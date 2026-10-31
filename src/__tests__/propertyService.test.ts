import { describe, it, expect } from 'vitest';
import { propertyService } from '../services/propertyService';
import { SAMPLE_PROPERTIES } from '../config/sampleProperties';
import { validateProperty, validatePropertyDataset } from '../utils/propertyValidation';
import { Property } from '../types/property';

describe('BILEKSA Property Data Architecture & Service', () => {
  describe('Dataset Integrity & Validation', () => {
    it('contains exactly six sample demonstration properties', async () => {
      const properties = await propertyService.getAllProperties();
      expect(properties.length).toBe(6);
    });

    it('passes complete schema and dataset validation with zero errors', () => {
      const result = validatePropertyDataset(SAMPLE_PROPERTIES);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.duplicateSlugs).toEqual([]);
      expect(result.totalChecked).toBe(6);
    });

    it('guarantees unique slugs for all sample properties', () => {
      const slugs = SAMPLE_PROPERTIES.map((p) => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    it('ensures all cover images and gallery images have valid URL format', () => {
      const isValidUrl = (url: string) => url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
      SAMPLE_PROPERTIES.forEach((prop) => {
        expect(isValidUrl(prop.coverImage)).toBe(true);
        expect(prop.gallery.length).toBeGreaterThanOrEqual(3);
        prop.gallery.forEach((media) => {
          expect(media.id).toBeTruthy();
          expect(isValidUrl(media.url)).toBe(true);
          expect(media.altText).toBeTruthy();
        });
      });
    });
  });

  describe('Property Retrieval & Lookup', () => {
    it('retrieves all published properties sorted by sortOrder', async () => {
      const properties = await propertyService.getAllProperties();
      for (let i = 0; i < properties.length - 1; i++) {
        expect(properties[i].sortOrder).toBeLessThanOrEqual(properties[i + 1].sortOrder);
      }
    });

    it('retrieves only featured properties', async () => {
      const featured = await propertyService.getFeaturedProperties();
      expect(featured.length).toBeGreaterThan(0);
      featured.forEach((p) => {
        expect(p.featured).toBe(true);
      });
    });

    it('retrieves an existing property by exact slug', async () => {
      const property = await propertyService.getPropertyBySlug('the-aurelia-estate');
      expect(property).not.toBeNull();
      expect(property?.name).toBe('The Aurelia Estate');
      expect(property?.propertyType).toBe('villa');
      expect(property?.bedrooms).toBe(6);
    });

    it('handles case-insensitive slug lookup with whitespace tolerance', async () => {
      const property = await propertyService.getPropertyBySlug('  THE-CELestia-PENTHOUSE  ');
      expect(property).not.toBeNull();
      expect(property?.slug).toBe('the-celestia-penthouse');
    });

    it('returns null when querying a non-existent slug', async () => {
      const property = await propertyService.getPropertyBySlug('non-existent-palace');
      expect(property).toBeNull();
    });

    it('retrieves an existing property by ID', async () => {
      const property = await propertyService.getPropertyById('res-aurelia-estate-01');
      expect(property).not.toBeNull();
      expect(property?.slug).toBe('the-aurelia-estate');
    });
  });

  describe('Filtering Operations', () => {
    it('filters properties by propertyType', async () => {
      const villas = await propertyService.filterProperties({ propertyType: 'villa' });
      expect(villas.length).toBeGreaterThan(0);
      villas.forEach((v) => {
        expect(v.propertyType).toBe('villa');
      });

      const penthouses = await propertyService.filterProperties({ propertyType: 'penthouse' });
      expect(penthouses.length).toBe(1);
      expect(penthouses[0].slug).toBe('the-celestia-penthouse');
    });

    it('filters properties by minimum bedroom count', async () => {
      const fivePlusBeds = await propertyService.filterProperties({ bedrooms: 5 });
      expect(fivePlusBeds.length).toBeGreaterThan(0);
      fivePlusBeds.forEach((p) => {
        expect(p.bedrooms).toBeGreaterThanOrEqual(5);
      });
    });

    it('filters properties within price range', async () => {
      const range = await propertyService.filterProperties({
        minPrice: 200000000,
        maxPrice: 400000000
      });
      range.forEach((p) => {
        expect(p.price).not.toBeNull();
        expect(p.price!).toBeGreaterThanOrEqual(200000000);
        expect(p.price!).toBeLessThanOrEqual(400000000);
      });
    });

    it('combines multiple filter criteria simultaneously', async () => {
      const filtered = await propertyService.filterProperties({
        propertyType: 'villa',
        bedrooms: 6
      });
      filtered.forEach((p) => {
        expect(p.propertyType).toBe('villa');
        expect(p.bedrooms).toBeGreaterThanOrEqual(6);
      });
    });
  });

  describe('Search Operations', () => {
    it('searches properties by name substring', async () => {
      const results = await propertyService.searchProperties('Aurelia');
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('The Aurelia Estate');
    });

    it('searches properties by location or city', async () => {
      const goaResults = await propertyService.searchProperties('Goa');
      expect(goaResults.length).toBe(2); // The Aurelia Estate and The Ocean Crest
      goaResults.forEach((p) => {
        expect(p.location.state === 'Goa' || p.location.city.includes('Goa')).toBe(true);
      });
    });

    it('searches properties by amenity keyword', async () => {
      const spaResults = await propertyService.searchProperties('Sauna');
      expect(spaResults.length).toBeGreaterThan(0);
      expect(spaResults[0].slug).toBe('the-aurelia-estate');
    });

    it('returns all properties when search query is empty or whitespace', async () => {
      const results = await propertyService.searchProperties('   ');
      expect(results.length).toBe(6);
    });
  });

  describe('Sorting Operations', () => {
    it('sorts properties by price ascending', async () => {
      const all = await propertyService.getAllProperties();
      const sorted = propertyService.sortProperties(all, 'price_asc');
      
      const pricedOnly = sorted.filter((p) => p.price !== null);
      for (let i = 0; i < pricedOnly.length - 1; i++) {
        expect(pricedOnly[i].price!).toBeLessThanOrEqual(pricedOnly[i + 1].price!);
      }
    });

    it('sorts properties by price descending', async () => {
      const all = await propertyService.getAllProperties();
      const sorted = propertyService.sortProperties(all, 'price_desc');
      
      const pricedOnly = sorted.filter((p) => p.price !== null);
      for (let i = 0; i < pricedOnly.length - 1; i++) {
        expect(pricedOnly[i].price!).toBeGreaterThanOrEqual(pricedOnly[i + 1].price!);
      }
    });

    it('sorts properties alphabetically by name', async () => {
      const all = await propertyService.getAllProperties();
      const sorted = propertyService.sortProperties(all, 'name_asc');
      
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].name.localeCompare(sorted[i + 1].name)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('Formatting Helpers', () => {
    it('formats Indian Rupee prices in Crores', () => {
      const sample = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-aurelia-estate')!;
      const formatted = propertyService.formatPrice(sample);
      expect(formatted).toBe('₹38 Cr');
    });

    it('returns "Price Upon Request" when price is hidden or enquiry only', () => {
      const oceanCrest = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-ocean-crest')!;
      const formatted = propertyService.formatPrice(oceanCrest);
      expect(formatted).toBe('Price Upon Request');
    });

    it('formats international currencies correctly', () => {
      const testProp: Property = {
        ...SAMPLE_PROPERTIES[0],
        price: 4500000,
        currency: 'USD',
        showPricePublicly: true,
        isEnquiryOnly: false
      };
      expect(propertyService.formatPrice(testProp)).toBe('$4,500,000');
    });

    it('formats area measurements with proper units', () => {
      expect(propertyService.formatArea({ value: 14500, unit: 'sqft' })).toBe('14,500 sq.ft.');
      expect(propertyService.formatArea({ value: 1.25, unit: 'acres' })).toBe('1.25 acres');
    });
  });

  describe('Defensive Validation of Malformed Entities', () => {
    it('flags missing required fields', () => {
      const invalid = {
        id: '',
        name: 'Incomplete Villa'
      };
      const res = validateProperty(invalid);
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes('"id"'))).toBe(true);
      expect(res.errors.some((e) => e.includes('"slug"'))).toBe(true);
      expect(res.errors.some((e) => e.includes('"propertyType"'))).toBe(true);
    });

    it('flags negative price or invalid propertyType', () => {
      const invalid = {
        ...SAMPLE_PROPERTIES[0],
        price: -5000,
        propertyType: 'spaceship' as any
      };
      const res = validateProperty(invalid);
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes('Invalid price'))).toBe(true);
      expect(res.errors.some((e) => e.includes('propertyType'))).toBe(true);
    });

    it('detects duplicate slugs across a dataset', () => {
      const duplicateDataset = [
        SAMPLE_PROPERTIES[0],
        { ...SAMPLE_PROPERTIES[1], slug: SAMPLE_PROPERTIES[0].slug }
      ];
      const res = validatePropertyDataset(duplicateDataset);
      expect(res.isValid).toBe(false);
      expect(res.duplicateSlugs).toContain(SAMPLE_PROPERTIES[0].slug);
    });
  });
});
