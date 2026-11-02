import React from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { getAssetSlotUrl } from '../../config/assetSlots';

export const CollectionsShowcaseSection: React.FC = () => {
  const collections = [
    {
      id: 'coastal',
      title: 'Coastal Collection',
      description: 'Oceanfront living at its purest.',
      imageUrl: getAssetSlotUrl('PROPERTY_EXTERIOR_PRIMARY'),
      href: '/collections?type=waterfront'
    },
    {
      id: 'skyline',
      title: 'Skyline Collection',
      description: 'Elevated residences in the city.',
      imageUrl: getAssetSlotUrl('PROPERTY_INTERIOR_SALON'),
      href: '/collections?type=penthouse'
    },
    {
      id: 'heritage',
      title: 'Heritage Collection',
      description: 'Timeless design, modern comfort.',
      imageUrl: getAssetSlotUrl('PROPERTY_ARCHITECTURAL_ENTRANCE'),
      href: '/collections?type=villa'
    }
  ];

  return (
    <section
      id="collections-showcase"
      style={{
        position: 'relative',
        padding: '70px 0 60px 0',
        zIndex: 10
      }}
    >
      <div className="container">
        {/* Editorial Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#292722',
              lineHeight: 1.15,
              margin: '0 0 10px 0',
              letterSpacing: '-0.015em'
            }}
          >
            Collections
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.96rem',
              color: '#68645D',
              margin: 0,
              fontWeight: 300
            }}
          >
            Distinct residential collections, each with its own identity.
          </p>
        </div>

        {/* 3-Column Collections Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}
        >
          {collections.map((col) => (
            <Link
              key={col.id}
              href="/collections"
              style={{
                position: 'relative',
                borderRadius: '22px',
                overflow: 'hidden',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                textDecoration: 'none',
                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 16px 36px -10px rgba(41, 39, 34, 0.10)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="group"
            >
              {/* Background Architectural Image */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  zIndex: 1
                }}
              >
                <img
                  src={col.imageUrl}
                  alt={col.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="group-hover:scale-105"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(20, 16, 12, 0.20) 0%, transparent 55%)'
                  }}
                />
              </div>

              {/* Integrated Lower Crystal Glass Information Panel */}
              <div
                className="glass-collection-card"
                style={{
                  position: 'relative',
                  zIndex: 3,
                  margin: '14px',
                  padding: '18px 22px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.62) 0%, rgba(250, 246, 238, 0.44) 100%)',
                  backdropFilter: 'blur(18px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(150%)',
                  border: '1.2px solid rgba(255, 255, 255, 0.88)',
                  boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(216, 189, 138, 0.28), 0 14px 32px rgba(41, 39, 34, 0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.35rem',
                      fontWeight: 500,
                      color: '#292722',
                      margin: '0 0 4px 0',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {col.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      color: '#68645D',
                      margin: 0,
                      fontWeight: 300
                    }}
                  >
                    {col.description}
                  </p>
                </div>

                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 30%, #C99A32 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  <ArrowRight size={14} strokeWidth={2.4} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Collections Link */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link
            href="/collections"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#A9781F',
              textDecoration: 'none',
              padding: '8px 16px',
              borderBottom: '1px solid rgba(201, 154, 50, 0.4)'
            }}
          >
            <span>Explore All Collections</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

