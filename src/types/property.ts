/**
 * BILEKSA PRIVATE RESIDENCES — PROPERTY DOMAIN TYPES
 * Scalable, configuration-driven luxury real estate domain model.
 */

export type PropertyType = 
  | 'villa'
  | 'penthouse'
  | 'waterfront'
  | 'estate'
  | 'apartment'
  | 'residential_development';

export type PropertyStatus = 
  | 'available'
  | 'reserved'
  | 'sold'
  | 'under_construction'
  | 'private_listing';

export interface AreaMeasurement {
  value: number;
  unit: 'sqft' | 'sqm' | 'acres';
}

export interface PropertyLocation {
  city: string;
  state?: string;
  country: string;
  region?: string;
  suburb?: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PropertyMediaItem {
  id: string;
  url: string;
  caption?: string;
  category?: 'exterior' | 'interior' | 'aerial' | 'terrace' | 'amenity' | 'view';
  isFeatured?: boolean;
  altText: string;
}

export interface PropertyVideoItem {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl?: string;
  durationSeconds?: number;
  videoType?: 'walkthrough' | 'drone_aerial' | 'architectural_film';
}

export interface PropertyFloorPlan {
  id: string;
  level: string; // e.g. "Ground Level", "First Level", "Rooftop Terrace"
  title: string;
  planImageUrl: string;
  pdfUrl?: string;
  dimensions?: {
    length: number;
    width: number;
    unit: 'ft' | 'm';
  };
  area?: AreaMeasurement;
  description?: string;
}

export interface Property3DModel {
  modelUrl: string;
  format: 'glb' | 'gltf';
  cameraDistance?: number;
  autoRotate?: boolean;
  posterUrl?: string;
}

export interface PropertySpecificationItem {
  category: string; // e.g., "Structure", "Fenestration", "Finishes", "Climate Control", "Home Automation"
  items: {
    label: string;
    value: string;
  }[];
}

export interface PropertyBrochure {
  title: string;
  fileUrl: string;
  fileSizeFormatted?: string;
  requiresEnquiry?: boolean;
}

export interface PropertyEnquiryConfig {
  conciergeEmail?: string;
  whatsappMessage?: string;
  privateViewingAvailable: boolean;
  advisoryDirector?: string;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  architecturalNarrative?: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  
  // Location
  location: PropertyLocation;
  address: string;
  
  // Pricing & Commercial
  price: number | null; // null represents "Price Upon Request"
  currency: string;     // ISO 4217 currency code: 'INR', 'USD', 'EUR', 'AED'
  priceDisplayPrefix?: string; // e.g., "Starting from", "Price Upon Request", "Guide Price"
  showPricePublicly: boolean;
  isEnquiryOnly: boolean;

  // Spatial Dimensions & Metrics
  bedrooms: number;
  bathrooms: number;
  powderRooms?: number;
  parkingSpaces: number;
  carpetArea: AreaMeasurement;
  builtUpArea: AreaMeasurement;
  plotArea?: AreaMeasurement;
  ceilingHeightFt?: number;
  completionYear?: number;
  
  // Display Flags & Categorisation
  featured: boolean;
  signatureEstate?: boolean;
  sortOrder: number;

  // Visual Assets
  coverImage: string;
  gallery: PropertyMediaItem[];
  videos?: PropertyVideoItem[];
  floorPlans?: PropertyFloorPlan[];
  model3D?: Property3DModel;

  // Curated Lifestyle & Technical Features
  amenities: string[];
  specifications: PropertySpecificationItem[];
  locationHighlights: string[];
  
  // Collateral & Concierge
  brochure?: PropertyBrochure;
  enquiryConfig?: PropertyEnquiryConfig;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilterOptions {
  propertyType?: PropertyType | 'all';
  bedrooms?: number | 'all';
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  featuredOnly?: boolean;
  status?: PropertyStatus | 'all';
}

export type PropertySortOption = 
  | 'price_asc' 
  | 'price_desc' 
  | 'featured' 
  | 'name_asc'
  | 'area_desc';

