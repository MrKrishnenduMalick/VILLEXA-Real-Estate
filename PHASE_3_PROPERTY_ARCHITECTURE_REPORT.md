# PHASE 3 — REAL ESTATE PROPERTY DATA ARCHITECTURE REPORT

## 1. Executive Summary

Phase 3 establishes a scalable, configuration-driven, and strictly typed property domain architecture for **BILEKSA PRIVATE RESIDENCES**. 

The architecture is entirely static and runs 100% in the frontend without databases, Supabase, or external server dependencies. It provides the foundational data modeling, client configuration, and domain services required for Phase 4 (Property Catalogue) and Phase 5 (Property Detail Pages).

All six sample demonstration residences pass comprehensive schema, continuity, and defensive validation rules with **zero errors**.

---

## 2. Domain Data Model Architecture

The property data model is defined in `src/types/property.ts`:

```
┌─────────────────────────────────────────────────────────────────┐
│                           Property                              │
├─────────────────────────────────────────────────────────────────┤
│ id: string                      slug: string                    │
│ name: string                    tagline: string                 │
│ description: string             architecturalNarrative?: string │
│ propertyType: PropertyType      status: PropertyStatus          │
│ price: number | null            currency: string                │
│ priceDisplayPrefix?: string     showPricePublicly: boolean      │
│ isEnquiryOnly: boolean          bedrooms: number                │
│ bathrooms: number               powderRooms?: number            │
│ parkingSpaces: number           carpetArea: AreaMeasurement     │
│ builtUpArea: AreaMeasurement    plotArea?: AreaMeasurement      │
│ ceilingHeightFt?: number        completionYear?: number         │
│ featured: boolean               signatureEstate?: boolean       │
│ sortOrder: number               coverImage: string              │
├─────────────────────────────────────────────────────────────────┤
│ location: PropertyLocation                                      │
│ gallery: PropertyMediaItem[]                                    │
│ videos?: PropertyVideoItem[]                                    │
│ floorPlans?: PropertyFloorPlan[]                                │
│ model3D?: Property3DModel                                       │
│ amenities: string[]                                             │
│ specifications: PropertySpecificationItem[]                     │
│ locationHighlights: string[]                                    │
│ brochure?: PropertyBrochure                                     │
│ enquiryConfig?: PropertyEnquiryConfig                           │
└─────────────────────────────────────────────────────────────────┘
```

### Key Type Definitions
1. **`PropertyType`**: `'villa' | 'penthouse' | 'waterfront' | 'estate' | 'apartment' | 'residential_development'`
2. **`PropertyStatus`**: `'available' | 'reserved' | 'sold' | 'under_construction' | 'private_listing'`
3. **`AreaMeasurement`**: `{ value: number; unit: 'sqft' | 'sqm' | 'acres' }`
4. **`PropertyLocation`**: `{ city: string; state?: string; country: string; suburb?: string; coordinates?: { latitude: number; longitude: number } }`
5. **`PropertyFloorPlan`**: `{ id: string; level: string; title: string; planImageUrl: string; area?: AreaMeasurement; description?: string }`
6. **`PropertySpecificationItem`**: Categorized technical architectural specifications (e.g. "Structure & Facade", "Interior Finishes", "Climate Control").

---

## 3. Property Data Service (`src/services/propertyService.ts`)

The service exposes a clean, asynchronous-ready API that mimics production data fetching while executing synchronously and deterministically in-memory:

| Method | Signature | Purpose |
| :--- | :--- | :--- |
| `getAllProperties` | `() => Promise<Property[]>` | Returns all residences sorted by `sortOrder`. |
| `getFeaturedProperties` | `() => Promise<Property[]>` | Returns signature estates and featured residences for hero/homepage highlights. |
| `getPropertyBySlug` | `(slug: string) => Promise<Property \| null>` | Case-insensitive and whitespace-tolerant slug lookup for routing. |
| `getPropertyById` | `(id: string) => Promise<Property \| null>` | Direct identifier retrieval. |
| `filterProperties` | `(filters: PropertyFilterOptions) => Promise<Property[]>` | Multi-criteria filtering by property type, bedroom count, price range, and status. |
| `searchProperties` | `(query: string) => Promise<Property[]>` | Full-text fuzzy search across title, tagline, city, country, amenities, and typologies. |
| `sortProperties` | `(properties: Property[], sortBy: PropertySortOption) => Property[]` | Sorts by price ascending/descending, built-up area, alphabetical name, or featured precedence. |
| `formatPrice` | `(property: Property, config?: ClientConfig) => string` | Luxury real estate price formatting: Crores (`₹38 Cr`), Lakhs, USD (`$4.5M`), or "Price Upon Request". |
| `formatArea` | `(area: AreaMeasurement) => string` | Spatial measurement formatting with proper localized units (`14,500 sq.ft.`). |
| `getPropertyTypes` | `() => { type: PropertyType; label: string; count: number }[]` | Dynamic category count chips for catalogue filter headers. |

---

## 4. Client Customization & Configuration

The client configuration system in `src/config/clientConfig.ts` was expanded to provide centralized real estate control:

- **New Feature Flags**:
  - `enableFloorPlans: boolean` (Controls whether floor plan blueprints are rendered).
  - `enableBrochureDownload: boolean` (Controls monograph/brochure PDF actions).
- **Environment Variable Overrides**:
  - `VITE_FEATURE_FLOOR_PLANS`
  - `VITE_FEATURE_BROCHURE_DOWNLOAD`
- **Commercial & Contact Details**:
  - WhatsApp concierge messaging pre-configured with bespoke property acquisition greetings.
  - Advisory director contact email and flagship gallery address centrally inherited.

---

## 5. Defensive Schema Validation (`src/utils/propertyValidation.ts`)

To ensure no malformed data or broken images enter the digital experience, `validateProperty` and `validatePropertyDataset` enforce:
- Slug format validation (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`).
- Absolute/root-relative cover image and gallery URL validation.
- Non-negative price and spatial metrics.
- Dataset-level duplicate slug detection.
- Graceful handling of optional assets: missing 3D models or floor plans never break rendering.

