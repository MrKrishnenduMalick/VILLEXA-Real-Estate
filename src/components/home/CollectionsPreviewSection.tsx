import React, { useState, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Film, Play, Pause, Volume2, VolumeX, Maximize, Layers, Compass } from 'lucide-react';
import { getAssetSlotUrl } from '../../config/assetSlots';

export const CollectionsPreviewSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const collections = [
    {
      id: 'col-coastal',
      name: 'Coastal & Clifftop Estates',
      tagline: 'Suspended over azure Mediterranean & Atlantic ocean horizons.',
      count: '02 Commissions',
      type: 'waterfront',
      imageUrl: getAssetSlotUrl('PROPERTY_EXTERIOR_PRIMARY')
    },
    {
      id: 'col-alpine',
      name: 'Alpine & Highland Sanctuaries',
      tagline: 'Monumental local granite and timber embedded into Swiss mountain slopes.',
      count: '01 Commission',
      type: 'villa',
      imageUrl: getAssetSlotUrl('PROPERTY_ARCHITECTURAL_ENTRANCE')
    },
    {
      id: 'col-sky',
      name: 'Metropolitan Sky Penthouses',
      tagline: 'Triplex sky terraces commanding uninterrupted deep-water harbour panoramas.',
      count: '01 Commission',
      type: 'penthouse',
      imageUrl: getAssetSlotUrl('PROPERTY_INTERIOR_SALON')
    },
    {
      id: 'col-estate',
      name: 'Master Botanical Compounds',
      tagline: 'Low-density acreage with centuries-old cypress and private reflecting basins.',
      count: '02 Commissions',
      type: 'residential_development',
      imageUrl: getAssetSlotUrl('PROPERTY_EXTERIOR_POOL')
    }
  ];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch((err) => {
          console.warn('Playback activation error:', err);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section id="collections" className="section-collections py-12 sm:py-16">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row mb-10 pb-5 border-b border-[#EAE5DC]">
          <div>
            <span className="eyebrow mb-2">
              <Layers size={13} className="text-[#B89552]" />
              <span>CURATED COLLECTIONS &amp; SCREENING</span>
            </span>
            <h2 className="section-title">
              Typological Collections in Motion
            </h2>
            <p className="mt-3 text-base font-normal leading-relaxed max-w-2xl">
              Residences categorized by landscape geography, complemented by an exclusive screening of our architectural motion study.
            </p>
          </div>
          <Link
            href="/collections"
            className="btn btn-outline-dark"
          >
            <span>Explore All Collections</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 1. Four Typology Categories in a Balanced 4-Column Responsive Editorial Spread */}
        <div className="typology-grid">
          {collections.map((col, idx) => (
            <Link
              key={col.id}
              href={`/residences?type=${col.type}`}
              className="group luxury-collection-card"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                minHeight: '440px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(197, 160, 89, 0.30)',
                boxShadow: '0 16px 36px -6px rgba(2, 6, 16, 0.45)',
                textDecoration: 'none',
                transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                backgroundColor: '#070C18'
              }}
            >
              {/* Full Architectural Visual Backdrop — Top 55-60% Clean Photography */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                  overflow: 'hidden'
                }}
              >
                <img
                  src={col.imageUrl}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = `/real-estate-hero-frames/frame-${String((idx + 2) * 50).padStart(5, '0')}.webp`;
                  }}
                />
                {/* Gentle lower vignette only behind glass panel for crisp contrast */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(6, 11, 24, 0.35) 0%, rgba(6, 11, 24, 0.06) 45%, transparent 100%)',
                    pointerEvents: 'none'
                  }}
                />
              </div>

              {/* Top Metadata Strip Floating over Photography */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 3,
                  padding: '16px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}
              >
                <span
                  style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.20em',
                    textTransform: 'uppercase',
                    color: '#DFCFA8',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(8, 14, 28, 0.68)',
                    border: '1px solid rgba(197, 160, 89, 0.32)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 14px rgba(2, 6, 14, 0.35)'
                  }}
                >
                  {col.count}
                </span>
                <span
                  style={{
                    fontSize: '0.64rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(250, 248, 245, 0.85)',
                    fontWeight: 500,
                    padding: '5px 10px',
                    borderRadius: '9999px',
                    background: 'rgba(8, 14, 28, 0.52)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)'
                  }}
                >
                  Monograph
                </span>
              </div>

              {/* Integrated Translucent Champagne Gold Glass Lower Panel */}
              <div
                className="glass-champagne-gold"
                style={{
                  position: 'relative',
                  zIndex: 3,
                  margin: '12px',
                  marginTop: 'auto',
                  padding: '20px 22px',
                  borderRadius: '12px',
                  background: 'linear-gradient(145deg, rgba(16, 26, 48, 0.46) 0%, rgba(8, 15, 30, 0.40) 100%)',
                  backdropFilter: 'blur(14px) saturate(135%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(135%)',
                  border: '1px solid rgba(197, 160, 89, 0.32)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.42), inset 0 0 0 1px rgba(197, 160, 89, 0.14), 0 16px 36px -4px rgba(2, 6, 16, 0.45)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.35s ease'
                }}
              >
                {/* Typology Title & Tagline */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.40rem',
                      color: '#FAF8F5',
                      fontWeight: 300,
                      lineHeight: 1.2,
                      margin: '0 0 6px 0',
                      letterSpacing: '-0.01em',
                      transition: 'color 0.25s ease'
                    }}
                    className="group-hover:text-[#DFCFA8]"
                  >
                    {col.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.80rem',
                      color: 'rgba(250, 248, 245, 0.82)',
                      fontWeight: 300,
                      lineHeight: 1.5,
                      margin: 0
                    }}
                  >
                    {col.tagline}
                  </p>
                </div>

                {/* Bottom Separated CTA Action Row */}
                <div
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(197, 160, 89, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#FAF8F5',
                    fontWeight: 500
                  }}
                >
                  <span className="group-hover:text-[#DFCFA8] transition-colors">Explore Portfolio</span>
                  <ArrowRight
                    size={13}
                    className="text-[#C5A059] transform group-hover:translate-x-1.5 transition-transform"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 2. Premier Architectural Film Screening Cinema Suite */}
        <div className="bg-[var(--glass-strong)] border border-[var(--glass-border)] rounded-[4px] p-6 lg:p-8 backdrop-blur-[24px] shadow-lg">
          <div className="screening-suite-grid">
            {/* Left Curatorial Panel: Monograph & Technical Specifications */}
            <div className="space-y-5">
              <span className="eyebrow text-[#B89552]">
                <Film size={13} className="text-[#B89552]" />
                <span>ARCHITECTURAL MOTION REEL · 4K ULTRA HD</span>
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1816] font-light leading-snug">
                The Aurelia Commission in Motion
              </h3>

              <p className="text-sm sm:text-base text-[#2B2724] leading-relaxed font-light">
                An exclusive 4K cinematography study capturing diurnal shadow choreography, acoustic calm, and the tactile materiality of honed Roman travertine as dawn transitions across the Cap d&apos;Antibes peninsula.
              </p>

              {/* Technical Specifications Badge Strip */}
              <div className="pt-4 border-t border-[#EAE5DC] grid grid-cols-3 gap-3 text-xs text-[#2B2724]">
                <div className="bg-white/60 border border-[#EAE5DC] p-2.5 rounded-[3px]">
                  <span className="block text-[9.5px] uppercase tracking-wider text-[#8A7E72] font-semibold mb-0.5">Format</span>
                  <span className="font-medium text-[#1A1816] text-[11px]">4K UHD · 60fps</span>
                </div>
                <div className="bg-white/60 border border-[#EAE5DC] p-2.5 rounded-[3px]">
                  <span className="block text-[9.5px] uppercase tracking-wider text-[#8A7E72] font-semibold mb-0.5">Acoustics</span>
                  <span className="font-medium text-[#1A1816] text-[11px]">Dolby Master</span>
                </div>
                <div className="bg-white/60 border border-[#EAE5DC] p-2.5 rounded-[3px]">
                  <span className="block text-[9.5px] uppercase tracking-wider text-[#8A7E72] font-semibold mb-0.5">Optics</span>
                  <span className="font-medium text-[#1A1816] text-[11px]">35mm Prime</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="btn btn-solid-dark"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="pl-0.5" />}
                  <span>{isPlaying ? 'Pause Screening' : 'Play 4K Screening'}</span>
                </button>
                <Link
                  href="/contact"
                  className="btn btn-outline-dark"
                >
                  <span>Request Full Reel</span>
                  <Compass size={14} />
                </Link>
              </div>
            </div>

            {/* Right Screen: Widescreen Interactive Cinema Player */}
            <div>
              <div className="relative rounded-[4px] overflow-hidden aspect-video bg-[#141210] shadow-2xl border border-[var(--glass-border)] group">
                <video
                  ref={videoRef}
                  src="/hero.mp4"
                  poster="/real-estate-hero-frames/frame-00240.webp"
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />

                {/* Large Initial Play Overlay with Guaranteed Contrast and Clear Affordance */}
                {!hasStarted && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 bg-[#141210]/45 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:bg-[#141210]/30"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#B89552] hover:bg-[#9E7D3B] text-white flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 pl-1 border border-white/30">
                      <Play size={28} />
                    </div>
                    <span className="mt-5 text-xs uppercase tracking-[0.25em] text-white font-semibold">
                      Watch Architectural Screening
                    </span>
                    <span className="mt-1 text-xs text-white/85 font-light">
                      The Aurelia Estate &middot; 4K Ultra HD Motion Study
                    </span>
                  </div>
                )}

                {/* Active Video Controls */}
                {hasStarted && (
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#1A1816]/90 via-[#1A1816]/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlay}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} className="pl-0.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                      <span className="text-xs text-white/90 font-light hidden sm:inline">
                        The Aurelia Estate &middot; Architectural Motion
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      aria-label="Fullscreen"
                      className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                    >
                      <Maximize size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Integrated Plaque below Player */}
              <div className="mt-3 px-3 py-2 flex items-center justify-between text-xs text-[#524C44]">
                <span className="text-[11px] font-serif text-[#1A1816]">The Aurelia Estate &middot; Cap d&apos;Antibes, France</span>
                <span className="text-[10px] uppercase tracking-wider text-[#B89552] font-semibold">Motion Study Reel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
