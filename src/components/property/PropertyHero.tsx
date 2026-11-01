import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, MapPin, Calendar, ChevronDown, Send, MessageSquare } from 'lucide-react';
import { Property } from '../../types/property';
import { propertyService } from '../../services/propertyService';
import { useClientConfig } from '../../context/ClientConfigContext';

interface PropertyHeroProps {
  property: Property;
  onExploreClick?: () => void;
  onEnquireClick?: () => void;
}

export const PropertyHero: React.FC<PropertyHeroProps> = ({
  property,
  onExploreClick,
  onEnquireClick
}) => {
  const clientConfig = useClientConfig();
  const formattedPrice = propertyService.formatPrice(property);
  const locationString = property.location.suburb
    ? `${property.location.suburb}, ${property.location.city}`
    : `${property.location.city}, ${property.location.country}`;

  const typologyLabels: Record<string, string> = {
    villa: 'Architectural Villa',
    penthouse: 'Sky Penthouse',
    waterfront: 'Waterfront Estate',
    estate: 'Private Sanctuary Estate',
    apartment: 'Private Residence',
    residential_development: 'Master Residential Enclave'
  };

  const typologyLabel = typologyLabels[property.propertyType] || 'Curated Residence';

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#12100E] text-white">
      {/* 1. Architectural Cover Imagery with Cinematic Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={property.coverImage}
          alt={property.name}
          className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
        />
        {/* Multilayered Warm Atmosphere Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/40 to-[#12100E]/30" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#12100E]/60 pointer-events-none" />
      </div>

      {/* 2. Top Navigation Bar (Breadcrumb & Signature Badge) */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-8 pt-28 sm:pt-32 flex items-center justify-between">
        <Link
          href="/residences"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs uppercase tracking-[0.15em] text-white/90 hover:text-white transition-all duration-300"
        >
          <ArrowLeft size={13} className="text-[#C5A059]" />
          <span>Residences Portfolio</span>
        </Link>

        <div className="flex items-center gap-2">
          {property.signatureEstate && (
            <span className="hidden sm:inline-block px-3.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-[#C5A059]/25 text-[#EFECE6] border border-[#C5A059]/40 backdrop-blur-md">
              Signature Commission
            </span>
          )}
          <span className="px-3.5 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] bg-white/10 text-white/90 border border-white/15 backdrop-blur-md">
            {typologyLabel}
          </span>
        </div>
      </div>

      {/* 3. Central Architectural Title & Primary Metadata */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <div className="max-w-4xl">
          {/* Location Kicker */}
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4">
            <MapPin size={13} />
            <span>{locationString}</span>
            {property.completionYear && (
              <>
                <span className="text-white/30">·</span>
                <span className="flex items-center gap-1 text-white/60">
                  <Calendar size={11} /> {property.completionYear}
                </span>
              </>
            )}
          </div>

          {/* Master Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.08] mb-6">
            {property.name}
          </h1>

          {/* Architectural Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/85 font-light leading-relaxed max-w-2xl mb-10">
            {property.tagline}
          </p>

          {/* Price & Primary Call-to-Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4 border-t border-white/15">
            {/* Formatted Valuation */}
            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-[#C5A059] mb-1">
                {property.priceDisplayPrefix || 'Investment Valuation'}
              </span>
              <span className="font-serif text-2xl sm:text-3xl text-white tracking-wide">
                {formattedPrice}
              </span>
            </div>

            <div className="h-10 w-px bg-white/15 hidden sm:block mx-2" />

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onEnquireClick) onEnquireClick();
                  else handleScrollTo('private-enquiry');
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#C5A059] hover:bg-[#b08d47] text-white font-medium text-xs uppercase tracking-[0.16em] transition-all duration-300 shadow-lg shadow-[#C5A059]/20"
              >
                <Send size={13} />
                <span>Reserve Private Viewing</span>
              </button>

              <a
                href={`https://wa.me/${clientConfig.contact.whatsappNumber}?text=${encodeURIComponent(`Hello Concierge, I would like to arrange a private consultation regarding ${property.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs uppercase tracking-[0.16em] text-white transition-all duration-300"
              >
                <MessageSquare size={13} className="text-[#25D366]" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Scroll Indicator */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-8 pb-8 flex items-center justify-between text-white/50 text-[11px] uppercase tracking-[0.2em]">
        <span className="hidden sm:inline">{clientConfig.brand.brandName} Private Office · Ref. {property.id}</span>
        <button
          type="button"
          onClick={() => {
            if (onExploreClick) onExploreClick();
            else handleScrollTo('architectural-narrative');
          }}
          className="inline-flex items-center gap-2 hover:text-white transition-colors duration-300 mx-auto sm:mx-0"
        >
          <span>Explore Architectural Details</span>
          <ChevronDown size={14} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
};

