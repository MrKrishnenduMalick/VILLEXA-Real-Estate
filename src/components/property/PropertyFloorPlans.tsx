import React, { useState } from 'react';
import { Layers, Maximize2, X, Compass, Image as ImageIcon } from 'lucide-react';
import { PropertyFloorPlan } from '../../types/property';
import { propertyService } from '../../services/propertyService';
import { useClientConfig } from '../../context/ClientConfigContext';

interface PropertyFloorPlansProps {
  propertyName: string;
  floorPlans?: PropertyFloorPlan[];
}

export const PropertyFloorPlans: React.FC<PropertyFloorPlansProps> = ({
  propertyName,
  floorPlans
}) => {
  const clientConfig = useClientConfig();
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Respect client configuration toggle
  if (!clientConfig.features.enableFloorPlans) {
    return null;
  }

  const plans = floorPlans && floorPlans.length > 0 ? floorPlans : [];

  if (plans.length === 0) {
    return null;
  }

  const currentPlan = plans[activePlanIndex] || plans[0];
  const isFailed = failedImages[currentPlan.planImageUrl];

  const handleImageError = (url: string) => {
    setFailedImages((prev) => ({ ...prev, [url]: true }));
  };

  return (
    <section id="floor-plans" className="py-20 sm:py-28 bg-[#F5F3EF] border-t border-[#EFECE6] text-[#12100E]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#C5A059] mb-3">
            <Layers size={13} />
            <span>ARCHITECTURAL BLUEPRINTS & VOLUMES</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#12100E] leading-tight">
            Floor Plans & Schematics
          </h2>
          <p className="mt-4 text-base text-[#6B655F] leading-relaxed">
            Examine the spatial choreography, dual-aspect sightlines, and circulation corridors across each architectural level.
          </p>
        </div>

        {/* Level Switcher Tabs */}
        {plans.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {plans.map((plan, idx) => {
              const isActive = idx === activePlanIndex;
              return (
                <button
                  key={plan.id || idx}
                  type="button"
                  onClick={() => setActivePlanIndex(idx)}
                  className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#12100E] text-white shadow-md'
                      : 'bg-white text-[#6B655F] hover:bg-[#EFECE6] border border-[#E8E4DC]'
                  }`}
                >
                  {plan.level || `Level 0${idx + 1}`}
                </button>
              );
            })}
          </div>
        )}

        {/* Floor Plan Display Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Blueprint (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E4DC] shadow-sm relative group">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#FAF9F6] border border-[#F2EFE9] flex items-center justify-center">
              {isFailed ? (
                <div className="text-center p-8 text-[#8C827A]">
                  <ImageIcon size={36} className="mx-auto mb-2 opacity-40 text-[#C5A059]" />
                  <p className="text-xs uppercase tracking-widest">Architectural schematic available upon private request</p>
                </div>
              ) : (
                <img
                  src={currentPlan.planImageUrl}
                  alt={currentPlan.title || `${propertyName} Plan`}
                  onError={() => handleImageError(currentPlan.planImageUrl)}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              )}

              {/* Enlarge Blueprint Button */}
              {!isFailed && (
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(true)}
                  className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#12100E]/80 hover:bg-[#12100E] text-white text-xs uppercase tracking-wider backdrop-blur-md transition-colors"
                >
                  <Maximize2 size={13} />
                  <span>Enlarge Blueprint</span>
                </button>
              )}
            </div>
          </div>

          {/* Plan Details & Area Spec (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-sm space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
                {currentPlan.level}
              </span>
              <h3 className="font-serif text-2xl font-normal text-[#12100E]">
                {currentPlan.title}
              </h3>
            </div>

            {currentPlan.area && (
              <div className="p-4 rounded-2xl bg-[#FBFBF9] border border-[#EFECE6]">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C827A] block mb-1">
                  Enclosed Usable Volume
                </span>
                <span className="font-serif text-2xl font-light text-[#12100E] block">
                  {propertyService.formatArea(currentPlan.area)}
                </span>
              </div>
            )}

            {currentPlan.description && (
              <p className="text-sm text-[#6B655F] leading-relaxed">
                {currentPlan.description}
              </p>
            )}

            <div className="pt-4 border-t border-[#F2EFE9] space-y-2 text-xs text-[#8C827A]">
              <div className="flex items-center gap-2">
                <Compass size={14} className="text-[#C5A059]" />
                <span>True north orientation calibrated for cross-ventilation</span>
              </div>
              <p className="text-[11px] text-[#A39990] italic">
                * Architectural schematics subject to final structural registration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint Zoom Modal */}
      {isZoomModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#12100E]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn"
        >
          <div className="flex items-center justify-between text-white/80 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059]">
                {propertyName} · {currentPlan.level}
              </span>
              <h4 className="font-serif text-lg text-white">
                {currentPlan.title}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 max-h-[82vh]">
            <img
              src={currentPlan.planImageUrl}
              alt={currentPlan.title}
              className="max-w-full max-h-full object-contain rounded-xl bg-white p-6 shadow-2xl"
            />
          </div>

          <div className="text-center text-white/60 text-xs py-2">
            Click anywhere or press Esc to return to the residence monograph.
          </div>
        </div>
      )}
    </section>
  );
};

