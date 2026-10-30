import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.resolve('./.chrome-temp-sections-2');
const outDir = path.resolve('./screenshots/redesign-homepage');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9228',
  '--user-data-dir=' + tempDir,
  '--window-size=1440,900',
  'http://127.0.0.1:4173/'
]);

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function run() {
  await delay(2500);
  try {
    const listRes = await fetch('http://127.0.0.1:9228/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page' && t.url.includes('4173'));
    if (!pageTab) throw new Error('No page tab found');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    await new Promise((resolve) => {
      ws.onopen = resolve;
    });

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const reqId = id++;
        callbacks.set(reqId, resolve);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    };

    await send('Page.enable');
    await send('Runtime.enable');

    const sections = [
      { id: 'cinematic-hero-track', name: '01-cinematic-hero' },
      { id: 'brand-introduction', name: '02-brand-introduction' },
      { id: 'explore-typologies', name: '03-typologies-showcase' },
      { id: 'signature-residences', name: '04-signature-residences' },
      { id: 'cinematic-showcase', name: '05-cinematic-film' },
      { id: 'architectural-vision', name: '06-architectural-vision' },
      { id: 'curated-lifestyle', name: '07-curated-lifestyle' },
      { id: 'private-viewing-cta', name: '08-private-viewing-cta' }
    ];

    for (const sec of sections) {
      console.log('Capturing section:', sec.name);
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.getElementById("${sec.id}");
            if (el) {
              window.scrollTo({ top: el.offsetTop, behavior: 'instant' });
              document.querySelectorAll(".scroll-reveal").forEach(e => e.classList.add("is-revealed"));
            }
          })()
        `
      });

      await delay(1200);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      if (shot && shot.result && shot.result.data) {
        const buffer = Buffer.from(shot.result.data, 'base64');
        const filePath = path.join(outDir, `${sec.name}.png`);
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved: ${filePath} (${buffer.length} bytes)`);
      }
    }

    ws.close();
  } catch (err) {
    console.error('Error in capture:', err);
  } finally {
    chromeProc.kill();
    await delay(1000);
    try {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {}
    console.log('Capture script finished.');
  }
}

run();
