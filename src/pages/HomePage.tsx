import React, { useEffect, useState } from 'react';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { CinematicHeroScroll } from '../components/home/CinematicHeroScroll';
import { BrandIntroduction } from '../components/home/BrandIntroduction';
import { FlagshipResidenceSection } from '../components/home/FlagshipResidenceSection';
import { CuratedCollectionSection } from '../components/home/CuratedCollectionSection';
import { ArchitecturalVisionSection } from '../components/home/ArchitecturalVisionSection';
import { LifestyleSection } from '../components/home/LifestyleSection';
import { CollectionsPreviewSection } from '../components/home/CollectionsPreviewSection';
import { PrivateViewingCTA } from '../components/home/PrivateViewingCTA';

export const HomePage: React.FC = () => {
  const [leadProperty, setLeadProperty] = useState<Property | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const all = await propertyService.getAllProperties();
        const aurelia = all.find((p) => p.slug === 'the-aurelia-estate') || all[0] || null;
        setLeadProperty(aurelia);
      } catch (err) {
        console.error('Failed to load homepage residences:', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="homepage-root">
      {/* LOCKED APPROVED 240-FRAME SCROLL-CONTROLLED CINEMATIC HERO SEQUENCE */}
      <CinematicHeroScroll />

      {/* CONTINUOUS AMBIENT ARCHITECTURAL ENVIRONMENT FOR EDITORIAL GLASS SECTIONS */}
      <div className="homepage-ambient-backdrop" aria-hidden="true">
        <div className="ambient-architectural-media" />
        <div className="ambient-warm-scrim" />
      </div>

      {/* EDITORIAL GLASS CONTAINER FLOATING ABOVE ARCHITECTURAL ENVIRONMENT */}
      <div className="homepage-editorial-flow">
        {/* SECTION 1 — ARCHITECTURAL INTRODUCTION & EDITORIAL FLOATING SLAB */}
        <BrandIntroduction />

        {/* SECTION 2 — FLAGSHIP RESIDENCE: THE CLIFF VILLA */}
        <FlagshipResidenceSection leadProperty={leadProperty} />

        {/* SECTION 3 — CURATED RESIDENCE COLLECTION (FIVE MASTERWORKS) */}
        <CuratedCollectionSection />

        {/* SECTION 4 — ARCHITECTURAL PHILOSOPHY: STONE, LIGHT & LANDSCAPE */}
        <ArchitecturalVisionSection />

        {/* SECTION 5 — SANCTUARY & LIVING PREVIEW (WELLNESS, POOLS, SALONS) */}
        <LifestyleSection />

        {/* SECTION 6 — CURATED LIFESTYLE & COLLECTIONS PREVIEW + 4K SCREENING */}
        <CollectionsPreviewSection />

        {/* SECTION 7 — PRIVATE VIEWING INVITATION & ADVISORY CONCIERGE */}
        <PrivateViewingCTA />
      </div>
    </div>
  );
};
