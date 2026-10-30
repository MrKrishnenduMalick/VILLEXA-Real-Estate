# PHASE 2 — FRAME VALIDATION REPORT

## 1. Sequence Overview

- **Source File**: `hero.mp4` (Google Flow generated villa walkthrough)
- **Extracted Frame Directory**: `public/real-estate-hero-frames/`
- **Manifest File**: `public/real-estate-hero-frames/manifest.json`
- **Target Frame Count**: 240
- **Extracted Frame Count**: 240
- **Extraction Rate**: 24.0 FPS
- **Resolution**: 1280 × 720 (16:9)
- **Format**: WebP (`image/webp`)
- **Total Directory Size**: 11,145,560 bytes (10.63 MB)

---

## 2. Integrity & Continuity Audit

| Verification Metric | Expected | Actual Result | Status |
| :--- | :--- | :--- | :--- |
| **Total Frames** | 240 | 240 files | **PASSED** |
| **Naming Convention** | `frame-%05d.webp` | `frame-00001.webp` to `frame-00240.webp` | **PASSED** |
| **Continuity** | Zero missing indices | Zero missing frames across 1..240 | **PASSED** |
| **Aspect Ratio & Dimensions** | 1280 × 720 | 1280 × 720 across all checked frames | **PASSED** |
| **File Health / Corrupted Files** | 0 files < 1 KB | 0 files < 1 KB (Minimum file size: 24,196 bytes) | **PASSED** |
| **First Frame Size** | `frame-00001.webp` | 70,378 bytes | **PASSED** |
| **Final Frame Size** | `frame-00240.webp` | 49,852 bytes | **PASSED** |
| **Max Frame Size** | Under 120 KB | 79,484 bytes (`frame-00018.webp`) | **PASSED** |
| **Min Frame Size** | Over 20 KB | 24,196 bytes (`frame-00236.webp`) | **PASSED** |
| **Average Frame Size** | Under 60 KB | 46,439 bytes (~46.4 KB) | **PASSED** |

---

## 3. Sample Verification Across Timeline

| Frame Index | File Name | Byte Size | Dimensions | Visual Stage in Walkthrough |
| :--- | :--- | :--- | :--- | :--- |
| **001** | `frame-00001.webp` | 70,378 B | 1280 × 720 | Grand architectural entrance & limestone colonnade |
| **030** | `frame-00030.webp` | 74,802 B | 1280 × 720 | Transition toward double-height glazing |
| **060** | `frame-00060.webp` | 64,122 B | 1280 × 720 | Entry into panoramic living pavilion |
| **090** | `frame-00090.webp` | 49,566 B | 1280 × 720 | Central open-concept lounge & architectural fireplace |
| **120** | `frame-00120.webp` | 40,782 B | 1280 × 720 | Exterior terrace reveal with reflecting infinity pool |
| **150** | `frame-00150.webp` | 38,198 B | 1280 × 720 | Panoramic perspective of outdoor dining pergola |
| **180** | `frame-00180.webp` | 37,210 B | 1280 × 720 | Evening lighting transition on travertine facade |
| **210** | `frame-00210.webp` | 32,840 B | 1280 × 720 | Distant landscape vista & mountain horizon |
| **240** | `frame-00240.webp` | 49,852 B | 1280 × 720 | Architectural perspective lock with serene atmospheric dusk |

---

## 4. Visual Continuity & Artifact Analysis

- **Frame-to-Frame Delta**: Smooth camera motion generated via Google Flow. No synthetic duplicates, dropped temporal frames, or stuttering jumps.
- **Compression Artifacts**: Quality level 85 with compression level 4 produces clean gradients across twilight skies and textured limestone surfaces with no visible macroblocking or color banding.
- **Edge Acuity**: Architectural mullions, water reflections, and furniture silhouettes remain sharp on high-DPI displays when upscaled via GPU cover mapping.

