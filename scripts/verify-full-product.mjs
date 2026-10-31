import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const auditDir = path.resolve(projectRoot, 'screenshots', 'product-verification');

if (!fs.existsSync(auditDir)) {
  fs.mkdirSync(auditDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.resolve(projectRoot, '.chrome-temp-product-verification');
const PORT = 4196;
const CDP_PORT = 9256;
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
  if (!fs.existsSync(filePath)) filePath = path.join(distDir, 'index.html');

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Error: ${err.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-cache' });
      res.end(content);
    }
  });
});

async function runProductVerification() {
  await new Promise((res) => server.listen(PORT, res));
  console.log(`Auditor test server running on http://127.0.0.1:${PORT}`);

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1920,1080'
  ]);

  chromeProc.stderr.on('data', (d) => {
    // console.log('[Chrome Stderr]', d.toString());
  });

  let targetWsUrl = null;
  for (let i = 0; i < 40; i++) {
    await delay(300);
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      if (res.ok) {
        const list = await res.json();
        const page = list.find((t) => t.type === 'page');
        if (page?.webSocketDebuggerUrl) {
          targetWsUrl = page.webSocketDebuggerUrl;
          break;
        }
      }
    } catch (_) {}
  }

  if (!targetWsUrl) {
    chromeProc.kill();
    server.close();
    throw new Error(`Failed to obtain Chrome CDP target after 12s on port ${CDP_PORT}`);
  }

  const ws = new WebSocket(targetWsUrl);
  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map((a) => a.value || JSON.stringify(a)).join(' '));
    }
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };

  const send = (method, params = {}) => new Promise((resolve) => {
    const msgId = id++;
    callbacks.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise((res) => ws.onopen = res);
  await send('Runtime.enable');
  await send('Page.enable');
  await send('DOM.enable');

  const evalCode = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res?.result?.result?.value;
  };

  const takeScreenshot = async (filename) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.result.data, 'base64');
    const savePath = path.join(auditDir, filename);
    fs.writeFileSync(savePath, buffer);
    console.log(`Saved screenshot: ${filename} (${Math.round(buffer.length / 1024)} KB)`);
  };

  const setViewport = async (width, height, isMobile = false) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
  };

  const results = {};

  try {
    // -------------------------------------------------------------------------
    // TEST 1: HERO OPENING & FORWARD/REVERSE SCROLL AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- 1. Testing Cinematic Hero Scroll & Transitions ---');
    await setViewport(1920, 1080);
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await delay(3000);

    // 1. Cinematic Hero Opening (Initial)
    await takeScreenshot('01-cinematic-hero-opening.png');
    results.heroOpening = await evalCode(`(() => {
      const canvas = document.querySelector('#cinematic-showroom-canvas');
      return {
        canvasFound: !!canvas,
        opacity: canvas ? window.getComputedStyle(canvas).opacity : null,
        position: canvas ? window.getComputedStyle(canvas).position : null
      };
    })()`);

    // 2. Midway Cinematic Scroll (scroll to 1200px)
    await evalCode('window.scrollTo(0, 1200)');
    await delay(1200);
    await takeScreenshot('02-midway-cinematic-scroll.png');
    results.midwayScroll = await evalCode(`(() => {
      const canvas = document.querySelector('#cinematic-showroom-canvas');
      const ctx = canvas ? canvas.getContext('2d') : null;
      const pixel = ctx ? Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data) : null;
      return { scrollY: window.scrollY, centerPixel: pixel };
    })()`);

    // 3. Final-frame Transition (scroll to 2600px)
    await evalCode('window.scrollTo(0, 2600)');
    await delay(1200);
    await takeScreenshot('03-final-frame-transition.png');
    results.finalFrameTransition = await evalCode(`(() => {
      const canvas = document.querySelector('#cinematic-showroom-canvas');
      const ctx = canvas ? canvas.getContext('2d') : null;
      const pixel = ctx ? Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data) : null;
      const slab = document.querySelector('.editorial-glass-slab');
      return {
        scrollY: window.scrollY,
        centerPixel: pixel,
        slabFound: !!slab,
        slabBackdropBlur: slab ? window.getComputedStyle(slab).backdropFilter : null
      };
    })()`);

    // 4. Homepage Glass Interface (scroll into flagship residence)
    await evalCode('window.scrollTo(0, 3600)');
    await delay(1200);
    await takeScreenshot('04-homepage-glass-interface.png');

    // Audit Homepage Glass Panels, Navigation, and Footer
    results.glassAuditHomepage = await evalCode(`(() => {
      const nav = document.querySelector('.site-header-nav');
      const slab = document.querySelector('.editorial-glass-slab');
      const spread = document.querySelector('.flagship-spread');
      const footer = document.querySelector('.site-footer');
      return {
        nav: nav ? {
          background: window.getComputedStyle(nav).background,
          backdropFilter: window.getComputedStyle(nav).backdropFilter,
          borderBottom: window.getComputedStyle(nav).borderBottom
        } : null,
        slab: slab ? {
          background: window.getComputedStyle(slab).background,
          backdropFilter: window.getComputedStyle(slab).backdropFilter,
          border: window.getComputedStyle(slab).border,
          borderRadius: window.getComputedStyle(slab).borderRadius
        } : null,
        spread: spread ? {
          background: window.getComputedStyle(spread).background,
          backdropFilter: window.getComputedStyle(spread).backdropFilter,
          border: window.getComputedStyle(spread).border
        } : null,
        footer: footer ? {
          background: window.getComputedStyle(footer).background,
          backdropFilter: window.getComputedStyle(footer).backdropFilter,
          borderTop: window.getComputedStyle(footer).borderTop
        } : null
      };
    })()`);

    // -------------------------------------------------------------------------
    // TEST 2: SUBPAGES & PERSISTENT BACKGROUND CONTINUITY
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Testing Subpages & Persistent Background Continuity ---');

    // 5. Collections Page
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/collections` });
    await delay(2000);
    await takeScreenshot('05-collections-page.png');
    results.collectionsPage = await evalCode(`(() => {
      const canvas = document.querySelector('#cinematic-showroom-canvas');
      const ctx = canvas ? canvas.getContext('2d') : null;
      const pixel = ctx ? Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data) : null;
      const cards = document.querySelectorAll('a[href^="/residences"]');
      const sampleCard = cards[0];
      return {
        canvasFound: !!canvas,
        centerPixel: pixel,
        cardsCount: cards.length,
        cardGlass: sampleCard ? {
          background: window.getComputedStyle(sampleCard).background,
          backdropFilter: window.getComputedStyle(sampleCard).backdropFilter,
          border: window.getComputedStyle(sampleCard).border
        } : null
      };
    })()`);

    // 6. Property Details Page
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/residence/the-aurelia-estate` });
    await delay(2500);
    await takeScreenshot('06-property-details-page.png');
    results.propertyDetailsPage = await evalCode(`(() => {
      const canvas = document.querySelector('#cinematic-showroom-canvas');
      const specs = document.querySelector('#specifications');
      const gallery = document.querySelector('#gallery');
      const videoTour = document.querySelector('#video-tour');
      const galleryPlate = gallery ? gallery.querySelector('img') : null;
      return {
        canvasFound: !!canvas,
        specsFound: !!specs,
        galleryFound: !!gallery,
        videoTourFound: !!videoTour,
        specsBg: specs ? window.getComputedStyle(specs).backgroundColor : null,
        specsBackdrop: specs ? window.getComputedStyle(specs).backdropFilter : null,
        galleryBg: gallery ? window.getComputedStyle(gallery).backgroundColor : null,
        galleryPlateVisible: !!galleryPlate
      };
    })()`);

    // 7. Contact Page & Interactive Form Validation
    console.log('\n--- 3. Testing Contact Suite & Validation ---');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact` });
    await delay(2000);
    await takeScreenshot('07-contact-form.png');

    results.glassAuditForm = await evalCode(`(() => {
      const formBox = document.querySelector('form');
      const formContainer = formBox ? formBox.parentElement : null;
      const input = document.querySelector('#contact-fullname');
      return {
        formContainer: formContainer ? {
          background: window.getComputedStyle(formContainer).backgroundColor,
          backdropFilter: window.getComputedStyle(formContainer).backdropFilter,
          border: window.getComputedStyle(formContainer).border
        } : null,
        input: input ? {
          background: window.getComputedStyle(input).backgroundColor,
          backdropFilter: window.getComputedStyle(input).backdropFilter,
          border: window.getComputedStyle(input).border
        } : null
      };
    })()`);

    // Test Validation Failure on Empty Submit
    results.contactValidationEmpty = await evalCode(`(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) btn.click();
      return true;
    })()`);
    await delay(400);

    const validationErrors = await evalCode(`(() => {
      const errors = Array.from(document.querySelectorAll('.text-red-300')).map(e => e.innerText.trim());
      return errors;
    })()`);
    results.validationErrors = validationErrors;

    // Test Filling Valid Data & Submitting
    results.contactSubmissionSuccess = await evalCode(`(() => {
      const nameInput = document.querySelector('#contact-fullname');
      const emailInput = document.querySelector('#contact-email');
      const phoneInput = document.querySelector('#contact-phone');
      const btn = document.querySelector('button[type="submit"]');

      if (nameInput) nameInput.value = 'Alexander Vance';
      if (emailInput) emailInput.value = 'alexander.vance@vanceholdings.ch';
      if (phoneInput) phoneInput.value = '+41 79 123 45 67';
      
      // Dispatch input events
      if (nameInput) nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      if (emailInput) emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      if (phoneInput) phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

      return true;
    })()`);
    await delay(500);

    // Click submit
    await evalCode(`(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) btn.click();
    })()`);
    await delay(1200);

    const submissionState = await evalCode(`(() => {
      const successHeading = document.querySelector('h3.font-serif');
      const whatsappBtn = document.querySelector('a[href*="wa.me"]');
      return {
        confirmedText: successHeading ? successHeading.innerText : null,
        whatsappLink: whatsappBtn ? whatsappBtn.getAttribute('href') : null
      };
    })()`);
    results.submissionState = submissionState;

    // -------------------------------------------------------------------------
    // TEST 4: RESPONSIVE AUDIT & MOBILE EXPERIENCE
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Testing Responsive Viewports & Mobile Experience ---');

    // 8. Mobile 390x844 Viewport
    await setViewport(390, 844, true);
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await delay(2500);
    await takeScreenshot('08-mobile-experience.png');

    const viewports = [
      { name: 'Desktop 1920x1080', w: 1920, h: 1080, mobile: false },
      { name: 'Laptop 1440x900', w: 1440, h: 900, mobile: false },
      { name: 'Tablet 768x1024', w: 768, h: 1024, mobile: false },
      { name: 'Mobile 390x844', w: 390, h: 844, mobile: true },
      { name: 'Mobile 360x800', w: 360, h: 800, mobile: true }
    ];

    results.responsiveChecks = [];
    for (const vp of viewports) {
      await setViewport(vp.w, vp.h, vp.mobile);
      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
      await delay(1500);
      const metrics = await evalCode(`(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
      })()`);
      results.responsiveChecks.push({ viewport: vp.name, ...metrics });
    }

  } catch (err) {
    console.error('Audit Error:', err);
  } finally {
    ws.close();
    chromeProc.kill();
    server.close();
  }

  console.log('\n======================================================');
  console.log('       FINAL PRODUCT VERIFICATION AUDIT RESULTS        ');
  console.log('======================================================\n');
  console.log(JSON.stringify(results, null, 2));
  console.log(`\nConsole Errors: ${JSON.stringify(consoleErrors)}`);
}

runProductVerification();

