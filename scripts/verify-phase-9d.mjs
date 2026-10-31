import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const screenshotsDir = path.resolve(projectRoot, 'screenshots', 'phase-9d');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-user-9d');
const PORT = 4173;
const CDP_PORT = 9233;
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
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
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

const getEvalValue = (res) => res?.result?.result?.value !== undefined ? res.result.result.value : res?.result?.value;

async function run() {
  server.listen(PORT, '127.0.0.1');
  console.log(`Phase 9D HTTP server active at http://127.0.0.1:${PORT}`);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${CDP_PORT}`,
    '--user-data-dir=' + TEMP_USER_DATA,
    '--window-size=1440,900',
    `http://127.0.0.1:${PORT}/`
  ]);

  let tabs;
  for (let i = 0; i < 20; i++) {
    await delay(500);
    try {
      const listRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      if (listRes.ok) {
        tabs = await listRes.json();
        break;
      }
    } catch {}
  }

  if (!tabs) throw new Error('Could not connect to Chrome CDP after retries');

  try {
    const pageTab = tabs.find((t) => t.type === 'page');
    if (!pageTab) throw new Error('Could not find Chrome page tab');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();
    const consoleErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        if (msg.params.type === 'error') {
          consoleErrors.push({ text, timestamp: new Date().toISOString() });
        }
      }
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    await new Promise((res) => ws.onopen = res);

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

    const report = {
      phase: 'Phase 9D: Homepage Editorial Experience',
      timestamp: new Date().toISOString(),
      sectionsAudit: {},
      responsiveOverflowReport: {},
      ctaAndAnchorAudit: {},
      consoleErrors: { count: 0, errors: [] },
      verificationStatus: {}
    };

    // Helper: set viewport
    async function setViewport(width, height, isMobile = false, dpr = 1) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: dpr,
        mobile: isMobile
      });
      await send('Emulation.setTouchEmulationEnabled', {
        enabled: isMobile
      });
    }

    // Helper: capture screenshot
    async function captureScreenshot(fileName, fullPage = false, clip = null) {
      const filePath = path.join(screenshotsDir, fileName);
      const params = { format: 'png', quality: 95 };
      if (fullPage) params.captureBeyondViewport = true;
      if (clip) params.clip = clip;
      const res = await send('Page.captureScreenshot', params);
      if (res?.result?.data) {
        fs.writeFileSync(filePath, Buffer.from(res.result.data, 'base64'));
        console.log(`Saved screenshot: ${fileName}`);
      } else {
        console.warn(`Failed to capture: ${fileName}`, res);
      }
    }

    // Helper: measure overflow
    async function auditOverflow(width, height) {
      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const docW = document.documentElement.clientWidth;
          const scrollW = document.documentElement.scrollWidth;
          const bodyScrollW = document.body.scrollWidth;
          const innerW = window.innerWidth;
          const delta = Math.max(0, scrollW - docW, bodyScrollW - docW);

          const allElements = Array.from(document.querySelectorAll('*'));
          const overflowing = [];
          for (const el of allElements) {
            const rect = el.getBoundingClientRect();
            if (rect.right > innerW + 1 && el.offsetParent !== null) {
              overflowing.push({
                tag: el.tagName,
                id: el.id,
                className: el.className ? String(el.className).substring(0, 40) : '',
                right: rect.right,
                width: rect.width
              });
            }
          }

          return {
            specifiedWidth: ${width},
            specifiedHeight: ${height},
            innerWidth: innerW,
            clientWidth: docW,
            scrollWidth: scrollW,
            bodyScrollWidth: bodyScrollW,
            overflowDeltaPixels: delta,
            hasHorizontalOverflow: delta > 1 || overflowing.length > 0,
            overflowingElementCount: overflowing.length,
            overflowingElementsSample: overflowing.slice(0, 3)
          };
        })()`,
        returnByValue: true
      });
      return getEvalValue(res);
    }

    // Helper: get element bounding box
    async function getElementClip(selector) {
      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${selector}');
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            x: Math.max(0, rect.left + window.scrollX),
            y: Math.max(0, rect.top + window.scrollY),
            width: rect.width,
            height: rect.height,
            scale: 1
          };
        })()`,
        returnByValue: true
      });
      return getEvalValue(res);
    }

    // --- STEP 1: Desktop 1440x900 Deep Audit ---
    console.log('\n--- 1. Desktop 1440x900 Verification ---');
    await setViewport(1440, 900, false);
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await delay(2500);

    // Fullpage Desktop Screenshot
    await captureScreenshot('phase-9d-desktop-1440x900-fullpage.png', true);

    // Section by Section Captures
    const sections = [
      { id: 'introduction', selector: '#introduction', name: 'Section 1 — Architectural Introduction', file: 'phase-9d-section-1-introduction.png' },
      { id: 'flagship', selector: '#flagship-residence', name: 'Section 2 — Flagship Residence', file: 'phase-9d-section-2-flagship.png' },
      { id: 'registry', selector: '#registry', name: 'Section 3 — Curated Residence Collection', file: 'phase-9d-section-3-curated-collection.png' },
      { id: 'materiality', selector: '#materiality', name: 'Section 4 — Architectural Philosophy', file: 'phase-9d-section-4-philosophy.png' },
      { id: 'amenities', selector: '#amenities', name: 'Section 5 — Sanctuary & Living Preview', file: 'phase-9d-section-5-sanctuary-living.png' },
      { id: 'collections', selector: '#collections', name: 'Section 6 — Curated Lifestyle / Collections Preview', file: 'phase-9d-section-6-collections-screening.png' },
      { id: 'concierge', selector: '#concierge', name: 'Section 7 — Private Viewing Invitation', file: 'phase-9d-section-7-private-viewing.png' }
    ];

    for (const sec of sections) {
      console.log(`Auditing & capturing: ${sec.name}`);
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${sec.selector}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()`
      });
      await delay(600);

      const clip = await getElementClip(sec.selector);
      if (clip && clip.height > 0 && clip.width > 0) {
        const targetClip = {
          x: Math.round(clip.x),
          y: Math.round(clip.y),
          width: Math.min(1440, Math.round(clip.width)),
          height: Math.min(1800, Math.round(clip.height)),
          scale: 1
        };
        await captureScreenshot(sec.file, false, targetClip);
        report.sectionsAudit[sec.id] = {
          name: sec.name,
          selector: sec.selector,
          exists: true,
          dimensions: { width: clip.width, height: clip.height },
          verified: true
        };
      } else {
        console.warn(`Element not found or zero dimensions: ${sec.selector}`);
        report.sectionsAudit[sec.id] = {
          name: sec.name,
          selector: sec.selector,
          exists: false,
          verified: false
        };
      }
    }

    // Measure desktop overflow
    report.responsiveOverflowReport['desktop-1440x900'] = await auditOverflow(1440, 900);

    // --- STEP 2: Laptop 1366x768 ---
    console.log('\n--- 2. Laptop 1366x768 Verification ---');
    await setViewport(1366, 768, false);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
    await delay(600);
    await captureScreenshot('phase-9d-laptop-1366x768.png');
    report.responsiveOverflowReport['laptop-1366x768'] = await auditOverflow(1366, 768);

    // --- STEP 3: Tablet 768x1024 ---
    console.log('\n--- 3. Tablet 768x1024 Verification ---');
    await setViewport(768, 1024, false);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
    await delay(600);
    await captureScreenshot('phase-9d-tablet-768x1024.png');
    report.responsiveOverflowReport['tablet-768x1024'] = await auditOverflow(768, 1024);

    // --- STEP 4: Mobile 390x844 ---
    console.log('\n--- 4. Mobile 390x844 Verification ---');
    await setViewport(390, 844, true);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
    await delay(600);
    await captureScreenshot('phase-9d-mobile-390x844.png');
    await captureScreenshot('phase-9d-mobile-390x844-fullpage.png', true);
    report.responsiveOverflowReport['mobile-390x844'] = await auditOverflow(390, 844);

    // --- STEP 5: Small Mobile 360x800 ---
    console.log('\n--- 5. Small Mobile 360x800 Verification ---');
    await setViewport(360, 800, true);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
    await delay(600);
    await captureScreenshot('phase-9d-small-mobile-360x800.png');
    report.responsiveOverflowReport['small-mobile-360x800'] = await auditOverflow(360, 800);

    // --- STEP 6: CTA & Anchor Integrity Audit ---
    console.log('\n--- 6. CTA & Anchor Integrity Audit ---');
    await setViewport(1440, 900, false);
    const ctaAuditRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a, button'));
        const audit = [];
        for (const el of links) {
          const href = el.getAttribute('href');
          const text = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ');
          if (href) {
            audit.push({
              text: text.substring(0, 40),
              href: href,
              isInternal: href.startsWith('/') || href.startsWith('#'),
              isExternal: href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
            });
          }
        }
        return {
          totalLinks: audit.length,
          sample: audit.slice(0, 15)
        };
      })()`,
      returnByValue: true
    });
    report.ctaAndAnchorAudit = getEvalValue(ctaAuditRes);

    // Record console errors
    report.consoleErrors = {
      count: consoleErrors.length,
      errors: consoleErrors
    };

    // Overall Status
    const allOverflowsZero = Object.values(report.responsiveOverflowReport).every(r => !r.hasHorizontalOverflow && r.overflowDeltaPixels === 0);
    const allSectionsPresent = Object.values(report.sectionsAudit).every(s => s.exists && s.verified);

    report.verificationStatus = {
      allSectionsPresent,
      allOverflowsZero,
      zeroConsoleErrors: consoleErrors.length === 0,
      overallApproved: allSectionsPresent && allOverflowsZero && consoleErrors.length === 0
    };

    const reportPath = path.join(screenshotsDir, 'PHASE_9D_VERIFICATION_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nSuccessfully saved complete populated report to ${reportPath}`);
    console.log(`Overall Approved: ${report.verificationStatus.overallApproved}`);

    ws.close();
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    try { chromeProc.kill(); } catch {}
    server.close(() => {
      console.log('HTTP server closed.');
    });
  }
}

run();
