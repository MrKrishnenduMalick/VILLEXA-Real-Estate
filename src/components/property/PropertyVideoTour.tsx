import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Film, Sparkles, MessageSquare } from 'lucide-react';
import { PropertyVideoItem } from '../../types/property';
import { useClientConfig } from '../../context/ClientConfigContext';

interface PropertyVideoTourProps {
  propertyName: string;
  videos?: PropertyVideoItem[];
  defaultPoster?: string;
}

export const PropertyVideoTour: React.FC<PropertyVideoTourProps> = ({
  propertyName,
  videos,
  defaultPoster
}) => {
  const clientConfig = useClientConfig();
  const videoItem = videos && videos.length > 0 ? videos[0] : null;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);

  const posterImage = videoItem?.posterUrl || defaultPoster;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch((err) => {
        console.warn('Video playback requires user activation:', err);
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

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section id="video-tour" className="py-20 sm:py-28 bg-[#12100E]/70 backdrop-blur-2xl text-white overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#C5A059] mb-3">
            <Film size={13} />
            <span>CINEMATIC ARCHITECTURAL TOUR</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight">
            Cinematic Walkthrough & Drone Perspectives
          </h2>
          <p className="mt-4 text-base text-white/70 font-light leading-relaxed">
            Experience the architectural volumes, shifting afternoon shadows, and coastal atmosphere captured in 4K resolution.
          </p>
        </div>

        {/* Video Stage Container */}
        {videoItem && !videoLoadError ? (
          <div className="relative rounded-3xl overflow-hidden aspect-video bg-black shadow-2xl border border-white/15 group">
            <video
              ref={videoRef}
              src={videoItem.videoUrl}
              poster={posterImage}
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setVideoLoadError(true)}
              className="w-full h-full object-cover"
            />

            {/* Initial Big Play Overlay (Before First Play) */}
            {!hasStarted && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:bg-black/30"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#C5A059]/90 hover:bg-[#C5A059] text-white flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 pl-1">
                  <Play size={32} />
                </div>
                <span className="mt-6 text-xs uppercase tracking-[0.25em] text-white font-medium">
                  Begin Cinematic Screening
                </span>
                {videoItem.title && (
                  <span className="mt-2 text-sm text-white/70 font-light">
                    {videoItem.title}
                  </span>
                )}
              </div>
            )}

            {/* Custom Bottom Control Bar */}
            {hasStarted && (
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

                  <span className="text-xs text-white/80 font-light hidden sm:inline">
                    {videoItem.title || propertyName}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleFullscreen}
                    aria-label="Fullscreen"
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Graceful Fallback When Video Is Not Yet Indexed / In Production */
          <div className="relative rounded-3xl overflow-hidden aspect-video bg-[#181614] border border-white/15 p-8 sm:p-12 flex flex-col justify-between">
            {posterImage && (
              <img
                src={posterImage}
                alt={propertyName}
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-sm"
              />
            )}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-[#C5A059]/20 text-[#EFECE6] border border-[#C5A059]/30 mb-4">
                <Sparkles size={11} /> Confidential Screening
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-light">
                Private Architectural Film Upon Request
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/70 max-w-xl font-light">
                To maintain client privacy and exclusive residency standards, complete high-resolution walkthrough films for {propertyName} are screened by appointment with the {clientConfig.brand.brandName} Advisory Board.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${clientConfig.contact.whatsappNumber}?text=${encodeURIComponent(`Hello, I would like to request access to the private architectural video film for ${propertyName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#C5A059] hover:bg-[#b08d47] text-white text-xs uppercase tracking-[0.16em] transition-colors"
              >
                <MessageSquare size={13} />
                <span>Request Private Film Screening</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

