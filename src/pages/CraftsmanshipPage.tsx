import React from 'react';
import { Compass, Sun, Layers, Shield, Building, Home, Leaf } from 'lucide-react';
import { useClientConfig } from '../context/ClientConfigContext';
import { getAssetSlotUrl } from '../config/assetSlots';

export const CraftsmanshipPage: React.FC = () => {
  const config = useClientConfig();
  const brandDisplayName = config?.brand?.brandName || 'VILLEXA';

  // 4 Features shown in Reference Image Middle-Right
  const craftsmanshipFeatures = [
    {
      id: 'architecture',
      title: 'Architecture',
      description: 'Timeless forms with modern sensibility.',
      detail: 'Monolithic lines, passive solar choreography, and structural equilibrium.',
      icon: Building
    },
    {
      id: 'materials',
      title: 'Materials',
      description: 'Curated, sustainable and enduring.',
      detail: 'Vein-cut travertine, honed limestone, patinated raw bronze, and European oak.',
      icon: Layers
    },
    {
      id: 'interiors',
      title: 'Interiors',
      description: 'Thoughtful spaces, refined to perfection.',
      detail: 'Seven-metre volume ceilings, custom joinery, and frameless acoustic glazing.',
      icon: Home
    },
    {
      id: 'sustainability',
      title: 'Sustainability',
      description: 'Designed for a lighter, greener future.',
      detail: 'Independent micro-grids, rainwater harvesting, and bioclimatic envelopes.',
      icon: Leaf
    }
  ];

  // 4 Core Design Pillars (Satisfies experienceAuditAndPages.test.ts)
  const pillars = [
    {
      title: 'Light as Living Sculpture',
      tagline: 'Solar Orientation & Volumetric Illumination',
      description: 'Calculated building orientation, frameless triple-track glass, and deep cantilevers choreograph dynamic natural illumination across daylight cycles.',
      icon: Sun,
      image: getAssetSlotUrl('PROPERTY_INTERIOR_SALON')
    },
    {
      title: 'Noble Materiality',
      tagline: 'Authentic Geological & Timber Provenance',
      description: 'Vein-cut Roman travertine, honed Jura limestone, patinated raw bronze, and sustainable old-growth European oak.',
      icon: Layers,
      image: getAssetSlotUrl('PROPERTY_GALLERY_MATERIALITY')
    },
    {
      title: 'Dissolving Boundaries',
      tagline: 'Seamless Indoor-Outdoor Topography',
      description: 'Disappearing pocket glazed walls, continuous flush stone flooring, and reflecting water basins dissolve the threshold to natural horizons.',
      icon: Compass,
      image: getAssetSlotUrl('PROPERTY_EXTERIOR_POOL')
    },
    {
      title: 'Enduring Legacy Equity',
      tagline: 'Multigenerational Structural Permanence',
      description: 'Monolithic reinforced foundations, subterranean vaulting, independent solar micro-grids, and bioclimatic envelopes.',
      icon: Shield,
      image: getAssetSlotUrl('PROPERTY_ARCHITECTURAL_ENTRANCE')
    }
  ];

  // 4 Commission Steps (Satisfies experienceAuditAndPages.test.ts)
  const processSteps = [
    {
      step: '01',
      title: 'Topographical & Solar Synthesis',
      description: 'Deep microclimate analysis, sightline preservation studies, and solar tracking to determine the optimal residential footprint.'
    },
    {
      step: '02',
      title: 'Volumetric & Acoustic Choreography',
      description: 'Proportioning grand receiving salons, private master quarters, and service corridors for effortless acoustic calm.'
    },
    {
      step: '03',
      title: 'Quarry Selection & Master Joinery',
      description: 'Direct quarry inspection of individual limestone and marble blocks, paired with custom atelier bronze and timber fabrication.'
    },
    {
      step: '04',
      title: 'Turnkey Architectural Delivery',
      description: 'Comprehensive structural completion, integrated home automation, landscape maturation, and private client onboarding.'
    }
  ];

  return (
    <div
      className="craftsmanship-page-root marble-vein-backdrop"
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
        {/* Editorial Header matching Reference Image Middle-Right */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 44px auto' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.6rem, 5vw, 4rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#292722',
              lineHeight: 1.15,
              margin: '0 0 12px 0',
              letterSpacing: '-0.015em'
            }}
          >
            Craftsmanship
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              color: '#68645D',
              margin: 0,
              fontWeight: 300
            }}
          >
            The detail behind every {brandDisplayName} residence.
          </p>
        </div>

        {/* Master Split Composition matching Reference Image Middle-Right */}
        <div
          className="glass-champagne"
          style={{
            position: 'relative',
            borderRadius: '26px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(249, 247, 243, 0.68) 100%)',
            backdropFilter: 'blur(20px) saturate(145%)',
            WebkitBackdropFilter: 'blur(20px) saturate(145%)',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 24px 60px -10px rgba(41, 39, 34, 0.12)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            alignItems: 'stretch',
            marginBottom: '48px'
          }}
        >
          {/* Left: Large Architectural Photo with Auric Curve Accent */}
          <div
            style={{
              position: 'relative',
              minHeight: '440px',
              overflow: 'hidden'
            }}
          >
            <img
              src={getAssetSlotUrl('PROPERTY_GALLERY_MATERIALITY')}
              alt="Craftsmanship and Materiality"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {/* Curved Golden Light Ribbon Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/assets/auric-flow-corner.svg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.65,
                mixBlendMode: 'screen',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(41, 39, 34, 0.2) 0%, transparent 80%)'
              }}
            />
          </div>

          {/* Right: 4 Vertical Floating Crystal Glass List Items with Gold Icons */}
          <div
            style={{
              padding: '36px 38px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '16px'
            }}
          >
            {craftsmanshipFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="glass-crystal"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(241, 235, 225, 0.58) 100%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 6px 18px rgba(41, 39, 34, 0.05)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(201, 154, 50, 0.12)',
                      border: '1px solid rgba(201, 154, 50, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C99A32',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    <Icon size={18} strokeWidth={2} />
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        color: '#292722',
                        margin: '0 0 3px 0'
                      }}
                    >
                      {feat.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        color: '#68645D',
                        margin: 0,
                        lineHeight: 1.5,
                        fontWeight: 400
                      }}
                    >
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Architectural Design Pillars Grid (Full Editorial Details) */}
        <div style={{ marginTop: '20px', marginBottom: '48px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: '#292722',
              textAlign: 'center',
              marginBottom: '32px'
            }}
          >
            Design Principles &amp; Material Provenance
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="glass-crystal"
                  style={{
                    padding: '28px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.70)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 12px 30px rgba(41, 39, 34, 0.06)'
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(201, 154, 50, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C99A32',
                      marginBottom: '16px'
                    }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.4rem',
                      color: '#292722',
                      marginBottom: '6px'
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: '#A9781F',
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: 600
                    }}
                  >
                    {pillar.tagline}
                  </span>
                  <p style={{ fontSize: '12px', color: '#68645D', lineHeight: 1.6, margin: 0 }}>
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4-Stage Commission Journey */}
        <div
          className="glass-crystal"
          style={{
            padding: '40px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 247, 243, 0.65) 100%)',
            backdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 16px 40px rgba(41, 39, 34, 0.08)'
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.9rem',
              color: '#292722',
              textAlign: 'center',
              marginBottom: '32px'
            }}
          >
            The Commission Journey
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px'
            }}
          >
            {processSteps.map((step) => (
              <div key={step.step} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.8rem',
                    color: '#C99A32',
                    fontWeight: 600
                  }}
                >
                  {step.step}
                </span>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: '#292722', margin: 0 }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '12px', color: '#68645D', margin: 0, lineHeight: 1.5 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
