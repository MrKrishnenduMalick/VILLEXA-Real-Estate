import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass, Sparkles, ShieldCheck } from 'lucide-react';

export const BrandIntroduction: React.FC = () => {
  return (
    <section
      id="brand-introduction"
      className="relative z-10 py-28 sm:py-36 bg-[#FAF8F5] text-[#1A1816] overflow-hidden border-t border-[#EAE5DC]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Statement (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-[#B89552] font-semibold mb-4">
                <Sparkles size={13} />
                <span>BILEKSA ARCHITECTURAL REGISTRY</span>
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#1A1816] leading-[1.06] tracking-tight">
                Spaces beyond the ordinary.
              </h2>
            </div>

            <div className="space-y-6 text-[#3D3934] font-light text-base sm:text-lg leading-relaxed max-w-2xl">
              <p>
                Founded on the conviction that true luxury is spatial serenity and architectural permanence. We commission, curate, and represent a limited registry of exceptional private residences across clifftop oceanfronts, high-altitude alpine sanctuaries, and metropolitan penthouses.
              </p>
              <p className="text-[#6E6860] text-base leading-relaxed">
                Every residence embodies an exacting dialogue between raw thermal limestone, frameless panoramic fenestration, and natural landscape choreography. Designed not merely to impress, but to elevate daily life into a continuous architectural experience.
              </p>
            </div>

            {/* Architectural Highlights Row */}
            <div className="pt-2 grid grid-cols-2 gap-6 max-w-lg border-y border-[#EAE5DC] py-6">
              <div>
                <span className="block font-serif text-3xl font-normal text-[#1A1816]">6 Estates</span>
                <span className="text-xs uppercase tracking-[0.16em] text-[#B89552] font-medium mt-1 block">Inaugural Registry</span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-normal text-[#1A1816]">100% Bespoke</span>
                <span className="text-xs uppercase tracking-[0.16em] text-[#B89552] font-medium mt-1 block">Noble Materiality</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/residences"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#1A1816] hover:bg-[#B89552] text-[#FAF8F5] hover:text-white font-medium text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-lg shadow-[#1A1816]/10"
              >
                <span>Explore The Residences</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/vision"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-[#F3EFEA] border border-[#DCD5C9] text-xs uppercase tracking-[0.18em] text-[#1A1816] font-medium transition-all duration-300 shadow-sm"
              >
                <span>Discover Our Vision</span>
                <Compass size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Image Composition (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Architectural Still */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#EAE5DC] border border-[#DCD5C9] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                  alt="The Aurelia Estate Architecture"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816]/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[#DFCFA8] font-medium block mb-1">
                    Signature Commission
                  </span>
                  <p className="font-serif text-xl text-white font-light">
                    The Aurelia Estate · Vagator Cliffs, Goa
                  </p>
                </div>
              </div>

              {/* Offset Floating Metric Card */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-[#EAE5DC] rounded-2xl p-5 shadow-xl hidden sm:flex items-center gap-4 max-w-xs">
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#B89552]/40 flex items-center justify-center text-[#B89552]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-[0.16em] text-[#B89552] font-semibold block">Architectural Guarantee</span>
                  <span className="text-xs text-[#3D3934] font-light mt-0.5 block">Multidecadal structural permanence & private tenure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
