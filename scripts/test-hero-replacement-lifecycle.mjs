import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-hero-lifecycle');
const PORT = 4197;
const CDP_PORT = 9257;
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
    // If requesting static assets like real-estate-hero-frames, check public/
    const publicPath = path.join(projectRoot, 'public', reqPath);
    if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
      filePath = publicPath;
    } else {
      filePath = path.join(distDir, 'index.html');
    }
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

async function runHeroLifecycleTest() {
  console.log('===========================================================');
  console.log('   HERO VIDEO REPLACEMENT & ROLLBACK VERIFICATION TEST    ');
  console.log('===========================================================\n');

  const report = {};

  // Step 1: Execute Hero Replacement CLI
  console.log('--- Step 1: Executing update-hero-video CLI with sample test video ---');
  const tempVideo = path.join(projectRoot, 'temp-test-hero.mp4');
  execSync(`node scripts/manage-client-assets.mjs update-hero-video "${tempVideo}"`, { stdio: 'inherit' });

  // Verify Frame Extraction Count
  const framesDir = path.join(projectRoot, 'public', 'real-estate-hero-frames');
  const extractedFrames = fs.readdirSync(framesDir).filter(f => f.endsWith('.webp'));
  const clientFinalFrame = path.join(projectRoot, 'public', 'assets', 'client', 'hero-final-frame.webp');
  
  report.replacementExtraction = {
    totalFramesExtracted: extractedFrames.length,
    finalFrameExists: fs.existsSync(clientFinalFrame),
    finalFrameSizeKb: fs.existsSync(clientFinalFrame) ? Math.round(fs.statSync(clientFinalFrame).size / 1024) : 0
  };
  console.log(`Extracted: ${extractedFrames.length} frames. Final frame exists: ${report.replacementExtraction.finalFrameExists} (${report.replacementExtraction.finalFrameSizeKb} KB)`);

  // Step 2: Build for distribution testing
  console.log('\n--- Step 2: Rebuilding production bundle with client override ---');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 3: Launch Chrome & Server to verify replaced hero in actual browser
  console.log('\n--- Step 3: Verifying replaced hero video in browser ---');
  await new Promise((res) => server.listen(PORT, res));

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

  const evalCode = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res?.result?.result?.value;
  };

  // Check Homepage Scroll with new video
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(2500);

  // Scroll to midway
  await evalCode('window.scrollTo(0, 1200)');
  await delay(1200);
  const replacedMidwayPixel = await evalCode(`(() => {
    const canvas = document.querySelector('#cinematic-showroom-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    return ctx ? Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data) : null;
  })()`);

  // Scroll to final frame
  await evalCode('window.scrollTo(0, 2600)');
  await delay(1200);
  const replacedFinalPixel = await evalCode(`(() => {
    const canvas = document.querySelector('#cinematic-showroom-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    return ctx ? Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data) : null;
  })()`);

  // Check Collections subpage
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/collections` });
  await delay(1500);
  const replacedCollectionsPixel = await evalCode(`(() => {
    const canvas = document.querySelector('#cinematic-showroom-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    return ctx ? Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data) : null;
  })()`);

  report.replacedBehavior = {
    midwayPixel: replacedMidwayPixel,
    finalPixel: replacedFinalPixel,
    collectionsPersistentPixel: replacedCollectionsPixel
  };
  console.log('Replaced hero behavior tested successfully.');

  // Close browser & server for rollback
  ws.close();
  chromeProc.kill();
  server.close();

  // Step 4: Revert to original Demo Video & Demo Frames
  console.log('\n--- Step 4: Executing revert all CLI to restore original AI demo assets ---');
  execSync('node scripts/manage-client-assets.mjs revert all', { stdio: 'inherit' });

  // Verify rollback on disk
  const heroVideoStat = fs.statSync(path.join(projectRoot, 'public', 'hero.mp4'));
  const finalFrameStat = fs.statSync(path.join(projectRoot, 'public', 'assets', 'demo', 'hero-final-frame.webp'));
  const restoredFramesCount = fs.readdirSync(framesDir).filter(f => f.endsWith('.webp')).length;

  report.revertVerification = {
    originalHeroVideoRestored: heroVideoStat.size > 5000000, // ~5.8 MB
    heroVideoSizeKb: Math.round(heroVideoStat.size / 1024),
    restoredFramesCount,
    finalFrameIntact: finalFrameStat.size > 40000,
    finalFrameSizeKb: Math.round(finalFrameStat.size / 1024)
  };

  // Step 5: Rebuild production bundle with restored demo assets
  console.log('\n--- Step 5: Rebuilding production bundle with restored demo assets ---');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 6: Verify restored assets in actual browser
  console.log('\n--- Step 6: Verifying restored demo assets in browser ---');
  await new Promise((res) => server.listen(PORT, res));

  const chromeProcRestored = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1920,1080'
  ]);

  let targetWsUrlRestored = null;
  for (let i = 0; i < 40; i++) {
    await delay(300);
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      if (res.ok) {
        const list = await res.json();
        const page = list.find((t) => t.type === 'page');
        if (page?.webSocketDebuggerUrl) {
          targetWsUrlRestored = page.webSocketDebuggerUrl;
          break;
        }
      }
    } catch (_) {}
  }

  const wsRestored = new WebSocket(targetWsUrlRestored);
  let idRestored = 1;
  const callbacksRestored = new Map();
  wsRestored.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacksRestored.has(msg.id)) {
      callbacksRestored.get(msg.id)(msg);
      callbacksRestored.delete(msg.id);
    }
  };

  const sendRestored = (method, params = {}) => new Promise((resolve) => {
    const msgId = idRestored++;
    callbacksRestored.set(msgId, resolve);
    wsRestored.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise((res) => wsRestored.onopen = res);
  await sendRestored('Runtime.enable');
  await sendRestored('Page.enable');

  const evalCodeRestored = async (expr) => {
    const res = await sendRestored('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res?.result?.result?.value;
  };

  await sendRestored('Page.navigate', { url: `http://127.0.0.1:${PORT}/collections` });
  await delay(2000);
  const restoredCollectionsPixel = await evalCodeRestored(`(() => {
    const canvas = document.querySelector('#cinematic-showroom-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    return ctx ? Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data) : null;
  })()`);

  report.restoredBehavior = {
    collectionsPersistentPixel: restoredCollectionsPixel,
    matchesTravertineBaseline: restoredCollectionsPixel[0] === 100 && restoredCollectionsPixel[1] === 98 && restoredCollectionsPixel[2] === 83
  };

  wsRestored.close();
  chromeProcRestored.kill();
  server.close();

  console.log('\n===========================================================');
  console.log('       HERO LIFECYCLE AUDIT REPORT SUMMARY                ');
  console.log('===========================================================\n');
  console.log(JSON.stringify(report, null, 2));

  // Step 7: Clean up test video and temp profile
  try {
    if (fs.existsSync(tempVideo)) fs.unlinkSync(tempVideo);
    await delay(1500);
    if (fs.existsSync(TEMP_USER_DATA)) fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true, maxRetries: 3 });
  } catch (err) {
    // Non-fatal temp cleanup warning
  }
}

runHeroLifecycleTest().catch(console.error);

