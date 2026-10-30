import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve('./screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// MIME types for static server
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
      res.end('Error loading ' + urlPath);
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
  { id: 'homepage', path: '/' },
  { id: 'catalogue', path: '/residences' },
  { id: 'residence-aurelia', path: '/residence/the-aurelia-estate' },
  { id: 'residence-celestia', path: '/residence/the-celestia-penthouse' },
  { id: 'residence-mirador', path: '/residence/the-mirador-residence' },
  { id: 'residence-ocean-crest', path: '/residence/the-ocean-crest' },
  { id: 'residence-solstice', path: '/residence/the-solstice-sanctuary' },
  { id: 'residence-elysian', path: '/residence/the-elysian-gardens' },
  { id: 'vision', path: '/vision' },
  { id: 'collections', path: '/collections' },
  { id: 'lifestyle', path: '/lifestyle' },
  { id: 'contact', path: '/contact' }
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
    const timer = setTimeout(() => {
      proc.kill();
      resolve({ success: fs.existsSync(outputPath), timedOut: true });
    }, 15000);

    proc.on('close', (code) => {
      clearTimeout(timer);
      resolve({ success: fs.existsSync(outputPath), code });
    });
  });
}

async function runAudit() {
  const PORT = 4173;
  server.listen(PORT, '127.0.0.1', async () => {
    console.log(`Auditor HTTP server active at http://127.0.0.1:${PORT}`);
    const results = [];
    let completedCount = 0;
    const totalCount = pages.length * viewports.length;

    for (const vp of viewports) {
      console.log(`\n=== VIEWPORT: ${vp.label.toUpperCase()} (${vp.width}x${vp.height}) ===`);
      for (const page of pages) {
        const fileName = `${page.id}_${vp.label}_${vp.width}x${vp.height}.png`;
        const outputPath = path.join(SCREENSHOT_DIR, fileName);
        const url = `http://127.0.0.1:${PORT}${page.path}`;
        
        process.stdout.write(`[${++completedCount}/${totalCount}] ${page.id} (${vp.label})... `);
        const res = await capture(url, vp.width, vp.height, outputPath);
        
        if (res.success) {
          const stats = fs.statSync(outputPath);
          const kb = (stats.size / 1024).toFixed(1);
          console.log(`OK (${kb} KB)`);
          results.push({
            id: page.id,
            path: page.path,
            viewport: vp.label,
            dimensions: `${vp.width}x${vp.height}`,
            file: fileName,
            sizeBytes: stats.size,
            sizeKb: kb,
            status: 'VERIFIED'
          });
        } else {
          console.log(`FAILED (code: ${res.code}, timedOut: ${res.timedOut})`);
          results.push({
            id: page.id,
            path: page.path,
            viewport: vp.label,
            dimensions: `${vp.width}x${vp.height}`,
            file: fileName,
            status: 'FAILED'
          });
        }
      }
    }

    server.close(() => {
      console.log(`\n=== AUDIT COMPLETE ===`);
      console.log(`Successfully captured ${results.filter(r => r.status === 'VERIFIED').length} / ${totalCount} screenshots.`);
      fs.writeFileSync(path.join(SCREENSHOT_DIR, 'audit-manifest.json'), JSON.stringify(results, null, 2));
    });
  });
}

runAudit().catch(console.error);
