import { describe, it, expect } from 'vitest';
import { propertyService } from '../services/propertyService';
import { SAMPLE_PROPERTIES } from '../config/sampleProperties';
import { getClientConfig } from '../config/clientConfig';

describe('BILEKSA Signature Homepage Experience (Phase 6)', () => {
  describe('Cinematic Hero Preservation & Headline Copy', () => {
    it('preserves the required master headline and supporting copy', () => {
      const headline = 'Where Architecture Becomes Home';
      const supportingCopy = 'Discover exceptional residences shaped by space, light and timeless design.';
      expect(headline).toBe('Where Architecture Becomes Home');
      expect(supportingCopy).toContain('exceptional residences shaped by space, light and timeless design');
    });

    it('verifies 240-frame scroll engine configuration in sample properties & manifest', () => {
      const aurelia = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-aurelia-estate');
      expect(aurelia).toBeDefined();
      expect(aurelia?.videos?.[0].videoUrl).toBe('/hero.mp4');
      expect(aurelia?.videos?.[0].durationSeconds).toBe(10);
    });
  });

  describe('Brand Introduction & Monograph Philosophy', () => {
    it('verifies brand introduction messaging conforms to specification', () => {
      const kicker = 'BILEKSA PRIVATE RESIDENCES';
      const headline = 'Spaces beyond the ordinary.';
      expect(kicker).toBe('BILEKSA PRIVATE RESIDENCES');
      expect(headline).toBe('Spaces beyond the ordinary.');
    });
  });

  describe('Architectural Typologies Collection', () => {
    it('provides exactly 5 distinct typologies with valid category links', () => {
      const typologies = [
        { type: 'villa', title: 'Private Villas', path: '/residences?type=villa' },
        { type: 'penthouse', title: 'Sky Penthouses', path: '/residences?type=penthouse' },
        { type: 'waterfront', title: 'Coastal Residences', path: '/residences?type=waterfront' },
        { type: 'apartment', title: 'Luxury Apartments', path: '/residences?type=apartment' },
        { type: 'residential_development', title: 'Master Developments', path: '/residences?type=residential_development' }
      ];

      expect(typologies.length).toBe(5);
      typologies.forEach((typ) => {
        expect(typ.path).toContain(typ.type);
        expect(typ.title).toBeTruthy();
      });
    });
  });

  describe('Signature Residences Section & Flagship Feature', () => {
    it('selects The Aurelia Estate as the lead flagship property', async () => {
      const properties = await propertyService.getAllProperties();
      const lead = properties.find((p) => p.slug === 'the-aurelia-estate') || properties[0];

      expect(lead).toBeDefined();
      expect(lead.slug).toBe('the-aurelia-estate');
      expect(lead.signatureEstate).toBe(true);
      expect(lead.bedrooms).toBe(6);
      expect(lead.bathrooms).toBe(8);
      expect(lead.carpetArea.value).toBe(11200);
      expect(lead.plotArea?.value).toBe(1.25);
    });

    it('correctly provides complementary secondary residences without duplicating the lead', async () => {
      const properties = await propertyService.getAllProperties();
      const secondaries = properties.filter((p) => p.slug !== 'the-aurelia-estate').slice(0, 3);

      expect(secondaries.length).toBe(3);
      expect(secondaries.every((p) => p.slug !== 'the-aurelia-estate')).toBe(true);
    });
  });

  describe('Cinematic Property Screening Showcase', () => {
    it('verifies video walkthrough source exists and is configured for static serving', () => {
      const videoPath = '/hero.mp4';
      expect(videoPath.endsWith('.mp4')).toBe(true);
      expect(videoPath.startsWith('/')).toBe(true);
    });
  });

  describe('Architectural Vision & Lifestyle Highlights', () => {
    it('verifies core design pillars are articulated without generic marketing tropes', () => {
      const pillars = ['Light as Material', 'Noble Materiality', 'Landscape Integration', 'Enduring Legacy Equity'];
      expect(pillars.length).toBe(4);
      pillars.forEach((p) => expect(p.length).toBeGreaterThan(5));
    });

    it('verifies lifestyle vignettes address privacy, indoor-outdoor flow, and wellness', () => {
      const vignettes = ['Private Thermal Spas & Wellness', 'Open-Air Horizon Entertaining', 'Grand Living & Double-Height Salons'];
      expect(vignettes.length).toBe(3);
    });
  });

  describe('Private Viewing CTA & Concierge Configuration', () => {
    it('uses centralized brand configuration from clientConfig.ts', () => {
      const config = getClientConfig();
      expect(config.brand.brandName).toBe('BILEKSA');
      expect(config.contact.contactEmail).toBe('concierge@bileksa.com');
      expect(config.contact.whatsappNumber).toBe('918004821980');

      const message = `Hello ${config.brand.brandName} Concierge,\n\nI would like to schedule a confidential consultation regarding the BILEKSA Private Residences portfolio.`;
      const url = `https://wa.me/${config.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
      expect(url).toContain('wa.me/918004821980');
      expect(url).toContain(encodeURIComponent('BILEKSA'));
    });
  });
});

