import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getAssetSlotUrl } from '../../config/assetSlots';

export const LifestyleSection: React.FC = () => {
  return (
    <section id="amenities" className="section-amenities py-12 sm:py-16">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row mb-10 pb-5 border-b border-[#EAE5DC]">
          <div>
            <span className="eyebrow mb-2">
              <Sparkles size={13} className="text-[#B89552]" />
              <span>SANCTUARY &amp; LIVING PREVIEW</span>
            </span>
            <h2 className="section-title">
              Living as an Art Form
            </h2>
            <p className="mt-3 text-base font-normal leading-relaxed max-w-2xl">
              From subterranean thermal baths to cantilevered infinity pools, each residence is designed as an acoustic and sensory sanctuary.
            </p>
          </div>
          <Link
            href="/lifestyle"
            className="btn btn-outline-dark"
          >
            <span>Explore Sanctuary &amp; Living</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 1. Master Sanctuary Spread: Heroic Architectural Feature */}
        <div className="bg-[var(--glass-primary)] border border-[var(--glass-border)] rounded-[4px] p-6 lg:p-8 backdrop-blur-[20px] shadow-md mb-8">
          <div className="lifestyle-hero-spread">
            {/* Commanding Primary Image (7 cols) */}
            <div>
              <div className="w-full aspect-[16/10] rounded-[3px] overflow-hidden border border-[#EAE5DC] bg-[#EAE5DC] shadow-sm">
                <img
                  src={getAssetSlotUrl('PROPERTY_INTERIOR_BATHROOM')}
                  alt="Private Thermal Spas & Hydrotherapy"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = '/real-estate-hero-frames/frame-00080.webp';
                  }}
                />
              </div>
            </div>

            {/* Editorial Story & Provenance (5 cols) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#B89552] font-semibold">
                  WELLNESS &amp; SPA SANCTUARY
                </span>
                <span className="text-[9.5px] uppercase tracking-widest text-[#8A7E72] font-medium bg-white/60 px-2 py-0.5 rounded border border-[#EAE5DC]">
                  Plate 03
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1816] font-light leading-snug">
                Private Thermal Spas &amp; Hydrotherapy
              </h3>

              <p className="text-sm sm:text-base text-[#2B2724] leading-relaxed font-light">
                Subterranean steam chambers, Finnish cedar saunas, and temperature-controlled hydrotherapy plunge basins carved from monolithic local stone. Engineered as an acoustic and sensory sanctuary away from external disturbance.
              </p>

              <div className="pt-3 border-t border-[#EAE5DC] grid grid-cols-2 gap-4 text-xs text-[#2B2724]">
                <div>
                  <strong className="block text-[#1A1816] text-[10.5px] uppercase tracking-wider mb-0.5">Vals Granite</strong>
                  <span className="text-[#524C44] text-[11px]">Carved subterranean basin</span>
                </div>
                <div>
                  <strong className="block text-[#1A1816] text-[10.5px] uppercase tracking-wider mb-0.5">Acoustic Quiet</strong>
                  <span className="text-[#524C44] text-[11px]">-48dB subterranean isolation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Balanced Architectural Diptych (Two Wide Curated Volumes) */}
        <div className="lifestyle-diptych-grid">
          {/* Diptych 1: Infinity Pools & Entertaining */}
          <div className="amenity-card flex flex-col justify-between">
            <div>
              <div className="w-full aspect-[16/10] overflow-hidden bg-[#EAE5DC]">
                <img
                  src={getAssetSlotUrl('PROPERTY_EXTERIOR_POOL')}
                  alt="Open-Air Horizon Entertaining"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = '/real-estate-hero-frames/frame-00140.webp';
                  }}
                />
              </div>
              <div className="p-6 bg-[var(--glass-strong)] border-t border-[var(--glass-border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="amenity-sub">INFINITY POOLS &amp; LOGGIAS</span>
                  <span className="text-[9.5px] uppercase tracking-widest text-[#B89552] font-semibold">Plate 04</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#1A1816] font-light">
                  Open-Air Horizon Entertaining
                </h3>
                <p className="text-xs sm:text-sm text-[#2B2724] leading-relaxed font-light">
                  Cantilevered dining loggias with integrated hearths and 25-meter infinity reflecting pools framing uninterrupted ocean sunsets.
                </p>
              </div>
            </div>
          </div>

          {/* Diptych 2: Grand Living & Double-Height Salons */}
          <div className="amenity-card flex flex-col justify-between">
            <div>
              <div className="w-full aspect-[16/10] overflow-hidden bg-[#EAE5DC]">
                <img
                  src={getAssetSlotUrl('PROPERTY_INTERIOR_SALON')}
                  alt="Grand Living & Double-Height Salons"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = '/real-estate-hero-frames/frame-00200.webp';
                  }}
                />
              </div>
              <div className="p-6 bg-[var(--glass-strong)] border-t border-[var(--glass-border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="amenity-sub">ACOUSTIC &amp; RESIDENTIAL VOLUME</span>
                  <span className="text-[9.5px] uppercase tracking-widest text-[#B89552] font-semibold">Plate 05</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#1A1816] font-light">
                  Grand Living &amp; Double-Height Salons
                </h3>
                <p className="text-xs sm:text-sm text-[#2B2724] leading-relaxed font-light">
                  Soaring 7-metre volume ceilings engineered for acoustic calm, natural cross-ventilation, and monumental private art curation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Secondary Amenity Infrastructure Triad (Refined Horizontal Capsules) */}
        <div>
          <div className="mb-6 pb-2 border-b border-[#EAE5DC]/80 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#B89552] font-semibold block">
              Curated Private Infrastructure
            </span>
            <span className="text-xs text-[#8A7E72] font-light">03 Specialized Commissions</span>
          </div>

          <div className="lifestyle-triad-grid">
            {/* Screening Room */}
            <div className="amenity-sub-card flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] overflow-hidden mb-4 border border-[var(--glass-border)] rounded-[3px] bg-[#EAE5DC]">
                  <img
                    src={getAssetSlotUrl('PROPERTY_GALLERY_MATERIALITY')}
                    alt="Dolby Private Screening Room"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = '/real-estate-hero-frames/frame-00060.webp';
                    }}
                  />
                </div>
                <span className="text-[9.5px] uppercase tracking-widest text-[#B89552] font-semibold block mb-1">
                  ACOUSTICALLY TUNED CINEMA
                </span>
                <h4 className="font-serif text-lg text-[#1A1816] mb-2">Dolby Private Screening Room</h4>
                <p className="text-xs text-[#2B2724] leading-relaxed font-light">
                  THX-certified 4K laser projection with bespoke fabric acoustics and ergonomic private lounge seating.
                </p>
              </div>
            </div>

            {/* Wine Vault */}
            <div className="amenity-sub-card flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] overflow-hidden mb-4 border border-[var(--glass-border)] rounded-[3px] bg-[#EAE5DC]">
                  <img
                    src={getAssetSlotUrl('PROPERTY_GALLERY_WINE_VAULT')}
                    alt="Subterranean Wine Vault"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = '/real-estate-hero-frames/frame-00180.webp';
                    }}
                  />
                </div>
                <span className="text-[9.5px] uppercase tracking-widest text-[#B89552] font-semibold block mb-1">
                  CLIMATE-CONTROLLED CELLAR
                </span>
                <h4 className="font-serif text-lg text-[#1A1816] mb-2">Subterranean Wine Vault</h4>
                <p className="text-xs text-[#2B2724] leading-relaxed font-light">
                  Vibration-damped sommelier cellars maintaining an exact 13°C and 70% humidity for up to 2,500 grand cru vintages.
                </p>
              </div>
            </div>

            {/* Botanical Grounds */}
            <div className="amenity-sub-card flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] overflow-hidden mb-4 border border-[var(--glass-border)] rounded-[3px] bg-[#EAE5DC]">
                  <img
                    src={getAssetSlotUrl('PROPERTY_GALLERY_ATRIUM')}
                    alt="Manicured Botanical Grounds"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = '/real-estate-hero-frames/frame-00220.webp';
                    }}
                  />
                </div>
                <span className="text-[9.5px] uppercase tracking-widest text-[#B89552] font-semibold block mb-1">
                  PRIVATE GROUNDS &amp; GARDENS
                </span>
                <h4 className="font-serif text-lg text-[#1A1816] mb-2">Manicured Botanical Grounds</h4>
                <p className="text-xs text-[#2B2724] leading-relaxed font-light">
                  Secluded meditative olive groves, sculpted water rills, and native botanical flora designed by landscape masters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
