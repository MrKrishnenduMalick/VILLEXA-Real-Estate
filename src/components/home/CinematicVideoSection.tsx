import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Film } from 'lucide-react';

export const CinematicVideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const videoSrc = '/hero.mp4';
  const posterSrc = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85';

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch((err) => {
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
    <section id="cinematic-showcase" className="py-28 sm:py-36 bg-[#FFFFFF] text-[#1A1816] overflow-hidden border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.28em] text-[#B89552] font-semibold mb-3">
            <Film size={13} />
            <span>CINEMATIC PROPERTY SCREENING</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1816] leading-tight">
            An Architectural Film in Motion
          </h2>
          <p className="mt-4 text-base text-[#6E6860] font-light leading-relaxed">
            Experience the interplay of morning coastal fog, shifting cantilever shadows, and spatial acoustics in our 4K cinematic walkthrough.
          </p>
        </div>

        {/* 16:9 Screen Container */}
        {!hasError ? (
          <div className="relative rounded-3xl overflow-hidden aspect-video bg-[#FAF8F5] shadow-2xl border border-[#EAE5DC] group">
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
              className="w-full h-full object-cover"
            />

            {/* Large Initial Play Overlay */}
            {!hasStarted && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 bg-[#1A1816]/35 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:bg-[#1A1816]/25"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#B89552] hover:bg-[#9E7D3B] text-white flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 pl-1">
                  <Play size={32} />
                </div>
                <span className="mt-6 text-xs uppercase tracking-[0.25em] text-white font-semibold">
                  Watch Architectural Film
                </span>
                <span className="mt-2 text-xs text-white/80 font-light">
                  The Aurelia Estate · 4K Ultra HD
                </span>
              </div>
            )}

            {/* Custom On-Hover Controls */}
            {hasStarted && (
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-[#1A1816]/90 via-[#1A1816]/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="pl-0.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <span className="text-xs text-white/90 font-light hidden sm:inline">
                    The Aurelia Estate Walkthrough (10s)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="Fullscreen"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                >
                  <Maximize size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden aspect-video bg-[#FAF8F5] border border-[#EAE5DC] p-12 flex flex-col justify-center items-center text-center">
            <Film size={40} className="text-[#B89552] mb-4" />
            <h3 className="font-serif text-2xl text-[#1A1816] font-light mb-2">
              Architectural Film In Production
            </h3>
            <p className="text-sm text-[#6E6860] max-w-md font-light">
              High-definition screening reels are rendered on request for registered private clients.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
