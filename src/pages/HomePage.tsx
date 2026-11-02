import React from 'react';
import { CinematicHeroScroll } from '../components/home/CinematicHeroScroll';
import { FeaturedResidencesSection } from '../components/home/FeaturedResidencesSection';
import { CollectionsShowcaseSection } from '../components/home/CollectionsShowcaseSection';
import { ExperienceShowcaseSection } from '../components/home/ExperienceShowcaseSection';
import { PrivateViewingFooterSection } from '../components/home/PrivateViewingFooterSection';

export const HomePage: React.FC = () => {
  return (
    <div
      className="homepage-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'transparent'
      }}
    >
      {/* SECTION 1 — PRESERVED 240-FRAME CINEMATIC HERO SEQUENCE */}
      <CinematicHeroScroll />

      {/* CONTINUOUS MARBLE VEIN & AURIC FLOW LUXURY ENVIRONMENT */}
      <div
        className="homepage-editorial-flow marble-vein-backdrop"
        style={{
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden'
        }}
      >
        {/* Auric Flow Top Corner Framing (Signature Metallic-Gold Wave) */}
        <div className="auric-ribbon-top-right" />

        {/* Auric Flow Mid-Page Left Ribbon Accent */}
        <div
          className="desktop-only-ribbon"
          style={{
            position: 'absolute',
            top: '860px',
            left: 0,
            width: '520px',
            height: '340px',
            backgroundImage: 'url(/assets/auric-flow-gold-ribbon.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'scaleX(-1) rotate(180deg)',
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
            opacity: 0.85,
            zIndex: 1
          }}
        />

        {/* SECTION 2 — FEATURED RESIDENCES (THREE COMPLETE PROPERTY CARDS) */}
        <FeaturedResidencesSection />

        {/* SECTION 3 — OUR COLLECTIONS (COASTAL, SKYLINE, HERITAGE) */}
        <CollectionsShowcaseSection />

        {/* SECTION 4 — THE VILLEXA EXPERIENCE (CINEMATIC VIDEO & 4 BADGES) */}
        <ExperienceShowcaseSection />

        {/* SECTION 5 — PRIVATE VIEWING AND COMPACT FOOTER */}
        <PrivateViewingFooterSection />
      </div>
    </div>
  );
};
