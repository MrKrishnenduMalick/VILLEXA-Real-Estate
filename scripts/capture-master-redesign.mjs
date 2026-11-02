import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const outDir = path.resolve(projectRoot, 'screenshots', 'master-redesign');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-master-qa');
const PORT = 4220;
const CDP_PORT = 9270;
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

async function runMasterQA() {
  server.listen(PORT, '127.0.0.1');
  console.log(`Master QA Server running at http://127.0.0.1:${PORT}`);

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

  const setViewport = async (width, height, isMobile = false) => {
    await send('Emulation.clearDeviceMetricsOverride');
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
    await delay(300);
  };

  const captureToFile = async (filename, clip = null) => {
    const params = { format: 'png', quality: 90 };
    if (clip) params.clip = clip;
    const res = await send('Page.captureScreenshot', params);
    const buf = Buffer.from(res.data, 'base64');
    fs.writeFileSync(path.join(outDir, filename), buf);
    console.log(`[Captured] ${filename} (${buf.length} bytes)`);
  };

  console.log('--- Starting Final Browser Verification Captures ---');

  // 1. Homepage at 1920px (Desktop Wide Initial Frame 1)
  await setViewport(1920, 1080, false);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(3200);
  await captureToFile('01-homepage-initial-frame-1920px.png');

  // 2. Homepage Middle Scroll (Midway 50% Through Hero)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const track = document.getElementById('cinematic-hero-track');
      if (track) {
        const total = track.offsetHeight - window.innerHeight;
        window.scrollTo(0, Math.round(total * 0.5));
        window.dispatchEvent(new Event('scroll'));
      }
    })()`
  });
  await delay(1200);
  await captureToFile('02-homepage-middle-scroll-1920px.png');

  // 3. Homepage Final Frame (100% Hero Completion)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const track = document.getElementById('cinematic-hero-track');
      if (track) {
        const total = track.offsetHeight - window.innerHeight;
        window.scrollTo(0, total);
        window.dispatchEvent(new Event('scroll'));
      }
    })()`
  });
  await delay(1200);
  await captureToFile('03-homepage-final-frame-1920px.png');

  // 4. Reset to Top & Standard Desktop 1440px
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0); window.dispatchEvent(new Event("scroll"));' });
  await setViewport(1440, 900, false);
  await delay(1000);
  await captureToFile('04-homepage-1440px.png');

  // 5. Homepage Sections: Featured Residences on Marble with Auric Ribbons
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("featured-residences")?.scrollIntoView({ behavior: "instant", block: "start" })'
  });
  await delay(1200);
  await captureToFile('05-homepage-featured-residences.png');

  // 6. Homepage Sections: Collections Showcase on Marble
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("collections-showcase")?.scrollIntoView({ behavior: "instant", block: "start" })'
  });
  await delay(1200);
  await captureToFile('06-homepage-collections.png');

  // 7. Homepage Sections: Private Viewing & Compact Footer
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("private-viewing-section")?.scrollIntoView({ behavior: "instant", block: "start" })'
  });
  await delay(1200);
  await captureToFile('07-homepage-private-viewing-footer.png');

  // 8. Residences Catalogue (1440x900)
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/residences` });
  await delay(2200);
  await captureToFile('08-residences-catalogue.png');

  // 9. Property Detail (1440x900) — The Aurelia Estate
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/residence/the-aurelia-estate` });
  await delay(2200);
  await captureToFile('09-property-detail.png');

  // 10. Collections (1440x900)
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/collections` });
  await delay(2200);
  await captureToFile('10-collections.png');

  // 11. Craftsmanship (1440x900)
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/craftsmanship` });
  await delay(2200);
  await captureToFile('11-craftsmanship.png');

  // 12. Experience (1440x900)
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/experience` });
  await delay(2200);
  await captureToFile('12-experience.png');

  // 13. Contact / Private Viewing Page (1440x900)
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact` });
  await delay(2200);
  await captureToFile('13-contact-page.png');

  // 14. Mobile Homepage (390x844)
  await setViewport(390, 844, true);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(2200);
  await captureToFile('14-mobile-homepage.png');

  // 15. Mobile Catalogue (390x844)
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/residences` });
  await delay(2200);
  await captureToFile('15-mobile-catalogue.png');

  // 16. Mobile Menu Drawer (390x844)
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(1500);
  await send('Runtime.evaluate', {
    expression: 'document.querySelector(".mobile-nav-trigger-btn, button[aria-label=\\"Open Mobile Navigation\\"]")?.click()'
  });
  await delay(800);
  await captureToFile('16-mobile-nav-drawer.png');

  console.log('--- All Verification Captures Successfully Completed! ---');

  ws.close();
  chromeProc.kill();
  server.close();
  try {
    fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  } catch {}
  process.exit(0);
}

runMasterQA().catch((err) => {
  console.error('QA Error:', err);
  process.exit(1);
});
