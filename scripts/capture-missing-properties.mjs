import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve('./screenshots');

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
  { id: 'residence-highland-manor', path: '/residence/the-highland-manor' },
  { id: 'residence-solstice-residences', path: '/residence/the-solstice-residences' }
];

const viewports = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'laptop', width: 1366, height: 768 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'mobile', width: 390, height: 844 },
  { label: 'small-mobile', width: 360, height: 800 }
];

function capture(url, width, height, outputPath) {
  return new Promise((resolve) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--run-all-compositor-stages-before-draw',
      `--window-size=${width},${height}`,
      `--screenshot=${outputPath}`,
      url
    ];

    const proc = spawn(CHROME_PATH, args);
    proc.on('close', (code) => {
      resolve({ success: fs.existsSync(outputPath), code });
    });
  });
}

async function run() {
  const PORT = 4173;
  server.listen(PORT, '127.0.0.1', async () => {
    for (const vp of viewports) {
      for (const page of pages) {
        const fileName = `${page.id}_${vp.label}_${vp.width}x${vp.height}.png`;
        const outputPath = path.join(SCREENSHOT_DIR, fileName);
        const url = `http://127.0.0.1:${PORT}${page.path}`;
        const res = await capture(url, vp.width, vp.height, outputPath);
        const kb = res.success ? (fs.statSync(outputPath).size / 1024).toFixed(1) : 0;
        console.log(`${fileName}: ${res.success ? 'OK ' + kb + ' KB' : 'FAILED'}`);
      }
    }
    server.close();
  });
}

run();

