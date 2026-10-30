import React from 'react';
import { Quote, Sparkles, CheckCircle2 } from 'lucide-react';
import { Property } from '../../types/property';

interface PropertyNarrativeProps {
  property: Property;
}

export const PropertyNarrative: React.FC<PropertyNarrativeProps> = ({ property }) => {
  // Select a supporting architectural photo from the gallery if available
  const narrativeImage = property.gallery.find((g) => g.category === 'interior' || g.category === 'exterior') || property.gallery[0];

  return (
    <section id="architectural-narrative" className="py-20 sm:py-28 bg-[#181614] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Architectural Essay (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#C5A059] mb-4">
                <Sparkles size={13} />
                <span>ARCHITECTURAL CURATION & MONOGRAPH</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.12]">
                Conceived with Pure Sculptural Integrity
              </h2>
            </div>

            {/* Pull Quote */}
            <div className="relative pl-6 border-l-2 border-[#C5A059] py-2">
              <Quote size={24} className="text-[#C5A059]/40 mb-2" />
              <p className="font-serif text-xl sm:text-2xl italic text-[#EFECE6] leading-relaxed">
                "{property.tagline}"
              </p>
            </div>

            {/* Long-form Architectural Narrative */}
            <div className="space-y-5 text-white/80 font-light text-base sm:text-lg leading-relaxed">
              <p>
                {property.architecturalNarrative || property.description}
              </p>
              {property.architecturalNarrative && (
                <p className="text-white/70 text-base">
                  {property.description}
                </p>
              )}
            </div>

            {/* Curated Highlights List */}
            {property.locationHighlights && property.locationHighlights.length > 0 && (
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4 font-medium">
                  Curated Residence Distinctions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {property.locationHighlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-white/85">
                      <CheckCircle2 size={14} className="text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: High-Fidelity Architectural Photography Feature (5 cols) */}
          <div className="lg:col-span-5">
            {narrativeImage && (
              <div className="relative group">
                {/* Decorative Gold Accent Border */}
                <div className="absolute -inset-3 rounded-3xl border border-[#C5A059]/30 pointer-events-none transform translate-x-2 translate-y-2 transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />

                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#221F1C] shadow-2xl">
                  <img
                    src={narrativeImage.url}
                    alt={narrativeImage.altText || property.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12100E]/80 via-transparent to-transparent pointer-events-none" />

                  {narrativeImage.caption && (
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-xs text-white/90 font-light italic leading-snug">
                        {narrativeImage.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

