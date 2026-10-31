import React, { useState, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Film, Play, Pause, Volume2, VolumeX, Maximize, Layers, Compass } from 'lucide-react';

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
      imageUrl: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'col-alpine',
      name: 'Alpine & Highland Sanctuaries',
      tagline: 'Monumental local granite and timber embedded into Swiss mountain slopes.',
      count: '01 Commission',
      type: 'villa',
      imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'col-sky',
      name: 'Metropolitan Sky Penthouses',
      tagline: 'Triplex sky terraces commanding uninterrupted deep-water harbour panoramas.',
      count: '01 Commission',
      type: 'penthouse',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=85'
    },
    {
      id: 'col-estate',
      name: 'Master Botanical Compounds',
      tagline: 'Low-density acreage with centuries-old cypress and private reflecting basins.',
      count: '02 Commissions',
      type: 'residential_development',
      imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=85'
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
    <section id="collections" className="section-collections py-12 sm:py-16 text-[#1A1816]">
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
            <p className="mt-3 text-base text-[#2B2724] font-normal leading-relaxed max-w-2xl">
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
              className="group collection-item-card"
            >
              <div>
                {/* Architectural Typology Image */}
                <div className="w-full aspect-[16/10] rounded-[3px] overflow-hidden mb-4 border border-[#EAE5DC] bg-[#EAE5DC]">
                  <img
                    src={col.imageUrl}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = `/real-estate-hero-frames/frame-${String((idx + 2) * 50).padStart(5, '0')}.webp`;
                    }}
                  />
                </div>

                {/* Typology Meta & Title */}
                <span className="text-[10px] uppercase tracking-[0.20em] text-[#B89552] font-semibold block mb-1">
                  {col.count}
                </span>
                <h3 className="font-serif text-xl text-[#1A1816] font-normal group-hover:text-[#B89552] transition-colors leading-snug mb-2">
                  {col.name}
                </h3>
                <p className="text-xs text-[#2B2724] font-light leading-relaxed mb-4">
                  {col.tagline}
                </p>
              </div>

              {/* Bottom Card Action Affordance */}
              <div className="pt-3 border-t border-[#EAE5DC]/80 flex items-center justify-between text-xs text-[#1A1816] font-medium group-hover:text-[#B89552] transition-colors">
                <span className="tracking-wide">Explore Portfolio</span>
                <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
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
