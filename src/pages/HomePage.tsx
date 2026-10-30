import React, { useEffect, useState } from 'react';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { CinematicHeroScroll } from '../components/home/CinematicHeroScroll';
import { BrandIntroduction } from '../components/home/BrandIntroduction';
import { TypologyShowcase } from '../components/home/TypologyShowcase';
import { SignatureResidencesSection } from '../components/home/SignatureResidencesSection';
import { CinematicVideoSection } from '../components/home/CinematicVideoSection';
import { ArchitecturalVisionSection } from '../components/home/ArchitecturalVisionSection';
import { LifestyleSection } from '../components/home/LifestyleSection';
import { PrivateViewingCTA } from '../components/home/PrivateViewingCTA';

export const HomePage: React.FC = () => {
  const [leadProperty, setLeadProperty] = useState<Property | null>(null);
  const [secondaryProperties, setSecondaryProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const all = await propertyService.getAllProperties();
        const aurelia = all.find((p) => p.slug === 'the-aurelia-estate') || all[0] || null;
        const secondaries = all.filter((p) => p.slug !== aurelia?.slug).slice(0, 3);
        setLeadProperty(aurelia);
        setSecondaryProperties(secondaries);
      } catch (err) {
        console.error('Failed to load homepage residences:', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1A1816]">
      {/* 1. PRESERVED 240-FRAME SCROLL-CONTROLLED CINEMATIC HERO SEQUENCE */}
      <CinematicHeroScroll />

      {/* 2. BRAND INTRODUCTION — SPACES BEYOND THE ORDINARY */}
      <BrandIntroduction />

      {/* 3. ARCHITECTURAL TYPOLOGIES SHOWCASE */}
      <TypologyShowcase />

      {/* 4. SIGNATURE RESIDENCES (THE AURELIA ESTATE & FEATURED COMMISSIONS) */}
      <SignatureResidencesSection
        leadProperty={leadProperty}
        secondaryProperties={secondaryProperties}
      />

      {/* 5. CINEMATIC PROPERTY SHOWCASE — 16:9 ARCHITECTURAL FILM SCREENING */}
      <CinematicVideoSection />

      {/* 6. ARCHITECTURAL VISION & MATERIAL CRAFT */}
      <ArchitecturalVisionSection />

      {/* 7. CURATED LIFESTYLE & LIVING EXPERIENCE */}
      <LifestyleSection />

      {/* 8. PRIVATE CLIENT VIEWING & CONCIERGE CTA */}
      <PrivateViewingCTA />
    </div>
  );
};
