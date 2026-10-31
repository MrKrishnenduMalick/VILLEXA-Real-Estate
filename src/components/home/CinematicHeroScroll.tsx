import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
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

  const kickerText = heroConfig.kicker && !heroConfig.kicker.includes('PORTFOLIO 2026')
    ? heroConfig.kicker
    : "Sole Autonomous Commission · Cap d'Antibes";

  const titleText = heroConfig.title && heroConfig.title !== 'Where Architecture Becomes Sanctuary'
    ? heroConfig.title
    : 'Architecture at the Edge of Wonder';

  const subtitleText = heroConfig.subtitle ||
    'Six monumental private residences orchestrated between raw geological cliffs and frameless horizon. Curated for discreet multi-generational ownership.';

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
          justifyContent: 'flex-end',
          overflow: 'hidden',
          zIndex: 2
        }}
      >
        {/* Full-Screen Minimalist Editorial Opening (Anchored Lower-Left) */}
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
            paddingBottom: '88px'
          }}
        >
          <div className="hero-editorial-card-wrap">
            {/* Architectural Kicker */}
            <div className="hero-editorial-kicker">
              <span>{kickerText}</span>
            </div>

            {/* Display Title */}
            <h1 className="hero-editorial-title">
              {titleText}
            </h1>

            {/* Subtitle */}
            <p className="hero-editorial-subtitle">
              {subtitleText}
            </p>

            {/* Architectural CTA Controls */}
            <div className="hero-actions-group">
              <Link
                href="/residences"
                className="btn btn-solid-white"
              >
                <span>Explore The Residences</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/contact"
                className="btn btn-glass-hero"
              >
                <span>Acquisition Advisory</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Cinematic Information Strip & Scroll Cue */}
        <div ref={scrollCueRef} className="hero-ground-strip">
          <div className="container ground-strip-inner">
            <span>Latitude 43.5528° N &middot; Longitude 7.1278° E</span>
            <div className="hero-scroll-cue-pill">
              <div className="hero-scroll-cue-dot" />
              <span>Descend to Editorial Registry</span>
            </div>
            <span>Monolithic Travertine &middot; Triple Glazing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
