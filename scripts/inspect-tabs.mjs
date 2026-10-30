import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const tempDir = path.resolve('./.chrome-temp-inspect');

const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9226',
  '--user-data-dir=' + tempDir,
  '--window-size=1440,900',
  'http://127.0.0.1:4173/'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9226/json');
    const tabs = await listRes.json();
    console.log('Tabs:', tabs.map(t => ({ id: t.id, type: t.type, url: t.url })));
    chromeProc.kill();
    setTimeout(() => {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    }, 500);
  } catch (err) {
    console.error(err);
    chromeProc.kill();
  }
}, 2500);

