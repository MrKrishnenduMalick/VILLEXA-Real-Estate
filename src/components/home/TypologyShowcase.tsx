import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass } from 'lucide-react';
import { PropertyType } from '../../types/property';

interface TypologyItem {
  id: string;
  type: PropertyType;
  title: string;
  tagline: string;
  count: number;
  imageUrl: string;
}

export const TypologyShowcase: React.FC = () => {
  const typologies: TypologyItem[] = [
    {
      id: 'typ-villa',
      type: 'villa',
      title: 'Private Villas',
      tagline: 'Expansive private sanctuaries with reflecting pools and landscaped pavilions.',
      count: 2,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'typ-penthouse',
      type: 'penthouse',
      title: 'Sky Penthouses',
      tagline: 'Multi-tiered sky decks with 360-degree metropolitan and marine horizons.',
      count: 1,
      imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'typ-waterfront',
      type: 'waterfront',
      title: 'Coastal Residences',
      tagline: 'Direct beach access and pavilions engineered to dissolve into tidal rhythms.',
      count: 1,
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'typ-apartment',
      type: 'apartment',
      title: 'Luxury Apartments',
      tagline: 'Double-height grand salons and bespoke full-floor privacy in premier towers.',
      count: 1,
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'typ-development',
      type: 'residential_development',
      title: 'Master Developments',
      tagline: 'Ultra-low-density residential enclaves blending botanical gardens with private security.',
      count: 1,
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=85'
    }
  ];

  return (
    <section id="explore-typologies" className="py-24 sm:py-32 bg-[#FAF8F5] text-[#1A1816] border-t border-[#EAE5DC]">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <span className="eyebrow mb-2">
              <Compass size={13} className="text-[#B89552]" />
              <span>ARCHITECTURAL TYPOLOGIES</span>
            </span>
            <h2 className="section-title">
              Explore by Typology
            </h2>
            <p className="mt-3 text-base text-[#2B2724] font-normal leading-relaxed max-w-2xl">
              Every commission is tailored to its geography &mdash; from monolithic coastal limestone to soaring metropolitan sky terraces.
            </p>
          </div>

          <Link
            href="/residences"
            className="btn btn-outline-dark"
          >
            <span>View Complete Portfolio (6)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 5-Card Typology Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {typologies.map((item, idx) => (
            <Link
              key={item.id}
              href={`/residences?type=${item.type}`}
              className={`group relative rounded-[2px] overflow-hidden aspect-[16/11] bg-[#FAF8F5] shadow-sm hover:shadow-xl transition-all duration-500 border border-[#EAE5DC] flex flex-col justify-end p-6 sm:p-8 ${
                idx === 0 ? 'md:col-span-2 lg:col-span-2 aspect-[16/9]' : ''
              }`}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816]/90 via-[#1A1816]/35 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] uppercase tracking-[0.22em] text-[#DFCFA8] font-semibold">
                    {item.count} {item.count === 1 ? 'Residence' : 'Residences'}
                  </span>
                  <div className="w-8 h-8 rounded-[2px] bg-white/20 backdrop-blur-md group-hover:bg-[#B89552] text-white flex items-center justify-center transition-colors duration-300">
                    <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-light text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 font-light line-clamp-2 max-w-lg">
                  {item.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
