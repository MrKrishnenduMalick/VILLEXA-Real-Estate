import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass, Sparkles, Building, Waves, Mountain, Shield } from 'lucide-react';
import { getAssetSlotUrl } from '../config/assetSlots';

interface ResidenceCollection {
  id: string;
  name: string;
  categoryFilter: string;
  headline: string;
  residenceCount: number;
  description: string;
  imageUrl: string;
  location: string;
  priceGuide: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

const RESIDENCE_COLLECTIONS: ResidenceCollection[] = [
  {
    id: 'coastal-estates',
    name: 'Coastal & Clifftop Estates',
    categoryFilter: 'waterfront',
    headline: 'OCEANFRONT MONOGRAPHS',
    residenceCount: 2,
    description: 'Dramatic cantilevered limestone pavilions, infinity reflecting pools, and private tidal access directly onto secluded shorelines.',
    imageUrl: getAssetSlotUrl('PROPERTY_EXTERIOR_PRIMARY'),
    location: 'Goa & Western Coastline',
    priceGuide: 'From ₹38 Crore',
    icon: Waves
  },
  {
    id: 'sky-penthouses',
    name: 'Metropolitan Sky Penthouses',
    categoryFilter: 'penthouse',
    headline: 'ELEVATED SKY HORIZONS',
    residenceCount: 1,
    description: 'Triplex penthouses commanding 360-degree metropolitan skylines, private glass elevators, and double-height entertaining salons.',
    imageUrl: getAssetSlotUrl('PROPERTY_INTERIOR_SALON'),
    location: 'South Mumbai & Prime Metros',
    priceGuide: 'From ₹65 Crore',
    icon: Building
  },
  {
    id: 'alpine-manors',
    name: 'Highland Sanctuaries & Manors',
    categoryFilter: 'villa',
    headline: 'ALPINE RETREATS',
    residenceCount: 1,
    description: 'Carved cedar and local stone country estates enveloped by permanent pine buffers, private orchards, and panoramic mountain ridges.',
    imageUrl: getAssetSlotUrl('PROPERTY_ARCHITECTURAL_ENTRANCE'),
    location: 'Himalayan Foothills & Kasauli',
    priceGuide: 'From ₹42 Crore',
    icon: Mountain
  },
  {
    id: 'master-enclaves',
    name: 'Botanical Master Enclaves',
    categoryFilter: 'residential_development',
    headline: 'COMMISSIONED ENCLAVES',
    residenceCount: 1,
    description: 'Ultra-low-density residential communities integrating mature olive groves, private security perimeters, and bespoke clubhouse pavilions.',
    imageUrl: getAssetSlotUrl('PROPERTY_EXTERIOR_POOL'),
    location: 'Alibaug & Coastal Sanctuaries',
    priceGuide: 'From ₹55 Crore',
    icon: Shield
  },
  {
    id: 'private-residences',
    name: 'Luxury City Residences',
    categoryFilter: 'apartment',
    headline: 'FULL-FLOOR SANCTUARIES',
    residenceCount: 1,
    description: 'Single-residence-per-floor architectural apartments featuring frameless panoramic glazing, private staff quarters, and acoustic serenity.',
    imageUrl: getAssetSlotUrl('PROPERTY_INTERIOR_MASTER_BEDROOM'),
    location: 'Central Capital Districts',
    priceGuide: 'From ₹28 Crore',
    icon: Compass
  }
];

export const CollectionsPage: React.FC = () => {
  const leadCol = RESIDENCE_COLLECTIONS[0];
  const secondaryCols = RESIDENCE_COLLECTIONS.slice(1, 3);
  const tertiaryCols = RESIDENCE_COLLECTIONS.slice(3);

  return (
    <div className="w-full bg-[#070C18]/80 backdrop-blur-2xl text-white pt-32 pb-24 sm:pt-36 sm:pb-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.25em] bg-white/10 text-[#DFCFA8] border border-white/15 backdrop-blur-md">
            <Sparkles size={12} className="text-[#C5A059]" />
            <span>CURATED ARCHITECTURAL PORTFOLIOS</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-tight">
            Curated Residence Collections
          </h1>
          <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed">
            Distinguished residential portfolios organized by geography, architectural typology, and lifestyle orientation. Engineered for discretion, permanence, and generational legacy.
          </p>
        </div>

        {/* 1. LEAD ASYMMETRIC MONOGRAPH (Wide Panoramic Showcase with Floating Glass Plaque) */}
        <div className="mb-12 group relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl min-h-[520px] flex flex-col justify-end">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={leadCol.imageUrl}
              alt={leadCol.name}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070C18]/90 via-[#070C18]/40 to-transparent pointer-events-none" />
          </div>

          <div className="relative z-10 p-6 sm:p-12 max-w-2xl m-4 sm:m-8 rounded-2xl glass-material-smoked border border-[rgba(197,160,89,0.30)] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#DFCFA8]">
              <Waves size={15} className="text-[#C5A059]" />
              <span>{leadCol.location}</span>
              <span className="text-white/40">·</span>
              <span>{leadCol.residenceCount} Residences</span>
              <span className="text-white/40">·</span>
              <span className="text-[#C5A059]">{leadCol.priceGuide}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
              {leadCol.name}
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
              {leadCol.description}
            </p>

            <div className="pt-2">
              <Link
                href={`/residences?type=${leadCol.categoryFilter}`}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#b08d47] text-white text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 shadow-xl shadow-[#C5A059]/20"
              >
                <span>Explore Coastal Collection</span>
                <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. ASYMMETRIC DIPTYCH (Sky Penthouses + Alpine Manors) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {secondaryCols.map((col, idx) => {
            const Icon = col.icon;
            const isFirst = idx === 0;
            return (
              <div
                key={col.id}
                className={`group relative rounded-3xl overflow-hidden border border-white/15 shadow-xl min-h-[460px] flex flex-col justify-end ${
                  isFirst ? 'lg:col-span-7' : 'lg:col-span-5'
                }`}
              >
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={col.imageUrl}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070C18]/90 via-[#070C18]/40 to-transparent pointer-events-none" />
                </div>

                <div className="relative z-10 p-6 sm:p-8 m-4 rounded-2xl glass-material-smoked border border-[rgba(197,160,89,0.30)] shadow-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#DFCFA8]">
                    <Icon size={14} className="text-[#C5A059]" />
                    <span>{col.location}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-[#C5A059]">{col.priceGuide}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-light">
                    {col.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed line-clamp-2">
                    {col.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/residences?type=${col.categoryFilter}`}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C5A059] hover:text-white font-medium transition-colors"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. TERTIARY HARMONIC SPLIT (Botanical Enclaves + City Residences) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {tertiaryCols.map((col) => {
            const Icon = col.icon;
            return (
              <div
                key={col.id}
                className="group relative rounded-3xl overflow-hidden border border-white/15 shadow-xl min-h-[420px] flex flex-col justify-end"
              >
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={col.imageUrl}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070C18]/90 via-[#070C18]/40 to-transparent pointer-events-none" />
                </div>

                <div className="relative z-10 p-6 sm:p-8 m-4 rounded-2xl glass-material-smoked border border-[rgba(197,160,89,0.30)] shadow-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#DFCFA8]">
                    <Icon size={14} className="text-[#C5A059]" />
                    <span>{col.location}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-[#C5A059]">{col.priceGuide}</span>
                  </div>

                  <h3 className="font-serif text-2xl text-white font-light">
                    {col.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed line-clamp-2">
                    {col.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/residences?type=${col.categoryFilter}`}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C5A059] hover:text-white font-medium transition-colors"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. FOOTER ADVISORY BANNER */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/20 text-center space-y-6 shadow-2xl">
          <h2 className="font-serif text-2xl sm:text-4xl font-light text-white">
            Seeking a Specific Architectural Geography?
          </h2>
          <p className="text-sm sm:text-base text-white/75 max-w-xl mx-auto font-light leading-relaxed">
            Our Private Office coordinates confidential, off-market residential acquisitions and custom land commissions across premier sanctuaries globally.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/residences"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#b08d47] text-white text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 shadow-xl shadow-[#C5A059]/20"
            >
              <span>View Master Portfolio</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-[0.16em] transition-all duration-300 border border-white/20 backdrop-blur-md"
            >
              <span>Contact Advisory Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
