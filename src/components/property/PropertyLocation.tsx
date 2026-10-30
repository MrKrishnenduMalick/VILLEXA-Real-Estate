import React from 'react';
import { MapPin, Compass, Navigation, CheckCircle2 } from 'lucide-react';
import { PropertyLocation as PropertyLocationType } from '../../types/property';

interface PropertyLocationProps {
  propertyName: string;
  location: PropertyLocationType;
  address: string;
  highlights: string[];
}

export const PropertyLocation: React.FC<PropertyLocationProps> = ({
  propertyName,
  location,
  address,
  highlights
}) => {
  const hasCoordinates = Boolean(
    location.coordinates?.latitude && location.coordinates?.longitude
  );

  return (
    <section id="location" className="py-20 sm:py-28 bg-[#FBFBF9] border-t border-[#EFECE6] text-[#12100E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Geographical Information & Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#C5A059] mb-3">
                <MapPin size={13} />
                <span>GEOGRAPHIC SANCTUARY · {propertyName}</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#12100E] leading-tight">
                Prime Clifftop & Urban Sanctuaries
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#6B655F] font-light leading-relaxed">
                Selected for unparalleled privacy, uninterrupted horizons, and protected green or coastal reserve boundaries.
              </p>
            </div>

            {/* Address Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E4DC] shadow-sm space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C827A] block">
                Official Registered Address
              </span>
              <p className="font-serif text-xl sm:text-2xl text-[#12100E] font-normal leading-relaxed">
                {address}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#8C827A]">
                <span className="px-3 py-1 rounded-full bg-[#F5F3EF] border border-[#E8E4DC]">
                  {location.city}
                </span>
                {location.state && (
                  <span className="px-3 py-1 rounded-full bg-[#F5F3EF] border border-[#E8E4DC]">
                    {location.state}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-[#F5F3EF] border border-[#E8E4DC]">
                  {location.country}
                </span>
                {location.region && (
                  <span className="px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20">
                    {location.region}
                  </span>
                )}
              </div>
            </div>

            {/* Location Highlights */}
            {highlights && highlights.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-medium">
                  Locale Distinctions & Strategic Access
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E8E4DC] text-xs text-[#4A4540]">
                      <CheckCircle2 size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Verified Coordinates & Cartographic Monograph (5 cols) */}
          <div className="lg:col-span-5 bg-[#181614] text-white p-8 sm:p-10 rounded-3xl border border-[#2A2724] shadow-xl relative overflow-hidden">
            {/* Background Compass Watermark */}
            <Compass size={240} className="absolute -right-16 -bottom-16 text-white/[0.03] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-[#C5A059]/20 text-[#EFECE6] border border-[#C5A059]/30">
                <Navigation size={12} /> Geodetic Coordinates
              </span>

              <h3 className="font-serif text-2xl font-light text-white">
                Architectural Positioning
              </h3>

              {hasCoordinates ? (
                <div className="space-y-4 py-4 border-y border-white/10">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-wider text-white/50">Latitude</span>
                    <span className="font-mono text-base text-[#C5A059]">
                      {location.coordinates?.latitude}° N
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-wider text-white/50">Longitude</span>
                    <span className="font-mono text-base text-[#C5A059]">
                      {location.coordinates?.longitude}° E
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-wider text-white/50">Territory Jurisdiction</span>
                    <span className="text-xs text-white/80">{location.state || location.city}, {location.country}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/70 py-4 border-y border-white/10 font-light">
                  Exact geodetic benchmarks and access coordinates are provided under signed non-disclosure agreement during private viewing appointments.
                </p>
              )}

              <p className="text-xs text-white/60 font-light leading-relaxed">
                Private chauffeurs and helicopter charters can be coordinated through the BILEKSA Concierge desk for prospective owner site inspections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
