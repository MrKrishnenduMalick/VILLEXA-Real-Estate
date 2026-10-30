import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Compass } from 'lucide-react';
import { useCinematicHero } from '../../context/CinematicHeroContext';

export const CinematicHeroScroll: React.FC = () => {
  const { heroConfig, setScrollProgress } = useCinematicHero();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);

  // Monitor scroll progression within the pinned hero track (Preserving exact engine math)
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
          // 0.0 -> 0.22: Smoothly dissolves over the first ~22% of scroll progression
          const opacity = progress <= 0.22 ? Math.max(1 - (progress / 0.22) * 1.15, 0) : 0;
          const translateY = progress <= 0.22 ? -(progress / 0.22) * 36 : -36;

          if (textContainerRef.current) {
            textContainerRef.current.style.opacity = String(opacity);
            textContainerRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
            textContainerRef.current.style.pointerEvents = opacity > 0.15 ? 'auto' : 'none';
          }

          if (scrollCueRef.current) {
            scrollCueRef.current.style.opacity = String(opacity);
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
          zIndex: 2
        }}
      >
        {/* Full-Screen Minimalist Editorial Opening */}
        <div
          ref={textContainerRef}
          className="container"
          style={{
            position: 'relative',
            zIndex: 10,
            opacity: 1,
            transform: 'translate3d(0, 0px, 0)',
            willChange: 'opacity, transform',
            pointerEvents: 'auto'
          }}
        >
          <div
            style={{
              maxWidth: '820px',
              position: 'relative'
            }}
          >
            {/* Architectural Kicker */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: 'var(--space-4)',
                color: '#DFCFA8',
                fontSize: '0.78rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontWeight: 600,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.45)'
              }}
            >
              <span>{heroConfig.kicker || 'BILEKSA PRIVATE RESIDENCES • PORTFOLIO 2026'}</span>
            </div>

            {/* Display Title */}
            <h1
              className="display-title"
              style={{
                marginBottom: 'var(--space-5)',
                color: '#FFFFFF',
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.55)',
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                fontSize: 'clamp(3.2rem, 6.5vw, 5.4rem)'
              }}
            >
              Where Architecture<br />Becomes Sanctuary
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.95)',
                marginBottom: 'var(--space-8)',
                maxWidth: '660px',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.55)',
                fontWeight: 300
              }}
            >
              Exceptional private estates and architectural penthouses conceived across clifftop coastlines and alpine ridges.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 'var(--space-4)'
              }}
            >
              <Link
                href="/residences"
                className="btn btn-gold"
                style={{
                  padding: '1rem 2.6rem',
                  fontSize: '0.84rem',
                  letterSpacing: '0.16em',
                  fontWeight: 500
                }}
              >
                <span>Explore The Residences</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/vision"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '1rem 2.2rem',
                  fontSize: '0.84rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                  color: '#FFFFFF',
                  fontWeight: 400,
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Architectural Vision</span>
                <Compass size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Scroll Cue */}
        <div
          ref={scrollCueRef}
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 22px',
            backgroundColor: 'rgba(250, 248, 245, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid #EAE5DC',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(26, 24, 22, 0.12)',
            opacity: 1,
            willChange: 'opacity',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent-gold)',
              boxShadow: '0 0 10px var(--color-accent-gold)'
            }}
          />
          <span
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              fontWeight: 500
            }}
          >
            Scroll to Explore
          </span>
        </div>
      </div>
    </div>
  );
};
