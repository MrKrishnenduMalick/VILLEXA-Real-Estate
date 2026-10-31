/**
 * BILEKSA PRIVATE RESIDENCES — CENTRALIZED ASSET SLOT SYSTEM
 *
 * This system associates website sections and property galleries with predefined
 * asset slots. Every asset slot has:
 *  1. An AI-generated photorealistic demo asset in `public/assets/demo/`
 *  2. A dedicated client override path in `public/assets/client/`
 *
 * Clients can replace demo assets with real property media using the CLI workflow:
 *   `node scripts/manage-client-assets.mjs map <SLOT_ID> <path-to-file>`
 *
 * This requires zero manual code modifications or broken URLs.
 */

export type AssetCategory =
  | 'hero'
  | 'property'
  | 'interior'
  | 'pool_landscape'
  | 'terrace'
  | 'gallery'
  | 'section'
  | 'page';

export type AssetSlotId =
  | 'HERO_CINEMATIC'
  | 'HERO_FINAL_FRAME'
  | 'PROPERTY_EXTERIOR_PRIMARY'
  | 'PROPERTY_ARCHITECTURAL_ENTRANCE'
  | 'PROPERTY_INTERIOR_SALON'
  | 'PROPERTY_INTERIOR_KITCHEN'
  | 'PROPERTY_INTERIOR_MASTER_BEDROOM'
  | 'PROPERTY_EXTERIOR_POOL'
  | 'PROPERTY_INTERIOR_BATHROOM'
  | 'PROPERTY_DINING_TERRACE'
  | 'PROPERTY_GALLERY_ATRIUM'
  | 'PROPERTY_GALLERY_WINE_VAULT'
  | 'PROPERTY_GALLERY_MATERIALITY'
  | 'SECTION_SANCTUARY_BG'
  | 'SECTION_PHILOSOPHY_BG';

export interface AssetSlotDefinition {
  id: AssetSlotId;
  name: string;
  category: AssetCategory;
  description: string;
  format: string;
  dimensions: string;
  demoPath: string;
  clientOverridePath?: string | null;
  activePath: string;
}

export const ASSET_SLOTS: Record<AssetSlotId, AssetSlotDefinition> = {
  HERO_CINEMATIC: {
    id: 'HERO_CINEMATIC',
    name: 'Hero Cinematic Video & Scroll Sequence',
    category: 'hero',
    description: 'Continuous unbroken camera journey from aerial cliffside approach into the villa glass pavilion.',
    format: 'mp4/webp-sequence',
    dimensions: '1280x720',
    demoPath: '/hero.mp4',
    clientOverridePath: null,
    activePath: '/hero.mp4'
  },
  HERO_FINAL_FRAME: {
    id: 'HERO_FINAL_FRAME',
    name: 'Hero Final Frame / Persistent Background',
    category: 'hero',
    description: 'The exact final frame (Frame 240) of the cinematic sequence, serving as the persistent background across all 7 website routes.',
    format: 'webp',
    dimensions: '1280x720',
    demoPath: '/assets/demo/hero-final-frame.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/hero-final-frame.webp'
  },
  PROPERTY_EXTERIOR_PRIMARY: {
    id: 'PROPERTY_EXTERIOR_PRIMARY',
    name: 'Primary Villa Exterior & Approach',
    category: 'property',
    description: 'Monolithic limestone Mediterranean villa exterior approach at golden hour, reflecting pool, architectural landscaping.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-exterior-approach.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-exterior-approach.webp'
  },
  PROPERTY_ARCHITECTURAL_ENTRANCE: {
    id: 'PROPERTY_ARCHITECTURAL_ENTRANCE',
    name: 'Architectural Entrance Facade',
    category: 'property',
    description: 'Monumental villa entrance facade featuring oversized pivot door in champagne bronze and weathered cedar, Roman travertine columns.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-architectural-entrance.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-architectural-entrance.webp'
  },
  PROPERTY_INTERIOR_SALON: {
    id: 'PROPERTY_INTERIOR_SALON',
    name: 'Grand Salon / Living Room',
    category: 'interior',
    description: 'Double-height living salon, monolithic honed travertine bookmatched fireplace wall, floor-to-ceiling glass framing ocean sunset.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-interior-living-salon.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-interior-living-salon.webp'
  },
  PROPERTY_INTERIOR_KITCHEN: {
    id: 'PROPERTY_INTERIOR_KITCHEN',
    name: 'Architectural Chef Kitchen',
    category: 'interior',
    description: 'Minimalist chef kitchen with monolithic Calacatta marble island, fluted smoked oak cabinetry, champagne bronze fixtures.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-interior-kitchen.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-interior-kitchen.webp'
  },
  PROPERTY_INTERIOR_MASTER_BEDROOM: {
    id: 'PROPERTY_INTERIOR_MASTER_BEDROOM',
    name: 'Master Sanctuary Suite',
    category: 'interior',
    description: 'Serene master bedroom suite, Belgian oat linen bed, fluted oak headboard, sliding glass opening to sea-view travertine terrace.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-interior-master-bedroom.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-interior-master-bedroom.webp'
  },
  PROPERTY_EXTERIOR_POOL: {
    id: 'PROPERTY_EXTERIOR_POOL',
    name: 'Infinity Pool & Sunken Fire Lounge',
    category: 'pool_landscape',
    description: '25-meter infinity reflection pool at twilight, cantilevered limestone terrace, sunken travertine fire-pit lounge.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-exterior-pool-landscape.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-exterior-pool-landscape.webp'
  },
  PROPERTY_INTERIOR_BATHROOM: {
    id: 'PROPERTY_INTERIOR_BATHROOM',
    name: 'Limestone Spa Master Bathroom',
    category: 'interior',
    description: 'Freestanding oval stone soaking tub overlooking private bamboo zen atrium, honed travertine walls, brushed champagne fixtures.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-interior-spa-bathroom.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-interior-spa-bathroom.webp'
  },
  PROPERTY_DINING_TERRACE: {
    id: 'PROPERTY_DINING_TERRACE',
    name: 'Outdoor Shaded Dining Loggia',
    category: 'terrace',
    description: 'Covered travertine terrace with 12-seater travertine dining table, cantilevered pergola, sunset ocean horizon.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-interior-dining-terrace.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-interior-dining-terrace.webp'
  },
  PROPERTY_GALLERY_ATRIUM: {
    id: 'PROPERTY_GALLERY_ATRIUM',
    name: 'Internal Courtyard Atrium',
    category: 'gallery',
    description: 'Open-air courtyard with ancient sculptural olive tree set in river stone bed, surrounded by minimal glass corridors.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-gallery-atrium.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-gallery-atrium.webp'
  },
  PROPERTY_GALLERY_WINE_VAULT: {
    id: 'PROPERTY_GALLERY_WINE_VAULT',
    name: 'Glass Wine Vault & Tasting Gallery',
    category: 'gallery',
    description: 'Minimalist climate-controlled glass wine vault with backlit amber travertine bottle niches and monolithic dark oak tasting table.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-gallery-wine-vault.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-gallery-wine-vault.webp'
  },
  PROPERTY_GALLERY_MATERIALITY: {
    id: 'PROPERTY_GALLERY_MATERIALITY',
    name: 'Architectural Materiality Detail',
    category: 'gallery',
    description: 'Macro detail of fluted smoked oak, Roman travertine, and champagne bronze shadowline reveal.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/property-gallery-materiality.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/property-gallery-materiality.webp'
  },
  SECTION_SANCTUARY_BG: {
    id: 'SECTION_SANCTUARY_BG',
    name: 'Sanctuary Section Architectural Texture',
    category: 'section',
    description: 'Monolithic Roman travertine colonnade, soft diagonal golden hour sunbeams, reflecting pool.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/section-sanctuary-bg.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/section-sanctuary-bg.webp'
  },
  SECTION_PHILOSOPHY_BG: {
    id: 'SECTION_PHILOSOPHY_BG',
    name: 'Architectural Philosophy Atelier Backdrop',
    category: 'section',
    description: 'Architectural study and design atelier at dusk with marble drafting table, travertine villa model, warm bronze task light.',
    format: 'webp',
    dimensions: '1920x1072',
    demoPath: '/assets/demo/section-philosophy-bg.webp',
    clientOverridePath: null,
    activePath: '/assets/demo/section-philosophy-bg.webp'
  }
};

/**
 * Retrieve the active URL for a given asset slot.
 * Returns client override if present, otherwise returns the high-end demo asset.
 */
export function getAssetSlotUrl(slotId: AssetSlotId): string {
  const slot = ASSET_SLOTS[slotId];
  if (!slot) return '';
  return slot.clientOverridePath || slot.activePath || slot.demoPath;
}

/**
 * Returns all asset slot definitions.
 */
export function getAllAssetSlots(): Record<AssetSlotId, AssetSlotDefinition> {
  return ASSET_SLOTS;
}
