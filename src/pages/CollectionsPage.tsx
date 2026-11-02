import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Waves, Building, Mountain, Shield, Compass } from 'lucide-react';
import { getAssetSlotUrl } from '../config/assetSlots';

export interface ResidenceCollection {
  id: string;
  name: string;
  categoryFilter: string;
  headline: string;
  residenceCount: number;
  description: string;
  imageUrl: string;
  location: string;
  priceGuide: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

export const RESIDENCE_COLLECTIONS: ResidenceCollection[] = [
  {
    id: 'coastal-estates',
    name: 'Coastal Collection',
    categoryFilter: 'waterfront',
    headline: 'OCEANFRONT LIVING',
    residenceCount: 2,
    description: 'Oceanfront living at its purest. Dramatic cantilevered limestone pavilions, infinity reflecting pools, and private tidal access.',
    imageUrl: getAssetSlotUrl('PROPERTY_EXTERIOR_PRIMARY'),
    location: 'Goa & Western Coastline',
    priceGuide: 'From ₹38 Crore',
    icon: Waves
  },
  {
    id: 'sky-penthouses',
    name: 'Skyline Collection',
    categoryFilter: 'penthouse',
    headline: 'ELEVATED SKY HORIZONS',
    residenceCount: 2,
    description: 'Elevated residences in the city. Commanding 360-degree metropolitan skylines, private glass elevators, and double-height entertaining salons.',
    imageUrl: getAssetSlotUrl('PROPERTY_INTERIOR_SALON'),
    location: 'South Mumbai & Prime Metros',
    priceGuide: 'From ₹65 Crore',
    icon: Building
  },
  {
    id: 'alpine-manors',
    name: 'Heritage Collection',
    categoryFilter: 'villa',
    headline: 'TIMELESS HERITAGE',
    residenceCount: 2,
    description: 'Timeless design, modern comfort. Carved stone and cedar estates enveloped by lush permanent buffers and serene courtyards.',
    imageUrl: getAssetSlotUrl('PROPERTY_ARCHITECTURAL_ENTRANCE'),
    location: 'Himalayan Foothills & Sanctuaries',
    priceGuide: 'From ₹42 Crore',
    icon: Mountain
  },
  {
    id: 'master-enclaves',
    name: 'Botanical Master Enclaves',
    categoryFilter: 'residential_development',
    headline: 'COMMISSIONED ENCLAVES',
    residenceCount: 1,
    description: 'Ultra-low-density residential communities integrating mature olive groves, private security perimeters, and bespoke clubhouse pavilions.',
    imageUrl: getAssetSlotUrl('PROPERTY_EXTERIOR_POOL'),
    location: 'Alibaug & Coastal Sanctuaries',
    priceGuide: 'From ₹55 Crore',
    icon: Shield
  },
  {
    id: 'private-residences',
    name: 'Luxury City Residences',
    categoryFilter: 'apartment',
    headline: 'FULL-FLOOR SANCTUARIES',
    residenceCount: 1,
    description: 'Single-residence-per-floor architectural apartments featuring frameless panoramic glazing and acoustic serenity.',
    imageUrl: getAssetSlotUrl('PROPERTY_INTERIOR_MASTER_BEDROOM'),
    location: 'Central Capital Districts',
    priceGuide: 'From ₹28 Crore',
    icon: Compass
  }
];

export const CollectionsPage: React.FC = () => {
  // 3 Primary collections matching Reference Image Middle-Center
  const primaryCols = RESIDENCE_COLLECTIONS.slice(0, 3);
  const secondaryCols = RESIDENCE_COLLECTIONS.slice(3);

  return (
    <div
      className="collections-page-root marble-vein-backdrop"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        paddingTop: '110px',
        paddingBottom: '90px',
        zIndex: 10,
        overflow: 'hidden'
      }}
    >
      {/* Auric Flow Top Corner Framing */}
      <div className="auric-ribbon-top-right" />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        {/* Editorial Header matching Reference */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.6rem, 5vw, 4rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#24211D',
              lineHeight: 1.15,
              margin: '0 0 12px 0',
              letterSpacing: '-0.015em'
            }}
          >
            Collections
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              color: '#514B43',
              margin: 0,
              fontWeight: 400
            }}
          >
            Distinct residential collections, each with its own identity.
          </p>
        </div>

        {/* 3 Primary Collections Row matching Reference Image */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}
        >
          {primaryCols.map((col) => (
            <Link
              key={col.id}
              href={`/residences?type=${col.categoryFilter}`}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                textDecoration: 'none',
                border: '1.5px solid rgba(255, 255, 255, 0.85)',
                boxShadow: '0 18px 44px -10px rgba(41, 39, 34, 0.12)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="group"
            >
              {/* Image */}
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
                  alt={col.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="group-hover:scale-105"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(41, 39, 34, 0.50) 0%, transparent 65%)'
                  }}
                />
              </div>

              {/* Integrated Lower Crystal Glass Panel */}
              <div
                className="glass-collection-card"
                style={{
                  position: 'relative',
                  zIndex: 3,
                  margin: '16px',
                  padding: '20px 24px',
                  borderRadius: '20px',
                  background: 'rgba(255, 248, 238, 0.25)',
                  backdropFilter: 'blur(18px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                  border: '1px solid rgba(255, 255, 255, 0.78)',
                  boxShadow:
                    'inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95), inset 0 0 12px 0 rgba(216, 189, 138, 0.15), 0 4px 10px -2px rgba(20, 16, 12, 0.16), 0 18px 40px -4px rgba(20, 16, 12, 0.26), 0 0 24px 0 rgba(201, 154, 50, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
                }}
              >
                {/* Specular Flare Along Top Edge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '15%',
                    right: '15%',
                    height: '1.5px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95) 25%, #FFF0CD 50%, rgba(255, 255, 255, 0.95) 75%, transparent)',
                    pointerEvents: 'none',
                    filter: 'blur(0.4px)'
                  }}
                />
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.45rem',
                      fontWeight: 500,
                      color: '#24211D',
                      margin: '0 0 6px 0',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {col.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12.5px',
                      color: '#514B43',
                      margin: 0,
                      fontWeight: 400,
                      lineHeight: 1.5
                    }}
                  >
                    {col.description}
                  </p>
                </div>

                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 30%, #C99A32 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  <ArrowRight size={15} strokeWidth={2.4} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Supporting Curated Portfolios (Enclaves & Penthouses) */}
        {secondaryCols.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                color: '#292722',
                textAlign: 'center',
                marginBottom: '24px'
              }}
            >
              Additional Specialized Enclaves
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px'
              }}
            >
              {secondaryCols.map((col) => (
                <Link
                  key={col.id}
                  href={`/residences?type=${col.categoryFilter}`}
                  style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 12px 30px rgba(41, 39, 34, 0.08)'
                  }}
                  className="group"
                >
                  <img
                    src={col.imageUrl}
                    alt={col.name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(41, 39, 34, 0.6) 0%, transparent 60%)'
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 3,
                      padding: '16px 20px',
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(14px)',
                      margin: '12px',
                      borderRadius: '14px'
                    }}
                  >
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#292722', margin: '0 0 4px 0' }}>
                      {col.name}
                    </h4>
                    <p style={{ fontSize: '11px', color: '#68645D', margin: 0 }}>
                      {col.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
