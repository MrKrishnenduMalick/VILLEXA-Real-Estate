# PHASE 4 — BILEKSA PROPERTY CARD ARCHITECTURE & INTERACTION REPORT

**Component:** `src/components/property/PropertyCard.tsx`  
**Status:** Complete & Validated  
**Date:** October 31, 2026  
**Audience:** Creative Director, Senior Frontend Engineer, UI/UX Designer  

---

## 1. Component Overview

`PropertyCard` is the foundational visual unit of the BILEKSA digital portfolio. It translates high-value real estate assets into an interactive architectural monograph card, balancing visual restraint with immersive micro-interactions.

### Key Metrics
- **Aspect Ratio:** Golden-ratio inspired `16:10` image/video container.
- **Color Palette:** Warm Ivory (`#FBFBF9`), Warm White (`#FFFFFF`), Gold Border (`#EFECE6` default, `#C5A059` hover), Deep Charcoal (`#12100E`).
- **Typography:** Serif display titles (`Cormorant Garamond`), clean sans-serif spatial labels (`Inter` / `system-ui`).

---

## 2. Interactive Media Engine

### 2.1 Viewport-Triggered Video Preview
Unlike noisy autoplay property cards, each `PropertyCard` encapsulates an intelligent, battery-efficient video preview system:
- **`IntersectionObserver` Trigger:** A dedicated ref observes the media container. The preview video (`property.videos.previewVideo` or `property.videos.heroWalkthrough`) initializes and plays *only* when at least 25% of the card is visible in the viewport.
- **Intersection Hysteresis:** Pauses playback immediately when scrolled out of view, reclaiming GPU cycles and hardware video decoder instances.
- **Graceful Error Handling:** Audio tracks are strictly disabled (`muted={true}` and `playsInline={true}`) to conform to browser autoplay security policies. Video failure triggers an invisible fallback to the high-resolution cover photography.

### 2.2 Accessibility & Reduced Motion Support
The card monitors the user's accessibility preferences via `window.matchMedia('(prefers-reduced-motion: reduce)')`. When active:
- Video autoplays are fully suppressed.
- Transform hover animations (scale, translations) are neutralized.
- Card transitions default to simple, instant opacity switches.

---

## 3. Typographic & Spatial Information Architecture

```
+--------------------------------------------------------+
| [Cover Image / Video Preview (16:10)]                  |
| [FEATURED / ARCHITECTURAL VILLA]        [READY / UC]   |
|                                                        |
| (Hover overlay: "Explore Private Residence ->")        |
+--------------------------------------------------------+
| THE AURELIA ESTATE                       [Share / Arrow]|
| Alibaug, Coastal Maharashtra                           |
|                                                        |
| "A monolithic oceanfront sanctuary with private cove..."|
+--------------------------------------------------------+
|  6 Bed Chambers  |  8 Baths  |  14,200 sq.ft Carpet    |
+--------------------------------------------------------+
| Starting Valuation               [REQUEST PRIVATE]     |
| ₹68.00 Cr / Price Upon Request   [VIEWING / DETAILS]   |
+--------------------------------------------------------+
```

### 3.1 Typology Badges
- Replaces raw database strings with bespoke luxury descriptors:
  - `villa` -> `"Architectural Villa"`
  - `penthouse` -> `"Sky Penthouse"`
  - `waterfront` -> `"Waterfront Estate"`
  - `apartment` -> `"Private Residence"`
  - `residential_development` -> `"Master Development"`
- Features signature pill styling with subtle backdrop blur and champagne gold border.

### 3.2 Spatial Specifications Grid
Displays the three critical decision metrics in an understated 3-column micro-grid:
1. **Bedrooms:** Represented by a minimalist `Bed` icon and count (e.g., `"6 Beds"`).
2. **Bathrooms:** Represented by a minimalist `Bath` icon and count (e.g., `"8 Baths"`).
3. **Carpet Area:** Formatted spatial area using `formatArea(property.carpetArea)` (e.g., `"14,200 sq.ft"`).

### 3.3 Private Valuation Presentation
- High-visibility valuation display honoring Indian financial notation (`₹68.00 Cr`, `₹18.50 Cr`).
- Where `showPricePublicly: false` or `isEnquiryOnly: true`, values are replaced with `"Price Upon Request"`, preserving ultra-luxury client discretion.
- Includes a direct CTA button that links seamlessly to `/residence/:slug`.

---

## 4. Micro-Interactions & Hover Polish

- **Subtle Image Zoom:** `scale-105 duration-700 ease-out` on card hover.
- **Border Elevation:** Border transitions from neutral stone `#EFECE6` to refined gold `#C5A059/40`.
- **Soft Shadow Spread:** Ambient shadow softens on hover (`shadow-xl` with warm undertone).
- **CTA Indicator:** An elegant gold arrow pill translates 4px horizontally on hover, signaling clickability without aggressive flashiness.

---

## 5. Verification & Unit Tests

The component is rigorously tested in `src/__tests__/catalogueExperience.test.ts`:
- Card data binding and fallback image rendering.
- Correct formatting of Indian currency (`₹ Cr` and `₹ Lakhs`).
- Discretionary handling of `"Price Upon Request"`.
- Correct bedroom, bathroom, and area label formatting.
- Typology label mapping.

