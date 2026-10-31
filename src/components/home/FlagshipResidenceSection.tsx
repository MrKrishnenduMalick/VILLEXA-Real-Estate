import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass } from 'lucide-react';
import { Property } from '../../types/property';

interface FlagshipResidenceSectionProps {
  leadProperty?: Property | null;
}

export const FlagshipResidenceSection: React.FC<FlagshipResidenceSectionProps> = ({ leadProperty }) => {
  const flagship = {
    editorialName: 'The Cliff Villa',
    originalName: leadProperty?.name || 'The Aurelia Estate',
    slug: leadProperty?.slug || 'the-aurelia-estate',
    location: "Cap d'Antibes, France",
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    imageAlt: "The Cliff Villa Clifftop Architecture overlooking the Mediterranean",
    description: "Perched dramatically upon a limestone sea cliff, this monumental estate integrates cantilevered travertine terraces and a 25-meter infinity pool that dissolves directly into the Mediterranean horizon. Conceived as a series of cascading pavilions, the residence utilizes thermal limestone envelopes, frameless floor-to-ceiling glass, and internal courtyards to orchestrate natural light and ocean cross-ventilation throughout all seasons.",
    footprint: '1,420 m² (15,280 sq.ft)',
    grounds: '4,800 m² Clifftop Plot',
    suites: '6 Master Suites · 8 Baths',
    materials: 'Honed Roman Travertine & Bronze',
    price: '€48,000,000'
  };

  return (
    <section id="flagship-residence" className="section-flagship py-12 sm:py-16">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row mb-10 pb-6">
          <div>
            <span className="eyebrow mb-2">
              <Compass size={13} className="text-[#B89552]" />
              <span>FLAGSHIP ARCHITECTURAL FEATURE</span>
            </span>
            <h2 className="section-title">
              The Inaugural Commission
            </h2>
          </div>
          <Link
            href="/residences"
            className="btn btn-outline-dark"
          >
            <span>All Residences</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Master Flagship Architectural Spread */}
        <div className="flagship-spread">
          <div className="flagship-media bg-[#EAE5DC]">
            <img
              src={flagship.imageUrl}
              alt={flagship.imageAlt}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                e.currentTarget.src = '/real-estate-hero-frames/frame-00240.webp';
              }}
            />
            {/* Floating Translucent Information Badge */}
            <div className="floating-specs-badge">
              <span>Flagship Commission</span>
              <strong>{flagship.editorialName} &middot; {flagship.location}</strong>
            </div>
          </div>

          <div className="flagship-details">
            <div>
              <span className="residence-location">{flagship.location}</span>
              <h3 className="residence-name">{flagship.editorialName}</h3>
              <p className="residence-excerpt">{flagship.description}</p>

              <div className="specs-table">
                <div className="specs-row">
                  <span className="specs-label">Interior Footprint</span>
                  <span className="specs-val">{flagship.footprint}</span>
                </div>
                <div className="specs-row">
                  <span className="specs-label">Private Grounds</span>
                  <span className="specs-val">{flagship.grounds}</span>
                </div>
                <div className="specs-row">
                  <span className="specs-label">Suites &amp; Bathrooms</span>
                  <span className="specs-val">{flagship.suites}</span>
                </div>
                <div className="specs-row">
                  <span className="specs-label">Structural Material</span>
                  <span className="specs-val">{flagship.materials}</span>
                </div>
              </div>

              <div className="price-tag">
                {flagship.price}
                <span className="price-disclaimer">* Demonstrative Guide Valuation</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                href={`/residence/${flagship.slug}`}
                className="btn btn-solid-dark"
              >
                <span>Acquisition Dossier</span>
                <ArrowRight size={14} />
              </Link>
              <a
                href="#concierge"
                className="btn btn-outline-dark"
              >
                <span>Private Enquiry</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

