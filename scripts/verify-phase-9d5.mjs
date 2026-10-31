import http from 'http';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const screenshotsDir = path.resolve(projectRoot, 'screenshots', 'phase-9d5');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-user-9d5');
const PORT = 4185;
const CDP_PORT = 9245;
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

const getEvalValue = (res) => (res?.result?.result?.value !== undefined ? res.result.result.value : res?.result?.value);

// Pure JS PNG Decoder to audit black rows and pixel values
function decodePngPixels(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0;
  const idatChunks = [];

  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
      bitDepth = buf[offset + 16];
      colorType = buf[offset + 17];
    } else if (type === 'IDAT') {
      idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + len;
  }

  const compressed = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressed);

  const bpp = colorType === 6 ? 4 : (colorType === 2 ? 3 : 4);
  const stride = 1 + width * bpp;
  const pixels = Buffer.alloc(width * height * 4);

  let prevRow = Buffer.alloc(width * bpp);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * stride;
    const filterType = decompressed[rowOffset];
    const currentRow = Buffer.alloc(width * bpp);

    for (let i = 0; i < width * bpp; i++) {
      const raw = decompressed[rowOffset + 1 + i];
      const a = i >= bpp ? currentRow[i - bpp] : 0;
      const b = prevRow[i];
      const c = i >= bpp ? prevRow[i - bpp] : 0;

      let val = raw;
      if (filterType === 1) val = (raw + a) & 0xff;
      else if (filterType === 2) val = (raw + b) & 0xff;
      else if (filterType === 3) val = (raw + Math.floor((a + b) / 2)) & 0xff;
      else if (filterType === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr = a;
        if (pb < pa && pb <= pc) pr = b;
        else if (pc < pa) pr = c;
        val = (raw + pr) & 0xff;
      }
      currentRow[i] = val;
    }

    for (let x = 0; x < width; x++) {
      const pxIdx = (y * width + x) * 4;
      if (colorType === 6) {
        pixels[pxIdx] = currentRow[x * 4];
        pixels[pxIdx + 1] = currentRow[x * 4 + 1];
        pixels[pxIdx + 2] = currentRow[x * 4 + 2];
        pixels[pxIdx + 3] = currentRow[x * 4 + 3];
      } else if (colorType === 2) {
        pixels[pxIdx] = currentRow[x * 3];
        pixels[pxIdx + 1] = currentRow[x * 3 + 1];
        pixels[pxIdx + 2] = currentRow[x * 3 + 2];
        pixels[pxIdx + 3] = 255;
      }
    }
    prevRow = currentRow;
  }

  return { width, height, pixels };
}

function countBlackRowsAtBottom(filePath, threshold = 18) {
  try {
    const { width, height, pixels } = decodePngPixels(filePath);
    let blackRows = 0;
    for (let y = height - 1; y >= 0; y--) {
      let isRowBlack = true;
      for (let x = 0; x < width; x += 10) {
        const idx = (y * width + x) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        if (r > threshold || g > threshold || b > threshold) {
          isRowBlack = false;
          break;
        }
      }
      if (isRowBlack) blackRows++;
      else break;
    }
    return { width, height, blackRows };
  } catch (err) {
    console.error('Error auditing black rows for', filePath, err);
    return { width: 0, height: 0, blackRows: 0 };
  }
}

async function runVerification() {
  console.log('========================================================');
  console.log('  BILEKSA PRIVATE RESIDENCES — PHASE 9D.5 FINAL POLISH  ');
  console.log('========================================================\n');

  await new Promise((res) => server.listen(PORT, '127.0.0.1', res));
  console.log(`Preview server running at http://127.0.0.1:${PORT}`);

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    '--autoplay-policy=no-user-gesture-required'
  ]);

  let cdpConnected = false;
  let targetWsUrl = null;

  for (let i = 0; i < 30; i++) {
    await delay(300);
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      if (res.ok) {
        const list = await res.json();
        const page = list.find((t) => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          targetWsUrl = page.webSocketDebuggerUrl;
          cdpConnected = true;
          break;
        }
      }
    } catch (_) {}
  }

  if (!cdpConnected || !targetWsUrl) {
    throw new Error('Failed to connect to Chrome CDP.');
  }

  const ws = new WebSocket(targetWsUrl);

  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      if (msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map((a) => a.value || a.description || JSON.stringify(a)).join(' '));
      }
    } else if (msg.method === 'Log.entryAdded') {
      if (msg.params.entry.level === 'error') {
        consoleErrors.push(msg.params.entry.text);
      }
    }

    if (msg.id && callbacks.has(msg.id)) {
      const resolve = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      resolve(msg);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  await new Promise((res) => {
    if (ws.readyState === WebSocket.OPEN) res();
    else ws.onopen = res;
  });

  await send('Runtime.enable');
  await send('Log.enable');
  await send('Page.enable');
  await send('DOM.enable');
  await send('CSS.enable');

  console.log('Connected to Chrome DevTools Protocol.');

  const report = {
    timestamp: new Date().toISOString(),
    phase: 'Phase 9D.5 — Final Quick Polish Verification',
    sanctuaryLivingAudit: {},
    collectionsScreeningAudit: {},
    architecturalPhilosophyAudit: {},
    fullPageSpacingAudit: {},
    responsiveOverflowReport: {},
    consoleErrors: { count: 0, errors: [] },
    sectionBlackRowVerification: {},
    overallApproved: false
  };

  async function setViewport(width, height, isMobile = false) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
    await send('Emulation.setVisibleSize', { width, height });
  }

  async function captureScreenshot(filename, captureBeyondViewport = false, clip = null) {
    const options = { format: 'png' };
    if (clip) options.clip = clip;
    if (captureBeyondViewport) options.captureBeyondViewport = true;

    const res = await send('Page.captureScreenshot', options);
    if (res && res.result && res.result.data) {
      const filePath = path.join(screenshotsDir, filename);
      fs.writeFileSync(filePath, Buffer.from(res.result.data, 'base64'));
      console.log(`Saved screenshot: ${filename}`);
    }
  }

  async function scrollThroughPage() {
    await send('Runtime.evaluate', {
      expression: `new Promise(async (resolve) => {
        const totalHeight = document.body.scrollHeight;
        const step = 800;
        for (let y = 0; y < totalHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 200));
        resolve();
      })`,
      awaitPromise: true
    });
  }

  async function auditOverflow(width, height) {
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const clientW = docEl.clientWidth;
        const scrollW = docEl.scrollWidth;
        const bodyScrollW = body.scrollWidth;
        const winInnerW = window.innerWidth;
        
        const delta = Math.max(0, scrollW - clientW, bodyScrollW - clientW);
        const elements = Array.from(document.querySelectorAll('*'));
        const overflowing = [];

        for (const el of elements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > winInnerW + 1 && el.offsetParent !== null) {
            overflowing.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              className: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 4).join(' ') : '',
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              windowWidth: winInnerW
            });
          }
        }

        return {
          viewportWidth: ${width},
          viewportHeight: ${height},
          clientWidth: clientW,
          windowInnerWidth: winInnerW,
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

  // --- STEP 1: Desktop 1440x900 Verification ---
  console.log('\n--- 1. Desktop 1440x900 Verification ---');
  await setViewport(1440, 900, false);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await delay(2500);

  console.log('Pre-scrolling through page to warm up all image assets...');
  await scrollThroughPage();
  await delay(600);

  // 1. Audit Section 5: Sanctuary & Living
  console.log('\n--- Auditing Sanctuary & Living (Section 5) ---');
  const s5AuditRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector('#amenities');
      if (!sec) return { exists: false };
      const rect = sec.getBoundingClientRect();
      const heroSpread = sec.querySelector('.lifestyle-hero-spread');
      const diptych = sec.querySelector('.lifestyle-diptych-grid');
      const triad = sec.querySelector('.lifestyle-triad-grid');

      const heroSpreadStyle = heroSpread ? window.getComputedStyle(heroSpread) : null;
      const diptychStyle = diptych ? window.getComputedStyle(diptych) : null;
      const triadStyle = triad ? window.getComputedStyle(triad) : null;

      return {
        exists: true,
        heightPixels: Math.round(rect.height),
        isHeightReduced: rect.height < 3000, // previously was 5,254px!
        heroSpreadColumns: heroSpreadStyle ? heroSpreadStyle.gridTemplateColumns : null,
        diptychColumns: diptychStyle ? diptychStyle.gridTemplateColumns : null,
        triadColumns: triadStyle ? triadStyle.gridTemplateColumns : null
      };
    })()`,
    returnByValue: true
  });
  report.sanctuaryLivingAudit = getEvalValue(s5AuditRes);
  console.log('Sanctuary & Living Audit:', JSON.stringify(report.sanctuaryLivingAudit, null, 2));

  // 2. Audit Section 6: Collections & Screening
  console.log('\n--- Auditing Collections & Screening (Section 6) ---');
  const s6AuditRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector('#collections');
      if (!sec) return { exists: false };
      const container = sec.querySelector('.container');
      const typologyGrid = sec.querySelector('.typology-grid');
      const screeningGrid = sec.querySelector('.screening-suite-grid');

      const cRect = container ? container.getBoundingClientRect() : null;
      const tRect = typologyGrid ? typologyGrid.getBoundingClientRect() : null;

      const tStyle = typologyGrid ? window.getComputedStyle(typologyGrid) : null;
      const sStyle = screeningGrid ? window.getComputedStyle(screeningGrid) : null;

      const cStyle = container ? window.getComputedStyle(container) : null;
      const padLeft = cStyle ? parseFloat(cStyle.paddingLeft) : 0;
      const padRight = cStyle ? parseFloat(cStyle.paddingRight) : 0;
      const availableInnerWidth = cRect ? (cRect.width - padLeft - padRight) : 0;

      const items = Array.from(sec.querySelectorAll('.collection-item-card'));
      const itemRects = items.map(el => {
        const r = el.getBoundingClientRect();
        return { width: Math.round(r.width), left: Math.round(r.left), right: Math.round(r.right) };
      });

      const widthRatio = availableInnerWidth > 0 ? (tRect.width / availableInnerWidth) : 0;

      return {
        exists: true,
        containerWidth: cRect ? Math.round(cRect.width) : 0,
        availableInnerWidth: Math.round(availableInnerWidth),
        typologyGridWidth: tRect ? Math.round(tRect.width) : 0,
        horizontalSpanPercentage: Math.round(widthRatio * 100),
        usesHorizontalSpaceProperly: widthRatio >= 0.98,
        typologyColumns: tStyle ? tStyle.gridTemplateColumns : null,
        screeningColumns: sStyle ? sStyle.gridTemplateColumns : null,
        itemsCount: items.length,
        itemWidthsSample: itemRects.map(i => i.width)
      };
    })()`,
    returnByValue: true
  });
  report.collectionsScreeningAudit = getEvalValue(s6AuditRes);
  console.log('Collections & Screening Audit:', JSON.stringify(report.collectionsScreeningAudit, null, 2));

  // 3. Audit Section 4: Architectural Philosophy
  console.log('\n--- Auditing Architectural Philosophy (Section 4) ---');
  const s4AuditRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const sec = document.querySelector('#materiality');
      if (!sec) return { exists: false };
      const visionGrid = sec.querySelector('.vision-diptych-grid');
      const pillarsGrid = sec.querySelector('.pillars-grid');
      const cards = Array.from(sec.querySelectorAll('.pillar-card'));

      const vStyle = visionGrid ? window.getComputedStyle(visionGrid) : null;
      const pStyle = pillarsGrid ? window.getComputedStyle(pillarsGrid) : null;

      const cardAudit = cards.map((c, i) => {
        const num = c.querySelector('.pillar-num');
        const title = c.querySelector('.pillar-title');
        const sub = c.querySelector('.pillar-sub');
        const desc = c.querySelector('.pillar-desc');
        return {
          cardIndex: i + 1,
          hasNumber: !!num && !!num.textContent.trim(),
          hasTitle: !!title && !!title.textContent.trim(),
          hasSubtitle: !!sub && !!sub.textContent.trim(),
          hasDescription: !!desc && !!desc.textContent.trim()
        };
      });

      return {
        exists: true,
        visionDiptychColumns: vStyle ? vStyle.gridTemplateColumns : null,
        pillarsColumns: pStyle ? pStyle.gridTemplateColumns : null,
        pillarsCount: cards.length,
        allPillarsAligned: cardAudit.every(c => c.hasNumber && c.hasTitle && c.hasSubtitle && c.hasDescription),
        cardsDetail: cardAudit
      };
    })()`,
    returnByValue: true
  });
  report.architecturalPhilosophyAudit = getEvalValue(s4AuditRes);
  console.log('Architectural Philosophy Audit:', JSON.stringify(report.architecturalPhilosophyAudit, null, 2));

  // 4. Audit Full-Page Spacing
  console.log('\n--- Auditing Full-Page Section Spacing ---');
  const spacingAuditRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const sectionSelectors = [
        '#introduction',
        '#flagship-residence',
        '#registry',
        '#materiality',
        '#amenities',
        '#collections',
        '#concierge'
      ];
      return sectionSelectors.map(sel => {
        const el = document.querySelector(sel);
        if (!el) return { selector: sel, exists: false };
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          selector: sel,
          exists: true,
          height: Math.round(rect.height),
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom,
          marginTop: style.marginTop,
          marginBottom: style.marginBottom
        };
      });
    })()`,
    returnByValue: true
  });
  report.fullPageSpacingAudit = getEvalValue(spacingAuditRes);
  console.log('Full-Page Spacing Audit:', JSON.stringify(report.fullPageSpacingAudit, null, 2));

  // Full-page Desktop Screenshot
  console.log('Capturing Desktop Fullpage Screenshot...');
  await captureScreenshot('desktop-1440x900-fullpage.png', true);

  // Section Screenshots (Sections 4, 5, 6)
  const sectionsToCapture = [
    { id: 'materiality', selector: '#materiality', name: 'Section 4 — Architectural Philosophy', file: 'section-4-philosophy.png' },
    { id: 'amenities', selector: '#amenities', name: 'Section 5 — Sanctuary & Living Preview', file: 'section-5-sanctuary-living.png' },
    { id: 'collections', selector: '#collections', name: 'Section 6 — Curated Lifestyle / Collections Preview', file: 'section-6-collections-screening.png' }
  ];

  for (const sec of sectionsToCapture) {
    console.log(`Auditing & capturing: ${sec.name}`);
    const dimsRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${sec.selector}');
        if (!el) return null;
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        const rect = el.getBoundingClientRect();
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      })()`,
      returnByValue: true
    });
    await delay(300);

    const dims = getEvalValue(dimsRes);
    if (dims && dims.height > 0) {
      const captureHeight = Math.max(800, dims.height);
      await setViewport(1440, captureHeight, false);
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${sec.selector}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()`
      });
      await delay(300);

      await captureScreenshot(sec.file, false);
      await setViewport(1440, 900, false);
      await delay(200);

      const blackAudit = countBlackRowsAtBottom(path.join(screenshotsDir, sec.file));
      report.sectionBlackRowVerification[sec.id] = {
        file: sec.file,
        dimensions: `${blackAudit.width}x${blackAudit.height}`,
        blackRowsAtBottom: blackAudit.blackRows,
        hasUnintendedBlackGap: blackAudit.blackRows > 5
      };
    }
  }

  report.responsiveOverflowReport['desktop-1440x900'] = await auditOverflow(1440, 900);

  // --- STEP 2: Laptop 1366x768 ---
  console.log('\n--- 2. Laptop 1366x768 Verification ---');
  await setViewport(1366, 768, false);
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
  await delay(500);
  await captureScreenshot('laptop-1366x768.png');
  report.responsiveOverflowReport['laptop-1366x768'] = await auditOverflow(1366, 768);

  // --- STEP 3: Tablet 768x1024 ---
  console.log('\n--- 3. Tablet 768x1024 Verification ---');
  await setViewport(768, 1024, false);
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
  await delay(500);
  await captureScreenshot('tablet-768x1024.png');
  report.responsiveOverflowReport['tablet-768x1024'] = await auditOverflow(768, 1024);

  // --- STEP 4: Mobile 390x844 ---
  console.log('\n--- 4. Mobile 390x844 Verification ---');
  await setViewport(390, 844, true);
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
  await delay(500);
  await captureScreenshot('mobile-390x844-fullpage.png', true);

  // Capture Mobile Section 5 & 6
  console.log('Capturing Mobile Section 5 & 6...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('#amenities');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await delay(300);
  await captureScreenshot('mobile-390x844-section-5.png');

  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('#collections');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await delay(300);
  await captureScreenshot('mobile-390x844-section-6.png');

  report.responsiveOverflowReport['mobile-390x844'] = await auditOverflow(390, 844);

  // --- STEP 5: Small Mobile 360x800 ---
  console.log('\n--- 5. Small Mobile 360x800 Verification ---');
  await setViewport(360, 800, true);
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
  await delay(500);
  await captureScreenshot('mobile-360x800.png');
  report.responsiveOverflowReport['mobile-360x800'] = await auditOverflow(360, 800);

  // Console Errors
  report.consoleErrors = {
    count: consoleErrors.length,
    errors: consoleErrors
  };

  const hasNoOverflow = Object.values(report.responsiveOverflowReport).every(v => !v.hasHorizontalOverflow && v.overflowDeltaPixels === 0);
  const s5Passed = report.sanctuaryLivingAudit.isHeightReduced;
  const s6Passed = report.collectionsScreeningAudit.usesHorizontalSpaceProperly;
  const s4Passed = report.architecturalPhilosophyAudit.allPillarsAligned;
  const noConsoleErrors = report.consoleErrors.count === 0;

  report.overallApproved = hasNoOverflow && s5Passed && s6Passed && s4Passed && noConsoleErrors;

  console.log('\n========================================================');
  console.log(`  OVERALL APPROVAL STATUS: ${report.overallApproved ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`  - Section 5 Height Reduced: ${s5Passed ? 'YES' : 'NO'} (${report.sanctuaryLivingAudit.heightPixels}px)`);
  console.log(`  - Section 6 Uses Horizontal Space: ${s6Passed ? 'YES' : 'NO'} (${report.collectionsScreeningAudit.horizontalSpanPercentage}%)`);
  console.log(`  - Section 4 Pillars Aligned: ${s4Passed ? 'YES' : 'NO'}`);
  console.log(`  - 0px Horizontal Overflow: ${hasNoOverflow ? 'YES' : 'NO'}`);
  console.log(`  - Console Errors: ${report.consoleErrors.count}`);
  console.log('========================================================\n');

  const reportPath = path.resolve(projectRoot, 'PHASE_9D5_VERIFICATION_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`Report written to ${reportPath}`);

  // Cleanup
  ws.close();
  chromeProc.kill();
  server.close();
  try {
    fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  } catch (_) {}

  process.exit(report.overallApproved ? 0 : 1);
}

runVerification().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
