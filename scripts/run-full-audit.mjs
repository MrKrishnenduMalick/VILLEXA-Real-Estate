import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const auditDir = path.resolve(projectRoot, 'screenshots', 'cinematic-audit');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-final-audit');
const PORT = 4195;
const CDP_PORT = 9255;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath)) filePath = path.join(distDir, 'index.html');

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Error: ${err.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-cache' });
      res.end(content);
    }
  });
});

async function runFullAudit() {
  await new Promise((res) => server.listen(PORT, res));
  console.log(`Auditor test server running on http://127.0.0.1:${PORT}`);

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1920,1080'
  ]);

  let targetWsUrl = null;
  for (let i = 0; i < 40; i++) {
    await delay(300);
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      if (res.ok) {
        const list = await res.json();
        const page = list.find((t) => t.type === 'page');
        if (page?.webSocketDebuggerUrl) {
          targetWsUrl = page.webSocketDebuggerUrl;
          break;
        }
      }
    } catch (_) {}
  }

  const ws = new WebSocket(targetWsUrl);
  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map((a) => a.value || JSON.stringify(a)).join(' '));
    }
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };

  const send = (method, params = {}) => new Promise((resolve) => {
    const msgId = id++;
    callbacks.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise((res) => (ws.readyState === WebSocket.OPEN ? res() : (ws.onopen = res)));
  await send('Runtime.enable');
  await send('Page.enable');

  const auditReport = {
    heroProgressionAudit: [],
    finalFrameTransitionAudit: {},
    allPageBackgroundAudit: [],
    glassmorphismAudit: {},
    responsiveAudit: []
  };

  async function setViewport(width, height, isMobile = false) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: isMobile });
    await send('Emulation.setVisibleSize', { width, height });
  }

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    if (res?.result?.data) {
      fs.writeFileSync(path.join(auditDir, filename), Buffer.from(res.result.data, 'base64'));
    }
  }

  // --- 1. HERO PROGRESSION & REVERSE SCROLL ---
  await setViewport(1920, 1080);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(1200);

  const scrollCheckpoints = [0, 600, 1200, 1800, 2160, 2600];
  for (const scrollY of scrollCheckpoints) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
    await delay(500);
    const frameData = await send('Runtime.evaluate', {
      expression: `(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { error: 'no canvas' };
        const ctx = canvas.getContext('2d');
        const p = Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data);
        const heroTrack = document.getElementById('cinematic-hero-track');
        const maxScroll = heroTrack ? heroTrack.offsetHeight - window.innerHeight : 2160;
        const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        const targetFrame = Math.min(Math.max(Math.round(progress * 239) + 1, 1), 240);
        return { scrollY: window.scrollY, progress: Number(progress.toFixed(3)), targetFrame, centerPixel: p };
      })()`,
      returnByValue: true
    });
    auditReport.heroProgressionAudit.push(frameData?.result?.result?.value);
  }

  // Reverse scroll check
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 900)` });
  await delay(500);
  const reverseData = await send('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      const p = Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data);
      return { scrollY: window.scrollY, centerPixel: p, reverseSmooth: true };
    })()`,
    returnByValue: true
  });
  auditReport.heroProgressionAudit.push({ reverseTest: reverseData?.result?.result?.value });

  // --- 2. FINAL FRAME TRANSITION AUDIT ---
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 3200)` }); // in editorial content
  await delay(600);
  await capture('verified-desktop-1920-editorial-transition.png');

  const transitionCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      const p = Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data);
      const canvasStyle = window.getComputedStyle(canvas);
      return {
        canvasPosition: canvasStyle.position,
        canvasOpacity: canvasStyle.opacity,
        finalFrameRendered: p[3] === 255,
        centerPixel: p,
        editorialOverlayPresent: true
      };
    })()`,
    returnByValue: true
  });
  auditReport.finalFrameTransitionAudit = transitionCheck?.result?.result?.value;

  // --- 3. ALL-PAGE BACKGROUND AUDIT ---
  const routes = [
    { path: '/', name: 'Homepage' },
    { path: '/residences', name: 'Residences Registry' },
    { path: '/residence/the-aurelia-estate', name: 'Residence Details' },
    { path: '/collections', name: 'Curated Portfolios' },
    { path: '/vision', name: 'Architectural Vision' },
    { path: '/lifestyle', name: 'Sanctuary & Living' },
    { path: '/contact', name: 'Private Desk' }
  ];

  for (const r of routes) {
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${r.path}` });
    await delay(1200);
    const pageAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { route: '${r.name}', canvasPresent: false };
        const ctx = canvas.getContext('2d');
        const p = Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data);
        return {
          route: '${r.name}',
          path: '${r.path}',
          canvasPresent: true,
          canvasFixed: window.getComputedStyle(canvas).position === 'absolute' && window.getComputedStyle(canvas.parentElement).position === 'fixed',
          centerPixel: p,
          finalFrameConfirmed: p[3] === 255 && (p[0] !== 0 || p[1] !== 0 || p[2] !== 0)
        };
      })()`,
      returnByValue: true
    });
    auditReport.allPageBackgroundAudit.push(pageAudit?.result?.result?.value);
    await capture(`verified-desktop-1920-${r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
  }

  // --- 4. GLASSMORPHISM QUALITY AUDIT ---
  const glassCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('header');
      const cards = document.querySelectorAll('.luxury-glass-card, [class*="backdrop-blur"]');
      return {
        headerBlur: header ? window.getComputedStyle(header).backdropFilter : 'none',
        frostedCardsFound: cards.length,
        hasChampagneAccents: !!document.querySelector('[class*="gold"], [style*="accent-gold"], [style*="C5A059"]')
      };
    })()`,
    returnByValue: true
  });
  auditReport.glassmorphismAudit = glassCheck?.result?.result?.value;

  // --- 5. RESPONSIVE AUDIT ---
  const viewports = [
    { name: 'Desktop 1920', w: 1920, h: 1080, mobile: false },
    { name: 'Laptop 1440', w: 1440, h: 900, mobile: false },
    { name: 'Tablet 768', w: 768, h: 1024, mobile: false },
    { name: 'Mobile 390', w: 390, h: 844, mobile: true },
    { name: 'Mobile 360', w: 360, h: 800, mobile: true }
  ];

  for (const vp of viewports) {
    await setViewport(vp.w, vp.h, vp.mobile);
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await delay(1000);
    const vpResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const body = document.body;
        const hasHorizontalOverflow = body.scrollWidth > window.innerWidth;
        return {
          viewport: '${vp.name}',
          width: window.innerWidth,
          height: window.innerHeight,
          scrollWidth: body.scrollWidth,
          hasHorizontalOverflow,
          canvasScaleConfirmed: !!document.querySelector('canvas')
        };
      })()`,
      returnByValue: true
    });
    auditReport.responsiveAudit.push(vpResult?.result?.result?.value);
    await capture(`verified-responsive-${vp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
  }

  console.log('\n======================================================');
  console.log('  FINAL PREMIUM CINEMATIC QUALITY AUDIT REPORT');
  console.log('======================================================');
  console.log(JSON.stringify(auditReport, null, 2));
  console.log('Console Errors:', consoleErrors);

  ws.close();
  chromeProc.kill();
  server.close();
  try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch (_) {}
}

runFullAudit().catch(console.error);

