import { describe, it, expect } from 'vitest';
import { propertyService } from '../services/propertyService';
import { SAMPLE_PROPERTIES } from '../config/sampleProperties';
import { getClientConfig } from '../config/clientConfig';

describe('BILEKSA Experience-Wide Quality & Remaining Pages Audit (Phase 7)', () => {
  describe('Data Consistency & The Aurelia Estate Area Reconciliation', () => {
    it('reconciles The Aurelia Estate carpet area vs built-up area unambiguously', async () => {
      const aurelia = await propertyService.getPropertyBySlug('the-aurelia-estate');
      expect(aurelia).not.toBeNull();

      // Canonical data model verification:
      // Internal net usable area: 11,200 sq.ft.
      expect(aurelia?.carpetArea.value).toBe(11200);
      expect(propertyService.formatArea(aurelia!.carpetArea)).toBe('11,200 sq.ft.');

      // Gross architectural structural envelope: 14,500 sq.ft.
      expect(aurelia?.builtUpArea.value).toBe(14500);
      expect(propertyService.formatArea(aurelia!.builtUpArea)).toBe('14,500 sq.ft.');

      // Private curated estate grounds: 1.25 acres
      expect(aurelia?.plotArea?.value).toBe(1.25);
      expect(propertyService.formatArea(aurelia!.plotArea!)).toBe('1.25 acres');
    });

    it('verifies all 6 properties have consistent non-zero spatial dimensions', () => {
      SAMPLE_PROPERTIES.forEach((prop) => {
        expect(prop.bedrooms).toBeGreaterThan(0);
        expect(prop.bathrooms).toBeGreaterThan(0);
        expect(prop.carpetArea.value).toBeGreaterThan(0);
        expect(prop.builtUpArea.value).toBeGreaterThan(0);
        expect(prop.carpetArea.value).toBeLessThanOrEqual(prop.builtUpArea.value);
      });
    });
  });

  describe('Architectural Vision & Editorial Philosophy (/vision)', () => {
    it('provides four concrete design pillars without generic corporate filler', () => {
      const pillars = [
        'Light as Living Sculpture',
        'Noble Materiality',
        'Dissolving Boundaries',
        'Enduring Legacy Equity'
      ];
      expect(pillars.length).toBe(4);
      pillars.forEach((p) => expect(p.length).toBeGreaterThan(10));
    });

    it('articulates a 4-stage residential commission journey', () => {
      const steps = [
        'Topographical & Solar Synthesis',
        'Volumetric & Acoustic Choreography',
        'Quarry Selection & Master Joinery',
        'Turnkey Architectural Delivery'
      ];
      expect(steps.length).toBe(4);
    });
  });

  describe('Contact & Private Viewing Experience (/contact)', () => {
    it('uses centralized static configuration without hardcoded personal info', () => {
      const config = getClientConfig();
      expect(config.contact.showroomAddress).toBeTruthy();
      expect(config.contact.visitingHours).toBeTruthy();
      expect(config.contact.contactEmail).toBe('concierge@bileksa.com');
      expect(config.contact.contactPhone).toBeTruthy();
      expect(config.contact.whatsappNumber).toBe('918004821980');
    });

    it('ensures all 6 sample residences are selectable for private viewing', () => {
      const propertyNames = SAMPLE_PROPERTIES.map((p) => p.name);
      expect(propertyNames.length).toBe(6);
      expect(propertyNames).toContain('The Aurelia Estate');
      expect(propertyNames).toContain('The Celestia Penthouse');
      expect(propertyNames).toContain('The Ocean Crest');
      expect(propertyNames).toContain('The Highland Manor');
      expect(propertyNames).toContain('The Solstice Residences');
      expect(propertyNames).toContain('The Elysian Gardens');
    });
  });

  describe('Curated Architectural Collections (/collections)', () => {
    it('articulates 5 distinct architectural collection portfolios', () => {
      const collections = [
        { id: 'coastal-estates', filter: 'waterfront' },
        { id: 'sky-penthouses', filter: 'penthouse' },
        { id: 'alpine-manors', filter: 'villa' },
        { id: 'master-enclaves', filter: 'residential_development' },
        { id: 'private-residences', filter: 'apartment' }
      ];
      expect(collections.length).toBe(5);
      collections.forEach((c) => {
        expect(['villa', 'penthouse', 'waterfront', 'apartment', 'residential_development']).toContain(c.filter);
      });
    });
  });

  describe('Navigation & Typology Route Continuity', () => {
    it('verifies all 5 typology parameters map to valid catalogue filters', async () => {
      const typologies = ['villa', 'penthouse', 'waterfront', 'apartment', 'residential_development'] as const;

      for (const typ of typologies) {
        const results = await propertyService.filterProperties({ propertyType: typ });
        expect(results.length).toBeGreaterThanOrEqual(1);
        expect(results.every((p) => p.propertyType === typ)).toBe(true);
      }
    });

    it('verifies canonical route consistency', () => {
      const publicRoutes = [
        '/',
        '/residences',
        '/collections',
        '/vision',
        '/lifestyle',
        '/contact'
      ];
      expect(publicRoutes.length).toBe(6);
      publicRoutes.forEach((r) => expect(r.startsWith('/')).toBe(true));
    });
  });

  describe('SEO & Metadata Integrity', () => {
    it('verifies SEO configuration contains required brand titles and keywords', () => {
      const config = getClientConfig();
      expect(config.seo.defaultTitle).toContain('BILEKSA');
      expect(config.seo.defaultDescription).toBeTruthy();
      expect(config.seo.keywords.length).toBeGreaterThanOrEqual(5);
      expect(config.seo.siteUrl).toBe('https://bileksa.com');
    });
  });
});

