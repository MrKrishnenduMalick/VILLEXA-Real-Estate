import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';

export const LifestyleSection: React.FC = () => {
  const vignettes = [
    {
      title: 'Private Thermal Spas & Wellness',
      category: 'SANCTUARY',
      description: 'Subterranean steam rooms, cedar saunas, and temperature-controlled infinity plunge basins.',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=85'
    },
    {
      title: 'Open-Air Horizon Entertaining',
      category: 'LOGGIAS & TERRACES',
      description: 'Cantilevered dining loggias with integrated outdoor hearths framing uninterrupted ocean sunsets.',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=85'
    },
    {
      title: 'Grand Living & Double-Height Salons',
      category: 'INTERIOR PROPORTIONS',
      description: 'Soaring 7-metre volume ceilings engineered for acoustic calm, natural cross-ventilation, and monumental art curation.',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=85'
    }
  ];

  return (
    <section id="curated-lifestyle" className="py-28 sm:py-36 bg-[#FFFFFF] text-[#1A1816] overflow-hidden border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-[#B89552] font-semibold mb-3">
              <Sparkles size={13} />
              <span>THE LIVING EXPERIENCE</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1816] leading-tight">
              An Elevated Daily Rhythm
            </h2>
            <p className="mt-4 text-base text-[#6E6860] font-light leading-relaxed">
              Architecture that nurtures tranquility, privacy, and meaningful gatherings with the service standards of a private resort.
            </p>
          </div>

          <Link
            href="/lifestyle"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#B89552] hover:text-[#9E7D3B] font-semibold transition-colors"
          >
            <span>Explore Lifestyle Monographs</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3-Column Lifestyle Vignettes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vignettes.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#FAF8F5] border border-[#EAE5DC] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6 sm:p-8"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816]/90 via-[#1A1816]/35 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-2">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#DFCFA8] font-semibold block">
                  {item.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
