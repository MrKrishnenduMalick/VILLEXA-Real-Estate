# PHASE 9B — BILEKSA IMAGE ASSET MAPPING & MANIFEST SPECIFICATION

**Project:** BILEKSA Private Residences  
**Working Directory:** `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main`  
**Execution Timestamp:** 2026-10-31T11:07:00+05:30  
**Source Asset Board:** User-Uploaded BILEKSA Real Estate Image Asset Board (43 Logical Asset IDs).

---

## 1. Executive Summary & Existing Asset Inventory

An audit of `public/` and `src/` reveals:
1. **IMG-01 (Cinematic Hero Sequence):** **MATCHED & ACTIVE**. All 240 WebP frames exist in `public/real-estate-hero-frames/frame-00001.webp` through `frame-00240.webp` (10.66 MB) with `manifest.json`.
2. **IMG-02 through IMG-43:** Currently unhosted locally. The existing application references generic, scattered Unsplash URLs inside `src/config/sampleProperties.ts`, which leads to duplicate images, missing floor plans, and broken aspect ratios.
3. **Contact Sheet Status:** The uploaded contact sheet is a master art-direction reference and will **never be loaded directly** as a website image.
4. **Resolution Strategy:** Map all 43 IDs into a central architecture `src/config/imageManifest.json` and a clean folder hierarchy `public/images/`.

---

## 2. Complete 43-Asset Mapping Table

| Asset ID | Category | Official Label on Board | Target File Path in `public/images/` | Recommended Aspect Ratio | Verified Status in Repo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **IMG-01** | Hero | Hero Main Frame (240-frame sequence) | `public/real-estate-hero-frames/frame-{index}.webp` | `16:9` | **VERIFIED & PRESENT (240 frames)** |
| **IMG-02** | Homepage | Homepage Section 1: Luxury Living | `public/images/homepage/IMG-02.webp` | `3:4` or `16:10` | Pending local asset placement |
| **IMG-03** | Homepage | Homepage Section 2: Interior Showcase | `public/images/homepage/IMG-03.webp` | `16:10` | Pending local asset placement |
| **IMG-04** | Homepage | Homepage Section 3: Location / View | `public/images/homepage/IMG-04.webp` | `16:9` | Pending local asset placement |
| **IMG-05** | Homepage | Homepage Section 4: Lifestyle | `public/images/homepage/IMG-05.webp` | `3:4` | Pending local asset placement |
| **IMG-06** | Residence | Residence 1: The Cliff Villa | `public/images/residences/IMG-06.webp` | `16:9` | Pending local asset placement |
| **IMG-07** | Residence | Residence 2: The Ocean Villa | `public/images/residences/IMG-07.webp` | `3:2` | Pending local asset placement |
| **IMG-08** | Residence | Residence 3: The Garden Villa | `public/images/residences/IMG-08.webp` | `3:2` | Pending local asset placement |
| **IMG-09** | Residence | Residence 4: The Skyline Residence | `public/images/residences/IMG-09.webp` | `3:2` | Pending local asset placement |
| **IMG-10** | Residence | Residence 5: The Beachfront Estate | `public/images/residences/IMG-10.webp` | `3:2` | Pending local asset placement |
| **IMG-11** | Residence | Residence 6: The Hillside Retreat | `public/images/residences/IMG-11.webp` | `3:2` | Pending local asset placement |
| **IMG-12** | Exterior | Exterior Front View | `public/images/interiors/IMG-12.webp` | `16:9` | Pending local asset placement |
| **IMG-13** | Exterior | Exterior Side View | `public/images/interiors/IMG-13.webp` | `16:9` | Pending local asset placement |
| **IMG-14** | Exterior | Infinity Pool View | `public/images/interiors/IMG-14.webp` | `16:9` | Pending local asset placement |
| **IMG-15** | Exterior | Night View | `public/images/interiors/IMG-15.webp` | `16:9` | Pending local asset placement |
| **IMG-16** | Interior | Living Room | `public/images/interiors/IMG-16.webp` | `16:10` | Pending local asset placement |
| **IMG-17** | Interior | Dining Room | `public/images/interiors/IMG-17.webp` | `16:10` | Pending local asset placement |
| **IMG-18** | Interior | Bedroom | `public/images/interiors/IMG-18.webp` | `16:10` | Pending local asset placement |
| **IMG-19** | Interior | Kitchen | `public/images/interiors/IMG-19.webp` | `16:10` | Pending local asset placement |
| **IMG-20** | Interior | Bathroom | `public/images/interiors/IMG-20.webp` | `4:3` | Pending local asset placement |
| **IMG-21** | Interior | Walk-in Closet | `public/images/interiors/IMG-21.webp` | `4:3` | Pending local asset placement |
| **IMG-22** | Interior | Home Office | `public/images/interiors/IMG-22.webp` | `4:3` | Pending local asset placement |
| **IMG-23** | Interior | Entertainment Room | `public/images/interiors/IMG-23.webp` | `16:9` | Pending local asset placement |
| **IMG-24** | Floor Plan | 2D Floor Plan | `public/images/floor-plans/IMG-24.webp`| `4:3` | Pending local asset placement |
| **IMG-25** | Floor Plan | 3D Floor Plan | `public/images/floor-plans/IMG-25.webp`| `4:3` | Pending local asset placement |
| **IMG-26** | 3D View | 3D Interactive View (WebGL / GLB) | `public/images/floor-plans/IMG-26.webp`| `16:9` | Pending local asset placement |
| **IMG-27** | Amenity | Swimming Pool | `public/images/amenities/IMG-27.webp` | `4:3` | Pending local asset placement |
| **IMG-28** | Amenity | Fitness Gym | `public/images/amenities/IMG-28.webp` | `4:3` | Pending local asset placement |
| **IMG-29** | Amenity | Spa & Wellness | `public/images/amenities/IMG-29.webp` | `4:3` | Pending local asset placement |
| **IMG-30** | Amenity | Private Cinema | `public/images/amenities/IMG-30.webp` | `4:3` | Pending local asset placement |
| **IMG-31** | Amenity | Wine Cellar | `public/images/amenities/IMG-31.webp` | `4:3` | Pending local asset placement |
| **IMG-32** | Lifestyle | Yacht & Marina | `public/images/lifestyle/IMG-32.webp` | `16:9` | Pending local asset placement |
| **IMG-33** | Lifestyle | Golf | `public/images/lifestyle/IMG-33.webp` | `16:9` | Pending local asset placement |
| **IMG-34** | Lifestyle | Fine Dining | `public/images/lifestyle/IMG-34.webp` | `4:3` | Pending local asset placement |
| **IMG-35** | Lifestyle | Shopping | `public/images/lifestyle/IMG-35.webp` | `4:3` | Pending local asset placement |
| **IMG-36** | Location | Coastal View | `public/images/location/IMG-36.webp` | `16:9` | Pending local asset placement |
| **IMG-37** | Location | City Skyline | `public/images/location/IMG-37.webp` | `16:9` | Pending local asset placement |
| **IMG-38** | Location | Nearby Beach | `public/images/location/IMG-38.webp` | `16:9` | Pending local asset placement |
| **IMG-39** | Location | Marina | `public/images/location/IMG-39.webp` | `16:9` | Pending local asset placement |
| **IMG-40** | Living | Family Lifestyle | `public/images/lifestyle/IMG-40.webp` | `16:9` | Pending local asset placement |
| **IMG-41** | Living | Couple Lifestyle | `public/images/lifestyle/IMG-41.webp` | `16:9` | Pending local asset placement |
| **IMG-42** | Living | Wellness & Yoga | `public/images/lifestyle/IMG-42.webp` | `16:9` | Pending local asset placement |
| **IMG-43** | Living | Nature & Tranquility | `public/images/lifestyle/IMG-43.webp` | `16:9` | Pending local asset placement |

---

## 3. Central Image Manifest Architecture (`src/config/imageManifest.json`)

The proposed manifest establishes a typed schema decoupling component source code from physical file paths:

```json
{
  "$schema": "./imageManifest.schema.json",
  "version": "1.0.0",
  "basePath": "/images",
  "assets": {
    "IMG-01": {
      "type": "sequence",
      "folder": "/real-estate-hero-frames",
      "pattern": "/real-estate-hero-frames/frame-{index}.webp",
      "frameCount": 240,
      "aspectRatio": "16:9",
      "alt": "BILEKSA Private Residences — Clifftop Villa Twilight Walkthrough"
    },
    "IMG-02": {
      "type": "static",
      "path": "/images/homepage/IMG-02.webp",
      "aspectRatio": "3:4",
      "alt": "Luxury Living Clifftop Infinity Pool at Twilight",
      "category": "homepage",
      "focalPoint": { "x": 0.5, "y": 0.4 }
    },
    "IMG-06": {
      "type": "static",
      "path": "/images/residences/IMG-06.webp",
      "aspectRatio": "16:9",
      "alt": "The Cliff Villa — Monolithic Clifftop Residence, Cap d'Antibes",
      "category": "residence_flagship",
      "focalPoint": { "x": 0.5, "y": 0.5 }
    },
    "IMG-24": {
      "type": "static",
      "path": "/images/floor-plans/IMG-24.webp",
      "aspectRatio": "4:3",
      "alt": "Precision 2D Architectural Floor Plan Schematic",
      "category": "floor_plan"
    },
    "IMG-26": {
      "type": "model_3d",
      "previewPath": "/images/floor-plans/IMG-26.webp",
      "modelPath": "/models/the-cliff-villa.glb",
      "aspectRatio": "16:9",
      "alt": "Interactive 3D Spatial Walkthrough Model"
    }
  }
}
```

---

## 4. Helper Service Architecture (`src/services/imageService.ts`)

Components will reference assets cleanly by ID rather than hardcoding paths:
```typescript
import { getImageAsset } from '../services/imageService';

// Usage in ResidenceCard.tsx:
const coverImage = getImageAsset('IMG-06');
// Returns: { url: '/images/residences/IMG-06.webp', alt: '...', aspectRatio: '16:9' }
```
This guarantees that when cloning the repository for a new client, updating `imageManifest.json` updates all website imagery simultaneously without touching React component JSX.

