import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass } from 'lucide-react';
import { Property } from '../../types/property';

interface SignatureResidencesSectionProps {
  leadProperty: Property | null;
  secondaryProperties?: Property[];
  allProperties?: Property[];
}

interface CuratedResidenceMeta {
  editorialName: string;
  originalName: string;
  slug: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  excerpt?: string;
  footprint: string;
  suites: string;
  grounds?: string;
  price: string;
  isFeatured?: boolean;
}

export const SignatureResidencesSection: React.FC<SignatureResidencesSectionProps> = ({
  leadProperty,
  secondaryProperties: _secondaryProperties = [],
  allProperties: _allProperties = []
}) => {
  // Curated metadata mapping 6 distinct residences to approved project data
  const curatedCatalog: CuratedResidenceMeta[] = [
    {
      editorialName: 'The Cliff Villa',
      originalName: 'The Aurelia Estate',
      slug: leadProperty?.slug || 'the-aurelia-estate',
      location: "Cap d'Antibes, France",
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85',
      imageAlt: "The Cliff Villa Clifftop Architecture overlooking Mediterranean",
      excerpt: "Perched dramatically upon a limestone sea cliff, this monumental estate integrates cantilevered travertine terraces and a 25-meter infinity pool that dissolves directly into the Mediterranean horizon.",
      footprint: '1,420 m² (15,280 sq.ft)',
      grounds: '4,800 m² Clifftop Plot',
      suites: '6 Master Suites · 8 Baths',
      price: '€48,000,000'
    },
    {
      editorialName: 'The Ocean Villa',
      originalName: 'The Ocean Crest',
      slug: 'the-ocean-crest',
      location: 'Palm Beach, Florida',
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'The Ocean Villa Curved Waterfront Architecture',
      footprint: '1,280 m²',
      suites: '5 Beds · 7 Baths',
      price: '$34,000,000'
    },
    {
      editorialName: 'The Garden Villa',
      originalName: 'The Elysian Gardens',
      slug: 'the-elysian-gardens',
      location: 'Lake Como, Italy',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'The Garden Villa Lake Como Estate',
      footprint: '1,150 m²',
      suites: '6 Beds · 7 Baths',
      price: '€22,000,000'
    },
    {
      editorialName: 'The Skyline Residence',
      originalName: 'The Celestia Penthouse',
      slug: 'the-celestia-penthouse',
      location: 'Monaco Harbor',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'The Skyline Residence Penthouse Architecture',
      footprint: '980 m²',
      suites: '4 Beds · 5 Baths',
      price: '€42,000,000'
    },
    {
      editorialName: 'The Beachfront Compound',
      originalName: 'The Solstice Residences',
      slug: 'the-solstice-residences',
      location: 'St. Barthélemy',
      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'The Beachfront Compound Coastal Architecture',
      footprint: '1,560 m²',
      suites: '7 Beds · 9 Baths',
      price: '$52,000,000'
    },
    {
      editorialName: 'The Hillside Retreat',
      originalName: 'The Highland Manor',
      slug: 'the-highland-manor',
      location: 'St. Moritz, Switzerland',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
      imageAlt: 'The Hillside Retreat Monumental Alpine Hillside Architecture',
      excerpt: 'Embedded into a dramatic alpine incline, this architectural masterpiece features multi-tiered cantilevers of blackened timber, local granite, and triple-insulated floor-to-ceiling panoramic glass facing the Engadin valley.',
      footprint: '1,380 m² (14,850 sq.ft)',
      grounds: '8,200 m² Mountain Plot & Private Helipad',
      suites: '5 Master Suites · Thermal Spa · 6 Baths',
      price: 'CHF 38,000,000',
      isFeatured: true
    }
  ];

  const flagship = curatedCatalog[0];
  const supportingResidences = curatedCatalog.slice(1);

  return (
    <section id="registry" className="section-registry">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <span className="eyebrow mb-2">
              <Compass size={13} className="text-[#B89552]" />
              <span>THE INAUGURAL REGISTRY</span>
            </span>
            <h2 className="section-title">
              Six Distinct Architectural Manifestos
            </h2>
          </div>
          <Link
            href="/residences"
            className="btn btn-outline-dark"
          >
            <span>View Full Portfolio</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Explicit Demonstration Notice Bar */}
        <div className="demo-notice-bar">
          <span className="text-[#B89552] text-lg font-serif leading-none">*</span>
          <div>
            <strong>Demonstration Portfolio Notice</strong> &mdash; Architectural specifications and guide valuations reflect conceptual master commissions. Formal private dossiers and verified ownership records are issued under confidential non-disclosure protocol via our Advisory Desk.
          </div>
        </div>

        {/* 1. Flagship Spread: Residence 1 - The Cliff Villa */}
        <div id="flagship-residence" className="flagship-spread">
          <div className="flagship-media">
            <img
              src={flagship.imageUrl}
              alt={flagship.imageAlt}
              className="w-full h-full object-cover"
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
              <p className="residence-excerpt">{flagship.excerpt}</p>

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
                  <span className="specs-label">Suites &amp; Amenities</span>
                  <span className="specs-val">{flagship.suites}</span>
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

        {/* 2. 2-Column Matrix for Remaining Properties */}
        <div className="registry-matrix-grid">
          {supportingResidences.map((prop) => (
            <div
              key={prop.slug}
              className={`residence-card ${prop.isFeatured ? 'residence-card-featured' : ''}`}
            >
              <div
                className="card-media-wrap"
                style={prop.isFeatured ? { aspectRatio: '21/9' } : {}}
              >
                <img
                  src={prop.imageUrl}
                  alt={prop.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="card-body">
                <div>
                  <span className="residence-location">{prop.location}</span>
                  <h3 className="residence-name">{prop.editorialName}</h3>

                  {prop.excerpt && (
                    <p className="residence-excerpt">{prop.excerpt}</p>
                  )}

                  <div className="specs-table">
                    <div className="specs-row">
                      <span className="specs-label">Interior Footprint</span>
                      <span className="specs-val">{prop.footprint}</span>
                    </div>
                    {prop.grounds && (
                      <div className="specs-row">
                        <span className="specs-label">Grounds</span>
                        <span className="specs-val">{prop.grounds}</span>
                      </div>
                    )}
                    <div className="specs-row">
                      <span className="specs-label">Suites &amp; Baths</span>
                      <span className="specs-val">{prop.suites}</span>
                    </div>
                  </div>

                  <div className="price-tag">
                    {prop.price}
                    <span className="price-disclaimer">* Demonstrative Guide Valuation</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3 items-center">
                  <Link
                    href={`/residence/${prop.slug}`}
                    className="btn btn-solid-dark"
                  >
                    <span>Inspect Residence</span>
                    <ArrowRight size={14} />
                  </Link>
                  <a
                    href="#concierge"
                    className="btn btn-outline-dark"
                  >
                    <span>Enquire</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
