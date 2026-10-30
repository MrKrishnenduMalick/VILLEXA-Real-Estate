import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass, Sparkles, Building, Waves, Mountain, Shield } from 'lucide-react';

interface ResidenceCollection {
  id: string;
  name: string;
  categoryFilter: string;
  headline: string;
  residenceCount: number;
  description: string;
  imageUrl: string;
  location: string;
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
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=85',
    location: 'Goa & Western Coastline',
    icon: Waves
  },
  {
    id: 'sky-penthouses',
    name: 'Metropolitan Sky Penthouses',
    categoryFilter: 'penthouse',
    headline: 'ELEVATED SKY HORIZONS',
    residenceCount: 1,
    description: 'Triplex penthouses commanding 360-degree metropolitan skylines, private glass elevators, and double-height entertaining salons.',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
    location: 'South Mumbai & Prime Metros',
    icon: Building
  },
  {
    id: 'alpine-manors',
    name: 'Highland Sanctuaries & Manors',
    categoryFilter: 'villa',
    headline: 'ALPINE RETREATS',
    residenceCount: 1,
    description: 'Carved cedar and local stone country estates enveloped by permanent pine buffers, private orchards, and panoramic mountain ridges.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    location: 'Himalayan Foothills & Kasauli',
    icon: Mountain
  },
  {
    id: 'master-enclaves',
    name: 'Botanical Master Enclaves',
    categoryFilter: 'residential_development',
    headline: 'COMMISSIONED ENCLAVES',
    residenceCount: 1,
    description: 'Ultra-low-density residential communities integrating mature olive groves, private security perimeters, and bespoke clubhouse pavilions.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85',
    location: 'Alibaug & Suburban Sanctuaries',
    icon: Shield
  },
  {
    id: 'private-residences',
    name: 'Luxury City Residences',
    categoryFilter: 'apartment',
    headline: 'FULL-FLOOR SANCTUARIES',
    residenceCount: 1,
    description: 'Single-residence-per-floor architectural apartments featuring frameless panoramic glazing, private staff quarters, and acoustic serenity.',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=85',
    location: 'Central Capital Districts',
    icon: Compass
  }
];

export const CollectionsPage: React.FC = () => {
  return (
    <div className="w-full bg-[#12100E] text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] uppercase tracking-[0.25em] bg-white/10 text-[#C5A059] border border-white/15 backdrop-blur-md">
            <Sparkles size={12} />
            <span>CURATED ARCHITECTURAL PORTFOLIOS</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-tight">
            Curated Residence Collections
          </h1>
          <p className="text-base sm:text-lg text-white/75 font-light leading-relaxed">
            Explore our curated residential portfolios organized by geography, architectural typology, and lifestyle orientation.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RESIDENCE_COLLECTIONS.map((col, idx) => {
            const Icon = col.icon;
            return (
              <div
                key={col.id}
                className={`group rounded-3xl overflow-hidden bg-[#181614] border border-white/15 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between ${
                  idx === 0 ? 'md:col-span-2 aspect-[16/10]' : 'aspect-[4/5]'
                }`}
              >
                <div className="relative flex-1 overflow-hidden">
                  <img
                    src={col.imageUrl}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-75 group-hover:opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/40 to-transparent pointer-events-none" />

                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-black/60 text-[#C5A059] border border-[#C5A059]/40 backdrop-blur-md">
                      {col.headline}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A059] mb-1">
                      <Icon size={14} />
                      <span>{col.location}</span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/70">{col.residenceCount} {col.residenceCount === 1 ? 'Residence' : 'Residences'}</span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-white font-light group-hover:text-[#EFECE6] transition-colors mb-2">
                      {col.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed line-clamp-2 max-w-lg mb-4">
                      {col.description}
                    </p>

                    <Link
                      href={`/residences?type=${col.categoryFilter}`}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C5A059] group-hover:text-white font-medium transition-colors"
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

        {/* Footer CTA */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-light text-white">
            Seeking a Specific Architectural Geography?
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto font-light">
            Our Private Office coordinates off-market residential acquisitions and land commissions across premier sanctuaries.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/residences"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#b08d47] text-white text-xs uppercase tracking-[0.16em] font-medium transition-colors"
            >
              <span>View Master Portfolio</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-[0.16em] transition-colors border border-white/15"
            >
              <span>Contact Advisory Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
