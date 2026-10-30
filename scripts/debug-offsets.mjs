import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const tempDir = path.resolve('./.chrome-temp-debug');

const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9227',
  '--user-data-dir=' + tempDir,
  '--window-size=1440,900',
  'http://127.0.0.1:4173/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9227/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page' && t.url.includes('4173'));
    if (!pageTab) throw new Error('Target page tab not found');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          returnByValue: true,
          expression: `
            (() => {
              const ids = ["cinematic-hero-track", "brand-introduction", "explore-typologies", "signature-residences", "cinematic-showcase", "architectural-vision", "curated-lifestyle", "private-viewing-cta"];
              return ids.map(id => {
                const el = document.getElementById(id);
                return { id, exists: !!el, offsetTop: el ? el.offsetTop : null, height: el ? el.offsetHeight : null };
              });
            })()
          `
        }
      }));
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      console.log('Sections layout:', JSON.stringify(msg.result?.result?.value, null, 2));
      chromeProc.kill();
      setTimeout(() => {
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
      }, 500);
    };
  } catch (err) {
    console.error(err);
    chromeProc.kill();
  }
}, 2500);
