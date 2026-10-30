# PHASE 1 — FILE CHANGELOG

This document tracks all files modified, archived, or created during **Phase 1: Foundation & BILEKSA Brand Transformation**.

---

## 1. Modified Files

| File Path | Action | Description of Modifications |
| :--- | :--- | :--- |
| `index.html` | Modified | Updated document title to `BILEKSA — Private Residences & Architectural Living`. Replaced default favicon with inline champagne gold vector SVG 'B' monogram. Added luxury meta description. |
| `package.json` | Modified | Renamed package to `bileksa-private-residences`. Removed `@supabase/supabase-js` dependency. |
| `package-lock.json` | Modified | Updated dependency tree after removing Supabase. |
| `.gitignore` | Modified | Added `_backup_baseline/` and `_archive_backend/` to ignore list. |
| `vite.config.ts` | Modified | Configured Vitest to exclude `_backup_baseline/**` and `_archive_backend/**`. |
| `scripts/validate-config.mjs` | Modified | Removed mandatory Supabase URL/key assertions. Updated default brand fallback to `BILEKSA` and contact to `concierge@bileksa.com`. |
| `src/App.tsx` | Modified | Removed `AuthProvider`, removed all 12 lazy-loaded `/admin/*` routes, removed `isAdminRoute` logic. Added dual-route mappings for `/residences`, `/vision`, `/lifestyle`, and `/residence/:slug`. |
| `src/config/clientConfig.ts` | Modified | Updated default master preset to `BILEKSA`, badge to `BILEKSA PRIVATE RESIDENCES`, tagline to `Private Residences & Architectural Living`, and contact email to `concierge@bileksa.com`. |
| `src/components/layout/Header.tsx` | Modified | Fixed hardcoded brand bug by binding to `config.brand.logoText` and `config.brand.logoSubtext`. Removed admin access button. Updated public nav items to Residences, Collections, Architectural Vision, Lifestyle, and Contact. |
| `src/components/layout/Footer.tsx` | Modified | Replaced furniture showroom text with luxury real estate concierge columns, residential typologies (Villas, Penthouses, Waterfront), and removed Admin Portal link. |
| `src/components/layout/MobileNavDrawer.tsx` | Modified | Removed Admin Gateway link and Shield icon. Updated nav links to real estate routes. |
| `src/components/home/CinematicHeroScroll.tsx` | Modified | Replaced furniture copy with "Where Architecture Becomes Home" and updated CTA destinations to `/residences` and `/vision`. |
| `src/pages/HomePage.tsx` | Modified | Updated hero banner, categories (Architectural Villas, Sky Penthouses, Waterfront Residences), Signature Residences, Architectural Vision & Craft, and Private Client Concierge. |
| `src/pages/ContactPage.tsx` | Modified | Updated copy for Private Residences Concierge, acquisitions, and private viewings. |
| `src/services/siteConfigService.ts` | Modified | Decoupled from Supabase; returns offline static fallback immediately with BILEKSA configuration. |
| `src/services/productService.ts` | Modified | Decoupled from Supabase; serves static inaugural catalogue items without network queries. |
| `src/services/collectionService.ts` | Modified | Decoupled from Supabase; returns static collections without network calls. |
| `src/services/enquiryService.ts` | Modified | Decoupled from Supabase; simulates immediate successful form dispatch and returns structured receipt. |
| `src/__tests__/clientConfig.test.ts` | Modified | Updated test assertions to validate BILEKSA default brand, tagline, and SEO parameters. |
| `src/__tests__/services.test.ts` | Modified | Decoupled from Supabase mocking; tests static `productService` and `siteConfigService`. |
| `src/__tests__/catalogueVideoShowcase.test.ts` | Modified | Inlined video media specifications; removed dependency on archived `storageService`. |

---

## 2. Archived Files (Moved from `src/` to `_archive_backend/`)

The following files were removed from the active frontend compilation and isolated in `_archive_backend/`:

| Original Path | Archived Destination | Reason for Archival |
| :--- | :--- | :--- |
| `src/pages/AdminGatewayPage.tsx` | `_archive_backend/pages/AdminGatewayPage.tsx` | Decommissioned admin authentication entry point. |
| `src/pages/admin/AdminCategories.tsx` | `_archive_backend/pages/admin/AdminCategories.tsx` | Admin category management dashboard. |
| `src/pages/admin/AdminCollections.tsx` | `_archive_backend/pages/admin/AdminCollections.tsx` | Admin collection management dashboard. |
| `src/pages/admin/AdminEnquiries.tsx` | `_archive_backend/pages/admin/AdminEnquiries.tsx` | Admin enquiry management dashboard. |
| `src/pages/admin/AdminHeroFrames.tsx` | `_archive_backend/pages/admin/AdminHeroFrames.tsx` | Admin frame sequencer dashboard. |
| `src/pages/admin/AdminLayout.tsx` | `_archive_backend/pages/admin/AdminLayout.tsx` | Admin layout wrapper. |
| `src/pages/admin/AdminLogin.tsx` | `_archive_backend/pages/admin/AdminLogin.tsx` | Admin password login interface. |
| `src/pages/admin/AdminOverview.tsx` | `_archive_backend/pages/admin/AdminOverview.tsx` | Admin dashboard overview metrics. |
| `src/pages/admin/AdminProductEditor.tsx` | `_archive_backend/pages/admin/AdminProductEditor.tsx` | Admin product creation/edit form. |
| `src/pages/admin/AdminProductList.tsx` | `_archive_backend/pages/admin/AdminProductList.tsx` | Admin product listing table. |
| `src/pages/admin/AdminShowroomMedia.tsx` | `_archive_backend/pages/admin/AdminShowroomMedia.tsx` | Admin video/media manager. |
| `src/pages/admin/AdminSiteSettings.tsx` | `_archive_backend/pages/admin/AdminSiteSettings.tsx` | Admin site settings interface. |
| `src/pages/admin/AdminStorageAudit.tsx` | `_archive_backend/pages/admin/AdminStorageAudit.tsx` | Admin storage auditor dashboard. |
| `src/context/AuthContext.tsx` | `_archive_backend/context/AuthContext.tsx` | Supabase auth session provider. |
| `src/services/adminService.ts` | `_archive_backend/services/adminService.ts` | Backend CRUD and Supabase database mutations. |
| `src/services/storageService.ts` | `_archive_backend/services/storageService.ts` | Supabase vault and public bucket uploader. |
| `src/services/storageAuditService.ts` | `_archive_backend/services/storageAuditService.ts` | Storage bucket reconciliation service. |
| `src/services/supabaseClient.ts` | `_archive_backend/services/supabaseClient.ts` | Supabase JS client initializer. |
| `src/__tests__/adminWorkflows.test.ts` | `_archive_backend/__tests__/adminWorkflows.test.ts` | Tests for admin CRUD operations. |
| `src/__tests__/mediaAuditedFixesRegression.test.ts` | `_archive_backend/__tests__/mediaAuditedFixesRegression.test.ts` | Tests for storage audit repairs. |
| `src/__tests__/productDeletionRegression.test.ts` | `_archive_backend/__tests__/productDeletionRegression.test.ts` | Tests for admin database cascading deletes. |
| `src/__tests__/securityAndValidation.test.ts` | `_archive_backend/__tests__/securityAndValidation.test.ts` | Tests for admin JWT validation and file headers. |
| `src/__tests__/storageAuditRegression.test.ts` | `_archive_backend/__tests__/storageAuditRegression.test.ts` | Tests for cloud bucket scanning. |
| `src/__tests__/videoPromotionRegression.test.ts` | `_archive_backend/__tests__/videoPromotionRegression.test.ts` | Tests for draft-to-public bucket promotion. |
| `src/__tests__/cinematicHeroAndShowroom.test.ts` | `_archive_backend/__tests__/cinematicHeroAndShowroom.test.ts` | Tests for admin video upload workflows. |

---

## 3. Preserved Unmodified Assets
- `hero-frames/` (384 WebP frames): Untouched.
- `public/hero-frames/` (384 WebP frames): Untouched.
- `src/components/home/hero-canvas/` (Canvas scroll rendering engine): Untouched.
- `src/components/viewers/` (Three.js and 360 viewer components): Untouched.

