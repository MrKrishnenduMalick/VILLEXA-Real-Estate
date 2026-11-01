import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const outDir = path.resolve(projectRoot, 'screenshots', 'card-redesign');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-card-audit');
const PORT = 4192;
const CDP_PORT = 9252;
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

async function run() {
  server.listen(PORT, '127.0.0.1');
  console.log(`Server running at http://127.0.0.1:${PORT}`);

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1080',
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

  const capture = async (name, width = 1440, height = 1080) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 600
    });
    await delay(300);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.result.data, 'base64');
    fs.writeFileSync(path.join(outDir, `${name}.png`), buffer);
    console.log(`Saved screenshot: ${name}.png (${Math.round(buffer.length / 1024)} KB)`);
  };

  // 1. Audit Property Cards on /residences
  console.log('\n--- 1. Auditing Property Cards on /residences ---');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/residences` });
  await delay(2500);

  // Scroll down to the property cards grid
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo({ top: 900, behavior: 'instant' });
    `
  });
  await delay(1200);
  await capture('01-property-cards-catalogue-grid');

  // Mobile viewport for property cards
  await capture('01-property-cards-mobile', 390, 844);

  // Restore Desktop Viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });
  await delay(500);

  // 2. Audit Confidential Acquisitions on /residences
  console.log('\n--- 2. Auditing Confidential Acquisitions on /residences ---');
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo({ top: 3200, behavior: 'instant' });
    `
  });
  await delay(1200);
  await capture('02-confidential-acquisitions-catalogue');

  // 3. Audit Collection Cards on Homepage
  console.log('\n--- 3. Auditing Collection Cards on Homepage ---');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(2500);

  // Scroll to Collection Typology Cards
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('collections');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo({ top: 8600, behavior: 'instant' });
    `
  });
  await delay(1200);
  await capture('03-collection-cards-homepage');

  // 4. Audit Registry Cards on Homepage
  console.log('\n--- 4. Auditing Registry Cards on Homepage ---');
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('registry');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo({ top: 2200, behavior: 'instant' });
    `
  });
  await delay(1200);
  await capture('04-registry-property-cards-homepage');

  // 5. Audit Confidential Viewing on Homepage
  console.log('\n--- 5. Auditing Confidential Concierge on Homepage ---');
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('concierge');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo({ top: 9800, behavior: 'instant' });
    `
  });
  await delay(1200);
  await capture('05-concierge-confidential-homepage');

  // 6. Audit Collections Page
  console.log('\n--- 6. Auditing Collections Page ---');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/collections` });
  await delay(2000);
  await capture('06-collections-page');

  ws.close();
  chromeProc.kill();
  server.close();

  if (fs.existsSync(TEMP_USER_DATA)) {
    try {
      fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
    } catch {}
  }

  console.log('\nAudit complete! All redesign screenshots captured.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
