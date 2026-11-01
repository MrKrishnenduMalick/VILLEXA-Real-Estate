import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass } from 'lucide-react';
import { getAssetSlotUrl } from '../../config/assetSlots';

interface CuratedResidence {
  editorialName: string;
  originalName: string;
  slug: string;
  location: string;
  imageUrl: string;
  imageAlt: string;
  excerpt: string;
  footprint: string;
  grounds?: string;
  suites: string;
  price: string;
  aspectRatio?: string;
  layoutStyle?: 'split-left' | 'split-right' | 'cinematic-wide';
}

export const CuratedCollectionSection: React.FC = () => {
  // Five distinctive secondary architectural residences
  const residences: CuratedResidence[] = [
    {
      editorialName: 'The Ocean Villa',
      originalName: 'The Ocean Crest',
      slug: 'the-ocean-crest',
      location: 'Palm Beach, Florida',
      imageUrl: getAssetSlotUrl('PROPERTY_EXTERIOR_PRIMARY'),
      imageAlt: 'The Ocean Villa Curved Waterfront Architecture',
      excerpt: 'Curved frameless glass curtain walls and private oceanfront pool loggias engineered to dissolve into tidal rhythms.',
      footprint: '1,280 m² (13,780 sq.ft)',
      suites: '5 Beds · 7 Baths',
      price: '$34,000,000',
      aspectRatio: '16/10',
      layoutStyle: 'split-left'
    },
    {
      editorialName: 'The Garden Villa',
      originalName: 'The Elysian Gardens',
      slug: 'the-elysian-gardens',
      location: 'Lake Como, Italy',
      imageUrl: getAssetSlotUrl('PROPERTY_GALLERY_ATRIUM'),
      imageAlt: 'The Garden Villa Lake Como Estate',
      excerpt: 'Monumental local granite estate surrounded by tiered botanical terraces, centuries-old cypress, and private lakeside jetty.',
      footprint: '1,150 m² (12,380 sq.ft)',
      suites: '6 Beds · 7 Baths',
      price: '€22,000,000',
      aspectRatio: '16/10',
      layoutStyle: 'split-right'
    },
    {
      editorialName: 'The Skyline Residence',
      originalName: 'The Celestia Penthouse',
      slug: 'the-celestia-penthouse',
      location: 'Monaco Harbor',
      imageUrl: getAssetSlotUrl('PROPERTY_INTERIOR_MASTER_BEDROOM'),
      imageAlt: 'The Skyline Residence Penthouse Architecture',
      excerpt: 'Triplex sky terrace cantilevered over the Mediterranean port with private glass swimming pool and direct helipad access.',
      footprint: '980 m² (10,550 sq.ft)',
      suites: '4 Beds · 5 Baths',
      price: '€42,000,000',
      aspectRatio: '16/10',
      layoutStyle: 'split-left'
    },
    {
      editorialName: 'The Beachfront Compound',
      originalName: 'The Solstice Residences',
      slug: 'the-solstice-residences',
      location: 'St. Barthélemy',
      imageUrl: getAssetSlotUrl('PROPERTY_EXTERIOR_POOL'),
      imageAlt: 'The Beachfront Compound Coastal Architecture',
      excerpt: 'Secluded multi-pavilion enclave constructed of bleached teak and volcanic basalt directly upon white coral sands.',
      footprint: '1,560 m² (16,800 sq.ft)',
      suites: '7 Beds · 9 Baths',
      price: '$52,000,000',
      aspectRatio: '16/10',
      layoutStyle: 'split-right'
    },
    {
      editorialName: 'The Hillside Retreat',
      originalName: 'The Highland Manor',
      slug: 'the-highland-manor',
      location: 'St. Moritz, Switzerland',
      imageUrl: getAssetSlotUrl('PROPERTY_ARCHITECTURAL_ENTRANCE'),
      imageAlt: 'The Hillside Retreat Monumental Alpine Architecture',
      excerpt: 'Embedded into a dramatic alpine incline, this architectural masterpiece features multi-tiered cantilevers of blackened timber, local granite, and triple-insulated floor-to-ceiling panoramic glass facing the Engadin valley.',
      footprint: '1,380 m² (14,850 sq.ft)',
      grounds: '8,200 m² Mountain Plot & Private Helipad',
      suites: '5 Master Suites · Thermal Spa · 6 Baths',
      price: 'CHF 38,000,000',
      aspectRatio: '21/9',
      layoutStyle: 'cinematic-wide'
    }
  ];

  const gridResidences = residences.slice(0, 4);
  const alpinePanorama = residences[4];

  return (
    <section id="registry" className="section-registry py-12 sm:py-16">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row mb-8 pb-5">
          <div>
            <span className="eyebrow mb-2">
              <Compass size={13} className="text-[#B89552]" />
              <span>THE RESIDENCE REGISTRY</span>
            </span>
            <h2 className="section-title">
              The Masterwork Registry &middot; Six Private Commissions
            </h2>
            <p className="mt-3 text-base font-normal leading-relaxed max-w-2xl">
              Comprising our flagship Aurelia commission alongside five autonomous architectural masterworks across Mediterranean cliffs, Alpine crests, and secluded island shores.
            </p>
          </div>
          <Link
            href="/residences"
            className="btn btn-outline-dark"
          >
            <span>Explore Complete Registry (6)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Demonstration Notice Bar */}
        <div className="demo-notice-bar mb-10">
          <span className="text-[#B89552] text-lg font-serif leading-none">*</span>
          <div>
            <strong>Demonstration Portfolio Notice</strong> &mdash; Architectural specifications, master plans, and guide valuations reflect conceptual master commissions. Formal private dossiers and verified ownership records are issued under confidential non-disclosure protocol via our Advisory Desk.
          </div>
        </div>

        {/* 2x2 Matrix for Waterfront, Lake, Penthouse, and Island Estates */}
        <div className="registry-matrix-grid mb-10">
          {gridResidences.map((prop, idx) => {
            const fallbackFrame = `/real-estate-hero-frames/frame-${String((idx + 1) * 40).padStart(5, '0')}.webp`;
            return (
              <div
                key={prop.slug}
                className="residence-card"
              >
                <div
                  className="card-media-wrap bg-[#070C18]"
                >
                  <img
                    src={prop.imageUrl}
                    alt={prop.imageAlt}
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = fallbackFrame;
                    }}
                  />
                </div>

                <div className="card-body">
                  <div>
                    <span className="residence-location">{prop.location}</span>
                    <h3 className="residence-name">{prop.editorialName}</h3>
                    <p className="residence-excerpt">{prop.excerpt}</p>

                    <div className="specs-table">
                      <div className="specs-row">
                        <span className="specs-label">Interior Footprint</span>
                        <span className="specs-val">{prop.footprint}</span>
                      </div>
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
            );
          })}
        </div>

        {/* Featured Alpine Panorama Spread (Residence 6 - The Hillside Retreat) */}
        {alpinePanorama && (
          <div className="residence-card residence-card-featured">
            <div className="card-media-wrap bg-[#EAE5DC]" style={{ aspectRatio: '21/9' }}>
              <img
                src={alpinePanorama.imageUrl}
                alt={alpinePanorama.imageAlt}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = '/real-estate-hero-frames/frame-00200.webp';
                }}
              />
              <div className="floating-specs-badge">
                <span>Alpine Master Commission</span>
                <strong>{alpinePanorama.editorialName} &middot; {alpinePanorama.location}</strong>
              </div>
            </div>

            <div className="card-body">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <span className="residence-location">{alpinePanorama.location}</span>
                  <h3 className="residence-name">{alpinePanorama.editorialName}</h3>
                  <p className="residence-excerpt">{alpinePanorama.excerpt}</p>
                </div>

                <div className="lg:col-span-5">
                  <div className="specs-table">
                    <div className="specs-row">
                      <span className="specs-label">Footprint</span>
                      <span className="specs-val">{alpinePanorama.footprint}</span>
                    </div>
                    {alpinePanorama.grounds && (
                      <div className="specs-row">
                        <span className="specs-label">Grounds</span>
                        <span className="specs-val">{alpinePanorama.grounds}</span>
                      </div>
                    )}
                    <div className="specs-row">
                      <span className="specs-label">Accommodations</span>
                      <span className="specs-val">{alpinePanorama.suites}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                    <div className="price-tag mb-0">
                      {alpinePanorama.price}
                      <span className="price-disclaimer">* Demonstrative Guide Valuation</span>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/residence/${alpinePanorama.slug}`}
                        className="btn btn-solid-dark"
                      >
                        <span>Inspect Alpine Estate</span>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

