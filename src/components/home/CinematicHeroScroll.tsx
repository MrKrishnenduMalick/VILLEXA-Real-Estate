import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Play, Home, MapPin, ShieldCheck, Gem } from 'lucide-react';
import { useCinematicHero } from '../../context/CinematicHeroContext';

export const CinematicHeroScroll: React.FC = () => {
  const { heroConfig, setScrollProgress } = useCinematicHero();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const statStripRef = useRef<HTMLDivElement | null>(null);

  // Monitor scroll progression within the pinned hero track (Preserving exact 240-frame engine math)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const track = trackRef.current;
          if (!track) {
            ticking = false;
            return;
          }

          const trackHeight = track.offsetHeight;
          const windowHeight = window.innerHeight;
          const totalScrollable = trackHeight - windowHeight;

          if (totalScrollable <= 0) {
            ticking = false;
            return;
          }

          const scrolled = window.scrollY;
          const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

          setScrollProgress(progress);

          // Progressive typography fade & drift:
          // 0.0 -> 0.26: Smoothly dissolves over the first ~26% of scroll progression
          const opacity = progress <= 0.26 ? Math.max(1 - (progress / 0.26) * 1.15, 0) : 0;
          const translateY = progress <= 0.26 ? -(progress / 0.26) * 32 : -32;

          if (textContainerRef.current) {
            textContainerRef.current.style.opacity = String(opacity);
            textContainerRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
            textContainerRef.current.style.pointerEvents = opacity > 0.15 ? 'auto' : 'none';
          }

          if (statStripRef.current) {
            statStripRef.current.style.opacity = String(opacity);
            statStripRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  if (!heroConfig) return null;

  return (
    <div
      ref={trackRef}
      id="cinematic-hero-track"
      style={{
        position: 'relative',
        height: '300vh', // Preserved comfortable cinematic scroll distance
        width: '100%'
      }}
    >
      {/* Pinned Full-Screen Viewport Scene */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 2,
          paddingTop: '60px'
        }}
      >
        {/* Floating Transparent Crystal Glass Introduction Panel (Anchored Left) */}
        <div
          ref={textContainerRef}
          className="container"
          style={{
            position: 'relative',
            zIndex: 10,
            opacity: 1,
            transform: 'translate3d(0, 0px, 0)',
            willChange: 'opacity, transform',
            pointerEvents: 'auto',
            marginBottom: '40px'
          }}
        >
          <div
            className="hero-crystal-card glass-gold-edge"
            style={{
              maxWidth: '560px',
              padding: '38px 44px',
              borderRadius: '26px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.36) 0%, rgba(255, 255, 255, 0.12) 50%, rgba(250, 244, 234, 0.22) 100%)',
              backdropFilter: 'blur(22px) saturate(160%)',
              WebkitBackdropFilter: 'blur(22px) saturate(160%)',
              border: '1.5px solid rgba(255, 255, 255, 0.70)',
              boxShadow: 'inset 0 2px 3px rgba(255, 255, 255, 0.90), 0 0 0 1px rgba(216, 189, 138, 0.35), 0 24px 60px -12px rgba(10, 8, 6, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Fine Specular Top Glow Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '20px',
                right: '20px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95), rgba(216, 189, 138, 0.8), transparent)'
              }}
            />

            {/* Architectural Kicker */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#E5C478',
                fontWeight: 600,
                marginBottom: '14px'
              }}
            >
              <span>THE RESIDENCE COLLECTION</span>
            </div>

            {/* Display Title: Masterwork Residences */}
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
                lineHeight: 1.08,
                color: '#FFFFFF',
                fontWeight: 400,
                margin: '0 0 16px 0',
                letterSpacing: '-0.015em'
              }}
            >
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#F3D082' }}>Masterwork</span>{' '}
              <span>Residences</span>
            </h1>

            {/* Subtitle Description */}
            <p
              style={{
                fontSize: '1.02rem',
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: 1.65,
                margin: '0 0 28px 0',
                fontWeight: 300,
                maxWidth: '460px'
              }}
            >
              A curated portfolio of architectural homes, designed for a life of privacy, light and extraordinary living.
            </p>

            {/* Action Buttons: Explore Residences -> & Watch the Experience */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <Link
                href="/residences"
                className="btn-gold-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 25%, #C99A32 60%, #A9781F 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 8px 24px rgba(201, 154, 50, 0.40)',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>Explore Residences</span>
                <ArrowRight size={14} strokeWidth={2.2} />
              </Link>

              <Link
                href="/experience"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.14)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.20)',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F5E8C7, #C99A32)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1A1816'
                  }}
                >
                  <Play size={10} fill="#1A1816" style={{ marginLeft: '1px' }} />
                </div>
                <span>Watch the Experience (1:20)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Horizontal Stat Capsule Directly Below Hero Card */}
        <div
          ref={statStripRef}
          className="container"
          style={{
            position: 'relative',
            zIndex: 10,
            opacity: 1,
            transform: 'translate3d(0, 0px, 0)',
            willChange: 'opacity, transform'
          }}
        >
          <div
            className="hero-stat-capsule glass-stat-panel"
          >
            {/* Stat Item 1: 28+ Signature Residences */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(201, 154, 50, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F3D082',
                  flexShrink: 0
                }}
              >
                <Home size={16} strokeWidth={2} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
                  28+
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.80)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Signature Residences
                </span>
              </div>
            </div>

            <div className="stat-capsule-divider" />

            {/* Stat Item 2: 6 Prime Destinations */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(201, 154, 50, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F3D082',
                  flexShrink: 0
                }}
              >
                <MapPin size={16} strokeWidth={2} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
                  6
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.80)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Prime Destinations
                </span>
              </div>
            </div>

            <div className="stat-capsule-divider" />

            {/* Stat Item 3: 100% Privacy Assured */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(201, 154, 50, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F3D082',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={16} strokeWidth={2} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
                  100%
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.80)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Privacy Assured
                </span>
              </div>
            </div>

            <div className="stat-capsule-divider" />

            {/* Stat Item 4: 7.5 Cr+ Residences Onwards */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(201, 154, 50, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F3D082',
                  flexShrink: 0
                }}
              >
                <Gem size={16} strokeWidth={2} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
                  7.5 Cr+
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.80)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Residences Onwards
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
