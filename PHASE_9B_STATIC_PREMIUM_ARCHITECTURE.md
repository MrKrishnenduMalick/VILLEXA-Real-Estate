# PHASE 9B — STATIC VS PREMIUM DIGITAL PLATFORM ARCHITECTURE

**Project:** BILEKSA Private Residences  
**Working Directory:** `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main`  
**Execution Timestamp:** 2026-10-31T11:08:00+05:30  
**Scope:** Coexistence of Mode A (Static Showcase) and Mode B (Digital Platform) via the Repository Pattern.

---

## 1. The Two Operating Modes

| Dimension | MODE A — STATIC ARCHITECTURE (Default) | MODE B — PREMIUM DIGITAL PLATFORM |
| :--- | :--- | :--- |
| **Target Client** | Boutique brokerages, single-development microsites, private family offices. | Major international development firms, luxury brokerage networks. |
| **Data Source** | `src/config/properties.json` & static JSON | PostgreSQL / SQLite / Supabase / REST API |
| **Media Hosting** | Local `public/images/` or static CDN | Cloudflare R2 / AWS S3 / Supabase Storage |
| **Enquiries** | Direct WhatsApp Web / Click-to-chat & mailto | Database lead capture + Email notifications + CRM webhook |
| **Admin Panel** | None (Code editor / JSON edits) | Web-based Admin Portal (`/admin`) with secure login |
| **Authentication**| None (100% public static pages) | JWT / Session-based role auth (Admin, Agent, Client) |
| **Server Cost** | **$0 / month** (Host on Cloudflare Pages, Vercel, Netlify) | $20 – $100 / month (API server, database instance) |

---

## 2. Clean Integration Boundary: The Repository Pattern

To ensure the exact same React components work seamlessly in both Mode A and Mode B without branching `if (mode === 'api')` in JSX, we introduce abstract TypeScript repository interfaces:

```
                            ┌──────────────────────────────────────┐
                            │        REACT UI COMPONENTS           │
                            │ (CataloguePage, ResidenceCard, etc.) │
                            └──────────────────┬───────────────────┘
                                               │
                                               ▼
                            ┌──────────────────────────────────────┐
                            │          PROPERTY REPOSITORY         │
                            │              INTERFACE               │
                            └──────────┬────────────────┬──────────┘
                                       │                │
                ┌──────────────────────┘                └──────────────────────┐
                ▼                                                              ▼
 ┌───────────────────────────────┐                             ┌───────────────────────────────┐
 │   StaticPropertyRepository    │                             │     ApiPropertyRepository     │
 │  - Reads properties.json      │                             │  - Calls /api/properties      │
 │  - Zero backend dependencies  │                             │  - Dynamic filtering on DB    │
 │  - Instant offline loading    │                             │  - Admin CRUD support         │
 └───────────────────────────────┘                             └───────────────────────────────┘
```

---

## 3. Abstract Repository Interfaces

### 3.1 Property Repository Interface (`src/repositories/types/PropertyRepository.ts`)
```typescript
import { Property, PropertyFilterQuery, PropertySortOption } from '../../types/property';

export interface PropertyRepository {
  getAllProperties(): Promise<Property[]>;
  getPropertyBySlug(slug: string): Promise<Property | null>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  queryProperties(query: PropertyFilterQuery, sort: PropertySortOption): Promise<Property[]>;
  getAdjacentProperties(slug: string): Promise<{ prev: Property | null; next: Property | null }>;
  getRelatedProperties(slug: string, limit?: number): Promise<Property[]>;
}
```

### 3.2 Enquiry Repository Interface (`src/repositories/types/EnquiryRepository.ts`)
```typescript
export interface PrivateEnquiry {
  propertyId?: string;
  propertyName?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientJurisdiction?: string;
  preferredContactMethod: 'whatsapp' | 'email' | 'phone';
  message: string;
}

export interface EnquiryRepository {
  submitEnquiry(enquiry: PrivateEnquiry): Promise<{ success: boolean; enquiryId?: string; error?: string }>;
  generateWhatsAppLink(enquiry: Partial<PrivateEnquiry>): string;
}
```

### 3.3 Media Storage Provider (`src/repositories/types/MediaStorageProvider.ts`)
```typescript
export interface MediaStorageProvider {
  resolveUrl(assetId: string): string;
  uploadMedia?(file: File, path: string): Promise<{ url: string; assetId: string }>;
}
```

---

## 4. Mode Selection & Inversion of Control

The application dynamically instantiates the correct repository at startup based on a single configuration switch in `src/config/siteConfig.json`:

```typescript
// src/repositories/index.ts
import { siteConfig } from '../config/siteConfig';
import { StaticPropertyRepository } from './static/StaticPropertyRepository';
import { ApiPropertyRepository } from './api/ApiPropertyRepository';
import { PropertyRepository } from './types/PropertyRepository';

export const propertyRepository: PropertyRepository = 
  siteConfig.architectureMode === 'api'
    ? new ApiPropertyRepository(siteConfig.apiBaseUrl)
    : new StaticPropertyRepository();
```

### Mode A Implementation (Static)
- Bundles `properties.json` directly into the build.
- `getAllProperties()` returns an in-memory resolved promise.
- `queryProperties()` performs fast client-side filtering and sorting.
- Zero network latency, 100% offline resilient.

### Mode B Implementation (API / Database)
- Leverages the preserved backend scaffolding in `_archive_backend/`.
- Fetches real-time property inventory from REST or GraphQL endpoints.
- Enables optional live lead capture into PostgreSQL.

---

## 5. Architectural Coexistence Guarantee

1. **Default Mode:** Every repository starts in **Mode A (Static)**.
2. **Upgrade Path:** Clients who purchase the Premium Package can enable Mode B simply by setting `"architectureMode": "api"` and deploying the companion Node.js/PostgreSQL microservice from `_archive_backend/`.
3. **No Code Forking:** The master frontend remains unified across all clients.

