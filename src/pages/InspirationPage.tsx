import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Sparkles, Heart, Waves, Sun, Flame, Trees } from 'lucide-react';
import { useClientConfig } from '../context/ClientConfigContext';

interface LifestyleVignette {
  id: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

const LIFESTYLE_VIGNETTES: LifestyleVignette[] = [
  {
    id: 'ls-01',
    category: 'WELLNESS & SANCTUARY',
    title: 'Private Thermal Spas & Reflection Pools',
    tagline: 'Hydraulic Calming & Hydrotherapy',
    description: 'Heated negative-edge infinity pools, cedar dry saunas, and subterranean marble steam chambers engineered for deep restorative tranquility.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85',
    icon: Waves
  },
  {
    id: 'ls-02',
    category: 'INTERIOR PROPORTIONS',
    title: 'Double-Height Grand Living Salons',
    tagline: 'Acoustic Calm & Spatial Volumes',
    description: 'Seven-metre soaring volume ceilings, bookmatched travertine hearths, and frameless motorized glass facades that dissolve into open terraces.',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
    icon: Sun
  },
  {
    id: 'ls-03',
    category: 'CULINARY ARTISTRY',
    title: 'Chef Show Kitchens & Back Annexes',
    tagline: 'Material Precision for Entertaining',
    description: 'Custom fluted dark oak cabinetry, honed Calacatta marble monolithic islands, integrated Gaggenau appliances, and discreet preparation galleys.',
    imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=85',
    icon: Flame
  },
  {
    id: 'ls-04',
    category: 'AL FRESCO ENTERTAINING',
    title: 'Cantilevered Sunset Dining Loggias',
    tagline: 'Horizon Gazing & Outdoor Hearths',
    description: 'Deep bioclimatic pergolas with motorized louvres, built-in masonry fireplaces, and dining loggias positioned for unobstructed 270-degree sunset ocean views.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85',
    icon: Sparkles
  },
  {
    id: 'ls-05',
    category: 'LANDSCAPE CHOREOGRAPHY',
    title: 'Inner Courtyards & Olive Groves',
    tagline: 'Biophilic Grounding & Quiet Atriums',
    description: 'Landscaped central courtyards framed by centuries-old olive trees, reflecting shallow water basins, and fragrant jasmine colonnades providing passive cooling.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85',
    icon: Trees
  },
  {
    id: 'ls-06',
    category: 'PRIVATE CELLARS',
    title: 'Subterranean Wine & Spirits Vaults',
    tagline: 'Temperature-Controlled Curation',
    description: 'Architectural tasting cellars holding upwards of 1,200 bottles with precision humidity control, dark fluted bronze racks, and intimate tasting lounges.',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85',
    icon: Heart
  }
];

export const InspirationPage: React.FC = () => {
  const config = useClientConfig();

  return (
    <div className="w-full bg-[#12100E] text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] uppercase tracking-[0.25em] bg-white/10 text-[#C5A059] border border-white/15 backdrop-blur-md">
            <Sparkles size={12} />
            <span>THE RESIDENTIAL EXPERIENCE</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-tight">
            Curated Living &amp; Spatial Atmosphere
          </h1>
          <p className="text-base sm:text-lg text-white/75 font-light leading-relaxed">
            True luxury is the cadence of daily life. Explore the deliberate architectural moments and private resort amenities that define the BILEKSA residential standard.
          </p>
        </div>

        {/* 6-Card Lifestyle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LIFESTYLE_VIGNETTES.map((vignette) => {
            const Icon = vignette.icon;
            return (
              <div
                key={vignette.id}
                className="group rounded-3xl overflow-hidden bg-[#181614] border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-[#201D1A]">
                  <img
                    src={vignette.imageUrl}
                    alt={vignette.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-[#C5A059] flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                </div>

                <div className="p-7 space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-medium block">
                    {vignette.category}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-white group-hover:text-[#EFECE6] transition-colors">
                    {vignette.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                    {vignette.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation CTA */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-light text-white">
            Experience These Spaces in Person
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto font-light">
            Private on-site viewings of our six published commissions can be arranged with the {config.brand.brandName} Client Advisory desk.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/residences"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#b08d47] text-white text-xs uppercase tracking-[0.16em] font-medium transition-colors"
            >
              <span>Explore The Residences</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-[0.16em] transition-colors border border-white/15"
            >
              <span>Schedule Private Viewing</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
