# PHASE 2 — FILE CHANGELOG

This document records all files added, modified, or preserved during **Phase 2: Cinematic Hero Engine & Luxury Villa Sequence**.

---

## 1. Created Directories & Assets

| File / Path | Action | Description |
| :--- | :--- | :--- |
| `public/real-estate-hero-frames/` | Created | Directory containing all 240 extracted luxury villa WebP frames. |
| `public/real-estate-hero-frames/frame-00001.webp` to `frame-00240.webp` | Created | 240 continuous WebP frames extracted at 24 FPS (1280 × 720). Total size: 10.63 MB. |
| `public/real-estate-hero-frames/manifest.json` | Created | Frame manifest tracking frame indices, relative paths, byte lengths, and dimensions. |
| `_backup_furniture_frames/` | Created | Safe, isolated backup directory preserving the original 384 furniture frames. |
| `src/__tests__/cinematicHeroScroll.test.ts` | Created | Vitest suite validating 240-frame configuration, scroll mapping, reversibility, and LRU eviction. |

---

## 2. Modified Configuration & Component Files

| File Path | Action | Description of Modifications |
| :--- | :--- | :--- |
| `src/services/siteConfigService.ts` | Modified | Updated `defaultSiteConfig.hero` to point to `/real-estate-hero-frames/`, configured `frameCount: 240`, `width: 1280`, `height: 720`, updated title, subtitle, and CTA routes. |
| `src/components/layout/CinematicShowroomBackground.tsx` | Modified | Updated default fallback frame count to `240`, updated default frame path pattern to `/real-estate-hero-frames/frame-{index}.webp`, adjusted default aspect ratio dimensions to 1280 × 720. |
| `src/components/home/CinematicHeroScroll.tsx` | Modified | Updated hero subtitle to "Discover exceptional residences shaped by space, light and timeless design.", updated CTA buttons and clean icon styling. |
| `src/__tests__/services.test.ts` | Modified | Updated test assertions to validate 240-frame hero configuration and `/real-estate-hero-frames/` path. |
| `.gitignore` | Modified | Added `_backup_furniture_frames/` to prevent committing heavy duplicate frame backup to Git. |

---

## 3. Preserved Unmodified Assets & Code

| Path | Preservation Details |
| :--- | :--- |
| `hero.mp4` | Original 10-second Google Flow source video untouched at project root. |
| `hero-frames/` | 384 original furniture frames untouched. |
| `public/hero-frames/` | 384 original furniture frames untouched in public directory. |
| `src/components/viewers/` | Three.js GLB and 360 viewer components untouched. |
| `src/config/inauguralCatalogue.ts` | Static property catalogue dataset untouched. |

