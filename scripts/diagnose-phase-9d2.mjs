import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-diag');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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
    if (err) { res.writeHead(404); res.end('Not found'); }
    else { res.writeHead(200, { 'Content-Type': contentType }); res.end(content); }
  });
});

async function main() {
  server.listen(4182, '127.0.0.1');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9242',
    '--user-data-dir=' + TEMP_USER_DATA,
    '--window-size=1440,900',
    'http://127.0.0.1:4182/'
  ]);

  let tabs;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const tabsRes = await fetch('http://127.0.0.1:9242/json');
      if (tabsRes.ok) {
        tabs = await tabsRes.json();
        break;
      }
    } catch {}
  }

  const pageTab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const resolve = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      resolve(msg);
    }
  };

  const send = (method, params = {}) => new Promise(res => {
    const msgId = id++;
    callbacks.set(msgId, res);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Page.enable');
  
  // Wait for initial load
  await new Promise(r => setTimeout(r, 2500));

  // 1. Audit sections layout
  const sectionsRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const elements = Array.from(document.querySelectorAll('#cinematic-hero-track, #introduction, #flagship-residence, #registry, #materiality, #amenities, #collections, #concierge, .site-footer'));
      return elements.map(s => {
        const rect = s.getBoundingClientRect();
        const style = window.getComputedStyle(s);
        return {
          id: s.id || s.className,
          offsetTop: s.offsetTop,
          offsetHeight: s.offsetHeight,
          clientTop: rect.top + window.scrollY,
          height: rect.height,
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom,
          marginTop: style.marginTop,
          marginBottom: style.marginBottom,
          backgroundColor: style.backgroundColor
        };
      });
    })()`,
    returnByValue: true
  });

  console.log('--- SECTIONS LAYOUT AUDIT ---');
  console.log(JSON.stringify(sectionsRes?.result?.result?.value, null, 2));

  // 2. Audit images
  const imagesRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => {
        const rect = img.getBoundingClientRect();
        return {
          src: img.src.substring(0, 80),
          loading: img.getAttribute('loading'),
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
          topOnPage: Math.round(rect.top + window.scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      });
    })()`,
    returnByValue: true
  });

  console.log('--- IMAGES AUDIT ---');
  console.log(JSON.stringify(imagesRes?.result?.result?.value, null, 2));

  // 3. Check what's between sections (is there empty space or background showing through?)
  const gapsRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const flow = document.querySelector('.homepage-editorial-flow');
      const root = document.querySelector('.homepage-root');
      const backdrop = document.querySelector('.homepage-ambient-backdrop');
      const media = document.querySelector('.ambient-architectural-media');
      const scrim = document.querySelector('.ambient-warm-scrim');
      return {
        homepageRoot: root ? { height: root.offsetHeight, bg: window.getComputedStyle(root).backgroundColor } : null,
        editorialFlow: flow ? { offsetTop: flow.offsetTop, height: flow.offsetHeight, bg: window.getComputedStyle(flow).backgroundColor } : null,
        ambientBackdrop: backdrop ? {
          position: window.getComputedStyle(backdrop).position,
          zIndex: window.getComputedStyle(backdrop).zIndex,
          bg: window.getComputedStyle(backdrop).backgroundColor
        } : null,
        media: media ? {
          opacity: window.getComputedStyle(media).opacity,
          bgImage: window.getComputedStyle(media).backgroundImage.substring(0, 80)
        } : null,
        scrim: scrim ? {
          bg: window.getComputedStyle(scrim).background.substring(0, 100)
        } : null
      };
    })()`,
    returnByValue: true
  });

  console.log('--- GAPS / BACKDROP AUDIT ---');
  console.log(JSON.stringify(gapsRes?.result?.result?.value, null, 2));

  ws.close();
  chromeProc.kill();
  server.close();
}

main().catch(console.error);

