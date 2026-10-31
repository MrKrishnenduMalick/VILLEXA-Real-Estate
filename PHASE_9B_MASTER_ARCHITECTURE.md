# PHASE 9B — MASTER TEMPLATE ARCHITECTURE & CLONING SYSTEM

**Project:** BILEKSA Private Residences  
**Working Directory:** `d:\VILLEXA - Real Estate\VILLEXA-MAIN-main`  
**Execution Timestamp:** 2026-10-31T11:07:30+05:30  
**Business Workflow:** BUILD ONCE → CLONE → CUSTOMISE → TEST → DEPLOY.

---

## 1. Core Architectural Paradigm

BILEKSA is engineered as a **White-Label Master Real-Estate Platform**. 
- It is **not** a multi-tenant shared SaaS where multiple clients share a single database and frontend.
- Instead, every client receives their own **independent Git repository**, **independent static build**, **bespoke media assets**, and **isolated deployment** on their own custom domain (e.g. `clientname-residences.com`).

```
                              ┌─────────────────────────────────────────┐
                              │     BILEKSA MASTER TEMPLATE REPO        │
                              │   (d:\VILLEXA - Real Estate\...)        │
                              └────────────────────┬────────────────────┘
                                                   │
                       ┌───────────────────────────┼───────────────────────────┐
                       ▼                           ▼                           ▼
          ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
          │  CLIENT A: CAP D'ANTIBES│ │  CLIENT B: MONACO SKY   │ │  CLIENT C: ASPEN LODGES │
          │  - Cap D'Antibes Brand  │ │  - Monaco Penthouse UI  │ │  - Alpine Chalet Theme  │
          │  - Local EUR Residences │ │  - EUR High-Rise Assets │ │  - USD Mountain Assets  │
          │  - Independent Repo     │ │  - Independent Repo     │ │  - Independent Repo     │
          │  - Vercel/Netlify Deploy│ │  - Cloudflare Pages     │ │  - AWS S3 / CloudFront  │
          └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
```

---

## 2. The 3-Tier Configuration Boundary

To make client onboarding instantaneous and error-free, all client-specific data is decoupled from the React component tree and consolidated into three clean configuration boundaries:

### Tier 1: Brand & Theme (`src/config/clientBranding.json`)
Controls brand name, logo typography, accent colors, typography pairings, contact concierge, and WhatsApp liaison:
```json
{
  "brandName": "BILEKSA",
  "legalEntity": "BILEKSA Private Residences Ltd.",
  "tagline": "Architectural Sanctuaries",
  "theme": {
    "primaryBg": "#FAF8F5",
    "surfaceBg": "#FFFFFF",
    "textPrimary": "#1A1816",
    "textSecondary": "#6E6860",
    "accentGold": "#B89552",
    "borderColor": "#EAE5DC"
  },
  "contact": {
    "conciergeEmail": "concierge@bileksa.com",
    "whatsAppNumber": "918004821980",
    "headquarters": "Mayfair, London · Cap d'Antibes"
  }
}
```

### Tier 2: Real-Estate Properties Registry (`src/config/properties.json`)
The canonical registry of all luxury residences. Contains zero hardcoded React code:
```json
[
  {
    "id": "res-01",
    "slug": "the-cliff-villa",
    "name": "The Cliff Villa",
    "typology": "villa",
    "tagline": "Monolithic Clifftop Limestone Sanctuary",
    "price": { "amount": 28500000, "currency": "EUR", "display": "€28,500,000" },
    "location": { "suburb": "Cap d'Antibes", "city": "Antibes", "country": "France" },
    "specs": { "bedrooms": 6, "bathrooms": 8, "internalAreaM2": 1450, "groundsAreaM2": 2800 },
    "assetMapping": {
      "coverImageId": "IMG-06",
      "exteriorGallery": ["IMG-12", "IMG-13", "IMG-14", "IMG-15"],
      "interiorGallery": ["IMG-16", "IMG-17", "IMG-18", "IMG-19"],
      "floorPlan2D": "IMG-24",
      "floorPlan3D": "IMG-25"
    }
  }
]
```

### Tier 3: Media Asset Manifest (`src/config/imageManifest.json`)
Maps logical asset IDs (IMG-01 to IMG-43) to local files or CDN endpoints.

---

## 3. Client Cloning & Customization Lifecycle

The deployment procedure for any new real-estate client consists of 5 deterministic steps:

1. **Clone Master Template:**
   ```bash
   git clone git@github.com:bileksa/master-template.git client-monaco-estates
   cd client-monaco-estates
   git remote set-url origin git@github.com:client/monaco-estates.git
   ```
2. **Execute Onboarding Customization Script:**
   ```bash
   node scripts/setup-client.mjs --name "MONACO RESIDENCES" --whatsapp "37798000000" --currency "EUR"
   ```
3. **Drop Client Media into `public/images/`:**
   - Overwrite or populate `public/images/residences/`, `homepage/`, `amenities/`.
   - Update `src/config/imageManifest.json`.
4. **Validate Preflight Config:**
   ```bash
   npm run validate:config --production
   ```
5. **Compile & Deploy:**
   ```bash
   npm run build
   # Deploy dist/ to client's CDN or static hosting provider (Vercel, Cloudflare, Netlify, AWS S3)
   ```

---

## 4. Preservation of Master Codebase Integrity

- **Code Updates:** When improvements (e.g. Three.js optimizations, accessibility fixes) are made to the master repository, client repositories can cleanly merge upstream changes using standard Git tracking:
  ```bash
  git remote add upstream git@github.com:bileksa/master-template.git
  git fetch upstream
  git merge upstream/main --allow-unrelated-histories
  ```
- Because client-specific data is strictly isolated inside `src/config/*.json` and `public/images/`, there are zero merge conflicts in core components or stylesheets.

