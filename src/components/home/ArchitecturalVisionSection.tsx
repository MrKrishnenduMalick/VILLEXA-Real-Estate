import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass, Sun, Layers, ShieldCheck } from 'lucide-react';

export const ArchitecturalVisionSection: React.FC = () => {
  const pillars = [
    {
      title: 'Light as Material',
      description: 'Calculated solar orientations, frameless three-track glazing, and deep cantilever overhangs choreograph dynamic natural illumination across all seasons.',
      icon: Sun
    },
    {
      title: 'Noble Materiality',
      description: 'Hand-honed Roman travertine, fluted European oak, bookmatched marble, and patinated bronze chosen to age with graceful dignity over generations.',
      icon: Layers
    },
    {
      title: 'Landscape Integration',
      description: 'Dissolving boundaries between interior sanctuaries and native terrain through reflecting pools, sunken courtyards, and continuous stone floors.',
      icon: Compass
    },
    {
      title: 'Enduring Legacy Equity',
      description: 'Brutal precision engineering, subterranean structural stability, and sustainable off-grid micro-utilities built for multidecadal family stewardship.',
      icon: ShieldCheck
    }
  ];

  return (
    <section id="architectural-vision" className="py-28 sm:py-36 bg-[#FAF8F5] text-[#1A1816] border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
          {/* Left Column: Asymmetrical Double Image Composition (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative space-y-4">
              <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-[#EAE5DC] shadow-xl border border-[#DCD5C9]">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85"
                  alt="Travertine Architectural Living"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-[#EAE5DC] shadow-lg ml-8 sm:ml-12 -mt-8 relative z-10 border-4 border-[#FAF8F5]">
                <img
                  src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=85"
                  alt="Minimalist Architectural Kitchen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-[#B89552] font-semibold mb-3">
                <Compass size={13} />
                <span>ARCHITECTURAL PHILOSOPHY</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#1A1816] leading-tight">
                Crafted at the Intersection of Sculpture and Shelter
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#3D3934] font-light leading-relaxed">
              We reject the superficial ornamentation of mass luxury. Instead, BILEKSA residences celebrate pure structural form, heroic spatial volumes, and the sensory calm of authentic, unembellished materials.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#EAE5DC]">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#B89552]/30 text-[#B89552] flex items-center justify-center shrink-0">
                        <Icon size={17} />
                      </div>
                      <h3 className="font-serif text-xl font-normal text-[#1A1816]">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#6E6860] font-light leading-relaxed pl-12">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/vision"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#B89552] hover:text-[#9E7D3B] font-semibold transition-colors"
              >
                <span>Read Full Architectural Monograph</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
