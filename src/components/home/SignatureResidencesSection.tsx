import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Bed, Bath, Maximize2, Compass, MapPin } from 'lucide-react';
import { Property } from '../../types/property';
import { propertyService } from '../../services/propertyService';
import { PropertyCard } from '../property/PropertyCard';

interface SignatureResidencesSectionProps {
  leadProperty: Property | null;
  secondaryProperties: Property[];
}

export const SignatureResidencesSection: React.FC<SignatureResidencesSectionProps> = ({
  leadProperty,
  secondaryProperties
}) => {
  if (!leadProperty) return null;

  const formattedLeadPrice = propertyService.formatPrice(leadProperty);
  const formattedLeadCarpet = propertyService.formatArea(leadProperty.carpetArea);
  const formattedLeadBuiltUp = propertyService.formatArea(leadProperty.builtUpArea);
  const leadLocationString = leadProperty.location.suburb
    ? `${leadProperty.location.suburb}, ${leadProperty.location.city}`
    : `${leadProperty.location.city}, ${leadProperty.location.country}`;

  return (
    <section id="signature-residences" className="py-28 sm:py-36 bg-[#FAF8F5] text-[#1A1816] overflow-hidden border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-[#B89552] font-semibold mb-3">
              <Compass size={13} />
              <span>SIGNATURE COMMISSIONS</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1816] leading-tight">
              Flagship Private Residences
            </h2>
            <p className="mt-4 text-base text-[#6E6860] font-light leading-relaxed">
              Curated private estates and architectural penthouses available for immediate private acquisition.
            </p>
          </div>

          <Link
            href="/residences"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#B89552] hover:text-[#9E7D3B] font-semibold transition-colors"
          >
            <span>Explore All Residences</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 1. Lead Flagship Spread: The Aurelia Estate */}
        <div className="mb-20 rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#EAE5DC] shadow-xl shadow-[#1A1816]/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Visual Media Half (7 cols) */}
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[380px] lg:min-h-[520px]">
              <img
                src={leadProperty.coverImage}
                alt={leadProperty.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816]/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.2em] bg-[#B89552] text-white font-medium shadow-md">
                  Signature Commission
                </span>
                <span className="px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.16em] bg-white/95 text-[#1A1816] backdrop-blur-md border border-[#EAE5DC] font-medium shadow-sm">
                  Architectural Villa
                </span>
              </div>
            </div>

            {/* Editorial Content Half (5 cols) */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-8 bg-[#FFFFFF]">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B89552] font-semibold mb-3">
                  <MapPin size={13} />
                  <span>{leadLocationString}</span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1816] font-light leading-snug mb-3">
                  {leadProperty.name}
                </h3>

                <p className="text-[#3D3934] font-normal text-sm sm:text-base leading-relaxed mb-4">
                  {leadProperty.tagline}
                </p>

                <p className="text-xs sm:text-sm text-[#6E6860] font-light leading-relaxed mb-8">
                  {leadProperty.description}
                </p>

                {/* Spatial Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-y border-[#EAE5DC] text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6E6860] block mb-1">
                      Bedrooms
                    </span>
                    <span className="font-serif text-lg text-[#1A1816] font-normal flex items-center gap-1.5">
                      <Bed size={14} className="text-[#B89552]" /> {leadProperty.bedrooms} Suites
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6E6860] block mb-1">
                      Baths
                    </span>
                    <span className="font-serif text-lg text-[#1A1816] font-normal flex items-center gap-1.5">
                      <Bath size={14} className="text-[#B89552]" /> {leadProperty.bathrooms} Baths
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6E6860] block mb-1">
                      Carpet Area
                    </span>
                    <span className="font-serif text-lg text-[#1A1816] font-normal flex items-center gap-1.5">
                      <Maximize2 size={14} className="text-[#B89552]" /> {formattedLeadCarpet}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6E6860] block mb-1">
                      Built-Up Area
                    </span>
                    <span className="font-serif text-lg text-[#1A1816] font-normal flex items-center gap-1.5">
                      <Compass size={14} className="text-[#B89552]" /> {formattedLeadBuiltUp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & CTA Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#EAE5DC]">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#B89552] font-semibold block">
                    Investment Guide
                  </span>
                  <span className="font-serif text-3xl text-[#1A1816] font-normal">
                    {formattedLeadPrice}
                  </span>
                </div>

                <Link
                  href={`/residence/${leadProperty.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1A1816] hover:bg-[#B89552] text-[#FAF8F5] hover:text-white text-xs uppercase tracking-[0.18em] font-medium transition-colors shadow-lg shadow-[#1A1816]/10"
                >
                  <span>Explore Residence</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Secondary Showcase Grid: Curated Trio */}
        {secondaryProperties.length > 0 && (
          <div>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#B89552] font-semibold block mb-1">
                  Complementary Commissions
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1816]">
                  Selected Architectural Residences
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {secondaryProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
