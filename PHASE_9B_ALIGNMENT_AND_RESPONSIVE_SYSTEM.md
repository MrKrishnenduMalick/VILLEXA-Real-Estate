# PHASE 9B — ALIGNMENT, SPACING & RESPONSIVE LAYOUT SYSTEM

**Project:** BILEKSA Private Residences  
**Working Directory:** `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main`  
**Execution Timestamp:** 2026-10-31T11:06:30+05:30  
**Specification Level:** Non-negotiable structural layout engineering rules.

---

## 1. Global Container & Grid Engineering

### 1.1 Content Boundaries & Margins
All pages adhere strictly to a unified 12-column architectural layout grid:

| Viewport | Screen Width | Max Container Width | Page Margins (Left/Right) | Grid Columns | Gutter Width |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Desktop Ultra** | `≥ 1440px` | `1320px` | `60px` | 12 | `32px` |
| **Desktop / Laptop** | `1366px – 1439px`| `1240px` | `48px` | 12 | `28px` |
| **Small Laptop** | `1024px – 1365px`| `960px` | `36px` | 12 | `24px` |
| **Tablet** | `768px – 1023px` | `720px` | `32px` | 6 / 12 | `20px` |
| **Mobile Standard** | `390px – 767px`  | `100%` | `20px` | 4 | `16px` |
| **Mobile Small** | `< 390px` | `100%` | `16px` | 4 | `12px` |

### 1.2 Vertical Rhythm & Section Spacing
Section padding must not use arbitrary pixel values. All vertical intervals are governed by a strict mathematical scale:

- **Monumental Section Gap (Hero to Master Spread):** `160px` desktop / `100px` mobile.
- **Standard Section Gap (Curatorial Spreads):** `140px` desktop / `80px` mobile.
- **Intimate Section Gap (Between related subsections):** `80px` desktop / `48px` mobile.
- **Component Internal Padding:**
  - Card Containers: `32px` desktop / `20px` mobile.
  - Floating Glass Badges: `8px 18px`.
  - Action Buttons: `16px 36px` (desktop), `14px 28px` (mobile).

---

## 2. Typographic Scale & Hierarchy System

| Role | Font Family | Desktop Size | Mobile Size | Line Height | Letter Spacing | Case | Max Width |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display Title** | Playfair Display / Cormorant | `clamp(3.4rem, 6vw, 5.2rem)` | `2.6rem` | `1.04` | `-0.02em` | Sentence | `860px` |
| **Section Masthead (H2)**| Playfair Display / Cormorant | `clamp(2.4rem, 4vw, 3.6rem)` | `2.0rem` | `1.10` | `-0.015em`| Sentence | `720px` |
| **Card Title (H3)** | Playfair Display / Cormorant | `1.75rem` (28px) | `1.45rem` (23px)| `1.20` | `0em` | Sentence | None |
| **Editorial Eyebrow** | Inter / Neue Haas Grotesk | `11px` | `10px` | `1.00` | `0.28em` | Uppercase | None |
| **Lead Narrative Body** | Inter / Neue Haas Grotesk | `18px` | `16px` | `1.72` | `0em` | Sentence | `680px` |
| **Standard Body Text** | Inter / Neue Haas Grotesk | `15px` | `14px` | `1.65` | `0em` | Sentence | `620px` |
| **Specification Metrics**| Inter (Tabular Numbers) | `13px` | `12px` | `1.20` | `0.18em` | Uppercase | None |
| **Button / Link Labels**| Inter | `12px` | `11px` | `1.00` | `0.20em` | Uppercase | None |

---

## 3. Image Composition & Aspect Ratio Standards

To eliminate all image distortion, awkward cropping, and uneven cards, the master template establishes four permanent aspect ratios:

| Component Type | Aspect Ratio | Allowed Crop | Resolution Requirement | Target Image IDs |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Sequences & Video** | `16:9` (1.778:1) | Center / Horizon | `1920 × 1080` (min) | IMG-01, Video |
| **Flagship Residence Cards**| `16:9` (1.778:1) | Sky / Facade 60/40| `1600 × 900` | IMG-06, IMG-12, IMG-15 |
| **Secondary Residence Cards**| `3:2` (1.500:1) | Optical Center | `1200 × 800` | IMG-07 through IMG-11 |
| **Editorial Vertical Stills** | `3:4` (0.750:1) | Top 30% / Horizon| `900 × 1200` | IMG-02, IMG-05 |
| **Interior Panoramas** | `16:10` (1.600:1)| Eye Level Living | `1600 × 1000` | IMG-03, IMG-16, IMG-17 |
| **Floor Plans & 3D Views** | `4:3` (1.333:1) | Drawing Center | `1200 × 900` | IMG-24, IMG-25, IMG-26 |
| **Amenities Triptych** | `4:3` (1.333:1) | Focal Center | `800 × 600` | IMG-27 through IMG-31 |

---

## 4. Component Alignment Rules

1. **Card Metadata Alignment:**
   - Property cards in any multi-column row must use `display: flex; flex-direction: column; justify-content: space-between`.
   - The title, location, specification row, and price must align on identical baseline grid lines across all cards in the row.
2. **Dividers and Hairlines:**
   - Dividers must use `height: 1px`, color `#EAE5DC` (warm ivory borders), with zero shadow or bevel.
3. **Button Alignment:**
   - Primary action buttons (Private Viewing, Explore Registry) must align to the left margin of their content block, never floating arbitrarily in the center of an asymmetrical layout.

---

## 5. Viewport Adaptation Matrix

| Component | Desktop (1440×900) | Laptop (1366×768) | Tablet (768×1024) | Mobile (390×844 / 360×800) |
| :--- | :--- | :--- | :--- | :--- |
| **Header** | Full horizontal row, height 88px. | Full row, height 80px. | Logo + Contact CTA + Burger icon. | Logo + Burger icon, height 68px. |
| **Hero Canvas** | 100vh pinned canvas, 300vh scroll. | 100vh pinned, 250vh scroll.| 100vh pinned, 220vh scroll. | 100vh pinned, 200vh scroll. |
| **Curatorial Statement**| 7 cols text / 5 cols image (3:4). | 7 cols text / 5 cols image. | 12 cols text, image stacks below. | Text full width, image stacks below (16:10). |
| **Flagship Residence** | 8 cols image / 4 cols text. | 7 cols image / 5 cols text. | Image full width, specs stack below. | Image full width, specs stack below. |
| **Residence Matrix** | 2-column balanced landscape pairs. | 2-column balanced pairs. | 2-column pairs. | 1-column linear feed, full width. |
| **Amenities Reel** | 3-column triptych (`col-span-4`). | 3-column triptych. | 2-column grid (`col-span-6`). | Horizontal snap-scroll carousel. |
| **Footer** | 4-column master directory. | 4-column directory. | 2-column directory. | 1-column accordion / linear list. |

