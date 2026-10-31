import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 4173;
const DIST_DIR = path.resolve('./dist');
const OUT_DIR = path.resolve('./screenshots/phase-9c3');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve('./.chrome-temp-p9c3');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading ' + urlPath);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function run() {
  server.listen(PORT, '127.0.0.1');
  console.log(`Auditor HTTP server started at http://127.0.0.1:${PORT}`);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9232',
    '--user-data-dir=' + TEMP_USER_DATA,
    '--window-size=1440,900',
    `http://127.0.0.1:${PORT}/`
  ]);

  await delay(3000);

  try {
    const listRes = await fetch('http://127.0.0.1:9232/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page');
    if (!pageTab) throw new Error('Could not find page tab in Chrome');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();
    const consoleErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          consoleErrors.push(msg.params.args);
        }
      }
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    await new Promise((res) => ws.onopen = res);

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const reqId = id++;
        callbacks.set(reqId, resolve);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    };

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    console.log('--- Connected to Chrome DevTools Protocol ---');

    // Step 1: Capture immediately after load (Desktop 1440x900)
    console.log('Capturing: phase-9c3-hero-initial-load.png');
    const initialShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(OUT_DIR, 'phase-9c3-hero-initial-load.png'),
      Buffer.from(initialShot.result.data, 'base64')
    );

    // Wait 2.5s for initial frames and canvas render
    await delay(2500);

    // Step 2: Capture after hero sequence has finished loading initial frames
    console.log('Capturing: phase-9c3-hero-fully-loaded.png');
    const fullyLoadedShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(OUT_DIR, 'phase-9c3-hero-fully-loaded.png'),
      Buffer.from(fullyLoadedShot.result.data, 'base64')
    );

    // Extract direct canvas frame 1 data
    const canvasData1 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvas = document.querySelector('canvas');
          return canvas ? canvas.toDataURL('image/png') : null;
        })()
      `,
      returnByValue: true
    });
    if (canvasData1.result.value) {
      const base64 = canvasData1.result.value.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(path.join(OUT_DIR, 'phase-9c3-canvas-frame-001.png'), Buffer.from(base64, 'base64'));
      console.log('Saved: phase-9c3-canvas-frame-001.png');
    }

    // Step 3: Scroll to middle position (~50% of 200vh scrollable distance = ~900px scroll)
    console.log('Scrolling to middle hero sequence (~frame 120)...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const track = document.getElementById('cinematic-hero-track');
          const totalScrollable = track.offsetHeight - window.innerHeight;
          window.scrollTo({ top: totalScrollable * 0.5, behavior: 'instant' });
        })()
      `
    });
    await delay(1200);

    console.log('Capturing: phase-9c3-hero-middle-scroll.png');
    const midShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(OUT_DIR, 'phase-9c3-hero-middle-scroll.png'),
      Buffer.from(midShot.result.data, 'base64')
    );

    const canvasDataMid = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvas = document.querySelector('canvas');
          return canvas ? canvas.toDataURL('image/png') : null;
        })()
      `,
      returnByValue: true
    });
    if (canvasDataMid.result.value) {
      const base64 = canvasDataMid.result.value.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(path.join(OUT_DIR, 'phase-9c3-canvas-frame-120.png'), Buffer.from(base64, 'base64'));
      console.log('Saved: phase-9c3-canvas-frame-120.png');
    }

    // Step 4: Scroll to final hero position (~100% of hero track = ~1800px)
    console.log('Scrolling to final hero position (~frame 240)...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const track = document.getElementById('cinematic-hero-track');
          const totalScrollable = track.offsetHeight - window.innerHeight;
          window.scrollTo({ top: totalScrollable * 0.98, behavior: 'instant' });
        })()
      `
    });
    await delay(1200);

    console.log('Capturing: phase-9c3-hero-final-frame.png');
    const finalShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(OUT_DIR, 'phase-9c3-hero-final-frame.png'),
      Buffer.from(finalShot.result.data, 'base64')
    );

    const canvasDataFinal = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvas = document.querySelector('canvas');
          return canvas ? canvas.toDataURL('image/png') : null;
        })()
      `,
      returnByValue: true
    });
    if (canvasDataFinal.result.value) {
      const base64 = canvasDataFinal.result.value.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(path.join(OUT_DIR, 'phase-9c3-canvas-frame-240.png'), Buffer.from(base64, 'base64'));
      console.log('Saved: phase-9c3-canvas-frame-240.png');
    }

    // Step 5: Responsive Viewports verification at initial load
    const viewports = [
      { name: 'phase-9c3-desktop-1440x900', width: 1440, height: 900 },
      { name: 'phase-9c3-laptop-1366x768', width: 1366, height: 768 },
      { name: 'phase-9c3-tablet-768x1024', width: 768, height: 1024 },
      { name: 'phase-9c3-mobile-390x844', width: 390, height: 844 },
      { name: 'phase-9c3-small-mobile-360x800', width: 360, height: 800 }
    ];

    const overflowAudit = {};

    for (const vp of viewports) {
      console.log(`\nCapturing viewport: ${vp.name} (${vp.width}x${vp.height})`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768
      });

      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: 0, behavior: 'instant' })`
      });
      await delay(800);

      const ofRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const innerW = window.innerWidth;
            const scrollW = document.documentElement.scrollWidth;
            return {
              innerW,
              scrollW,
              hasOverflow: scrollW > innerW
            };
          })()
        `,
        returnByValue: true
      });
      overflowAudit[vp.name] = ofRes.result.value;

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.result.data, 'base64');
      fs.writeFileSync(path.join(OUT_DIR, `${vp.name}.png`), buffer);
      console.log(`Saved: ${vp.name}.png (${buffer.length} bytes)`);
    }

    // Perform comprehensive DOM and style audit on hero elements
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await delay(500);

    const auditData = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvas = document.querySelector('canvas');
          const canvasCtx = canvas ? canvas.getContext('2d') : null;
          let sample = [];
          if (canvasCtx) {
            // sample 4 pixels across canvas
            const p1 = canvasCtx.getImageData(100, 100, 1, 1).data;
            const p2 = canvasCtx.getImageData(500, 300, 1, 1).data;
            const p3 = canvasCtx.getImageData(900, 500, 1, 1).data;
            sample = [Array.from(p1), Array.from(p2), Array.from(p3)];
          }

          const wordmark = document.querySelector('.brand-wordmark-text');
          const navLinks = document.querySelectorAll('.nav-link-item');
          const heroTitle = document.querySelector('.hero-editorial-title');
          const heroSub = document.querySelector('.hero-editorial-subtitle');
          const heroKicker = document.querySelector('.hero-editorial-kicker');
          const ctaWhite = document.querySelector('.btn-solid-white');
          const ctaGlass = document.querySelector('.btn-glass-hero');
          const groundStrip = document.querySelector('.hero-ground-strip');

          const getInfo = (el) => {
            if (!el) return null;
            const s = window.getComputedStyle(el);
            return {
              text: el.innerText ? el.innerText.trim() : null,
              color: s.color,
              background: s.backgroundColor,
              textShadow: s.textShadow,
              fontSize: s.fontSize,
              fontWeight: s.fontWeight
            };
          };

          return {
            canvas: {
              present: !!canvas,
              width: canvas ? canvas.width : null,
              height: canvas ? canvas.height : null,
              samplePixelsRGB: sample
            },
            typographyAudit: {
              wordmark: getInfo(wordmark),
              navLinkSample: getInfo(navLinks[0]),
              heroTitle: getInfo(heroTitle),
              heroSubtitle: getInfo(heroSub),
              heroKicker: getInfo(heroKicker),
              ctaPrimary: getInfo(ctaWhite),
              ctaSecondary: getInfo(ctaGlass),
              groundStrip: getInfo(groundStrip)
            }
          };
        })()
      `,
      returnByValue: true
    });

    const finalReport = {
      auditData: auditData.result.value,
      overflowAudit,
      totalConsoleErrors: consoleErrors.length,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(OUT_DIR, 'HERO_VERIFICATION_REPORT.json'),
      JSON.stringify(finalReport, null, 2)
    );
    console.log(`Saved audit report to ${path.join(OUT_DIR, 'HERO_VERIFICATION_REPORT.json')}`);

    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chromeProc.kill();
    await delay(1000);
    try {
      if (fs.existsSync(TEMP_USER_DATA)) fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
    } catch (e) {}
    server.close(() => console.log('HTTP server closed.'));
  }
}

run();

