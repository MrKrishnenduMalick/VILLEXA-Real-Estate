import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const outDir = path.resolve(projectRoot, 'screenshots', 'cinematic-scroll-audit');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-cinematic-audit');
const PORT = 4235;
const CDP_PORT = 9285;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
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

async function runCinematicScrollAudit() {
  server.listen(PORT, '127.0.0.1');
  console.log(`Cinematic Audit Server running at http://127.0.0.1:${PORT}`);

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

  await delay(2500);

  const targetsRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find((t) => t.type === 'page');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  await new Promise((resolve) => (ws.onopen = resolve));

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  await send('Emulation.clearDeviceMetricsOverride');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });

  const captureToFile = async (filename) => {
    const res = await send('Page.captureScreenshot', { format: 'png', quality: 90 });
    const buf = Buffer.from(res.data, 'base64');
    fs.writeFileSync(path.join(outDir, filename), buf);
    console.log(`[Audit Captured] ${filename} (${buf.length} bytes)`);
  };

  const evaluateState = async (stepDesc) => {
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const track = document.getElementById('cinematic-hero-track');
        const scrollY = window.scrollY;
        const totalScrollable = track ? track.offsetHeight - window.innerHeight : 0;
        const progress = totalScrollable > 0 ? scrollY / totalScrollable : 0;
        const canvas = document.querySelector('canvas');
        return {
          step: "${stepDesc}",
          scrollY,
          totalScrollable,
          progress: Number(progress.toFixed(3)),
          hasCanvas: Boolean(canvas),
          canvasWidth: canvas ? canvas.width : 0,
          canvasHeight: canvas ? canvas.height : 0
        };
      })()`,
      returnByValue: true
    });
    console.log(`   State:`, evalRes.result?.value);
    return evalRes.result?.value;
  };

  console.log('--- Starting Cinematic Scroll Integrity Audit ---');

  // Step 1: Initial Page Load (scrollY = 0, progress = 0.0 -> Frame 1)
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(3500); // Allow initial frame cache hydration
  await evaluateState('Initial Frame 1 (Progress 0%)');
  await captureToFile('01-scroll-000-frame-001.png');

  // Helper to scroll to fraction of hero track
  const scrollToRatio = async (ratio) => {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const track = document.getElementById('cinematic-hero-track');
        if (!track) return;
        const totalScrollable = track.offsetHeight - window.innerHeight;
        const targetScroll = Math.round(totalScrollable * ${ratio});
        window.scrollTo(0, targetScroll);
        window.dispatchEvent(new Event('scroll'));
      })()`
    });
    await delay(1200); // Allow frame load and canvas draw
  };

  // Step 2: Scroll Down 25% (progress ~0.25 -> Frame ~60)
  console.log('--- Scrolling Forward: 25% ---');
  await scrollToRatio(0.25);
  await evaluateState('Forward Scroll 25% (~Frame 60)');
  await captureToFile('02-scroll-025-frame-060.png');

  // Step 3: Scroll Down 50% Midway (progress ~0.50 -> Frame ~120)
  console.log('--- Scrolling Forward: 50% Midway ---');
  await scrollToRatio(0.50);
  await evaluateState('Forward Scroll 50% Midway (~Frame 120)');
  await captureToFile('03-scroll-050-midway-frame-120.png');

  // Step 4: Scroll Down 75% (progress ~0.75 -> Frame ~180)
  console.log('--- Scrolling Forward: 75% ---');
  await scrollToRatio(0.75);
  await evaluateState('Forward Scroll 75% (~Frame 180)');
  await captureToFile('04-scroll-075-frame-180.png');

  // Step 5: Scroll Down 100% (progress = 1.0 -> Final Frame 240)
  console.log('--- Scrolling Forward: 100% Final Frame ---');
  await scrollToRatio(1.0);
  await evaluateState('Forward Scroll 100% Final Frame (Frame 240)');
  await captureToFile('05-scroll-100-final-frame-240.png');

  // Step 6: Reverse Scroll Backwards to 50% Midway (Reversibility & Freeze Check)
  console.log('--- Reverse Scrolling: Backwards to 50% Midway ---');
  await scrollToRatio(0.50);
  await evaluateState('Reverse Scroll to 50% Midway (~Frame 120)');
  await captureToFile('06-reverse-scroll-050-frame-120.png');

  // Step 7: Reverse Scroll Backwards to 0% (Return to Frame 1)
  console.log('--- Reverse Scrolling: Backwards to 0% Origin ---');
  await scrollToRatio(0.0);
  await evaluateState('Reverse Scroll to 0% Origin (Frame 1)');
  await captureToFile('07-reverse-scroll-000-frame-001.png');

  console.log('--- Cinematic Scroll Integrity Audit Completed Successfully ---');

  ws.close();
  chromeProc.kill();
  server.close();
  try {
    fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  } catch {}
  process.exit(0);
}

runCinematicScrollAudit().catch((err) => {
  console.error('Audit Error:', err);
  process.exit(1);
});

