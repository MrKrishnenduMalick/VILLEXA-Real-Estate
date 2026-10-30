/**
 * VILLEXA / DIGITAL SHOWROOM — PREFLIGHT CLIENT CONFIGURATION VALIDATOR
 * 
 * Verifies that client branding, contact credentials, theme colors, and
 * backend environment settings are valid and safe before building or deploying.
 * 
 * Run with: node scripts/validate-config.mjs [--mode production]
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const isProduction = process.argv.includes('--production') || process.env.NODE_ENV === 'production';

console.log('\n======================================================');
console.log('  DIGITAL SHOWROOM — PREFLIGHT CONFIGURATION CHECK    ');
console.log(`  Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} `);
console.log('======================================================\n');

// Read active environment variables from .env files if present
function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const content = readFileSync(filePath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const rootDir = process.cwd();
const envLocal = parseEnvFile(resolve(rootDir, '.env.local'));
const envDefault = parseEnvFile(resolve(rootDir, '.env'));

const activeEnv = {
  ...envDefault,
  ...envLocal,
  ...process.env
};

const errors = [];
const warnings = [];
const notes = [];

// 1. BRAND IDENTITY CHECKS
const brandName = activeEnv.VITE_CLIENT_BRAND_NAME || 'BILEKSA';
if (!brandName || brandName.trim().length < 2) {
  errors.push('VITE_CLIENT_BRAND_NAME must be at least 2 characters.');
} else {
  notes.push(`Brand Name: "${brandName}"`);
}

// 2. CONTACT DETAILS CHECKS
const contactEmail = activeEnv.VITE_CLIENT_CONTACT_EMAIL || 'concierge@bileksa.com';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(contactEmail)) {
  errors.push(`VITE_CLIENT_CONTACT_EMAIL "${contactEmail}" is not a valid email address.`);
} else {
  notes.push(`Contact Email: "${contactEmail}"`);
}

const whatsappNumber = activeEnv.VITE_CLIENT_WHATSAPP_NUMBER || '918004821980';
const digitsOnly = whatsappNumber.replace(/\D/g, '');
if (digitsOnly.length < 7) {
  errors.push(`VITE_CLIENT_WHATSAPP_NUMBER "${whatsappNumber}" must contain at least 7 digits.`);
} else {
  notes.push(`WhatsApp Concierge Number: "${whatsappNumber}" (${digitsOnly.length} digits)`);
}

// 3. THEME ACCENT TOKENS
const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const accentColor = activeEnv.VITE_CLIENT_THEME_ACCENT || '#c5a059';
if (!hexColorRegex.test(accentColor)) {
  errors.push(`VITE_CLIENT_THEME_ACCENT "${accentColor}" is not a valid hex color code.`);
}

// 4. FRONTEND-ONLY ARCHITECTURE (No Supabase required for static demo)
notes.push('Architecture: Static Luxury Real Estate Demonstration Mode (Frontend-only, no backend required)');

// 5. FEATURE FLAGS INTEGRITY
const featureKeys = [
  'VITE_FEATURE_3D_VIEWER',
  'VITE_FEATURE_360_TURNTABLE',
  'VITE_FEATURE_SHOWROOM_VIDEO',
  'VITE_FEATURE_BESPOKE_INQUIRY',
  'VITE_FEATURE_PRICE_DISPLAY',
  'VITE_FEATURE_COLLECTIONS',
  'VITE_FEATURE_INSPIRATION',
  'VITE_FEATURE_CRAFTSMANSHIP'
];

for (const fk of featureKeys) {
  const val = activeEnv[fk];
  if (val !== undefined && val !== 'true' && val !== 'false') {
    errors.push(`Feature flag ${fk} must be "true" or "false" (received: "${val}").`);
  }
}

// REPORT RESULTS
console.log('--- Configuration Summary ---');
for (const n of notes) {
  console.log(` [OK] ${n}`);
}

if (warnings.length > 0) {
  console.log('\n--- Warnings ---');
  for (const w of warnings) {
    console.log(` [!] ${w}`);
  }
}

if (errors.length > 0) {
  console.log('\n--- Configuration Errors ---');
  for (const e of errors) {
    console.log(` [X] ${e}`);
  }
  console.log('\n❌ Preflight validation FAILED. Resolve the issues above before proceeding.\n');
  process.exit(1);
} else {
  console.log('\n✅ Preflight configuration check PASSED.\n');
  process.exit(0);
}
