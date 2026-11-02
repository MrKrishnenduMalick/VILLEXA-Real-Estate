import React, { useState, useRef } from 'react';
import { Link } from 'wouter';
import { Play, Pause, Compass, Film, Sparkles, Calendar, Waves, Sun, Flame, Trees, Heart } from 'lucide-react';
import { getAssetSlotUrl } from '../config/assetSlots';

export interface LifestyleVignette {
  id: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

export const LIFESTYLE_VIGNETTES: LifestyleVignette[] = [
  {
    id: 'ls-01',
    category: 'WELLNESS & SANCTUARY',
    title: 'Private Thermal Spas & Reflection Pools',
    tagline: 'Hydraulic Calming & Hydrotherapy',
    description: 'Heated negative-edge infinity pools, cedar dry saunas, and subterranean marble steam chambers engineered for deep restorative tranquility.',
    imageUrl: getAssetSlotUrl('PROPERTY_INTERIOR_BATHROOM'),
    icon: Waves
  },
  {
    id: 'ls-02',
    category: 'INTERIOR PROPORTIONS',
    title: 'Double-Height Grand Living Salons',
    tagline: 'Acoustic Calm & Spatial Volumes',
    description: 'Seven-metre soaring volume ceilings, bookmatched travertine hearths, and frameless motorized glass facades that dissolve into open terraces.',
    imageUrl: getAssetSlotUrl('PROPERTY_INTERIOR_SALON'),
    icon: Sun
  },
  {
    id: 'ls-03',
    category: 'CULINARY ARTISTRY',
    title: 'Chef Show Kitchens & Back Annexes',
    tagline: 'Material Precision for Entertaining',
    description: 'Custom fluted dark oak cabinetry, honed Calacatta marble monolithic islands, integrated Gaggenau appliances, and discreet preparation galleys.',
    imageUrl: getAssetSlotUrl('PROPERTY_INTERIOR_KITCHEN'),
    icon: Flame
  },
  {
    id: 'ls-04',
    category: 'AL FRESCO ENTERTAINING',
    title: 'Cantilevered Sunset Dining Loggias',
    tagline: 'Horizon Gazing & Outdoor Hearths',
    description: 'Deep bioclimatic pergolas with motorized louvres, built-in masonry fireplaces, and dining loggias positioned for unobstructed sunset ocean views.',
    imageUrl: getAssetSlotUrl('PROPERTY_DINING_TERRACE'),
    icon: Sparkles
  },
  {
    id: 'ls-05',
    category: 'LANDSCAPE CHOREOGRAPHY',
    title: 'Inner Courtyards & Olive Groves',
    tagline: 'Biophilic Grounding & Quiet Atriums',
    description: 'Landscaped central courtyards framed by centuries-old olive trees, reflecting shallow water basins, and fragrant jasmine colonnades providing passive cooling.',
    imageUrl: getAssetSlotUrl('PROPERTY_GALLERY_ATRIUM'),
    icon: Trees
  },
  {
    id: 'ls-06',
    category: 'PRIVATE CELLARS',
    title: 'Subterranean Wine & Spirits Vaults',
    tagline: 'Temperature-Controlled Curation',
    description: 'Architectural tasting cellars holding upwards of 1,200 bottles with precision humidity control, dark fluted bronze racks, and intimate tasting lounges.',
    imageUrl: getAssetSlotUrl('PROPERTY_GALLERY_WINE_VAULT'),
    icon: Heart
  }
];

export const InspirationPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const featureBadges = [
    {
      icon: Compass,
      title: 'Virtual Tour',
      subtitle: 'Step inside',
      href: '/residences'
    },
    {
      icon: Film,
      title: 'Immersive Video',
      subtitle: '1-2 min',
      href: '/experience'
    },
    {
      icon: Sparkles,
      title: 'Lifestyle',
      subtitle: 'The VILLEXA Life',
      href: '/experience'
    },
    {
      icon: Calendar,
      title: 'Private Viewing',
      subtitle: 'By Appointment',
      href: '/contact'
    }
  ];

  return (
    <div
      className="experience-page-root marble-vein-backdrop"
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
        {/* Editorial Header matching Reference Image Lower-Left */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
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
            Experience
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
            A closer look at the VILLEXA way of living.
          </p>
        </div>

        {/* Master Cinema-Grade Video Showcase Panel */}
        <div
          className="glass-champagne"
          style={{
            position: 'relative',
            borderRadius: '26px',
            overflow: 'hidden',
            aspectRatio: '16/8.5',
            maxHeight: '480px',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 24px 60px -10px rgba(41, 39, 34, 0.12)',
            marginBottom: '28px'
          }}
        >
          <video
            ref={videoRef}
            src="/hero.mp4"
            poster={getAssetSlotUrl('PROPERTY_DINING_TERRACE')}
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          <div
            onClick={togglePlay}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isPlaying ? 'transparent' : 'rgba(41, 39, 34, 0.25)',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 25%, #C99A32 60%, #A9781F 100%)',
                border: '2px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 32px rgba(201, 154, 50, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                opacity: isPlaying ? 0 : 0.95,
                transition: 'all 0.25s ease'
              }}
              className="hover:scale-105"
            >
              {isPlaying ? <Pause size={26} /> : <Play size={26} fill="#FFFFFF" style={{ marginLeft: '4px' }} />}
            </div>
          </div>
        </div>

        {/* 4 Feature Badges Strip Below Video */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginBottom: '54px'
          }}
        >
          {featureBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <Link
                key={idx}
                href={badge.href}
                className="glass-crystal"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '18px 22px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.78) 0%, rgba(241, 235, 225, 0.60) 100%)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 8px 24px rgba(41, 39, 34, 0.06)',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(201, 154, 50, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C99A32',
                    flexShrink: 0
                  }}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#292722'
                    }}
                  >
                    {badge.title}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      color: '#68645D',
                      fontWeight: 400
                    }}
                  >
                    {badge.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 6-Card Curated Living Vignettes Grid */}
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: '#292722',
              textAlign: 'center',
              marginBottom: '32px'
            }}
          >
            Curated Living &amp; Spatial Atmosphere
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {LIFESTYLE_VIGNETTES.map((vig) => {
              return (
                <div
                  key={vig.id}
                  className="glass-crystal"
                  style={{
                    borderRadius: '22px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(16px)',
                    border: '1.2px solid rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 14px 34px rgba(41, 39, 34, 0.08)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={vig.imageUrl}
                      alt={vig.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(10px)',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        color: '#A9781F',
                        textTransform: 'uppercase'
                      }}
                    >
                      {vig.category}
                    </div>
                  </div>

                  <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.35rem',
                          color: '#292722',
                          margin: '0 0 6px 0',
                          fontWeight: 500
                        }}
                      >
                        {vig.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#68645D', margin: 0, lineHeight: 1.6 }}>
                        {vig.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
