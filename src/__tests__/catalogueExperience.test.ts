import { describe, it, expect } from 'vitest';
import { propertyService } from '../services/propertyService';
import { SAMPLE_PROPERTIES } from '../config/sampleProperties';

describe('BILEKSA Premium Property Catalogue & Cards Experience', () => {
  describe('Catalogue Filtering Mechanics', () => {
    it('returns all 6 residences when category filter is "all"', async () => {
      const results = await propertyService.filterProperties({ propertyType: 'all' });
      expect(results.length).toBe(6);
    });

    it('correctly filters for luxury villas', async () => {
      const villas = await propertyService.filterProperties({ propertyType: 'villa' });
      expect(villas.length).toBe(2); // The Aurelia Estate & The Highland Manor
      expect(villas.every((v) => v.propertyType === 'villa')).toBe(true);
    });

    it('correctly filters for sky penthouses', async () => {
      const penthouses = await propertyService.filterProperties({ propertyType: 'penthouse' });
      expect(penthouses.length).toBe(1);
      expect(penthouses[0].slug).toBe('the-celestia-penthouse');
    });

    it('correctly filters for waterfront estates', async () => {
      const waterfront = await propertyService.filterProperties({ propertyType: 'waterfront' });
      expect(waterfront.length).toBe(1);
      expect(waterfront[0].slug).toBe('the-ocean-crest');
    });

    it('correctly filters for luxury apartments', async () => {
      const apts = await propertyService.filterProperties({ propertyType: 'apartment' });
      expect(apts.length).toBe(1);
      expect(apts[0].slug).toBe('the-solstice-residences');
    });

    it('correctly filters for residential enclaves', async () => {
      const enclaves = await propertyService.filterProperties({ propertyType: 'residential_development' });
      expect(enclaves.length).toBe(1);
      expect(enclaves[0].slug).toBe('the-elysian-gardens');
    });
  });

  describe('Multi-Criteria Filtering & Search Combinations', () => {
    it('correctly combines propertyType and bedroom threshold', async () => {
      const sixBedVillas = await propertyService.filterProperties({
        propertyType: 'villa',
        bedrooms: 6
      });
      expect(sixBedVillas.length).toBe(1);
      expect(sixBedVillas[0].slug).toBe('the-aurelia-estate');
    });

    it('filters properties within price brackets', async () => {
      // Under ₹30 Cr (< 300,000,000)
      const under30Cr = await propertyService.filterProperties({ maxPrice: 300000000 });
      expect(under30Cr.length).toBe(2); // Highland Manor (₹28 Cr) & Solstice (₹18.5 Cr)
      expect(under30Cr.every((p) => p.price !== null && p.price <= 300000000)).toBe(true);

      // Above ₹50 Cr (> 500,000,000)
      const above50Cr = await propertyService.filterProperties({ minPrice: 500000000 });
      expect(above50Cr.length).toBe(2); // Celestia (₹55 Cr) & Elysian Gardens (₹62 Cr)
      expect(above50Cr.every((p) => p.price !== null && p.price >= 500000000)).toBe(true);
    });

    it('combines location search and price filter cleanly', async () => {
      const goaFiltered = await propertyService.filterProperties({
        searchQuery: 'Goa',
        maxPrice: 400000000
      });
      // The Aurelia Estate is ₹38 Cr (<= ₹40 Cr). Ocean Crest is null/enquiry-only so excluded from numeric maxPrice
      expect(goaFiltered.length).toBe(1);
      expect(goaFiltered[0].slug).toBe('the-aurelia-estate');
    });

    it('returns empty array when no property matches strict criteria', async () => {
      const empty = await propertyService.filterProperties({
        propertyType: 'penthouse',
        minPrice: 800000000 // ₹80 Cr (none exist)
      });
      expect(empty.length).toBe(0);
    });
  });

  describe('Sorting Behavior', () => {
    it('sorts properties by price: High to Low (null prices last)', () => {
      const sorted = propertyService.sortProperties(SAMPLE_PROPERTIES, 'price_desc');
      expect(sorted[0].name).toBe('The Elysian Gardens'); // ₹62 Cr
      expect(sorted[1].name).toBe('The Celestia Penthouse'); // ₹55 Cr
      expect(sorted[sorted.length - 1].name).toBe('The Solstice Residences'); // ₹18.5 Cr
    });

    it('sorts properties by price: Low to High (null prices last)', () => {
      const sorted = propertyService.sortProperties(SAMPLE_PROPERTIES, 'price_asc');
      expect(sorted[0].name).toBe('The Solstice Residences'); // ₹18.5 Cr
      expect(sorted[1].name).toBe('The Highland Manor'); // ₹28 Cr
      expect(sorted[sorted.length - 1].name).toBe('The Elysian Gardens'); // ₹62 Cr
    });

    it('sorts properties by built-up area descending', () => {
      const sorted = propertyService.sortProperties(SAMPLE_PROPERTIES, 'area_desc');
      expect(sorted[0].name).toBe('The Elysian Gardens'); // 16,200 sq.ft.
      expect(sorted[1].name).toBe('The Aurelia Estate'); // 14,500 sq.ft.
      expect(sorted[sorted.length - 1].builtUpArea.value).toBe(6100); // The Solstice
    });
  });

  describe('Property Card Content & Formatting Verification', () => {
    it('formats price in Crores with proper currency symbol', () => {
      const aurelia = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-aurelia-estate')!;
      expect(propertyService.formatPrice(aurelia)).toBe('₹38 Cr');

      const solstice = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-solstice-residences')!;
      expect(propertyService.formatPrice(solstice)).toBe('₹18.50 Cr');
    });

    it('formats area with thousands separators and unit suffix', () => {
      const aurelia = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-aurelia-estate')!;
      expect(propertyService.formatArea(aurelia.builtUpArea)).toBe('14,500 sq.ft.');
    });

    it('provides valid image URLs for all property cards', () => {
      SAMPLE_PROPERTIES.forEach((p) => {
        expect(p.coverImage).toMatch(/^https?:\/\//);
        expect(p.gallery.length).toBeGreaterThanOrEqual(3);
      });
    });
  });
});
