# PHASE 9A — FINAL PROJECT STRUCTURE

**Project:** BILEKSA Private Residences  
**Working Directory:** `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main`  
**Date:** October 31, 2026  
**Scope:** Final cleaned architectural directory map for the BILEKSA luxury real-estate platform.

---

## 1. High-Level Project Directory Map

```
VILLEXA-MAIN-main/
├── dist/                              # Optimized production build (~16.84 MB)
├── node_modules/                      # Installed npm dependencies
├── public/                            # Runtime static assets (~16.39 MB)
│   ├── favicon.svg                    # BILEKSA brand monogram
│   ├── apple-touch-icon.png           # iOS web clip icon
│   ├── hero.mp4                       # High-definition video showcase (6.01 MB)
│   └── real-estate-hero-frames/       # Active 240-frame real-estate hero (10.66 MB)
│       ├── frame-00001.webp ... frame-00240.webp
│       └── manifest.json
├── screenshots/                       # Verified visual audit screenshots
│   └── redesign-homepage/             # 12 high-res captures across viewports
├── scripts/                           # Automation & validation scripts
│   └── validate-config.mjs            # Preflight configuration validator
├── src/                               # Application source code
│   ├── __tests__/                     # Vitest test suites (9 suites, 107 tests)
│   │   ├── catalogueExperience.test.ts
│   │   ├── catalogueVideoShowcase.test.ts
│   │   ├── cinematicHeroScroll.test.ts
│   │   ├── clientConfig.test.ts
│   │   ├── experienceAuditAndPages.test.ts
│   │   ├── homepageExperience.test.ts
│   │   ├── propertyDetailExperience.test.ts
│   │   ├── propertyService.test.ts
│   │   └── services.test.ts
│   ├── components/
│   │   ├── common/
│   │   │   ├── EmptyState.tsx         # Real-estate missing slug / 404 state
│   │   │   └── SectionHeader.tsx      # Editorial section headline component
│   │   ├── home/
│   │   │   ├── ArchitecturalVisionSection.tsx
│   │   │   ├── BrandIntroduction.tsx
│   │   │   ├── CinematicHeroScroll.tsx
│   │   │   ├── CinematicVideoSection.tsx
│   │   │   ├── LifestyleSection.tsx
│   │   │   ├── PrivateViewingCTA.tsx
│   │   │   ├── SignatureResidencesSection.tsx
│   │   │   └── TypologyShowcase.tsx
│   │   ├── layout/
│   │   │   ├── CinematicShowroomBackground.tsx  # 240-frame canvas engine
│   │   │   ├── Footer.tsx             # Luxury real-estate footer & concierge links
│   │   │   ├── Header.tsx             # Editorial sticky navigation header
│   │   │   └── MobileNavDrawer.tsx    # Responsive mobile drawer
│   │   └── property/
│   │       ├── PropertyAdjacentNav.tsx
│   │       ├── PropertyAmenities.tsx
│   │       ├── PropertyCard.tsx       # Standard landscape property card
│   │       ├── PropertyEnquirySection.tsx
│   │       ├── PropertyFloorPlans.tsx # Interactive multi-tier architectural plans
│   │       ├── PropertyGallery.tsx    # High-res gallery with lightbox
│   │       ├── PropertyHero.tsx       # Immersive property headline & hero
│   │       ├── PropertyLocation.tsx   # Micro-location context
│   │       ├── PropertyNarrative.tsx  # Editorial architectural story
│   │       ├── PropertySpecs.tsx      # Interior/exterior square footage, beds, baths
│   │       └── PropertyVideoTour.tsx  # Cinema video tour player
│   ├── config/
│   │   ├── clientConfig.ts            # Client customization provider
│   │   └── sampleProperties.ts        # Luxury property fallback datasets
│   ├── context/
│   │   ├── CinematicHeroContext.tsx   # Canvas frame scroll synchronizer
│   │   └── ClientConfigContext.tsx    # Multi-client theme & branding context
│   ├── pages/
│   │   ├── CataloguePage.tsx          # Real-estate catalogue with typology filters
│   │   ├── CollectionsPage.tsx        # Curated portfolios
│   │   ├── ContactPage.tsx            # Private viewing concierge & inquiry form
│   │   ├── CraftsmanshipPage.tsx      # Architectural materiality page
│   │   ├── HomePage.tsx               # Primary editorial showcase
│   │   ├── InspirationPage.tsx        # Visual journal
│   │   └── ProductDetailPage.tsx      # Pure real-estate residence detail page
│   ├── services/
│   │   ├── collectionService.ts       # Curated collection filters
│   │   ├── enquiryService.ts          # WhatsApp liaison and consultation booking
│   │   ├── propertyService.ts         # Real-estate data service (6 residences)
│   │   ├── siteConfigService.ts       # Brand, typography, contact configuration
│   │   └── viewer/
│   │       └── threeViewerEngine.ts   # Three.js 3D spatial WebGL viewer
│   ├── styles/
│   │   ├── main.css                   # Global styles & layout rules
│   │   └── tokens.css                 # Ivory, charcoal, sand & gold CSS variables
│   ├── types/
│   │   ├── collection.ts
│   │   ├── content.ts
│   │   ├── enquiry.ts
│   │   └── property.ts                # Real-estate TypeScript definitions
│   ├── utils/
│   │   └── propertyValidation.ts      # Schema validator for properties
│   ├── App.tsx                        # Root application component with routes
│   ├── main.tsx                       # React DOM entry point
│   └── vite-env.d.ts
├── _archive_backend/                  # Future Phase 9 Mode B digital platform API
├── _backup_baseline/                  # Untouched baseline repository snapshot
├── _backup_furniture_frames/          # Archival preservation of 384 furniture frames
├── index.html                         # HTML5 shell with Google Fonts & SEO
├── package.json                       # 5 runtime deps, 7 dev deps (ultra-lean)
├── tsconfig.json                      # Strict TypeScript compiler options
└── vite.config.ts                     # Optimized chunk splitting configuration
```

---

## 2. Structural Purity Highlights

1. **Zero Furniture Footprint:** All legacy furniture components (`CatalogueProductCard`), catalogue datasets (`inauguralCatalogue.ts`), and services (`productService.ts`) have been completely purged from `src/`.
2. **Lean Assets:** Runtime `public/` directory contains only the active 240-frame real-estate hero sequence, active `hero.mp4` video showcase, and brand assets.
3. **Decoupled Architecture:** `ProductDetailPage.tsx` now purely loads luxury residences without fallback furniture dependencies.
4. **Preserved Engines:** The 240-frame canvas scroll engine (`CinematicShowroomBackground.tsx`) and the Three.js WebGL viewer (`threeViewerEngine.ts`) remain intact and fully operational.

