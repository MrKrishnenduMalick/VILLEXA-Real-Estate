# PHASE 9A — REMOVED FILES REPORT

**Project:** BILEKSA Private Residences  
**Working Directory:** `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main`  
**Date:** October 31, 2026  
**Scope:** Itemised log of every file, directory, and asset removed during Phase 9A cleanup.

---

## 1. Summary of Removed Assets

| Category | Count / Scope | Total Reclaimed Space |
| :--- | :--- | :--- |
| **Temporary Chrome User Profiles** | 2 directories | 109.84 MB |
| **Legacy Furniture Animation Sequences** | 768 WebP frames | 76.60 MB |
| **Obsolete Browser Screenshots** | 60 PNG images | 38.00 MB |
| **Root Media Duplicates** | 1 MP4 video | 6.01 MB |
| **Temporary Debug & Inspection Scripts** | 4 MJS files | ~15 KB |
| **Legacy Furniture Code & Data** | 4 TS/TSX files | ~38 KB |
| **Total Reclaimed Space** | — | **~230.45 MB** |

---

## 2. Itemised Record of Removed Items

### 2.1 Temporary Chrome User Profiles & Automation Caches
1. `.chrome-audit-1440-900/`
   - **Size:** 93.01 MB
   - **Reason:** Temporary user data profile created by Chrome during 1440x900 viewport visual audits.
   - **Safety Check:** Pure browser cache, cookies, and crashpad logs. Zero code dependencies.
2. `.chrome-temp-cdp/`
   - **Size:** 16.83 MB
   - **Reason:** Temporary browser automation directory for Chrome DevTools Protocol debugging.
   - **Safety Check:** Pure transient cache. Zero code dependencies.

### 2.2 Duplicate Media & Legacy Animation Sequences
3. `hero.mp4` (Root level)
   - **Size:** 6.01 MB
   - **Reason:** Redundant duplicate of `public/hero.mp4`.
   - **Safety Check:** Verified byte-for-byte identical to `public/hero.mp4`. Application and tests only reference `/hero.mp4` (served by Vite from `public/`).
4. `hero-frames/` (Root level)
   - **Size:** 38.21 MB (384 files)
   - **Reason:** Legacy 384-frame furniture sofa rotating animation from VILLEXA furniture store.
   - **Safety Check:** Fully preserved in offline archive `_backup_furniture_frames/`. Not referenced by active code.
5. `public/hero-frames/`
   - **Size:** 38.39 MB (384 files)
   - **Reason:** Runtime copy of the above legacy furniture sofa sequence. Inflated production builds by 38.39 MB.
   - **Safety Check:** The active 240-frame real-estate sequence is located in `public/real-estate-hero-frames/`. Deleting `public/hero-frames/` reduced `dist/` bundle size from 55.86 MB to 16.84 MB. Fully preserved in `_backup_furniture_frames/`.

### 2.3 Obsolete Screenshots
6. Root `screenshots/*.png` (60 files)
   - **Size:** ~38.00 MB
   - **Files:** `catalogue_*`, `collections_*`, `contact_*`, `homepage_*`, `lifestyle_*`, `residence-*`, `vision_*`, `test_live.png`.
   - **Reason:** Obsolete screenshots captured across previous iterative audit phases.
   - **Preservation Check:** Preserved the 12 active high-resolution screenshots in `screenshots/redesign-homepage/` representing the current responsive design.

### 2.4 Temporary Scripts
7. `scripts/debug-offsets.mjs`
   - **Size:** ~2.5 KB
   - **Reason:** Transient script used to test scroll offset heights in Chrome.
8. `scripts/inspect-tabs.mjs`
   - **Size:** ~1.8 KB
   - **Reason:** Transient script used to probe Chrome DevTools Protocol WebSocket targets.
9. `scripts/test-chrome-screenshot.mjs`
   - **Size:** ~3.2 KB
   - **Reason:** Standalone debugging script for headless Chrome screenshot flags.
10. `scripts/capture-missing-properties.mjs`
    - **Size:** ~4.1 KB
    - **Reason:** Single-use script to capture screenshots of dynamic property slugs.

### 2.5 Legacy Furniture Components & Models
11. `src/components/common/CatalogueProductCard.tsx`
    - **Size:** 14.5 KB (375 lines)
    - **Reason:** Furniture e-commerce card with upholstery swatches, material selection, and cart actions.
    - **Safety Check:** Replaced by `src/components/common/ResidenceCard.tsx`. Zero active references.
12. `src/config/inauguralCatalogue.ts`
    - **Size:** 14.2 KB
    - **Reason:** Static furniture catalogue data (sofas, armchairs, marble tables).
    - **Safety Check:** Replaced by `src/services/propertyService.ts` (6 real-estate residences). Zero active references.
13. `src/services/productService.ts`
    - **Size:** 4.8 KB
    - **Reason:** Furniture query service.
    - **Safety Check:** Replaced by real-estate `propertyService.ts`. Zero active references.
14. `src/types/product.ts`
    - **Size:** 3.2 KB
    - **Reason:** TypeScript types for furniture dimensions, upholstery grades, and joinery.
    - **Safety Check:** Real-estate types reside in `src/types/property.ts`. Zero active references.

---

## 3. Post-Removal Verification

Immediately following the removals:
1. Ran `npx tsc --noEmit` — **0 errors**.
2. Ran `npm test -- --run` — **107/107 tests passing**.
3. Ran `npm run build` — **Built cleanly in 3.60s**.

