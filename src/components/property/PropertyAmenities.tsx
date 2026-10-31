import React from 'react';
import { Sparkles, Waves, ShieldCheck, Sun, Wine, Trees, KeyRound, Wifi, Dumbbell, Flame } from 'lucide-react';

interface PropertyAmenitiesProps {
  amenities: string[];
}

export const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({ amenities }) => {
  if (!amenities || amenities.length === 0) return null;

  // Icon mapping heuristic based on keywords
  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('pool') || lower.includes('water')) return Waves;
    if (lower.includes('spa') || lower.includes('sauna') || lower.includes('wellness')) return Flame;
    if (lower.includes('wine') || lower.includes('cellar') || lower.includes('vault')) return Wine;
    if (lower.includes('solar') || lower.includes('energy') || lower.includes('power')) return Sun;
    if (lower.includes('garden') || lower.includes('grove') || lower.includes('landscape') || lower.includes('courtyard')) return Trees;
    if (lower.includes('staff') || lower.includes('security') || lower.includes('guard')) return ShieldCheck;
    if (lower.includes('gym') || lower.includes('fitness')) return Dumbbell;
    if (lower.includes('automation') || lower.includes('smart') || lower.includes('network')) return Wifi;
    if (lower.includes('elevator') || lower.includes('lift') || lower.includes('concierge')) return KeyRound;
    return Sparkles;
  };

  return (
    <section id="amenities" className="py-20 sm:py-28 bg-[#12100E]/70 backdrop-blur-2xl text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-3xl mb-14">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#C5A059] mb-3">
            <Sparkles size={13} />
            <span>BESPOKE APPOINTMENTS & AMENITIES</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight">
            Curated Lifestyle & Privileges
          </h2>
          <p className="mt-4 text-base text-white/70 font-light leading-relaxed">
            Private resort wellness facilities, discreet dedicated service quarters, and advanced independent infrastructure engineered for absolute privacy and comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity, idx) => {
            const Icon = getAmenityIcon(amenity);
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#C5A059]/40 transition-all duration-300 flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center shrink-0 group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-300">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-light text-white group-hover:text-[#EFECE6] transition-colors">
                    {amenity}
                  </h4>
                  <span className="text-[11px] uppercase tracking-wider text-white/40 block mt-1">
                    Signature In-Residence Inclusions
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

