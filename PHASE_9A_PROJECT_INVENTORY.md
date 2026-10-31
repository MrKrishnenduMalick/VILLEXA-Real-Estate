# PHASE 9A — BILEKSA PROJECT INVENTORY

**Project:** BILEKSA Private Residences  
**Working Directory:** `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main`  
**Date:** October 31, 2026  
**Scope:** Complete structural inventory of active real-estate files, media assets, removed legacy furniture files, and preserved core engines.

---

## 1. Executive Summary

During Phase 9A, the project underwent a thorough inventory and systematic cleanup to transition from a legacy furniture platform codebase (VILLEXA) to a dedicated luxury real-estate website architecture (BILEKSA). Over **230 MB** of unneeded temporary Chrome profiles, obsolete screenshots, duplicate video/image files, and legacy furniture components were safely audited and removed without breaking any active real-estate functionality.

---

## 2. Inventory by Category

### Category A — Active Real-Estate Application Files
*All source code powering the luxury real-estate experience.*
- **Entry Points:** `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- **Pages:**
  - `src/pages/HomePage.tsx`: Editorial showcase with 240-frame real-estate hero, featured residences, private concierge CTA.
  - `src/pages/CataloguePage.tsx`: Real-estate catalogue with typology filtering (Villa, Penthouse, Estate, Waterfront, Alpine), search, sort, and specifications.
  - `src/pages/ProductDetailPage.tsx`: Pure real-estate residence view (editorial specifications, architectural narrative, high-res gallery, video tour, interactive floor plans, bespoke amenities, location map, adjacent navigation).
  - `src/pages/VisionPage.tsx`: Architectural philosophy and spatial ethos.
  - `src/pages/CollectionsPage.tsx`: Curated portfolios (Private Estates, Coastal Sanctuary, Alpine Retreats, Sky Palaces).
  - `src/pages/LifestylePage.tsx`: Curated luxury living and private concierge services.
  - `src/pages/ContactPage.tsx`: Private advisory, appointment scheduling, and direct WhatsApp liaison.
- **Core Real-Estate Components:**
  - `src/components/common/Header.tsx`, `Footer.tsx`, `EmptyState.tsx`, `Toast.tsx`
  - `src/components/common/CinematicShowroomBackground.tsx`: 240-frame canvas scroll engine.
  - `src/components/common/ResidenceCard.tsx`: Landscape ratio property cards with specifications.
  - Property Detail modules: `PropertyGallery.tsx`, `PropertyVideoTour.tsx`, `PropertyFloorPlans.tsx`, `PropertyAmenities.tsx`, `PropertyLocation.tsx`, `PropertyAdjacentNav.tsx`.
- **Services & Configuration:**
  - `src/services/propertyService.ts`: Real-estate property data service (6 prime residences).
  - `src/services/siteConfigService.ts`: Client branding, WhatsApp concierge configuration, metadata.
  - `src/services/viewer/threeViewerEngine.ts`: Real-time Three.js WebGL engine.
  - `src/config/siteConfig.json`, `clientBranding.json`, `preflightConfig.ts`.

### Category B — Active Real-Estate Media Assets
*Essential media assets powering the BILEKSA luxury real-estate platform.*
- **Cinematic Hero Frames:** `public/real-estate-hero-frames/` (240 WebP frames, `frame-00001.webp` to `frame-00240.webp` + `manifest.json`, total 10.66 MB).
- **Cinema Hero Video:** `public/hero.mp4` (6.01 MB).
- **Favicons & Logos:** `public/favicon.svg`, `public/apple-touch-icon.png`.
- **Active Screenshots:** `screenshots/redesign-homepage/` (12 high-resolution responsive captures across desktop, laptop, tablet, and mobile).

### Category C — Removed Legacy Furniture Components & Content
- `src/components/common/CatalogueProductCard.tsx` (375 lines): Legacy furniture catalogue card with upholstery swatches, material selectors, and chair dimensions. (REMOVED)
- `src/config/inauguralCatalogue.ts`: Static catalogue of armchairs, sofas, coffee tables, and dining tables. (REMOVED)
- `src/services/productService.ts`: Furniture catalog retrieval service. (REMOVED)
- `src/types/product.ts`: Furniture product interfaces (`MaterialOption`, `FinishOption`, `Dimensions`). (REMOVED)
- `ProductDetailPage.tsx` legacy fallbacks: Upholstery selectors, quantity counters, joinery guarantee badges. (REMOVED)

### Category D — Removed Temporary Artifacts & Duplicates
- `.chrome-audit-1440-900/` (93.01 MB): Chrome automation user data cache. (REMOVED)
- `.chrome-temp-cdp/` (16.83 MB): Temporary Chrome DevTools Protocol profile. (REMOVED)
- `hero.mp4` (6.01 MB): Duplicate video file at project root (identical to `public/hero.mp4`). (REMOVED)
- `hero-frames/` (38.21 MB): 384 furniture sofa frames at project root. (REMOVED)
- `public/hero-frames/` (38.39 MB): 384 furniture sofa frames in public directory. (REMOVED)
- Obsolete root screenshots in `screenshots/` (38 MB, 60 files). (REMOVED)
- Temporary scripts in `scripts/`: `debug-offsets.mjs`, `inspect-tabs.mjs`, `test-chrome-screenshot.mjs`, `capture-missing-properties.mjs`. (REMOVED)

### Category E — Preserved Backups & External References
- `_backup_furniture_frames/`: Complete offline archival preservation of original 384 furniture frames (untouched outside runtime paths).
- `_backup_baseline/`: Baseline repository backup created before transformation (untouched).
- `_archive_backend/`: Future Phase 9 Mode B digital platform API scaffolding (untouched).
- Parent directory: `d:\VILLEXA - Real Estate\` (Original production files remain completely untouched).

---

## 3. Inventory Totals & Metrics

| Metric | Before Cleanup | After Cleanup | Net Difference |
| :--- | :--- | :--- | :--- |
| **Total Project Size** | ~495 MB | ~262 MB | **-233 MB (-47%)** |
| **Public Directory Size** | 57.44 MB | 16.39 MB | **-41.05 MB (-71%)** |
| **Dist Production Output** | 55.86 MB | 16.84 MB | **-39.02 MB (-70%)** |
| **Passing Test Suites** | 9 files / 113 tests | 9 files / 107 tests | **100% real-estate clean** |
| **TypeScript Type Errors** | 0 | 0 | **0 errors (strict)** |

