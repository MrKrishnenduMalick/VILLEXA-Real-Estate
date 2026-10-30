/**
 * BILEKSA PRIVATE RESIDENCES — PROPERTY DATA SERVICE
 * Static, configuration-driven luxury real estate domain service.
 * Operates 100% locally with zero backend dependencies.
 */

import { Property, PropertyFilterOptions, PropertySortOption, PropertyType, AreaMeasurement } from '../types/property';
import { SAMPLE_PROPERTIES, SAMPLE_PROPERTIES_BY_SLUG } from '../config/sampleProperties';
import { getClientConfig, ClientConfig } from '../config/clientConfig';

export const propertyService = {
  /**
   * Retrieves all published residences in defined sort order.
   */
  async getAllProperties(): Promise<Property[]> {
    return [...SAMPLE_PROPERTIES].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  /**
   * Retrieves signature and featured residences for primary showcase.
   */
  async getFeaturedProperties(): Promise<Property[]> {
    return SAMPLE_PROPERTIES
      .filter((p) => p.featured)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },

  /**
   * Retrieves a specific property by its URL-friendly slug.
   */
  async getPropertyBySlug(slug: string): Promise<Property | null> {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();
    return SAMPLE_PROPERTIES_BY_SLUG[cleanSlug] || null;
  },

  /**
   * Retrieves a specific property by its unique identifier.
   */
  async getPropertyById(id: string): Promise<Property | null> {
    if (!id) return null;
    return SAMPLE_PROPERTIES.find((p) => p.id === id) || null;
  },

  /**
   * Filters properties based on multidimensional criteria (type, bedrooms, price, status).
   */
  async filterProperties(filters: PropertyFilterOptions): Promise<Property[]> {
    let result = [...SAMPLE_PROPERTIES];

    if (filters.propertyType && filters.propertyType !== 'all') {
      result = result.filter((p) => p.propertyType === filters.propertyType);
    }

    if (filters.bedrooms && filters.bedrooms !== 'all') {
      result = result.filter((p) => p.bedrooms >= Number(filters.bedrooms));
    }

    if (typeof filters.minPrice === 'number' && !isNaN(filters.minPrice)) {
      result = result.filter((p) => p.price !== null && p.price >= filters.minPrice!);
    }

    if (typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice)) {
      result = result.filter((p) => p.price !== null && p.price <= filters.maxPrice!);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters.featuredOnly) {
      result = result.filter((p) => p.featured);
    }

    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.country.toLowerCase().includes(q) ||
        (p.location.state && p.location.state.toLowerCase().includes(q)) ||
        (p.location.suburb && p.location.suburb.toLowerCase().includes(q)) ||
        p.propertyType.toLowerCase().includes(q) ||
        p.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }

    return result;
  },

  /**
   * Full-text fuzzy search across property title, architectural narrative, and location.
   */
  async searchProperties(query: string): Promise<Property[]> {
    if (!query || query.trim().length === 0) {
      return this.getAllProperties();
    }
    return this.filterProperties({ searchQuery: query });
  },

  /**
   * Sorts properties by price, featured order, or alphabetical name.
   */
  sortProperties(properties: Property[], sortBy: PropertySortOption): Property[] {
    const list = [...properties];
    switch (sortBy) {
      case 'price_asc':
        return list.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return a.price - b.price;
        });
      case 'price_desc':
        return list.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return b.price - a.price;
        });
      case 'area_desc':
        return list.sort((a, b) => b.builtUpArea.value - a.builtUpArea.value);
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return list.sort((a, b) => {
          if (a.featured !== b.featured) {
            return a.featured ? -1 : 1;
          }
          return a.sortOrder - b.sortOrder;
        });
    }
  },

  /**
   * Formats property price respecting luxury real estate norms (Crores for INR, standard for USD/EUR).
   */
  formatPrice(property: Property, configOverride?: Partial<ClientConfig>): string {
    const config = configOverride || getClientConfig();

    if (!config?.features?.enablePriceDisplay || !property.showPricePublicly || property.isEnquiryOnly || property.price === null) {
      return 'Price Upon Request';
    }

    const currency = property.currency || 'INR';

    if (currency === 'INR') {
      const cr = property.price / 10000000;
      if (cr >= 1) {
        const formattedCr = cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2);
        return `₹${formattedCr} Cr`;
      }
      const lakh = property.price / 100000;
      return `₹${lakh.toFixed(2)} Lakh`;
    }

    if (currency === 'USD') {
      return `$${property.price.toLocaleString('en-US')}`;
    }

    if (currency === 'EUR') {
      return `€${property.price.toLocaleString('de-DE')}`;
    }

    if (currency === 'AED') {
      return `AED ${property.price.toLocaleString('en-US')}`;
    }

    return `${currency} ${property.price.toLocaleString()}`;
  },

  /**
   * Formats area measurement with proper spatial unit notation.
   */
  formatArea(area: AreaMeasurement): string {
    if (!area || typeof area.value !== 'number') return '';
    const formatted = area.value.toLocaleString();
    switch (area.unit) {
      case 'sqft':
        return `${formatted} sq.ft.`;
      case 'sqm':
        return `${formatted} sq.m.`;
      case 'acres':
        return `${formatted} acres`;
      default:
        return `${formatted} ${area.unit}`;
    }
  },

  /**
   * Provides unique property types with counts for dynamic filtering chips.
   */
  getPropertyTypes(): { type: PropertyType; label: string; count: number }[] {
    const labels: Record<PropertyType, string> = {
      villa: 'Architectural Villas',
      penthouse: 'Sky Penthouses',
      waterfront: 'Waterfront Residences',
      estate: 'Private Estates',
      apartment: 'Luxury Apartments',
      residential_development: 'Residential Enclaves'
    };

    const counts = SAMPLE_PROPERTIES.reduce((acc, p) => {
      acc[p.propertyType] = (acc[p.propertyType] || 0) + 1;
      return acc;
    }, {} as Record<PropertyType, number>);

    return (Object.keys(labels) as PropertyType[]).map((type) => ({
      type,
      label: labels[type],
      count: counts[type] || 0
    }));
  },

  /**
   * Retrieves related residences matching same typology or location, excluding current slug.
   */
  async getRelatedProperties(currentSlug: string, limit = 3): Promise<Property[]> {
    const current = await this.getPropertyBySlug(currentSlug);
    if (!current) {
      return (await this.getAllProperties()).slice(0, limit);
    }
    const all = await this.getAllProperties();
    const candidates = all.filter((p) => p.slug !== current.slug);
    
    // Prioritize same propertyType, then others
    const sameType = candidates.filter((p) => p.propertyType === current.propertyType);
    const otherType = candidates.filter((p) => p.propertyType !== current.propertyType);
    
    return [...sameType, ...otherType].slice(0, limit);
  },

  /**
   * Retrieves previous and next residences in portfolio sort order for seamless navigation.
   */
  async getAdjacentProperties(currentSlug: string): Promise<{ prev: Property | null; next: Property | null }> {
    const all = await this.getAllProperties();
    const currentIndex = all.findIndex((p) => p.slug === currentSlug);
    if (currentIndex === -1) {
      return { prev: null, next: null };
    }
    const prev = currentIndex > 0 ? all[currentIndex - 1] : all[all.length - 1];
    const next = currentIndex < all.length - 1 ? all[currentIndex + 1] : all[0];
    return { prev, next };
  }
};

