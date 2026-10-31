#!/usr/bin/env node
/**
 * BILEKSA PRIVATE RESIDENCES — CLIENT ASSET REPLACEMENT & WORKFLOW CLI
 *
 * This tool manages the transition from AI-generated demo assets to real client media.
 *
 * COMMANDS:
 *   node scripts/manage-client-assets.mjs status
 *   node scripts/manage-client-assets.mjs inspect <folder>
 *   node scripts/manage-client-assets.mjs map <SLOT_ID> <file-path>
 *   node scripts/manage-client-assets.mjs update-hero-video <video-path>
 *   node scripts/manage-client-assets.mjs revert <SLOT_ID | 'all'>
 *   node scripts/manage-client-assets.mjs verify
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const REGISTRY_PATH = path.resolve(projectRoot, 'public', 'assets', 'asset-registry.json');
const CLIENT_ASSETS_DIR = path.resolve(projectRoot, 'public', 'assets', 'client');
const DEMO_ASSETS_DIR = path.resolve(projectRoot, 'public', 'assets', 'demo');
const CLIENT_UPLOADS_DIR = path.resolve(projectRoot, 'client-uploads');
const HERO_FRAMES_DIR = path.resolve(projectRoot, 'public', 'real-estate-hero-frames');

// Locate FFmpeg
let FFMPEG_PATH = 'ffmpeg';
const potentialPaths = [
  'C:\\Users\\KRISHNENDU\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe',
  'ffmpeg'
];
for (const p of potentialPaths) {
  if (fs.existsSync(p)) {
    FFMPEG_PATH = `"${p}"`;
    break;
  }
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Registry not found at ${REGISTRY_PATH}`);
  }
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
}

function saveRegistry(registry) {
  registry.updatedAt = new Date().toISOString();
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
}

function updateTsConfigFile(registry) {
  const tsPath = path.resolve(projectRoot, 'src', 'config', 'assetSlots.ts');
  if (!fs.existsSync(tsPath)) return;

  let content = fs.readFileSync(tsPath, 'utf-8');
  for (const [slotId, slot] of Object.entries(registry.slots)) {
    const overrideVal = slot.clientOverridePath ? `'${slot.clientOverridePath}'` : 'null';
    const activeVal = `'${slot.activePath}'`;

    // Replace clientOverridePath and activePath for this slot in the TS config
    const slotRegex = new RegExp(`(${slotId}:\\s*{[\\s\\S]*?clientOverridePath:\\s*)([^,\\n]+)(,[\\s\\S]*?activePath:\\s*)([^,\\n]+)`, 'm');
    content = content.replace(slotRegex, `$1${overrideVal}$3${activeVal}`);
  }
  fs.writeFileSync(tsPath, content, 'utf-8');
}

function getFileProbe(filePath) {
  try {
    const out = execSync(`${FFMPEG_PATH} -i "${filePath}" 2>&1`, { encoding: 'utf-8' });
    const resMatch = out.match(/Stream #\d+:\d+.*?: Video:.*? (\d{3,5})x(\d{3,5})/);
    const durationMatch = out.match(/Duration: (\d{2}:\d{2}:\d{2}\.\d{2})/);
    return {
      resolution: resMatch ? `${resMatch[1]}x${resMatch[2]}` : 'Unknown',
      duration: durationMatch ? durationMatch[1] : null,
      raw: out
    };
  } catch (err) {
    const out = err.stdout || err.stderr || '';
    const resMatch = out.match(/Stream #\d+:\d+.*?: Video:.*? (\d{3,5})x(\d{3,5})/);
    const durationMatch = out.match(/Duration: (\d{2}:\d{2}:\d{2}\.\d{2})/);
    return {
      resolution: resMatch ? `${resMatch[1]}x${resMatch[2]}` : 'Unknown',
      duration: durationMatch ? durationMatch[1] : null,
      raw: out
    };
  }
}

// -------------------------------------------------------------
// COMMAND: STATUS
// -------------------------------------------------------------
function cmdStatus() {
  const registry = loadRegistry();
  console.log('\n========================================================================================');
  console.log('              BILEKSA PRIVATE RESIDENCES — ASSET SLOT REGISTRY STATUS                   ');
  console.log('========================================================================================\n');
  console.log(
    'SLOT KEY'.padEnd(34) +
    'TYPE'.padEnd(10) +
    'SOURCE'.padEnd(10) +
    'RESOLUTION'.padEnd(14) +
    'SIZE'.padEnd(10) +
    'STATUS'
  );
  console.log('-'.repeat(88));

  let totalSlots = 0;
  let clientOverrides = 0;

  for (const [key, slot] of Object.entries(registry.slots)) {
    totalSlots++;
    const isClient = !!slot.clientOverridePath;
    if (isClient) clientOverrides++;

    const relativePath = slot.activePath.startsWith('/') ? slot.activePath.slice(1) : slot.activePath;
    const diskPath = path.resolve(projectRoot, 'public', relativePath);
    const exists = fs.existsSync(diskPath);

    let sizeStr = 'N/A';
    if (exists) {
      const stats = fs.statSync(diskPath);
      sizeStr = `${Math.round(stats.size / 1024)} KB`;
    }

    const typeStr = slot.category.toUpperCase().slice(0, 8);
    const sourceStr = isClient ? 'CLIENT' : 'DEMO';
    const statusStr = exists ? 'READY' : 'MISSING';

    console.log(
      key.padEnd(34) +
      typeStr.padEnd(10) +
      sourceStr.padEnd(10) +
      (slot.dimensions || 'Dynamic').padEnd(14) +
      sizeStr.padEnd(10) +
      (exists ? '✅ ' + statusStr : '❌ ' + statusStr)
    );
  }

  console.log('-'.repeat(88));
  console.log(`Total Configured Slots: ${totalSlots} | Client Assets Active: ${clientOverrides} | AI Demo Assets: ${totalSlots - clientOverrides}\n`);
}

// -------------------------------------------------------------
// COMMAND: INSPECT
// -------------------------------------------------------------
function cmdInspect(folderPath) {
  const targetDir = folderPath ? path.resolve(projectRoot, folderPath) : CLIENT_UPLOADS_DIR;
  if (!fs.existsSync(targetDir)) {
    console.error(`Directory not found: ${targetDir}`);
    process.exit(1);
  }

  console.log(`\nInspecting uploaded media assets in: ${targetDir}\n`);
  const files = fs.readdirSync(targetDir).filter((f) => !f.startsWith('.'));

  if (files.length === 0) {
    console.log(`No uploaded files found in ${targetDir}. Drop client images/videos into this folder.`);
    return;
  }

  const registry = loadRegistry();
  const slotKeys = Object.keys(registry.slots);

  console.log(
    'FILENAME'.padEnd(32) +
    'TYPE'.padEnd(10) +
    'RESOLUTION'.padEnd(14) +
    'RECOMMENDED SLOT MAPPING'
  );
  console.log('-'.repeat(90));

  for (const f of files) {
    const fullPath = path.join(targetDir, f);
    const ext = path.extname(f).toLowerCase();
    const probe = getFileProbe(fullPath);
    const isVideo = ['.mp4', '.mov', '.webm', '.mkv'].includes(ext);

    // Heuristic slot matching
    let recommended = 'Ambiguous (Manual Selection Required)';
    const lower = f.toLowerCase();

    if (isVideo || lower.includes('hero') || lower.includes('drone') || lower.includes('flythrough')) {
      recommended = 'HERO_CINEMATIC (Video Walkthrough)';
    } else if (lower.includes('entrance') || lower.includes('facade') || lower.includes('gate') || lower.includes('door')) {
      recommended = 'PROPERTY_ARCHITECTURAL_ENTRANCE';
    } else if (lower.includes('exterior') || lower.includes('approach') || lower.includes('villa') || lower.includes('front')) {
      recommended = 'PROPERTY_EXTERIOR_PRIMARY';
    } else if (lower.includes('living') || lower.includes('salon') || lower.includes('lounge')) {
      recommended = 'PROPERTY_INTERIOR_SALON';
    } else if (lower.includes('kitchen') || lower.includes('chef') || lower.includes('culinary')) {
      recommended = 'PROPERTY_INTERIOR_KITCHEN';
    } else if (lower.includes('bedroom') || lower.includes('master') || lower.includes('suite')) {
      recommended = 'PROPERTY_INTERIOR_MASTER_BEDROOM';
    } else if (lower.includes('pool') || lower.includes('water') || lower.includes('infinity')) {
      recommended = 'PROPERTY_EXTERIOR_POOL';
    } else if (lower.includes('bath') || lower.includes('spa') || lower.includes('tub')) {
      recommended = 'PROPERTY_INTERIOR_BATHROOM';
    } else if (lower.includes('terrace') || lower.includes('dining') || lower.includes('deck')) {
      recommended = 'PROPERTY_DINING_TERRACE';
    } else if (lower.includes('atrium') || lower.includes('garden') || lower.includes('courtyard')) {
      recommended = 'PROPERTY_GALLERY_ATRIUM';
    } else if (lower.includes('wine') || lower.includes('cellar') || lower.includes('vault')) {
      recommended = 'PROPERTY_GALLERY_WINE_VAULT';
    } else if (lower.includes('material') || lower.includes('stone') || lower.includes('travertine')) {
      recommended = 'PROPERTY_GALLERY_MATERIALITY';
    }

    console.log(
      f.padEnd(32) +
      (isVideo ? 'VIDEO' : 'IMAGE').padEnd(10) +
      probe.resolution.padEnd(14) +
      recommended
    );
  }

  console.log('\nTo map any file to a slot, run:');
  console.log('  node scripts/manage-client-assets.mjs map <SLOT_KEY> "<file-path>"\n');
}

// -------------------------------------------------------------
// COMMAND: MAP
// -------------------------------------------------------------
function cmdMap(slotKey, sourceFile) {
  if (!slotKey || !sourceFile) {
    console.error('Usage: node scripts/manage-client-assets.mjs map <SLOT_KEY> <file-path>');
    process.exit(1);
  }

  const registry = loadRegistry();
  const slot = registry.slots[slotKey];
  if (!slot) {
    console.error(`Invalid slot key: "${slotKey}". Valid keys:\n${Object.keys(registry.slots).join(', ')}`);
    process.exit(1);
  }

  const sourceAbs = path.isAbsolute(sourceFile) ? sourceFile : path.resolve(projectRoot, sourceFile);
  if (!fs.existsSync(sourceAbs)) {
    console.error(`Source file not found: ${sourceAbs}`);
    process.exit(1);
  }

  if (!fs.existsSync(CLIENT_ASSETS_DIR)) {
    fs.mkdirSync(CLIENT_ASSETS_DIR, { recursive: true });
  }

  const targetFilename = `${slotKey.toLowerCase().replace(/_/g, '-')}.webp`;
  const targetAbs = path.join(CLIENT_ASSETS_DIR, targetFilename);
  const clientRelative = `/assets/client/${targetFilename}`;

  console.log(`Processing client asset for slot [${slotKey}]...`);
  console.log(`Source: ${sourceAbs}`);
  console.log(`Target: ${targetAbs}`);

  // Convert/Scale to high efficiency WebP
  execSync(
    `${FFMPEG_PATH} -y -i "${sourceAbs}" -vf "scale=1920:-1" -c:v libwebp -quality 88 "${targetAbs}"`,
    { stdio: 'inherit' }
  );

  const probe = getFileProbe(targetAbs);
  slot.clientOverridePath = clientRelative;
  slot.activePath = clientRelative;
  slot.dimensions = probe.resolution;

  saveRegistry(registry);
  updateTsConfigFile(registry);

  console.log(`\n✅ Slot [${slotKey}] successfully mapped to client asset (${clientRelative})!`);
  console.log(`Resolution: ${probe.resolution}. Original file preserved.`);
}

// -------------------------------------------------------------
// COMMAND: UPDATE-HERO-VIDEO
// -------------------------------------------------------------
function cmdUpdateHeroVideo(videoPath) {
  if (!videoPath) {
    console.error('Usage: node scripts/manage-client-assets.mjs update-hero-video <video-path>');
    process.exit(1);
  }

  const videoAbs = path.isAbsolute(videoPath) ? videoPath : path.resolve(projectRoot, videoPath);
  if (!fs.existsSync(videoAbs)) {
    console.error(`Video file not found: ${videoAbs}`);
    process.exit(1);
  }

  console.log(`\nInspecting and processing client hero video: ${videoAbs}`);
  const probe = getFileProbe(videoAbs);
  console.log(`Detected Video Duration: ${probe.duration || 'Unknown'}, Resolution: ${probe.resolution}`);

  // 1. Copy video to public/hero.mp4 (and client backup)
  const clientVideoPath = path.join(CLIENT_ASSETS_DIR, 'hero.mp4');
  const publicVideoPath = path.join(projectRoot, 'public', 'hero.mp4');

  if (!fs.existsSync(CLIENT_ASSETS_DIR)) fs.mkdirSync(CLIENT_ASSETS_DIR, { recursive: true });
  fs.copyFileSync(videoAbs, clientVideoPath);
  fs.copyFileSync(videoAbs, publicVideoPath);
  console.log(`✅ Hero video mounted to /hero.mp4`);

  // 2. Extract 240 WebP frames into public/real-estate-hero-frames/
  console.log(`Extracting exactly 240 WebP cinematic scroll frames...`);
  const framePattern = path.join(HERO_FRAMES_DIR, 'frame-%05d.webp');
  execSync(
    `${FFMPEG_PATH} -y -i "${videoAbs}" -vf "scale=1280:720,fps=24" -vframes 240 -c:v libwebp -quality 85 "${framePattern}"`,
    { stdio: 'inherit' }
  );

  // 3. Extract final frame 240 to client persistent background
  const finalFrame240 = path.join(HERO_FRAMES_DIR, 'frame-00240.webp');
  const clientFinalFrame = path.join(CLIENT_ASSETS_DIR, 'hero-final-frame.webp');
  if (fs.existsSync(finalFrame240)) {
    fs.copyFileSync(finalFrame240, clientFinalFrame);
    console.log(`✅ Extracted signature Final Frame 240 to ${clientFinalFrame}`);
  }

  // 4. Update Registry
  const registry = loadRegistry();
  registry.slots.HERO_CINEMATIC.clientOverridePath = '/hero.mp4';
  registry.slots.HERO_CINEMATIC.activePath = '/hero.mp4';
  registry.slots.HERO_FINAL_FRAME.clientOverridePath = '/assets/client/hero-final-frame.webp';
  registry.slots.HERO_FINAL_FRAME.activePath = '/assets/client/hero-final-frame.webp';

  saveRegistry(registry);
  updateTsConfigFile(registry);

  console.log(`\n🎉 HERO SCROLL SEQUENCE & PERSISTENT BACKGROUND FULLY SYNCHRONIZED TO CLIENT VIDEO!`);
}

// -------------------------------------------------------------
// COMMAND: REVERT
// -------------------------------------------------------------
function cmdRevert(targetSlot) {
  const registry = loadRegistry();
  const backupHeroDir = path.resolve(projectRoot, 'public', 'assets', 'demo', 'backup-hero');

  const restoreHeroBackup = () => {
    const backupVideo = path.join(backupHeroDir, 'hero.mp4');
    const backupFrames = path.join(backupHeroDir, 'real-estate-hero-frames');
    if (fs.existsSync(backupVideo)) {
      fs.copyFileSync(backupVideo, path.join(projectRoot, 'public', 'hero.mp4'));
      console.log('✅ Restored original hero.mp4 from backup.');
    }
    if (fs.existsSync(backupFrames)) {
      const targetFrames = path.join(projectRoot, 'public', 'real-estate-hero-frames');
      for (const file of fs.readdirSync(backupFrames)) {
        fs.copyFileSync(path.join(backupFrames, file), path.join(targetFrames, file));
      }
      console.log('✅ Restored all 240 original WebP hero frames from backup.');
    }
  };

  if (targetSlot === 'all') {
    for (const [key, slot] of Object.entries(registry.slots)) {
      slot.clientOverridePath = null;
      slot.activePath = slot.demoPath;
    }
    restoreHeroBackup();
    console.log('✅ Reverted all asset slots back to AI Demo Assets.');
  } else if (registry.slots[targetSlot]) {
    registry.slots[targetSlot].clientOverridePath = null;
    registry.slots[targetSlot].activePath = registry.slots[targetSlot].demoPath;
    if (targetSlot === 'HERO_CINEMATIC' || targetSlot === 'HERO_FINAL_FRAME') {
      restoreHeroBackup();
    }
    console.log(`✅ Reverted slot [${targetSlot}] back to AI Demo Asset.`);
  } else {
    console.error(`Slot "${targetSlot}" not found.`);
    process.exit(1);
  }

  saveRegistry(registry);
  updateTsConfigFile(registry);
}

// -------------------------------------------------------------
// COMMAND: VERIFY
// -------------------------------------------------------------
function cmdVerify() {
  const registry = loadRegistry();
  console.log('\nRunning asset integrity preflight check...\n');
  let failures = 0;

  for (const [key, slot] of Object.entries(registry.slots)) {
    const rel = slot.activePath.startsWith('/') ? slot.activePath.slice(1) : slot.activePath;
    const abs = path.resolve(projectRoot, 'public', rel);
    if (!fs.existsSync(abs)) {
      console.error(`❌ [${key}] Missing file at: ${abs}`);
      failures++;
    } else {
      const stats = fs.statSync(abs);
      if (stats.size === 0) {
        console.error(`❌ [${key}] Zero byte empty file at: ${abs}`);
        failures++;
      } else {
        console.log(`✅ [${key}] Valid (${Math.round(stats.size / 1024)} KB) -> ${slot.activePath}`);
      }
    }
  }

  if (failures > 0) {
    console.error(`\nAsset preflight check FAILED with ${failures} error(s).`);
    process.exit(1);
  } else {
    const totalSlots = Object.keys(registry.slots).length;
    console.log(`\n✅ All ${totalSlots} asset slots verified. 100% asset availability on disk.\n`);
  }
}

// -------------------------------------------------------------
// MAIN ROUTER
// -------------------------------------------------------------
const args = process.argv.slice(2);
const command = args[0] || 'status';

switch (command) {
  case 'status':
    cmdStatus();
    break;
  case 'inspect':
    cmdInspect(args[1]);
    break;
  case 'map':
    cmdMap(args[1], args[2]);
    break;
  case 'update-hero-video':
    cmdUpdateHeroVideo(args[1]);
    break;
  case 'revert':
    cmdRevert(args[1] || 'all');
    break;
  case 'verify':
    cmdVerify();
    break;
  default:
    console.log(`Unknown command: ${command}`);
    console.log('Available commands: status, inspect, map, update-hero-video, revert, verify');
    process.exit(1);
}

