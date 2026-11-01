import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass, Sun, Layers, Shield, Sparkles } from 'lucide-react';
import { useClientConfig } from '../context/ClientConfigContext';
import { getAssetSlotUrl } from '../config/assetSlots';

export const CraftsmanshipPage: React.FC = () => {
  const config = useClientConfig();

  const pillars = [
    {
      title: 'Light as Living Sculpture',
      tagline: 'Solar Orientation & Volumetric Illumination',
      description: 'Calculated building orientation, frameless triple-track glass, and deep structural cantilevers choreograph dynamic natural illumination across daylight cycles while mitigating solar thermal gain.',
      icon: Sun,
      image: getAssetSlotUrl('PROPERTY_INTERIOR_SALON')
    },
    {
      title: 'Noble Materiality',
      tagline: 'Authentic Geological & Timber Provenance',
      description: 'Vein-cut Roman travertine, honed Jura limestone, patinated raw bronze, and sustainable old-growth European oak. Materials chosen for tactile warmth and the capacity to age with graceful dignity over generations.',
      icon: Layers,
      image: getAssetSlotUrl('PROPERTY_GALLERY_MATERIALITY')
    },
    {
      title: 'Dissolving Boundaries',
      tagline: 'Seamless Indoor-Outdoor Topography',
      description: 'Disappearing pocket glazed walls, continuous flush stone flooring, and reflecting water basins dissolve the threshold between internal sanctuaries and coastal or botanical horizons.',
      icon: Compass,
      image: getAssetSlotUrl('PROPERTY_EXTERIOR_POOL')
    },
    {
      title: 'Enduring Legacy Equity',
      tagline: 'Multigenerational Structural Permanence',
      description: 'Monolithic reinforced foundations, subterranean vaulting, independent solar micro-grids, and bioclimatic thermal envelopes built to withstand marine environments and preserve long-term family equity.',
      icon: Shield,
      image: getAssetSlotUrl('PROPERTY_ARCHITECTURAL_ENTRANCE')
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Topographical & Solar Synthesis',
      description: 'Deep microclimate analysis, sightline preservation studies, and solar tracking to determine the optimal residential footprint.'
    },
    {
      step: '02',
      title: 'Volumetric & Acoustic Choreography',
      description: 'Proportioning grand receiving salons, private master quarters, and service corridors for effortless acoustic calm and cross-ventilation.'
    },
    {
      step: '03',
      title: 'Quarry Selection & Master Joinery',
      description: 'Direct quarry inspection of individual limestone and marble blocks, paired with custom atelier bronze and timber fabrication.'
    },
    {
      step: '04',
      title: 'Turnkey Architectural Delivery',
      description: 'Comprehensive structural completion, integrated home automation, landscape maturation, and private client onboarding.'
    }
  ];

  return (
    <div className="w-full bg-[#070C18]/80 backdrop-blur-xl text-white relative z-10">
      {/* 1. Distinctive Editorial Hero */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden border-b border-white/10 px-6 sm:px-8 py-24 sm:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src={getAssetSlotUrl('SECTION_PHILOSOPHY_BG')}
            alt="Architectural Vision Monograph"
            className="w-full h-full object-cover scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070C18] via-[#070C18]/70 to-[#070C18]/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.28em] bg-white/10 text-[#C5A059] border border-white/15 backdrop-blur-md">
            <Sparkles size={12} />
            <span>ARCHITECTURAL MONOGRAPH &amp; VISION</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-white leading-[1.08] tracking-tight">
            The Art of Architectural Permanence
          </h1>

          <p className="text-lg sm:text-xl text-white/85 font-light leading-relaxed max-w-2xl mx-auto">
            We conceive residences as sculptural sanctuaries — balanced between monumental stone, panoramic illumination, and timeless natural topography.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/residences"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#b08d47] text-white font-medium text-xs uppercase tracking-[0.16em] transition-all duration-300 shadow-xl shadow-[#C5A059]/20"
            >
              <span>Explore Available Residences</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs uppercase tracking-[0.16em] text-white transition-all duration-300"
            >
              <span>Private Advisory</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Core Architectural Philosophy Essay */}
      <section className="py-24 sm:py-32 bg-[#181614] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="border-l-2 border-[#C5A059] pl-6 sm:pl-8 py-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#C5A059] block mb-2 font-medium">
              CURATORIAL STATEMENT
            </span>
            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#EFECE6] leading-snug italic">
              "A residence is not an object placed upon the landscape, but an architectural instrument that frames, honors, and celebrates its terrain."
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white/80 font-light text-base sm:text-lg leading-relaxed">
            <p>
              In an era dominated by rapid fabrication and ephemeral trends, {config.brand.brandName} champions architectural restraint. Every private commission begins with deep topographical respect — studying the prevailing sea breezes, midday sun angles, and ancient trees of each site before drawing the first line.
            </p>
            <p className="text-white/70">
              We eliminate decorative excess in favor of bold tectonic purity. Generous ceiling volumes, monolithic masonry, and frameless floor-to-ceiling glass pavilions create tranquil living environments that shield their inhabitants from the noise of the outside world while keeping them intimately connected to nature.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Four Pillars of Architectural Design */}
      <section className="py-24 sm:py-32 bg-[#FAF8F5] text-[#070C18]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#C5A059] mb-3 font-medium">
              <Compass size={13} />
              <span>THE FOUR PILLARS</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#070C18] leading-tight">
              Design Principles &amp; Material Integrity
            </h2>
            <p className="mt-4 text-base text-[#6B655F] leading-relaxed">
              Every detail is engineered with uncompromising standards to foster calm, light, and enduring aesthetic value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden bg-white border border-[#E8E4DC] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#FAF9F6] relative">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#070C18]/85 backdrop-blur-md text-[#C5A059] flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                  </div>

                  <div className="p-8 space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-medium block">
                      {pillar.tagline}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-[#070C18]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B655F] leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. The Commission & Delivery Process */}
      <section className="py-24 sm:py-32 bg-[#070C18] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059]">
              METHODOLOGY &amp; STEWARDSHIP
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white">
              The Residential Commission Journey
            </h2>
            <p className="text-sm sm:text-base text-white/70 font-light max-w-xl mx-auto">
              From initial topographical inspection to final key handover, our advisory protocol ensures complete discretion and rigorous execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#C5A059]/40 transition-all duration-300 space-y-4"
              >
                <span className="font-mono text-2xl text-[#C5A059] font-light block">
                  {step.step}
                </span>
                <h3 className="font-serif text-xl text-white font-light">
                  {step.title}
                </h3>
                <p className="text-xs text-white/70 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Closing Conversion Invitation */}
      <section className="py-20 sm:py-28 bg-[#181614] border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white">
            Experience Our Private Portfolio
          </h2>
          <p className="text-base text-white/70 font-light leading-relaxed">
            Discover our six signature commissions currently available for private acquisition.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/residences"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C5A059] hover:bg-[#b08d47] text-white text-xs uppercase tracking-[0.16em] font-medium transition-colors shadow-lg shadow-[#C5A059]/20"
            >
              <span>Explore The Residences</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-[0.16em] transition-colors border border-white/15"
            >
              <span>Arrange Private Viewing</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
