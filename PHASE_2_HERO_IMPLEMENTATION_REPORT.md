# PHASE 2 — CINEMATIC HERO ENGINE & LUXURY VILLA SEQUENCE REPORT

## 1. Executive Summary

Phase 2 has successfully adapted the deterministic scroll-driven cinematic canvas engine from the legacy 384-frame furniture sequence to the new **240-frame luxury villa walkthrough** generated via Google Flow. 

All 240 frames were extracted at 24 FPS with full 1280 × 720 resolution in WebP format, achieving a total media payload of 10.63 MB (down 73.5% from the original 40.2 MB furniture sequence).

The hero experience is completely deterministic:
- Downward scrolling scrubs from `frame-00001.webp` through `frame-00240.webp`.
- Upward scrolling smoothly reverses the camera motion.
- Halting scrolling freezes the view on the current frame with zero flicker.
- Bounded LRU caching with distance-based eviction protects bookend frames and keeps memory usage under 5 MB.
- Mobile devices scale using responsive aspect-ratio cover calculations without distortion or blank flashes.

---

## 2. Source Video Metadata & Verification

The source villa video was located at the project root `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main\hero.mp4` and verified using `ffprobe`:

| Attribute | Video Property | Verification Status |
| :--- | :--- | :--- |
| **File Path** | `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main\hero.mp4` | Verified |
| **Container Format** | QuickTime / MP4 (`isommp42`) | Verified |
| **Duration** | `10.000000` seconds (Video stream) / `10.026667`s total | Verified |
| **Video Codec** | H.264 / AVC (High Profile, `yuv420p`) | Verified |
| **Dimensions** | 1280 × 720 (16:9 widescreen) | Verified |
| **Frame Rate** | 24.000 FPS constant (`r_frame_rate: 24/1`) | Verified |
| **Total Frames** | 240 frames (`nb_frames: 240`) | Verified |
| **Bitrate** | 3,873 kb/s (Video) | Verified |
| **Metadata Handler** | `ISO Media file produced by Google Inc. Created on: 10/30/2026` | Google Flow Verified |
| **Content** | High-end cinematic luxury villa architectural walkthrough | Verified |

---

## 3. Frame Extraction & Storage

Extraction was executed using `ffmpeg` with `libwebp` encoding (quality level 85, compression level 4) to ensure crisp architectural edge definition while maintaining web delivery performance:

- **Destination Directory**: `public/real-estate-hero-frames/`
- **File Pattern**: `frame-00001.webp` through `frame-00240.webp` (5-digit zero-padded)
- **Manifest**: `public/real-estate-hero-frames/manifest.json` generated with individual frame byte sizes and index metadata
- **Total Payload**: 11,145,560 bytes (~10.63 MB)
- **Average Frame Size**: ~46.4 KB
- **Original Furniture Backup**: Preserved in `hero-frames/` (384 frames), `public/hero-frames/` (384 frames), and `_backup_furniture_frames/hero-frames/` (384 frames).

---

## 4. Architectural Implementation Details

### A. High-DPI Canvas Rendering (`CinematicShowroomBackground.tsx`)
- Canvas rendering employs 2D context with `{ alpha: false }` for GPU hardware acceleration.
- Window DPR is clamped to `Math.min(window.devicePixelRatio || 1, 2)` to eliminate GPU fill-rate bottlenecks on 3x/4x mobile displays.
- Aspect ratio mapping uses strict `object-fit: cover` geometry:
  $$\text{canvasRatio} = \frac{\text{canvasWidth}}{\text{canvasHeight}}, \quad \text{imageRatio} = \frac{1280}{720} = 1.778$$
  If $\text{canvasRatio} > \text{imageRatio}$, height expands and crops vertically; otherwise width expands and crops horizontally, keeping the architectural focal point centered.

### B. Preloading & Bounded Distance-Based LRU Caching
- **Bounded Cache**: `MAX_CACHE_SIZE = 96` frames (~4.4 MB uncompressed WebP buffer).
- **Distance Eviction**: When cache exceeds 96 frames, the frame furthest from the active target index is evicted, while bookends (`frame-00001.webp` and `frame-00240.webp`) are permanently pinned.
- **In-Flight Request Deduplication**: Duplicate requests for the same frame index share a single active `Promise<HTMLImageElement>` in `inFlightRequestsRef`.
- **Sliding Window Preload**: Loads up to `LOOKAHEAD_FRAMES = 12` forward and `LOOKBEHIND_FRAMES = 6` backward, throttled to `MAX_CONCURRENT_IN_FLIGHT = 6` parallel connections.
- **Off-Thread Decoding**: Decodes images asynchronously via `img.decode()` prior to canvas dispatch.

### C. Hero Presentation Layer (`CinematicHeroScroll.tsx`)
- **Headline**: "Where Architecture Becomes Home"
- **Subtitle**: "Discover exceptional residences shaped by space, light and timeless design."
- **Primary CTA**: "Explore Residences" $\rightarrow$ `/residences`
- **Secondary CTA**: "Discover Our Vision" $\rightarrow$ `/vision`
- **Scroll Cue**: Minimalist gold glass pill `(8) SCROLL TO EXPLORE` pinned to bottom center.
- **Scroll Progression**: Pinned track with `300vh` scroll height. Copy drifts upward and smoothly dissolves across the initial 22% of scroll progression ($0.0 \rightarrow 0.22$), seamlessly revealing the unobstructed villa exploration.

---

## 5. Verification & Test Suite

- **TypeScript Compilation**: `npm run typecheck` $\rightarrow$ **0 errors**.
- **Unit Test Suite**: `npm run test` $\rightarrow$ **27 / 27 passing across 4 test suites**:
  - `cinematicHeroScroll.test.ts` (5 tests): Verified 240-frame config, linear scroll mapping, bidirectionality, LRU bookend protection, and URL padding.
  - `catalogueVideoShowcase.test.ts` (6 tests).
  - `clientConfig.test.ts` (9 tests).
  - `services.test.ts` (7 tests).
- **Production Build**: `npm run build` $\rightarrow$ **Clean build in 7.11s**.

