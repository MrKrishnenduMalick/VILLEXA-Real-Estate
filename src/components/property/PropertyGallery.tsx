import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { PropertyMediaItem } from '../../types/property';

interface PropertyGalleryProps {
  propertyName: string;
  coverImage: string;
  gallery: PropertyMediaItem[];
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  propertyName,
  coverImage,
  gallery
}) => {
  // Combine cover image with gallery items into a unified list
  const allImages: PropertyMediaItem[] = React.useMemo(() => {
    const list: PropertyMediaItem[] = [];
    if (coverImage) {
      list.push({
        id: 'cover',
        url: coverImage,
        caption: 'Signature Architectural View',
        altText: `${propertyName} Cover View`,
        isFeatured: true
      });
    }
    gallery.forEach((item) => {
      if (item.url && !list.some((existing) => existing.url === item.url)) {
        list.push(item);
      }
    });
    return list;
  }, [coverImage, gallery, propertyName]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Touch swipe support for mobile
  const touchStartXRef = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartXRef.current = null;
  };

  const handleImageError = (url: string) => {
    setFailedImages((prev) => ({ ...prev, [url]: true }));
  };

  if (allImages.length === 0) {
    return (
      <section className="py-16 bg-[#FBFBF9] text-center text-[#8C827A]">
        <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-xs uppercase tracking-widest">Architectural photography pending archive upload</p>
      </section>
    );
  }

  const currentImage = allImages[activeIndex] || allImages[0];
  const isCurrentFailed = failedImages[currentImage.url];

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#12100E]/70 backdrop-blur-2xl border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="block text-[11px] uppercase tracking-[0.25em] text-[#DFCFA8] mb-3 font-medium">
              CURATED RESIDENCE VISUAL ARCHIVE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white">
              Architectural Gallery
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#DFCFA8] hover:text-[#C5A059] font-medium transition-colors"
          >
            <Maximize2 size={14} />
            <span>Enter Fullscreen Gallery ({activeIndex + 1}/{allImages.length})</span>
          </button>
        </div>

        {/* Master Showcase Frame */}
        <div
          className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-[#181614] shadow-xl group"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isCurrentFailed ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#A39990] bg-[#221F1C]">
              <ImageIcon size={48} className="mb-3 text-[#C5A059]/40" />
              <p className="text-sm font-light">High-resolution frame archiving in progress</p>
            </div>
          ) : (
            <img
              src={currentImage.url}
              alt={currentImage.altText || propertyName}
              onError={() => handleImageError(currentImage.url)}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          )}

          {/* Caption Overlay */}
          {currentImage.caption && (
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex justify-between items-end">
              <div>
                {currentImage.category && (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
                    {currentImage.category}
                  </span>
                )}
                <p className="font-serif text-base sm:text-lg font-light text-white/95">
                  {currentImage.caption}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-[11px] uppercase tracking-wider text-white transition-colors"
              >
                <Maximize2 size={12} />
                <span>Enlarge</span>
              </button>
            </div>
          )}

          {/* Previous / Next Stage Controls */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Image"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Filmstrip */}
        {allImages.length > 1 && (
          <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            {allImages.map((img, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative shrink-0 w-24 sm:w-32 aspect-[16/10] rounded-xl overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? 'ring-2 ring-[#C5A059] scale-[1.03] shadow-md'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || `View ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(img.url)}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#070C18]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white/80 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059]">
                {propertyName}
              </span>
              <span className="block text-sm font-light text-white/60">
                Plate {activeIndex + 1} of {allImages.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close Lightbox"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Lightbox Image Stage */}
          <div className="relative flex-1 flex items-center justify-center max-h-[78vh] my-4">
            <img
              src={currentImage.url}
              alt={currentImage.altText || propertyName}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Lightbox Prev / Next */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                  aria-label="Previous plate"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                  aria-label="Next plate"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Footer Caption */}
          <div className="text-center text-white/80 text-xs sm:text-sm font-light pt-3">
            {currentImage.caption || `${propertyName} Architectural Perspective`}
          </div>
        </div>
      )}
    </section>
  );
};

