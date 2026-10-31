import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { EmptyState } from '../components/common/EmptyState';

// Luxury Real Estate Property Components
import { PropertyHero } from '../components/property/PropertyHero';
import { PropertySpecs } from '../components/property/PropertySpecs';
import { PropertyNarrative } from '../components/property/PropertyNarrative';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { PropertyVideoTour } from '../components/property/PropertyVideoTour';
import { PropertyFloorPlans } from '../components/property/PropertyFloorPlans';
import { PropertyAmenities } from '../components/property/PropertyAmenities';
import { PropertyLocation } from '../components/property/PropertyLocation';
import { PropertyEnquirySection } from '../components/property/PropertyEnquirySection';
import { PropertyAdjacentNav } from '../components/property/PropertyAdjacentNav';

export const ProductDetailPage: React.FC = () => {
  const [, residenceParams] = useRoute('/residence/:slug');
  const [, residencesParams] = useRoute('/residences/:slug');
  const [, productParams] = useRoute('/product/:slug');
  const slug = residenceParams?.slug || residencesParams?.slug || productParams?.slug || '';

  const [property, setProperty] = useState<Property | null>(null);
  const [adjacentProps, setAdjacentProps] = useState<{ prev: Property | null; next: Property | null }>({ prev: null, next: null });
  const [relatedProps, setRelatedProps] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) {
        setIsLoading(false);
        return;
      }
      try {
        const foundProperty = await propertyService.getPropertyBySlug(slug);
        if (foundProperty) {
          setProperty(foundProperty);
          const [adjacent, related] = await Promise.all([
            propertyService.getAdjacentProperties(slug),
            propertyService.getRelatedProperties(slug, 3)
          ]);
          setAdjacentProps(adjacent);
          setRelatedProps(related);
        } else {
          setProperty(null);
        }
      } catch (err) {
        console.error('Failed to load residence detail:', err);
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--space-24) 0', textAlign: 'center' }}>
        <span className="kicker">LOCATING ARCHITECTURAL RESIDENCE...</span>
      </div>
    );
  }

  // Bespoke Luxury Real Estate Property Experience
  if (property) {
    return (
      <div className="w-full bg-[#FAF8F5] min-h-screen text-[#1A1816]">
        {/* 1. Full-Width Architectural Hero Introduction */}
        <PropertyHero property={property} />

        {/* 2. Structured Architectural Specifications Bar */}
        <PropertySpecs property={property} />

        {/* 3. Deep Architectural Narrative */}
        <PropertyNarrative property={property} />

        {/* 4. Curated Fullscreen Architectural Gallery */}
        <PropertyGallery
          propertyName={property.name}
          coverImage={property.coverImage}
          gallery={property.gallery}
        />

        {/* 5. Cinema-Grade Video Tour */}
        <PropertyVideoTour
          propertyName={property.name}
          videos={property.videos}
          defaultPoster={property.coverImage}
        />

        {/* 6. Precision Architectural Floor Plans */}
        <PropertyFloorPlans
          propertyName={property.name}
          floorPlans={property.floorPlans}
        />

        {/* 7. Comprehensive Amenities Grid */}
        <PropertyAmenities amenities={property.amenities} />

        {/* 8. Regional Context & Surrounding Sanctuary Map */}
        <PropertyLocation
          propertyName={property.name}
          location={property.location}
          address={property.address}
          highlights={property.locationHighlights}
        />

        {/* 9. Adjacent Sequential Property Navigation */}
        <PropertyAdjacentNav
          currentProperty={property}
          prevProperty={adjacentProps.prev}
          nextProperty={adjacentProps.next}
          relatedProperties={relatedProps}
        />

        {/* 10. Private Confidential Consultation & Viewing Scheduler */}
        <PropertyEnquirySection property={property} />
      </div>
    );
  }

  // Residence Not Found in Registry
  return (
    <div style={{ padding: 'var(--space-24) 0' }}>
      <div className="container">
        <EmptyState
          type="catalogue"
          title="Residence Outside Registry"
          description="The architectural residence or private estate reference you requested does not exist."
          actionLabel="Return to Master Residences"
          actionHref="/residences"
        />
      </div>
    </div>
  );
};
