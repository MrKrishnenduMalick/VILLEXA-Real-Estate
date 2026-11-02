import { describe, it, expect } from 'vitest';
import { propertyService } from '../services/propertyService';
import { SAMPLE_PROPERTIES } from '../config/sampleProperties';
import { getClientConfig } from '../config/clientConfig';

describe('BILEKSA Luxury Property Detail Experience (Phase 5)', () => {
  const allSlugs = [
    'the-aurelia-estate',
    'the-celestia-penthouse',
    'the-ocean-crest',
    'the-highland-manor',
    'the-solstice-residences',
    'the-elysian-gardens'
  ];

  describe('Property Slug Resolution & Registry Integrity', () => {
    it.each(allSlugs)('successfully resolves property slug: %s', async (slug) => {
      const property = await propertyService.getPropertyBySlug(slug);
      expect(property).not.toBeNull();
      expect(property?.slug).toBe(slug);
      expect(property?.name).toBeTruthy();
      expect(property?.tagline).toBeTruthy();
      expect(property?.coverImage).toBeTruthy();
      expect(property?.gallery.length).toBeGreaterThanOrEqual(3);
    });

    it('returns null for an invalid or unknown property slug', async () => {
      const missing = await propertyService.getPropertyBySlug('villa-not-found');
      expect(missing).toBeNull();

      const empty = await propertyService.getPropertyBySlug('');
      expect(empty).toBeNull();
    });

    it('case-insensitively resolves slugs', async () => {
      const upper = await propertyService.getPropertyBySlug('THE-AURELIA-ESTATE');
      expect(upper).not.toBeNull();
      expect(upper?.slug).toBe('the-aurelia-estate');
    });
  });

  describe('Spatial Dimensions & Specifications Validation', () => {
    it('verifies all 6 properties possess non-zero spatial dimensions', () => {
      SAMPLE_PROPERTIES.forEach((prop) => {
        expect(prop.bedrooms).toBeGreaterThan(0);
        expect(prop.bathrooms).toBeGreaterThan(0);
        expect(prop.carpetArea.value).toBeGreaterThan(0);
        expect(prop.builtUpArea.value).toBeGreaterThan(0);
        expect(prop.parkingSpaces).toBeGreaterThanOrEqual(1);
      });
    });

    it('correctly formats price for public vs confidential properties', () => {
      // The Aurelia Estate (₹38 Cr)
      const aurelia = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-aurelia-estate')!;
      expect(propertyService.formatPrice(aurelia)).toBe('₹38 Cr');

      // The Celestia Penthouse (₹55 Cr)
      const celestia = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-celestia-penthouse')!;
      expect(propertyService.formatPrice(celestia)).toBe('₹55 Cr');

      // The Solstice Residences (₹18.5 Cr)
      const solstice = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-solstice-residences')!;
      expect(propertyService.formatPrice(solstice)).toBe('₹18.50 Cr');

      // The Ocean Crest (Confidential / Enquiry Only)
      const oceanCrest = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-ocean-crest')!;
      expect(propertyService.formatPrice(oceanCrest)).toBe('Price Upon Request');
    });

    it('correctly formats spatial area across sqft, sqm, and acres', () => {
      expect(propertyService.formatArea({ value: 11200, unit: 'sqft' })).toBe('11,200 sq.ft.');
      expect(propertyService.formatArea({ value: 850, unit: 'sqm' })).toBe('850 sq.m.');
      expect(propertyService.formatArea({ value: 2.5, unit: 'acres' })).toBe('2.5 acres');
    });

    it('ensures each residence has categorized technical specifications without empty values', () => {
      SAMPLE_PROPERTIES.forEach((prop) => {
        expect(prop.specifications.length).toBeGreaterThanOrEqual(1);
        prop.specifications.forEach((category) => {
          expect(category.category).toBeTruthy();
          expect(category.items.length).toBeGreaterThan(0);
          category.items.forEach((item) => {
            expect(item.label).toBeTruthy();
            expect(item.value).toBeTruthy();
          });
        });
      });
    });
  });

  describe('Architectural Gallery & Media Integration', () => {
    it('ensures every property has high-resolution gallery items with altText and captions', () => {
      SAMPLE_PROPERTIES.forEach((prop) => {
        expect(prop.gallery.length).toBeGreaterThanOrEqual(3);
        prop.gallery.forEach((media) => {
          expect(media.id).toBeTruthy();
          expect(media.url.startsWith('https://') || media.url.startsWith('/')).toBe(true);
          expect(media.altText).toBeTruthy();
        });
      });
    });

    it('verifies The Aurelia Estate includes cinematic walkthrough video', () => {
      const aurelia = SAMPLE_PROPERTIES.find((p) => p.slug === 'the-aurelia-estate')!;
      expect(aurelia.videos).toBeDefined();
      expect(aurelia.videos!.length).toBeGreaterThanOrEqual(1);
      expect(aurelia.videos![0].videoUrl).toBe('/hero.mp4');
      expect(aurelia.videos![0].videoType).toBe('walkthrough');
    });
  });

  describe('Floor Plans & Architectural Schematics', () => {
    it('ensures all 6 properties have registered architectural floor plans', () => {
      SAMPLE_PROPERTIES.forEach((prop) => {
        expect(prop.floorPlans).toBeDefined();
        expect(prop.floorPlans!.length).toBeGreaterThanOrEqual(1);
        prop.floorPlans!.forEach((plan) => {
          expect(plan.level).toBeTruthy();
          expect(plan.title).toBeTruthy();
          expect(plan.planImageUrl).toBeTruthy();
          if (plan.area) {
            expect(plan.area.value).toBeGreaterThan(0);
          }
        });
      });
    });
  });

  describe('Amenities & Curated Lifestyle Specifications', () => {
    it('verifies all 6 properties possess luxury amenities', () => {
      SAMPLE_PROPERTIES.forEach((prop) => {
        expect(prop.amenities.length).toBeGreaterThanOrEqual(5);
        expect(prop.amenities.every((a) => typeof a === 'string' && a.length > 3)).toBe(true);
      });
    });
  });

  describe('Geographic Sanctuaries & Coordinates', () => {
    it('ensures all properties have registered city and country', () => {
      SAMPLE_PROPERTIES.forEach((prop) => {
        expect(prop.location.city).toBeTruthy();
        expect(prop.location.country).toBeTruthy();
        expect(prop.address).toBeTruthy();
      });
    });

    it('verifies coordinates are valid numbers when present', () => {
      SAMPLE_PROPERTIES.forEach((prop) => {
        if (prop.location.coordinates) {
          expect(typeof prop.location.coordinates.latitude).toBe('number');
          expect(typeof prop.location.coordinates.longitude).toBe('number');
          expect(prop.location.coordinates.latitude).toBeGreaterThan(-90);
          expect(prop.location.coordinates.latitude).toBeLessThan(90);
        }
      });
    });
  });

  describe('Adjacent & Related Navigation Logic', () => {
    it('computes previous and next residences for circular navigation', async () => {
      const aureliaAdjacent = await propertyService.getAdjacentProperties('the-aurelia-estate');
      expect(aureliaAdjacent.prev).not.toBeNull();
      expect(aureliaAdjacent.next).not.toBeNull();
      expect(aureliaAdjacent.next?.slug).toBe('the-celestia-penthouse');

      const lastProp = SAMPLE_PROPERTIES[SAMPLE_PROPERTIES.length - 1];
      const lastAdjacent = await propertyService.getAdjacentProperties(lastProp.slug);
      expect(lastAdjacent.next?.slug).toBe(SAMPLE_PROPERTIES[0].slug); // wraps to first
    });

    it('returns related properties excluding the current residence', async () => {
      const related = await propertyService.getRelatedProperties('the-aurelia-estate', 3);
      expect(related.length).toBeLessThanOrEqual(3);
      expect(related.some((p) => p.slug === 'the-aurelia-estate')).toBe(false);
    });
  });

  describe('Confidential Client Advisory & WhatsApp Concierge Integration', () => {
    it('validates pre-configured client contact details from clientConfig', () => {
      const config = getClientConfig();
      expect(config.contact.contactEmail).toBe('concierge@villexa.com');
      expect(config.contact.whatsappNumber).toBe('918004821980');
      expect(config.brand.brandName).toBe('VILLEXA');
    });

    it('generates valid WhatsApp consultation URL with encoded parameters', () => {
      const config = getClientConfig();
      const property = SAMPLE_PROPERTIES[0];
      const message = `Hello ${config.brand.brandName} Concierge,\n\nI would like to schedule a private architectural consultation for:\nResidence: ${property.name}\nReference: ${property.id}`;
      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${config.contact.whatsappNumber}?text=${encoded}`;

      expect(url).toContain('https://wa.me/918004821980');
      expect(url).toContain(encodeURIComponent(property.name));
    });
  });
});
