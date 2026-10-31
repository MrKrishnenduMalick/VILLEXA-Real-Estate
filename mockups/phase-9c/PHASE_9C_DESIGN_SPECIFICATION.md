# PHASE 9C — VISUAL DESIGN SPECIFICATION & MOCKUP REPORT
## Approved Direction: Hybrid Concept A (Luxury Editorial) + Concept B (Cinematic Architecture)

**Project:** BILEKSA Private Residences  
**Working Directory:** `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main`  
**Execution Timestamp:** 2026-10-31T11:38:45+05:30  
**Phase Mode:** **Design Mockups Only** (Zero application code modified in `src/`)

---

## 1. Executive Summary & Design Transformation

Phase 9C delivers high-fidelity visual mockups of the redesigned BILEKSA homepage, realizing the approved **Hybrid Concept A + B** direction. 

### Before vs. After: Key Structural Transformations
1. **Header Navigation:**
   - *Previous:* Bulky 80px opaque slab with a dark telephone button and cramped e-commerce links.
   - *Phase 9C Mockup:* Airy 72px translucent ivory bar (`rgba(250, 248, 245, 0.92)`) with 20px blur, delicate serif monogram (`B I L E K S A`), spacious navigation, and a crisp, 2px-radius architectural advisory button.
2. **Cinematic Hero Repositioning & Clearance:**
   - *Previous:* White headline centered directly over the villa's high-contrast window frames and limestone balustrades, requiring heavy, artificial drop shadows that obscured the architecture.
   - *Phase 9C Mockup:* Repositioned into the lower-left quadrant with an asymmetric crop. 85% of the villa facade, infinity pool, and sunset horizon remain 100% unobscured. Zero artificial heavy drop shadows.
3. **Architectural Controls (Elimination of Pill Buttons):**
   - *Previous:* Yellowish mustard-gold pill buttons (`rounded-full`) with casual travel icons (compass, telephone) that looked like consumer travel apps.
   - *Phase 9C Mockup:* Sophisticated architectural controls with 2px monolithic corner radii, 1px hairline borders, and refined uppercase typography with 0.22em tracking.
4. **Persistent Dark Overlay Removal:**
   - *Previous:* Background scrims and dark CSS layers caused body text in scrolled sections to render as black-on-black.
   - *Phase 9C Mockup:* Pure warm ivory (`#FAF8F5`), raw sandstone (`#F3EFEA`), and bone white (`#FFFFFF`) backgrounds with crisp charcoal text (`#1A1816`).
5. **Asymmetrical Editorial Grid:**
   - *Previous:* Symmetrical 3-column product cards resembling furniture listings.
   - *Phase 9C Mockup:* 12-column master editorial spread: Monumental 16:9 Flagship Spread (The Cliff Villa) paired with balanced 2-column 3:2 landscape cards.

---

## 2. Palette & Typographic System

### 2.1 Color Palette
- **Warm Ivory (Primary Ground):** `#FAF8F5`
- **Pure Bone White (Card Surfaces):** `#FFFFFF`
- **Raw Sandstone (Materiality Section):** `#F3EFEA`
- **Deep Obsidian Charcoal (Primary Typography):** `#1A1816`
- **Muted Charcoal (Body Text):** `#5A544C`
- **Champagne Gold (Architectural Eyebrows & Accents):** `#B89552`
- **Luminous Champagne (Hero Accents):** `#DFCFA8`
- **Hairline Dividers:** `#EAE5DC` (Ivory), `#332F2B` (Dark)

### 2.2 Typography Hierarchy
- **Primary Serif:** *Cormorant Garamond* (Headlines, Monograms, Residence Titles)
- **Primary Sans-Serif:** *Inter* (Eyebrows, Body, Technical Specifications, Buttons)
- **Hero Title:** `clamp(3.2rem, 5.2vw, 4.8rem)` / Line height `1.05` / Weight `300`
- **Section Masthead (H2):** `clamp(2.4rem, 3.8vw, 3.4rem)` / Line height `1.12` / Weight `300`
- **Residence Card Titles (H3):** `28px` / Line height `1.20` / Weight `400`
- **Editorial Eyebrows:** `11px` / Tracking `0.28em` / Uppercase / Weight `600`
- **Technical Specifications:** `11px` / Tracking `0.12em` / Uppercase / Tabular Figures

---

## 3. Mockup Section Breakdown

1. **Header (72px):** Monogram, Overview, The Registry, Architectural Vision, Sanctuary & Living, Private Desk, and "Private Viewing" control.
2. **Hero Scene (calc(100vh - 72px)):** Pinned Frame 001 of 240, bottom-left editorial card, ground bar with coordinates (`43°33'N 7°07'E`), scroll indicator, and frame counter (`Frame 001 / 240`).
3. **Curatorial Statement (Section 2):** 7-column editorial text with milestone metrics (06 Estates, 100% Bespoke) paired with 5-column framed plaque image (Plate I · Ocean Loggia).
4. **The Inaugural Registry (Section 3):**
   - Flagship Spread: The Cliff Villa, Cap d'Antibes (€28,500,000) with complete architectural specification table.
   - 2-Column Balanced Matrix: The Ocean Villa ($34M), The Garden Villa (€22M), The Skyline Residence (€42M), The Hillside Retreat (CHF 31M).
5. **Architectural Materiality (Section 4):** Raw sandstone section with 3 numbered pillar cards (01 Solar Choreography, 02 Geological Permanence, 03 Acoustic Sanctuary).
6. **Bespoke Amenities & Sanctuary (Section 5):** 3-card triptych (Thermal Infinity Waters, Dolby Private Screening, Subterranean Wine Vault).
7. **Private Concierge & Advisory Desk (Section 6):** Deep obsidian invitation box with Direct WhatsApp Concierge and Formal Advisory Dossier triggers.
8. **Master Architectural Footer (Section 7):** 4-column master directory with international jurisdictions (London, Cap d'Antibes, Monaco, Dubai, St. Moritz).

---

## 4. Visual Mockup Artifacts & Screenshots

All mockup files and high-resolution rendered screenshots are saved in `mockups/phase-9c/`:

| Artifact | File Path | Resolution | Size | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Interactive HTML Mockup** | [`mockups/phase-9c/index.html`](file:///d:/VILLEXA%20-%20Real%20Estate/VILLEXA-MAIN-main/mockups/phase-9c/index.html) | Standalone responsive HTML | ~28 KB | Complete runnable visual mockup |
| **Desktop Viewport** | [`mockups/phase-9c/screenshots/mockup-desktop-1440x900.png`](file:///d:/VILLEXA%20-%20Real%20Estate/VILLEXA-MAIN-main/mockups/phase-9c/screenshots/mockup-desktop-1440x900.png) | 1440 × 900 | 1.09 MB | Desktop hero & header inspection |
| **Laptop Viewport** | [`mockups/phase-9c/screenshots/mockup-laptop-1366x768.png`](file:///d:/VILLEXA%20-%20Real%20Estate/VILLEXA-MAIN-main/mockups/phase-9c/screenshots/mockup-laptop-1366x768.png) | 1366 × 768 | 919 KB | Laptop viewport adaptation |
| **Tablet Viewport** | [`mockups/phase-9c/screenshots/mockup-tablet-768x1024.png`](file:///d:/VILLEXA%20-%20Real%20Estate/VILLEXA-MAIN-main/mockups/phase-9c/screenshots/mockup-tablet-768x1024.png) | 768 × 1024 | 539 KB | Tablet vertical layout |
| **Mobile Viewport** | [`mockups/phase-9c/screenshots/mockup-mobile-390x844.png`](file:///d:/VILLEXA%20-%20Real%20Estate/VILLEXA-MAIN-main/mockups/phase-9c/screenshots/mockup-mobile-390x844.png) | 390 × 844 | 249 KB | Mobile responsive stacking |
| **Full-Page Desktop** | [`mockups/phase-9c/screenshots/mockup-desktop-fullpage.png`](file:///d:/VILLEXA%20-%20Real%20Estate/VILLEXA-MAIN-main/mockups/phase-9c/screenshots/mockup-desktop-fullpage.png) | 1440 × 5800 | 3.90 MB | Complete end-to-end page flow |

---

## 5. Strict Verification & Integrity Confirmation

- [x] **Zero changes to existing application code:** `src/`, `public/`, `package.json`, and `vite.config.ts` remain 100% untouched.
- [x] **Working tree clean:** Verified that no production files were modified.
- [x] **Hero engine untouched:** 240 WebP frames in `public/real-estate-hero-frames/` remain intact.
- [x] **No implementation started:** Work has halted; awaiting explicit user approval before proceeding to implementation.

