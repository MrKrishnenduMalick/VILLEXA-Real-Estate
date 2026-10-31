# BILEKSA PRIVATE RESIDENCES — PHASE 9C REVISION 3 DESIGN SPECIFICATION
### Architectural Master Template · Hybrid Concept A + B + Selective Transparency

---

## 1. Masthead & Navigation Dual-State Architecture

| Visual State | Scroll Position (`window.scrollY`) | Background Styling | Border / Shadow | Brand Wordmark | Link Color | Advisory CTA |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Top of Page** | `0px` | `transparent` | `border-bottom: 1px solid rgba(255, 255, 255, 0.16)` | `#FFFFFF` (White) | `rgba(255, 255, 255, 0.90)` | Frosted White Glass button |
| **After Scroll** | `> 30px` | `rgba(250, 248, 245, 0.88)` | `border-bottom: 1px solid rgba(184, 149, 82, 0.35)` · `box-shadow: 0 4px 24px rgba(26, 24, 22, 0.05)` | `#1A1816` (Deep Charcoal) | `#1A1816` · hover `#9E7D3B` | Solid Charcoal Outline button |

### Blur & Optical Treatment
* **Backdrop Filter**: `blur(20px) saturate(140%)` for smooth, warm ivory distortion of passing content.
* **Transition**: `background-color 0.35s ease, height 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease`.

---

## 2. Cinematic Hero & Architectural Glass Transition

### A. Hero Framing & Clearance
* **Villa Facade Clearance**: Unobstructed across 85% of the frame (center and right fields).
* **Vignette Strategy**: Localized radial gradient strictly at the lower left (`radial-gradient(circle at 16% 88%, rgba(14, 12, 10, 0.70) 0%, rgba(14, 12, 10, 0.32) 44%, rgba(14, 12, 10, 0.0) 72%)`). No artificial rectangular drop-shadows or murky full-page dimming.

### B. Grand Editorial Floating Slab (`#transition-curatorial`)
* **Layering**: Upward negative margin (`margin-top: -140px`) creates a clean architectural overlap over the base of the cinematic hero sequence.
* **Surface Formula**:
  * `background: rgba(250, 248, 245, 0.82)` (Warm Ivory Glass)
  * `backdrop-filter: blur(32px) saturate(140%)`
  * `border: 1px solid rgba(255, 255, 255, 0.85)`
  * `box-shadow: 0 24px 64px rgba(26, 24, 22, 0.08)`
* **Gradual Grounding**: The atmospheric hero tone blends seamlessly into the solid warm ivory (`#FAF8F5`) editorial background of *The Inaugural Registry*.

---

## 3. Curated Property Imagery & Demonstration Portfolio

Every property card was verified against architectural typologies:

1. **Residence 1: The Cliff Villa (Cap d'Antibes, France)**
   * *Image*: Cantilevered modern limestone villa overlooking azure Mediterranean waters (`photo-1600596542815-ffad4c1539a9`).
   * *Panel*: Floating translucent information badge (`rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(16px)`).
2. **Residence 2: The Ocean Villa (Palm Beach, Florida)**
   * *Image*: Curved glass contemporary waterfront residence with private pool and palms (`photo-1613490493576-7fde63acd811`).
3. **Residence 3: The Garden Villa (Lake Como, Italy)**
   * *Image*: Contemporary stone estate surrounded by manicured private gardens (`photo-1600607687939-ce8a6c25118c`).
4. **Residence 4: The Skyline Residence (Monaco Harbor)**
   * *Image*: Panoramic floor-to-ceiling glass penthouse terrace overlooking city and coastline (`photo-1545324418-cc1a3fa10c00`).
5. **Residence 5: The Beachfront Compound (St. Barthélemy)**
   * *Image*: Expansive oceanfront architectural compound directly on the coast (`photo-1580587771525-78b9dba3b914`).
6. **Residence 6: The Hillside Retreat (St. Moritz, Switzerland)**
   * *Image*: Monumental multi-tiered contemporary alpine hillside chalet exterior embedded into alpine terrain (`photo-1542314831-068cd1dbfeeb`). No generic furniture lamps or ordinary cottages.
7. **Demonstration Protocol Notice**: Clearly flagged across all valuations with an explicit disclaimer bar:
   `* Demonstration Portfolio Notice — Architectural specifications and guide valuations reflect conceptual master commissions. Formal private dossiers and verified ownership records are issued under confidential non-disclosure protocol via our Advisory Desk.`

---

## 4. Mobile-First Geometric Validation

Audited directly via Chrome DevTools Protocol at exact viewport widths:

* **iPhone 12/13/14 Standard (390 × 844)**:
  * `document.documentElement.scrollWidth`: **390px**
  * `document.body.scrollWidth`: **390px**
  * `window.innerWidth`: **390px**
  * Overflow Elements Count: **0**
* **Samsung Galaxy / Compact Android (360 × 800)**:
  * `document.documentElement.scrollWidth`: **360px**
  * `document.body.scrollWidth`: **360px**
  * `window.innerWidth`: **360px**
  * Overflow Elements Count: **0**
* **Touch Targets**: Minimum 44px – 48px height on all interactive CTAs.
* **Header Height**: Compact 64px with architectural hamburger trigger.

