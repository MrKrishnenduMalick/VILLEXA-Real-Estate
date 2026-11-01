import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const auditDir = path.resolve(projectRoot, 'screenshots', 'section-audit');

if (!fs.existsSync(auditDir)) {
  fs.mkdirSync(auditDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-section-audit');
const PORT = 4198;
const CDP_PORT = 9258;
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
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

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

async function runSectionAudit() {
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

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
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

  await new Promise((res) => ws.onopen = res);
  await send('Runtime.enable');
  await send('Page.enable');
  await send('DOM.enable');

  const evalCode = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res?.result?.result?.value;
  };

  const takeScreenshot = async (filename) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    const savePath = path.join(auditDir, filename);
    fs.writeFileSync(savePath, buffer);
    console.log(`Saved screenshot: ${filename} (${Math.round(buffer.length / 1024)} KB)`);
  };

  const setViewport = async (width, height, isMobile = false) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
  };

  await setViewport(1920, 1080);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(3000);

  // Measure sections on homepage
  const sections = await evalCode(`(() => {
    const elements = Array.from(document.querySelectorAll('.homepage-editorial-flow > *'));
    return elements.map(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        id: el.id,
        tag: el.tagName,
        className: el.className,
        topOffset: el.offsetTop,
        height: rect.height,
        background: style.background,
        backgroundColor: style.backgroundColor
      };
    });
  })()`);

  console.log('Homepage Sections Geometry:', JSON.stringify(sections, null, 2));

  // Capture homepage by element scroll
  const sectionIds = [
    { name: '01-hero.png', y: 0 },
    { name: '02-hero-scroll.png', y: 1400 },
    { name: '03-hero-end.png', y: 2200 },
    { name: '04-brand-intro.png', selector: '#introduction' },
    { name: '05-flagship.png', selector: '#flagship-residence' },
    { name: '06-registry.png', selector: '#registry' },
    { name: '07-philosophy.png', selector: '#materiality' },
    { name: '08-sanctuary.png', selector: '#amenities' },
    { name: '09-collections.png', selector: '#collections' },
    { name: '10-concierge.png', selector: '#concierge' },
    { name: '11-footer.png', selector: 'footer' }
  ];

  for (const item of sectionIds) {
    if (item.selector) {
      await evalCode(`(() => {
        const el = document.querySelector('${item.selector}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`);
    } else {
      await evalCode(`window.scrollTo(0, ${item.y})`);
    }
    await delay(1000);
    await takeScreenshot(item.name);
  }

  // Audit Subpages
  const pages = [
    { url: '/residences', name: 'page-residences.png' },
    { url: '/collections', name: 'page-collections.png' },
    { url: '/residence/the-aurelia-estate', name: 'page-residence-detail.png' },
    { url: '/vision', name: 'page-vision.png' },
    { url: '/lifestyle', name: 'page-lifestyle.png' },
    { url: '/contact', name: 'page-contact.png' }
  ];

  for (const p of pages) {
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${p.url}` });
    await delay(2000);
    await takeScreenshot(p.name);
  }

  ws.close();
  chromeProc.kill();
  server.close();

  try {
    await delay(1500);
    if (fs.existsSync(TEMP_USER_DATA)) fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  } catch (_) {}
}

runSectionAudit().catch(console.error);

