import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { Property } from '../../types/property';
import { PropertyCard } from './PropertyCard';

interface PropertyAdjacentNavProps {
  currentProperty: Property;
  prevProperty: Property | null;
  nextProperty: Property | null;
  relatedProperties: Property[];
}

export const PropertyAdjacentNav: React.FC<PropertyAdjacentNavProps> = ({
  prevProperty,
  nextProperty,
  relatedProperties
}) => {
  return (
    <section className="py-20 sm:py-28 bg-[#F5F3EF] border-t border-[#EFECE6] text-[#12100E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* 1. Next & Previous Residence Navigation Bar */}
        {(prevProperty || nextProperty) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {/* Previous Residence */}
            {prevProperty ? (
              <Link
                href={`/residence/${prevProperty.slug}`}
                className="group p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E4DC] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#E8E4DC] flex items-center justify-center shrink-0 group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-300">
                  <ArrowLeft size={18} className="text-[#8C827A] group-hover:text-white" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
                    Previous Residence
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-[#12100E] font-normal truncate group-hover:text-[#9A7B39] transition-colors">
                    {prevProperty.name}
                  </h4>
                  <span className="text-xs text-[#8C827A] truncate block mt-0.5">
                    {prevProperty.location.city}, {prevProperty.location.country}
                  </span>
                </div>
              </Link>
            ) : <div />}

            {/* Next Residence */}
            {nextProperty ? (
              <Link
                href={`/residence/${nextProperty.slug}`}
                className="group p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E4DC] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-5 text-right"
              >
                <div className="overflow-hidden flex-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
                    Next Residence
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-[#12100E] font-normal truncate group-hover:text-[#9A7B39] transition-colors">
                    {nextProperty.name}
                  </h4>
                  <span className="text-xs text-[#8C827A] truncate block mt-0.5">
                    {nextProperty.location.city}, {nextProperty.location.country}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#E8E4DC] flex items-center justify-center shrink-0 group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-300">
                  <ArrowRight size={18} className="text-[#8C827A] group-hover:text-white" />
                </div>
              </Link>
            ) : <div />}
          </div>
        )}

        {/* 2. Related Private Residences Showcase */}
        {relatedProperties.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#C5A059] mb-3">
                  <Compass size={13} />
                  <span>COMPLEMENTARY COMMISSIONS</span>
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#12100E]">
                  Related Architectural Residences
                </h3>
              </div>
              <Link
                href="/residences"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C5A059] hover:text-[#9A7B39] font-medium transition-colors"
              >
                <span>View Full Portfolio</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

