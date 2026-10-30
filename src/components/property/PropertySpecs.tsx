import React from 'react';
import { Bed, Bath, Maximize2, Compass, Car, ArrowUpRight, Sparkles } from 'lucide-react';
import { Property } from '../../types/property';
import { propertyService } from '../../services/propertyService';

interface PropertySpecsProps {
  property: Property;
}

export const PropertySpecs: React.FC<PropertySpecsProps> = ({ property }) => {
  const formattedCarpet = propertyService.formatArea(property.carpetArea);
  const formattedBuiltUp = propertyService.formatArea(property.builtUpArea);
  const formattedPlot = property.plotArea ? propertyService.formatArea(property.plotArea) : null;

  // Primary spatial metric cards
  const coreMetrics = [
    {
      label: 'Bed Chambers',
      value: `${property.bedrooms} Suites`,
      detail: property.powderRooms ? `+ ${property.powderRooms} Powder Rooms` : 'All En-Suite',
      icon: Bed
    },
    {
      label: 'Bathrooms',
      value: `${property.bathrooms} Full Baths`,
      detail: 'Honed Marble Finishes',
      icon: Bath
    },
    {
      label: 'Carpet Area',
      value: formattedCarpet,
      detail: 'Internal Usable Space',
      icon: Maximize2
    },
    {
      label: 'Built-Up Area',
      value: formattedBuiltUp,
      detail: 'Total Architectural Envelope',
      icon: Compass
    },
    ...(formattedPlot
      ? [
          {
            label: 'Plot Domain',
            value: formattedPlot,
            detail: 'Private Curated Grounds',
            icon: Sparkles
          }
        ]
      : []),
    {
      label: 'Private Garage',
      value: `${property.parkingSpaces} Vehicles`,
      detail: 'Secure Covered Bays',
      icon: Car
    }
  ];

  return (
    <section id="specifications" className="py-20 sm:py-28 bg-[#FBFBF9] border-t border-[#EFECE6] text-[#12100E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="block text-[11px] uppercase tracking-[0.25em] text-[#C5A059] mb-3">
            ARCHITECTURAL DIMENSIONS & ATTRIBUTES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#12100E] leading-tight">
            Spatial Dimensions & Specifications
          </h2>
          <p className="mt-4 text-base text-[#6B655F] leading-relaxed">
            Every square foot is engineered with exacting spatial proportions, utilizing premium materials sourced across historical European quarries and master fabrication workshops.
          </p>
        </div>

        {/* Primary Spatial Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-16">
          {coreMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EFECE6] shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mb-4">
                    <Icon size={18} />
                  </div>
                  <span className="block text-[11px] uppercase tracking-[0.16em] text-[#8C827A] mb-1">
                    {metric.label}
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-normal text-[#12100E] block leading-snug">
                    {metric.value}
                  </span>
                </div>
                <span className="block text-[11px] text-[#A39990] mt-3 pt-3 border-t border-[#F2EFE9]">
                  {metric.detail}
                </span>
              </div>
            );
          })}
        </div>

        {/* Categorized Specifications Accordion / Grid */}
        {property.specifications && property.specifications.length > 0 && (
          <div className="mt-12 pt-12 border-t border-[#EFECE6]">
            <h3 className="font-serif text-2xl font-light text-[#12100E] mb-8">
              Technical & Material Palette
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {property.specifications.map((specCat, catIdx) => (
                <div
                  key={catIdx}
                  className="bg-white/80 p-6 sm:p-7 rounded-2xl border border-[#EFECE6]"
                >
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2EFE9]">
                    <span className="text-xs uppercase tracking-[0.18em] font-medium text-[#C5A059]">
                      {specCat.category}
                    </span>
                    <ArrowUpRight size={14} className="text-[#C5A059]/50" />
                  </div>

                  <ul className="space-y-3.5">
                    {specCat.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 text-xs">
                        <span className="text-[#8C827A]">{item.label}</span>
                        <span className="font-medium text-[#12100E] text-right">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

