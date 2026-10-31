# PHASE 9A — PRESERVED ASSETS REPORT

**Project:** BILEKSA Private Residences  
**Working Directory:** `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main`  
**Date:** October 31, 2026  
**Scope:** Verification of all preserved core assets, 3D engines, real-estate hero sequences, property portfolios, and safety archives.

---

## 1. Preserved Real-Estate Media & Hero Assets

### 1.1 The 240-Frame Real-Estate Cinematic Hero Sequence
- **Location:** `public/real-estate-hero-frames/`
- **Total Files:** 241 files (240 WebP frames + 1 manifest)
- **Total Size:** 10.66 MB
- **Frame Range:** `frame-00001.webp` through `frame-00240.webp`
- **Metadata Manifest:** `public/real-estate-hero-frames/manifest.json`
- **Verification:**
  - Used directly by `src/components/common/CinematicShowroomBackground.tsx` for scroll-bound visual progression.
  - Verified that all frames load sequentially, with smooth canvas interpolation and zero missing frames.

### 1.2 Cinema Hero Video
- **Location:** `public/hero.mp4`
- **Size:** 6.01 MB
- **Verification:** Preserved in `public/` and used as background video fallback and property preview modal.

### 1.3 Favicons & Public Assets
- `public/favicon.svg` (Bespoke BILEKSA monogram)
- `public/apple-touch-icon.png` (High-resolution icon)
- `public/vite.svg`

---

## 2. Preserved Application Architecture & Engines

### 2.1 Three.js WebGL Engine
- **Location:** `src/services/viewer/threeViewerEngine.ts`
- **Dependencies:** `three` and `three/examples/jsm/controls/OrbitControls.js`
- **Status:** Fully functional and preserved for interactive 3D spatial models and virtual architectural tours.
- **Verification:** Build produces optimized chunk `dist/assets/three-*.js` without conflicts.

### 2.2 BILEKSA Property Service & Residences Portfolio
- **Location:** `src/services/propertyService.ts` (and `src/types/property.ts`)
- **Preserved Properties (6 Prime Residences):**
  1. **The Aurelia Estate** (`the-aurelia-estate`) — Cap d'Antibes, France (€28,500,000)
  2. **The Celestia Penthouse** (`the-celestia-penthouse`) — Monaco (€42,000,000)
  3. **The Ocean Crest** (`the-ocean-crest`) — Palm Jumeirah, Dubai ($34,000,000)
  4. **The Highland Manor** (`the-highland-manor`) — St. Moritz, Switzerland (CHF 31,000,000)
  5. **The Solstice Residences** (`the-solstice-residences`) — Aspen, Colorado ($26,500,000)
  6. **The Elysian Gardens** (`the-elysian-gardens`) — Lake Como, Italy (€22,000,000)

### 2.3 Property Detail Submodules
- `src/components/property/PropertyGallery.tsx`: High-res architectural photography with fullscreen lightbox.
- `src/components/property/PropertyVideoTour.tsx`: Cinema-style embedded video tour.
- `src/components/property/PropertyFloorPlans.tsx`: Multi-level architectural layouts with metric/imperial toggle.
- `src/components/property/PropertyAmenities.tsx`: Bespoke residence amenities with curated categorization.
- `src/components/property/PropertyLocation.tsx`: Micro-location narrative and neighborhood context.
- `src/components/property/PropertyAdjacentNav.tsx`: Fluid navigation between adjacent residences.

---

## 3. Preserved Testing & Validation Infrastructure

### 3.1 Test Suites (9 Active Test Suites, 107 Tests Passing)
- `src/__tests__/propertyService.test.ts` (28 tests)
- `src/__tests__/propertyDetailExperience.test.ts` (22 tests)
- `src/__tests__/catalogueExperience.test.ts` (16 tests)
- `src/__tests__/homepageExperience.test.ts` (10 tests)
- `src/__tests__/experienceAuditAndPages.test.ts` (10 tests)
- `src/__tests__/clientConfig.test.ts` (9 tests)
- `src/__tests__/catalogueVideoShowcase.test.ts` (6 tests)
- `src/__tests__/cinematicHeroScroll.test.ts` (5 tests)
- `src/__tests__/services.test.ts` (1 test)

### 3.2 Automated Validation Scripts
- `scripts/validate-config.mjs`: Preflight configuration checker validating branding, email, WhatsApp phone formatting, and static mode architecture before every build.

---

## 4. Preserved Offline Backups & Archives

1. **`_backup_furniture_frames/`**
   - Contains the complete original 384 furniture sofa frames (`frame-00001.webp` through `frame-00384.webp`).
   - Located outside active web bundles.
2. **`_backup_baseline/`**
   - Complete baseline snapshot of the repository established before Phase 9/9A modifications.
3. **`_archive_backend/`**
   - Preserved API routes and controllers prepared for Phase 9 Mode B (Premium Digital Platform).
4. **Original VILLEXA Production Repository**
   - The root parent directory (`d:\VILLEXA - Real Estate\`) remains 100% untouched and unchanged.

