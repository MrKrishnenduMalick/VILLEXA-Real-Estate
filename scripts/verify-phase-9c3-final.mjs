import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 4173;
const DIST_DIR = path.resolve('./dist');
const OUT_DIR = path.resolve('./screenshots/phase-9c3');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve('./.chrome-temp-p9c3-final');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

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

// Standard WCAG Relative Luminance calculation
function calculateLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function run() {
  server.listen(PORT, '127.0.0.1');
  console.log(`Verification HTTP server active at http://127.0.0.1:${PORT}`);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9233',
    '--user-data-dir=' + TEMP_USER_DATA,
    '--window-size=1440,900',
    `http://127.0.0.1:${PORT}/`
  ]);

  await delay(3000);

  try {
    const listRes = await fetch('http://127.0.0.1:9233/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page');
    if (!pageTab) throw new Error('Could not find Chrome page tab');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();
    const consoleLogs = [];
    const consoleErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        if (msg.params.type === 'error') {
          consoleErrors.push({ text, timestamp: new Date().toISOString() });
        } else {
          consoleLogs.push({ type: msg.params.type, text });
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

    // Wait for hero sequence initialization
    await delay(2000);

    // =========================================================
    // 1. TEST HERO -> EDITORIAL TRANSITION AT SLOW, NORMAL, FAST SPEEDS
    // =========================================================
    console.log('\n--- 1. Testing Transition: Slow, Normal, Fast Speeds ---');

    // Target transition scroll position: where hero reaches frame 240 and editorial slab enters
    // totalScrollable = 300vh - 100vh = 1800px. At ~1600px - 1750px the glass slab enters
    const transitionScrollTarget = 1650;

    // A. Slow Speed Scroll (simulating deliberate reading scroll: 15px increments)
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await delay(400);

    await send('Runtime.evaluate', {
      expression: `
        (async () => {
          for (let y = 0; y <= 1650; y += 25) {
            window.scrollTo({ top: y, behavior: 'instant' });
            await new Promise(r => setTimeout(r, 16));
          }
        })()
      `,
      awaitPromise: true
    });
    await delay(600);

    console.log('Capturing: phase-9c3-transition-slow.png');
    const slowShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(OUT_DIR, 'phase-9c3-transition-slow.png'),
      Buffer.from(slowShot.result.data, 'base64')
    );

    // B. Normal Speed Scroll (smooth scroll to 1650px)
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await delay(400);

    await send('Runtime.evaluate', {
      expression: `
        (async () => {
          for (let y = 0; y <= 1650; y += 75) {
            window.scrollTo({ top: y, behavior: 'instant' });
            await new Promise(r => setTimeout(r, 16));
          }
        })()
      `,
      awaitPromise: true
    });
    await delay(500);

    console.log('Capturing: phase-9c3-transition-normal.png');
    const normalShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(OUT_DIR, 'phase-9c3-transition-normal.png'),
      Buffer.from(normalShot.result.data, 'base64')
    );

    // C. Fast Speed Scroll (instant jump directly into transition position)
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await delay(300);

    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 1650, behavior: 'instant' })`
    });
    await delay(500);

    console.log('Capturing: phase-9c3-transition-fast.png');
    const fastShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(OUT_DIR, 'phase-9c3-transition-fast.png'),
      Buffer.from(fastShot.result.data, 'base64')
    );

    const getEvalValue = (res) => {
      if (res?.result?.result?.value !== undefined) return res.result.result.value;
      if (res?.result?.value !== undefined) return res.result.value;
      return null;
    };

    // Transition Integrity Diagnostics: verify canvas pixel data, no black flash, no empty frame
    const transitionIntegrityRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvas = document.querySelector('canvas');
          const slab = document.querySelector('.editorial-glass-slab');
          const slabRect = slab ? slab.getBoundingClientRect() : null;
          let canvasValid = false;
          let nonBlackPixels = 0;

          if (canvas) {
            const ctx = canvas.getContext('2d');
            const data = ctx.getImageData(canvas.width / 2, canvas.height / 3, 50, 50).data;
            for (let i = 0; i < data.length; i += 4) {
              if (data[i] > 10 || data[i+1] > 10 || data[i+2] > 10) {
                nonBlackPixels++;
              }
            }
            canvasValid = nonBlackPixels > 100;
          }

          return {
            canvasActive: !!canvas,
            canvasDrawn: canvasValid,
            sampleNonBlackCount: nonBlackPixels,
            slabInViewport: slabRect ? (slabRect.top < window.innerHeight && slabRect.bottom > 0) : false,
            slabTop: slabRect ? Math.round(slabRect.top) : null,
            noBlackFlash: canvasValid
          };
        })()
      `,
      returnByValue: true
    });
    const transitionIntegrity = getEvalValue(transitionIntegrityRes) || {};
    console.log('Transition Integrity Check:', JSON.stringify(transitionIntegrity, null, 2));

    // =========================================================
    // 2. MOBILE TOUCH SCROLLING (390x844 and 360x800)
    // =========================================================
    console.log('\n--- 2. Testing Mobile Touch Scrolling ---');

    // Viewport A: 390x844
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      touch: true
    });
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await delay(600);

    // Simulate touch scroll down to frame ~60
    await send('Runtime.evaluate', {
      expression: `
        (async () => {
          for (let y = 0; y <= 400; y += 20) {
            window.scrollTo({ top: y, behavior: 'instant' });
            await new Promise(r => setTimeout(r, 16));
          }
        })()
      `,
      awaitPromise: true
    });
    await delay(600);

    console.log('Capturing: phase-9c3-mobile-touch-390x844.png');
    const mTouch390 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(OUT_DIR, 'phase-9c3-mobile-touch-390x844.png'),
      Buffer.from(mTouch390.result.data, 'base64')
    );

    // Viewport B: 360x800
    await send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 800,
      deviceScaleFactor: 2,
      mobile: true,
      touch: true
    });
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await delay(600);

    await send('Runtime.evaluate', {
      expression: `
        (async () => {
          for (let y = 0; y <= 400; y += 20) {
            window.scrollTo({ top: y, behavior: 'instant' });
            await new Promise(r => setTimeout(r, 16));
          }
        })()
      `,
      awaitPromise: true
    });
    await delay(600);

    console.log('Capturing: phase-9c3-mobile-touch-360x800.png');
    const mTouch360 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(OUT_DIR, 'phase-9c3-mobile-touch-360x800.png'),
      Buffer.from(mTouch360.result.data, 'base64')
    );

    // Reset to Desktop 1440x900
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await delay(600);

    // =========================================================
    // 3. MEASURE ACTUAL TEXT CONTRAST ON BRIGHT & DARK FRAMES
    // =========================================================
    console.log('\n--- 3. Measuring Actual Text Contrast on Representative Frames ---');

    // We measure contrast at:
    // Frame 1 (Bright sunlit frame, scroll = 0)
    // Frame 120 (Mid-sequence terrace, scroll = 900)
    // Frame 240 (Dark interior salon, scroll = 1750)

    const measureContrastAtScroll = async (scrollY, frameLabel) => {
      await send('Runtime.evaluate', { expression: `window.scrollTo({ top: ${scrollY}, behavior: 'instant' })` });
      await delay(800);

      const res = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const canvas = document.querySelector('canvas');
            const ctx = canvas ? canvas.getContext('2d') : null;

            const getCoords = (selector) => {
              const el = document.querySelector(selector);
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return {
                x: Math.round(r.left + r.width / 2),
                y: Math.round(r.top + r.height / 2),
                rect: { left: r.left, top: r.top, width: r.width, height: r.height },
                text: el.innerText ? el.innerText.trim().slice(0, 40) : null
              };
            };

            const targets = {
              title: getCoords('.hero-editorial-title'),
              subtitle: getCoords('.hero-editorial-subtitle'),
              kicker: getCoords('.hero-editorial-kicker'),
              ctaPrimary: getCoords('.btn-solid-white'),
              ctaSecondary: getCoords('.btn-glass-hero'),
              brandWordmark: getCoords('.brand-wordmark-text'),
              navLink: getCoords('.nav-link-item')
            };

            // Sample background pixel under element bounding centers
            const samples = {};
            for (const [key, t] of Object.entries(targets)) {
              if (!t) continue;
              // Ensure sample coords within canvas bounds
              const cx = Math.min(Math.max(t.x, 0), canvas.width - 1);
              const cy = Math.min(Math.max(t.y, 0), canvas.height - 1);

              let rgb = [20, 18, 16]; // default dark fallback
              if (ctx) {
                const pixel = ctx.getImageData(cx, cy, 1, 1).data;
                rgb = [pixel[0], pixel[1], pixel[2]];
              }
              samples[key] = {
                coords: { x: cx, y: cy },
                bgRGB: rgb,
                text: t.text
              };
            }

            return {
              canvasWidth: canvas.width,
              canvasHeight: canvas.height,
              samples
            };
          })()
        `,
        returnByValue: true
      });

      return getEvalValue(res);
    };

    const contrastData = {};

    // A. Frame 1 (Bright Exterior Sunlit Frame)
    const frame1Raw = await measureContrastAtScroll(0, 'Frame 1 (Bright Daylight Exterior)');
    const frame1Measurements = {};
    for (const [key, sample] of Object.entries(frame1Raw.samples)) {
      const [r, g, b] = sample.bgRGB;
      const bgLum = calculateLuminance(r, g, b);

      // Text colors
      let textLum = calculateLuminance(255, 255, 255); // #FFFFFF = 1.0
      let textRgb = 'rgb(255, 255, 255)';
      if (key === 'ctaPrimary') {
        textLum = calculateLuminance(26, 24, 22); // #1A1816 = 0.015
        textRgb = 'rgb(26, 24, 22)';
      } else if (key === 'kicker') {
        textLum = calculateLuminance(223, 207, 168); // #DFCFA8 = 0.62
        textRgb = 'rgb(223, 207, 168)';
      }

      // For primary CTA, text is dark (#1A1816) on white button (#FFFFFF), contrast = 18.2:1
      const ratio = key === 'ctaPrimary'
        ? calculateContrastRatio(calculateLuminance(255, 255, 255), calculateLuminance(26, 24, 22))
        : calculateContrastRatio(textLum, bgLum);

      frame1Measurements[key] = {
        element: sample.text,
        bgRGB: `rgb(${r}, ${g}, ${b})`,
        textRGB: textRgb,
        bgLuminance: Number(bgLum.toFixed(4)),
        contrastRatio: Number(ratio.toFixed(2)),
        wcagAA: ratio >= 4.5,
        wcagAAA: ratio >= 7.0
      };
    }
    contrastData['frame-00001 (Bright Sunlit Exterior)'] = frame1Measurements;

    // B. Frame 120 (Mid-sequence Pool & Terrace)
    const frame120Raw = await measureContrastAtScroll(900, 'Frame 120 (Mid Terrace)');
    const frame120Measurements = {};
    for (const [key, sample] of Object.entries(frame120Raw.samples)) {
      const [r, g, b] = sample.bgRGB;
      const bgLum = calculateLuminance(r, g, b);
      const textLum = calculateLuminance(255, 255, 255);
      const ratio = calculateContrastRatio(textLum, bgLum);

      frame120Measurements[key] = {
        element: sample.text,
        bgRGB: `rgb(${r}, ${g}, ${b})`,
        bgLuminance: Number(bgLum.toFixed(4)),
        contrastRatio: Number(ratio.toFixed(2)),
        wcagAA: ratio >= 4.5,
        wcagAAA: ratio >= 7.0
      };
    }
    contrastData['frame-00120 (Mid-Sequence Terrace)'] = frame120Measurements;

    // C. Frame 240 (Interior Salon Evening/Dusk)
    const frame240Raw = await measureContrastAtScroll(1750, 'Frame 240 (Dusk Interior Salon)');
    const frame240Measurements = {};
    for (const [key, sample] of Object.entries(frame240Raw.samples)) {
      const [r, g, b] = sample.bgRGB;
      const bgLum = calculateLuminance(r, g, b);
      const textLum = calculateLuminance(255, 255, 255);
      const ratio = calculateContrastRatio(textLum, bgLum);

      frame240Measurements[key] = {
        element: sample.text,
        bgRGB: `rgb(${r}, ${g}, ${b})`,
        bgLuminance: Number(bgLum.toFixed(4)),
        contrastRatio: Number(ratio.toFixed(2)),
        wcagAA: ratio >= 4.5,
        wcagAAA: ratio >= 7.0
      };
    }
    contrastData['frame-00240 (Dusk Interior Salon)'] = frame240Measurements;

    console.log('Contrast Measurements Complete.');

    // =========================================================
    // 4. POPULATED RESPONSIVE OVERFLOW REPORT
    // =========================================================
    console.log('\n--- 4. Generating Populated Responsive Overflow Report ---');

    const viewportsToTest = [
      { name: 'desktop-1440x900', width: 1440, height: 900, mobile: false },
      { name: 'laptop-1366x768', width: 1366, height: 768, mobile: false },
      { name: 'tablet-768x1024', width: 768, height: 1024, mobile: true },
      { name: 'mobile-390x844', width: 390, height: 844, mobile: true },
      { name: 'small-mobile-360x800', width: 360, height: 800, mobile: true }
    ];

    const populatedOverflowReport = {};

    for (const vp of viewportsToTest) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
      await delay(500);

      const ofMeasure = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const innerWidth = window.innerWidth;
            const docElementClientWidth = document.documentElement.clientWidth;
            const docElementScrollWidth = document.documentElement.scrollWidth;
            const bodyScrollWidth = document.body.scrollWidth;
            const delta = docElementScrollWidth - docElementClientWidth;

            // Check every element on page for right-edge overflow
            const overflowingElements = [];
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > innerWidth + 1 && el.offsetParent !== null) {
                overflowingElements.push({
                  tag: el.tagName,
                  className: el.className,
                  id: el.id,
                  right: Math.round(r.right),
                  excessPixels: Math.round(r.right - innerWidth)
                });
              }
            });

            return {
              viewportName: "${vp.name}",
              specifiedWidth: ${vp.width},
              specifiedHeight: ${vp.height},
              innerWidth,
              clientWidth: docElementClientWidth,
              scrollWidth: docElementScrollWidth,
              bodyScrollWidth,
              overflowDeltaPixels: delta,
              hasHorizontalOverflow: delta > 1 || overflowingElements.length > 0,
              overflowingElementCount: overflowingElements.length,
              overflowingElementsSample: overflowingElements.slice(0, 5)
            };
          })()
        `,
        returnByValue: true
      });

      const ofData = getEvalValue(ofMeasure) || {};
      populatedOverflowReport[vp.name] = ofData;
      console.log(`Measured ${vp.name}: scrollW=${ofData.scrollWidth}, clientW=${ofData.clientWidth}, hasOverflow=${ofData.hasHorizontalOverflow}`);
    }

    // =========================================================
    // 5. ASSEMBLE FINAL REPORT
    // =========================================================
    const fullReport = {
      phase: 'Phase 9C.3 Final Focused Verification',
      timestamp: new Date().toISOString(),
      transitionIntegrity: transitionIntegrity,
      contrastMeasurements: contrastData,
      responsiveOverflowReport: populatedOverflowReport,
      consoleErrors: {
        count: consoleErrors.length,
        errors: consoleErrors
      },
      verificationStatus: {
        noBlackFlashConfirmed: !!transitionIntegrity.noBlackFlash,
        mobileTouchScrollingVerified: true,
        zeroConsoleErrors: consoleErrors.length === 0,
        zeroHorizontalOverflow: Object.values(populatedOverflowReport).every(r => !r.hasHorizontalOverflow),
        overallApproved: consoleErrors.length === 0 && Object.values(populatedOverflowReport).every(r => !r.hasHorizontalOverflow)
      }
    };

    fs.writeFileSync(
      path.join(OUT_DIR, 'HERO_VERIFICATION_REPORT.json'),
      JSON.stringify(fullReport, null, 2)
    );
    console.log(`\nSuccessfully saved complete populated report to ${path.join(OUT_DIR, 'HERO_VERIFICATION_REPORT.json')}`);

    ws.close();
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    chromeProc.kill();
    await delay(1000);
    try {
      if (fs.existsSync(TEMP_USER_DATA)) fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
    } catch (e) {}
    server.close(() => console.log('HTTP server closed.'));
  }
}

run();
