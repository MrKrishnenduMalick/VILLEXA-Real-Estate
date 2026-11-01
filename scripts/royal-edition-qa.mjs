import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const outDir = path.resolve(projectRoot, 'screenshots', 'royal-qa');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-royal-qa');
const PORT = 4210;
const CDP_PORT = 9262;
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
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

async function runQA() {
  server.listen(PORT, '127.0.0.1');
  console.log(`QA Server running at http://127.0.0.1:${PORT}`);

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1920,1080',
    'about:blank'
  ]);

  await delay(2000);

  const targetsRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find((t) => t.type === 'page');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = idCounter++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await new Promise((res) => (ws.onopen = res));

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  const evalCode = async (expr) => {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res?.result?.result?.value;
  };

  const setViewport = async (width, height, isMobile = false) => {
    await send('Emulation.clearDeviceMetricsOverride');
    await delay(100);
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
    await delay(300);
  };

  const capture = async (filename, width = 1440, height = 900, isMobile = false) => {
    await setViewport(width, height, isMobile);
    await delay(400);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.result.data, 'base64');
    fs.writeFileSync(path.join(outDir, filename), buffer);
    console.log(`[Captured] ${filename} (${width}x${height}) - ${Math.round(buffer.length / 1024)} KB`);
  };

  const checkOverflow = async (pageName, width) => {
    const overflowResult = await evalCode(`(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const isOverflowing = docWidth > winWidth + 1;
      return { docWidth, winWidth, isOverflowing };
    })()`);
    console.log(`[Overflow Check] ${pageName} @ ${width}px: scrollWidth=${overflowResult?.docWidth}, winWidth=${overflowResult?.winWidth}, hasOverflow=${overflowResult?.isOverflowing}`);
    return overflowResult;
  };

  console.log('\n======================================================');
  console.log('  VILLEXA ROYAL EDITION — COMPREHENSIVE QA PASS');
  console.log('======================================================\n');

  // --- 1. Complete Homepage Desktop (1920x1080) ---
  console.log('--- 1. Testing Homepage at 1920x1080 ---');
  await setViewport(1920, 1080, false);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(2500);
  await checkOverflow('Homepage', 1920);
  await capture('01-complete-homepage-desktop-1920.png', 1920, 1080, false);

  // --- 2. Homepage Collection & Registry Sections ---
  console.log('\n--- 2. Testing Homepage Registry Section ---');
  await evalCode(`(() => {
    const el = document.querySelector('#registry');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  })()`);
  await delay(1200);
  await capture('02-homepage-registry-section.png', 1440, 900, false);

  console.log('\n--- 2B. Testing Homepage Typological Collections Section ---');
  await evalCode(`(() => {
    const el = document.querySelector('#collections');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  })()`);
  await delay(1200);
  await capture('02-homepage-collections-section.png', 1440, 900, false);

  // --- 3. Residences Catalogue — Desktop (1440x900) ---
  console.log('\n--- 3. Testing Residences Catalogue (Desktop 1440x900) ---');
  await setViewport(1440, 900, false);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/residences` });
  await delay(2500);
  await checkOverflow('Catalogue Desktop', 1440);
  await evalCode(`window.scrollTo({ top: 900, behavior: 'instant' })`);
  await delay(1000);
  await capture('03-residences-catalogue-desktop.png', 1440, 900, false);

  // --- 4. Residences Catalogue — Mobile (390x844) ---
  console.log('\n--- 4. Testing Residences Catalogue (Mobile 390x844) ---');
  await setViewport(390, 844, true);
  await delay(500);
  await checkOverflow('Catalogue Mobile 390', 390);
  await capture('04-residences-catalogue-mobile.png', 390, 844, true);

  // --- 5. Collections Page ---
  console.log('\n--- 5. Testing Collections Monograph Page ---');
  await setViewport(1440, 900, false);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/collections` });
  await delay(2000);
  await checkOverflow('Collections Page', 1440);
  await capture('05-collections-page.png', 1440, 900, false);

  // --- 6. Property Detail Page ---
  console.log('\n--- 6. Testing Property Detail Page ---');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/residence/the-aurelia-estate` });
  await delay(2500);
  await checkOverflow('Property Detail', 1440);
  await capture('06-property-detail-page.png', 1440, 900, false);

  // --- 7. Confidential Acquisitions Section ---
  console.log('\n--- 7. Testing Confidential Acquisitions Section ---');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/residences` });
  await delay(2000);
  await evalCode(`window.scrollTo({ top: 3200, behavior: 'instant' })`);
  await delay(1200);
  await capture('07-confidential-acquisitions.png', 1440, 900, false);

  // --- 8. Contact / Private Advisory Desk ---
  console.log('\n--- 8. Testing Contact / Private Advisory Desk ---');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact` });
  await delay(2000);
  await checkOverflow('Contact Page', 1440);
  await capture('08-contact-private-viewing.png', 1440, 900, false);

  // --- 9. Navigation and Mobile Menu Drawer ---
  console.log('\n--- 9. Testing Navigation & Mobile Menu Drawer ---');
  await setViewport(390, 844, true);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(2000);
  // Open the mobile menu drawer
  await evalCode(`(() => {
    const btn = document.querySelector('.mobile-nav-trigger-btn');
    if (btn) btn.click();
  })()`);
  await delay(600);
  await capture('09-navigation-mobile-menu.png', 390, 844, true);

  // --- 10. Representative Glass Panels (Desktop & Mobile) ---
  console.log('\n--- 10. Testing Representative Glass Panels ---');
  await setViewport(1440, 900, false);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/residences` });
  await delay(2000);
  await evalCode(`window.scrollTo({ top: 950, behavior: 'instant' })`);
  await delay(800);
  await capture('10-glass-panels-desktop-detail.png', 1440, 900, false);

  await setViewport(390, 844, true);
  await delay(600);
  await capture('10-glass-panels-mobile-detail.png', 390, 844, true);

  // --- 11. Multi-Resolution Viewport QA Sweep ---
  console.log('\n--- 11. Multi-Resolution Viewport QA Sweep ---');
  // 768x1024 Tablet
  await setViewport(768, 1024, false);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/residences` });
  await delay(1800);
  await checkOverflow('Residences Tablet 768', 768);
  await capture('11-responsive-tablet-768x1024.png', 768, 1024, false);

  // 360x800 Mobile Compact
  await setViewport(360, 800, true);
  await delay(600);
  await checkOverflow('Residences Mobile 360', 360);
  await capture('11-responsive-mobile-compact-360x800.png', 360, 800, true);

  ws.close();
  chromeProc.kill();
  server.close();

  if (fs.existsSync(TEMP_USER_DATA)) {
    try {
      fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
    } catch {}
  }

  console.log('\n======================================================');
  console.log('✅ QA AUDIT COMPLETE — ALL 10 DELIVERABLES CAPTURED');
  console.log('======================================================\n');
  process.exit(0);
}

runQA().catch((err) => {
  console.error('QA Audit failed:', err);
  process.exit(1);
});

