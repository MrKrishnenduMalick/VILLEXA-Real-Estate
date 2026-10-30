import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  let filePath = path.join(path.resolve('./dist'), urlPath === '/' ? 'index.html' : urlPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(path.resolve('./dist'), 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error');
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

const pages = [
  '/',
  '/residences',
  '/residence/the-aurelia-estate',
  '/residence/the-celestia-penthouse',
  '/residence/the-ocean-crest',
  '/residence/the-highland-manor',
  '/residence/the-solstice-residences',
  '/residence/the-elysian-gardens',
  '/vision',
  '/collections',
  '/lifestyle',
  '/contact'
];

const viewports = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'laptop', width: 1366, height: 768 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'mobile', width: 390, height: 844 },
  { label: 'small-mobile', width: 360, height: 800 }
];

async function checkPage(url, width, height) {
  return new Promise((resolve) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--enable-logging=stderr',
      '--v=1',
      `--window-size=${width},${height}`,
      '--dump-dom',
      url
    ];

    const proc = spawn(CHROME_PATH, args);
    let htmlOutput = '';
    let stderrOutput = '';

    proc.stdout.on('data', d => { htmlOutput += d.toString(); });
    proc.stderr.on('data', d => { stderrOutput += d.toString(); });

    proc.on('close', () => {
      // Check for errors in stderr
      const errors = stderrOutput
        .split('\n')
        .filter(line => line.includes(':ERROR:') && !line.includes('google_update_settings_win.cc'));
      
      resolve({
        htmlLength: htmlOutput.length,
        hasRootApp: htmlOutput.includes('showroom-public-main'),
        errors
      });
    });
  });
}

async function run() {
  const PORT = 4173;
  server.listen(PORT, '127.0.0.1', async () => {
    console.log('Testing DOM rendering & errors across pages...');
    let allOk = true;

    for (const pagePath of pages) {
      for (const vp of viewports) {
        const url = `http://127.0.0.1:${PORT}${pagePath}`;
        const res = await checkPage(url, vp.width, vp.height);
        if (!res.hasRootApp || res.errors.length > 0) {
          console.log(`[ALERT] ${pagePath} (${vp.label}): root=${res.hasRootApp}, errors=${res.errors.length}`);
          if (res.errors.length > 0) console.log(res.errors);
          allOk = false;
        }
      }
    }

    if (allOk) {
      console.log('✅ ALL PAGES & VIEWPORTS rendered with valid root app container and ZERO application errors!');
    }

    server.close();
  });
}

run();

