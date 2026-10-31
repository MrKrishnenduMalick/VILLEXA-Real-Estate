import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass } from 'lucide-react';

export const ArchitecturalVisionSection: React.FC = () => {
  const pillars = [
    {
      number: '01',
      title: 'Solar Choreography',
      subTitle: 'Light as Material',
      description: 'Calculated solar azimuth orientation, deep structural cantilevers, and triple-track frameless glass orchestrate natural diurnal illumination while eliminating thermal gain.'
    },
    {
      number: '02',
      title: 'Geological Permanence',
      subTitle: 'Noble Materiality',
      description: 'Vein-cut Roman travertine, honed Jura limestone, patinated raw bronze, and European oak. Noble organic materials selected to mature with quiet dignity across generations.'
    },
    {
      number: '03',
      title: 'Acoustic Sanctuary',
      subTitle: 'Landscape Integration',
      description: 'Monolithic acoustic ceilings, subterranean master isolation, and flush pocket doors dissolve the boundary between internal peace and open horizon.'
    },
    {
      number: '04',
      title: 'Materiality & Craftsmanship',
      subTitle: 'Enduring Legacy Equity',
      description: 'Precision masonry engineering, subterranean structural permanence, and timeless craftsmanship built for multi-generational stewardship.'
    }
  ];

  return (
    <section id="materiality" className="section-materiality py-12 sm:py-16">
      <div className="container">
        {/* Section Header with Refined Spacing */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-10 gap-8 pb-5 border-b border-[#EAE5DC]">
          <div className="max-w-2xl">
            <span className="eyebrow mb-3">
              <Compass size={13} className="text-[#B89552]" />
              <span>ARCHITECTURAL PHILOSOPHY</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1816] leading-[1.1] tracking-tight mt-2">
              The Dialogue of Stone, Light, and Landscape
            </h2>
            <p className="mt-4 text-base text-[#2B2724] font-normal leading-relaxed max-w-xl">
              We reject the superficial ornamentation of mass luxury. Instead, BILEKSA residences celebrate pure structural form, heroic spatial volumes, and the sensory calm of authentic, unembellished materials.
            </p>
          </div>

          <div className="shrink-0 pb-2">
            <Link
              href="/vision"
              className="btn btn-outline-dark"
            >
              <span>Read Architectural Monograph</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Balanced Architectural Diptych & Narrative Spread */}
        <div className="vision-diptych-grid">
          {/* Left Column: Architectural Photo & Refined Caption Plaque */}
          <div className="space-y-4">
            <div className="border border-[var(--glass-border)] bg-[#EAE5DC] shadow-md overflow-hidden aspect-[4/3] rounded-[4px] backdrop-blur-[16px]">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
                alt="Travertine Architectural Living Volume"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = '/real-estate-hero-frames/frame-00160.webp';
                }}
              />
            </div>

            {/* Uncrowded, Generous Caption Plaque */}
            <div className="p-5 sm:p-6 bg-[var(--glass-strong)] border border-[var(--glass-border)] rounded-[4px] backdrop-blur-[16px] space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DC]/80">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#B89552] font-semibold">
                  Plate 02 · Light Study
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] font-medium bg-white/60 px-2 py-0.5 rounded border border-[#EAE5DC]">
                  Cap d&apos;Antibes
                </span>
              </div>
              <h4 className="font-serif text-lg sm:text-xl text-[#1A1816] font-normal leading-snug">
                The Double-Height Travertine Salon
              </h4>
              <p className="text-xs sm:text-sm text-[#524C44] font-light leading-relaxed">
                Natural diurnal illumination and passive cross-ventilation orchestrated through 7-metre floor-to-ceiling glass.
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Focus on Material Integrity */}
          <div className="space-y-6">
            <div className="border border-[var(--glass-border)] bg-[var(--glass-strong)] p-8 sm:p-10 shadow-sm rounded-[4px] space-y-6 backdrop-blur-[24px]">
              <div>
                <span className="eyebrow text-[#B89552] mb-2 block">NOBLE PROVENANCE</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1816] font-light leading-snug">
                  Raw Roman Travertine &amp; Smoked European Oak
                </h3>
              </div>

              <p className="text-sm sm:text-base text-[#2B2724] leading-relaxed font-light">
                Milled directly from ancestral Italian quarries, each monumental block is hand-selected for veining density and thermal mass. Unsealed and unlacquered, the stone breathes naturally with maritime humidity, acquiring an authentic patina across generations.
              </p>

              {/* Distinct Material Feature Enclosures */}
              <div className="pt-4 border-t border-[#EAE5DC] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#2B2724]">
                <div className="p-4 rounded-[3px] bg-white/60 border border-[#EAE5DC] space-y-1">
                  <span className="block text-[#1A1816] font-semibold text-[11px] uppercase tracking-wider">
                    Acoustic Quiet
                  </span>
                  <p className="text-[11.5px] text-[#524C44] font-light leading-relaxed">
                    Monolithic plaster &amp; isolated subfloors eliminate reverberation.
                  </p>
                </div>
                <div className="p-4 rounded-[3px] bg-white/60 border border-[#EAE5DC] space-y-1">
                  <span className="block text-[#1A1816] font-semibold text-[11px] uppercase tracking-wider">
                    Thermal Inertia
                  </span>
                  <p className="text-[11.5px] text-[#524C44] font-light leading-relaxed">
                    Passive thermal cooling reduces mechanical reliance by up to 64%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Numbered Editorial Content (4 Deliberate Architectural Pillars) */}
        <div>
          <div className="mb-6 pb-2 border-b border-[#EAE5DC]/80 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#B89552] font-semibold block">
              Core Architectural Pillars
            </span>
            <span className="text-xs text-[#8A7E72] font-light">04 Foundational Principles</span>
          </div>

          <div className="pillars-grid">
            {pillars.map((pillar) => (
              <div key={pillar.number} className="pillar-card">
                <div>
                  <div className="pillar-card-header">
                    <span className="pillar-num">{pillar.number}</span>
                    <span className="pillar-sub">
                      {pillar.subTitle}
                    </span>
                  </div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-desc">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
