import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 4173;
const DIST_DIR = path.resolve('./dist');
const OUT_DIR = path.resolve('./screenshots/phase-9c2');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve('./.chrome-temp-audit');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
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
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
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

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function run() {
  server.listen(PORT, '127.0.0.1');
  console.log(`Auditor HTTP server started at http://127.0.0.1:${PORT}`);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9229',
    '--user-data-dir=' + TEMP_USER_DATA,
    '--window-size=1440,900',
    `http://127.0.0.1:${PORT}/`
  ]);

  await delay(3000);

  try {
    const listRes = await fetch('http://127.0.0.1:9229/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page' && t.url.includes(`${PORT}`));
    if (!pageTab) throw new Error('Could not find Chrome tab');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();
    const consoleErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          consoleErrors.push(msg.params.args);
        }
      }
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
    await send('DOM.enable');

    console.log('--- Connected to Chrome CDP ---');

    // Reveal any scroll-hidden items for captures
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('is-revealed'));
        })()
      `
    });

    const viewports = [
      { name: 'phase-9c2-desktop-1440x900', width: 1440, height: 900 },
      { name: 'phase-9c2-laptop-1366x768', width: 1366, height: 768 },
      { name: 'phase-9c2-tablet-768x1024', width: 768, height: 1024 },
      { name: 'phase-9c2-mobile-390x844', width: 390, height: 844 },
      { name: 'phase-9c2-small-mobile-360x800', width: 360, height: 800 }
    ];

    const auditResults = {};

    for (const vp of viewports) {
      console.log(`\nCapturing viewport: ${vp.name} (${vp.width}x${vp.height})`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768
      });

      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: 0, behavior: 'instant' })`
      });
      await delay(800);

      // DOM overflow audit
      const overflowAudit = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const innerW = window.innerWidth;
            const scrollW = document.documentElement.scrollWidth;
            return {
              innerW,
              scrollW,
              hasOverflow: scrollW > innerW
            };
          })()
        `,
        returnByValue: true
      });

      auditResults[vp.name] = overflowAudit.result.value;

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.result.data, 'base64');
      const filePath = path.join(OUT_DIR, `${vp.name}.png`);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved: ${filePath} (${buffer.length} bytes)`);
    }

    // Reset viewport to Desktop 1440x900
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await delay(500);

    // Capture Desktop Dedicated Sections
    const desktopSections = [
      { id: 'introduction', name: 'phase-9c2-desktop-section-curatorial' },
      { id: 'amenities', name: 'phase-9c2-desktop-section-amenities' },
      { id: 'concierge', name: 'phase-9c2-desktop-section-concierge' }
    ];

    for (const sec of desktopSections) {
      console.log(`Capturing section: ${sec.name}`);
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.getElementById("${sec.id}");
            if (el) {
              window.scrollTo({ top: el.offsetTop - 40, behavior: 'instant' });
            }
          })()
        `
      });
      await delay(1200);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.result.data, 'base64');
      const filePath = path.join(OUT_DIR, `${sec.name}.png`);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved: ${filePath} (${buffer.length} bytes)`);
    }

    // Capture Desktop Footer specifically
    console.log(`Capturing desktop footer...`);
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.querySelector('footer.site-footer');
          if (footer) {
            window.scrollTo({ top: footer.offsetTop - 20, behavior: 'instant' });
          } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
          }
        })()
      `
    });
    await delay(1000);
    const footerShot = await send('Page.captureScreenshot', { format: 'png' });
    const footerBuf = Buffer.from(footerShot.result.data, 'base64');
    const footerPath = path.join(OUT_DIR, `phase-9c2-desktop-section-footer.png`);
    fs.writeFileSync(footerPath, footerBuf);
    console.log(`Saved: ${footerPath} (${footerBuf.length} bytes)`);

    // Capture Desktop Fullpage
    console.log(`Capturing desktop fullpage...`);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await delay(500);
    const fullpageShot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    const fullpageBuf = Buffer.from(fullpageShot.result.data, 'base64');
    const fullpagePath = path.join(OUT_DIR, `phase-9c2-desktop-fullpage.png`);
    fs.writeFileSync(fullpagePath, fullpageBuf);
    console.log(`Saved: ${fullpagePath} (${fullpageBuf.length} bytes)`);

    // Switch to Mobile Viewport (390x844) for Mobile Specific Sections
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });
    await delay(600);

    // Mobile Concierge
    console.log(`Capturing mobile concierge...`);
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById("concierge");
          if (el) window.scrollTo({ top: el.offsetTop, behavior: 'instant' });
        })()
      `
    });
    await delay(1000);
    const mConciergeShot = await send('Page.captureScreenshot', { format: 'png' });
    const mConciergeBuf = Buffer.from(mConciergeShot.result.data, 'base64');
    const mConciergePath = path.join(OUT_DIR, `phase-9c2-mobile-section-concierge.png`);
    fs.writeFileSync(mConciergePath, mConciergeBuf);
    console.log(`Saved: ${mConciergePath} (${mConciergeBuf.length} bytes)`);

    // Mobile Footer
    console.log(`Capturing mobile footer...`);
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const footer = document.querySelector('footer.site-footer');
          if (footer) window.scrollTo({ top: footer.offsetTop, behavior: 'instant' });
        })()
      `
    });
    await delay(1000);
    const mFooterShot = await send('Page.captureScreenshot', { format: 'png' });
    const mFooterBuf = Buffer.from(mFooterShot.result.data, 'base64');
    const mFooterPath = path.join(OUT_DIR, `phase-9c2-mobile-section-footer.png`);
    fs.writeFileSync(mFooterPath, mFooterBuf);
    console.log(`Saved: ${mFooterPath} (${mFooterBuf.length} bytes)`);

    // Mobile Fullpage using captureBeyondViewport
    console.log(`Capturing mobile fullpage...`);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await delay(500);
    const mFullpageShot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    const mFullpageBuf = Buffer.from(mFullpageShot.result.data, 'base64');
    const mFullpagePath = path.join(OUT_DIR, `phase-9c2-mobile-fullpage.png`);
    fs.writeFileSync(mFullpagePath, mFullpageBuf);
    console.log(`Saved: ${mFullpagePath} (${mFullpageBuf.length} bytes)`);

    // Perform DOM Verification on the 4 fixed defects
    const domVerification = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // 1. Footer verification
          const footer = document.querySelector('footer.site-footer');
          const footerGrid = document.querySelector('.footer-grid');
          const footerLists = document.querySelectorAll('.footer-links');
          const listItems = document.querySelectorAll('.footer-links li');
          
          let anyBullets = false;
          listItems.forEach(li => {
            const style = window.getComputedStyle(li);
            if (style.listStyleType !== 'none') anyBullets = true;
          });

          const footerGridStyle = footerGrid ? window.getComputedStyle(footerGrid) : null;

          // 2. Concierge Reassurance Strip verification
          const reassuranceGrid = document.querySelector('.concierge-reassurance-grid');
          const reassuranceCapsules = document.querySelectorAll('.reassurance-capsule');
          const capsuleData = Array.from(reassuranceCapsules).map(c => ({
            text: c.innerText.trim(),
            border: window.getComputedStyle(c).border,
            padding: window.getComputedStyle(c).padding
          }));

          // 3. Architectural Vision Caption verification
          const badgeBar = document.querySelector('.structural-badge-bar');
          const tag = document.querySelector('.structural-tag');
          const specs = document.querySelectorAll('.structural-spec');
          const dot = document.querySelector('.structural-dot');
          const structuralCaption = {
            tag: tag ? tag.innerText.trim() : null,
            specs: Array.from(specs).map(s => s.innerText.trim()),
            dotPresent: !!dot
          };

          // 4. Wellness Image verification
          const wellnessImg = document.querySelector('.amenity-card img');
          const wellnessImgSrc = wellnessImg ? wellnessImg.src : null;

          return {
            footer: {
              present: !!footer,
              gridDisplay: footerGridStyle ? footerGridStyle.display : null,
              gridColumns: footerGridStyle ? footerGridStyle.gridTemplateColumns : null,
              listCount: footerLists.length,
              listItemCount: listItems.length,
              hasUnintendedBullets: anyBullets
            },
            reassuranceCapsules: {
              gridPresent: !!reassuranceGrid,
              count: reassuranceCapsules.length,
              capsules: capsuleData
            },
            structuralCaption,
            wellnessImage: {
              src: wellnessImgSrc,
              isIndoorThermalSpa: wellnessImgSrc && wellnessImgSrc.includes('photo-1507652313519-d4e9174996dd')
            }
          };
        })()
      `,
      returnByValue: true
    });

    const report = {
      domVerification: domVerification.result.value,
      auditResults,
      totalConsoleErrors: consoleErrors.length,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(OUT_DIR, 'CORRECTION_AUDIT_REPORT.json'),
      JSON.stringify(report, null, 2)
    );
    console.log(`\nAudit Report written to ${path.join(OUT_DIR, 'CORRECTION_AUDIT_REPORT.json')}`);

    ws.close();
  } catch (err) {
    console.error('Error during verification run:', err);
  } finally {
    chromeProc.kill();
    await delay(1000);
    try {
      if (fs.existsSync(TEMP_USER_DATA)) {
        fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
      }
    } catch (e) {}
    server.close(() => {
      console.log('Verification finished and HTTP server closed.');
    });
  }
}

run();

