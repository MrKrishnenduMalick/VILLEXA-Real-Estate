import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, MapPin, Bed, Bath, Maximize2, Heart } from 'lucide-react';
import { Property } from '../../types/property';
import { propertyService } from '../../services/propertyService';
import { useClientConfig } from '../../context/ClientConfigContext';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, priority = false }) => {
  const config = useClientConfig();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const videoUrl = property.videos?.[0]?.videoUrl;
  const hasVideo = Boolean(videoUrl && videoUrl.trim() !== '' && !videoError);

  // 1. Accessibility: detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener?.('change', listener);
    return () => media.removeEventListener?.('change', listener);
  }, []);

  // 2. Viewport-triggered muted preview if video asset is configured
  useEffect(() => {
    if (!hasVideo || prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry ? entry.isIntersecting : false;
        const video = videoRef.current;
        if (!video) return;

        if (isVisible) {
          video.muted = true;
          const promise = video.play();
          if (promise !== undefined) {
            promise.catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasVideo, prefersReducedMotion]);

  const formattedPrice = propertyService.formatPrice(property);
  const formattedArea = propertyService.formatArea(property.carpetArea || property.builtUpArea);

  const typologyLabels: Record<string, string> = {
    villa: 'Villa',
    penthouse: 'Penthouse',
    waterfront: 'Beachfront',
    estate: 'Estate',
    apartment: 'Apartment',
    residential_development: 'Enclave'
  };
  const categoryBadgeLabel = typologyLabels[property.propertyType] || 'Residence';

  const locationString = property.location.suburb
    ? `${property.location.suburb}, ${property.location.city}`
    : `${property.location.city}, ${property.location.country}`;

  return (
    <article
      ref={containerRef}
      className="luxury-property-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '510px',
        border: '1.5px solid rgba(255, 255, 255, 0.85)',
        borderColor: isHovered ? 'rgba(216, 189, 138, 0.65)' : 'rgba(255, 255, 255, 0.85)',
        boxShadow: isHovered
          ? '0 24px 56px -8px rgba(41, 39, 34, 0.15), 0 0 28px rgba(216, 189, 138, 0.30), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)'
          : '0 18px 45px -10px rgba(41, 39, 34, 0.12), 0 0 22px rgba(216, 189, 138, 0.20), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
        transform: isHovered && !prefersReducedMotion ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.4s ease',
        backgroundColor: '#FAF8F5'
      }}
    >
      {/* 1. LARGE ARCHITECTURAL PHOTOGRAPHY (Main Visual Backdrop) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        {/* Video Preview or Cover Image — Stable on hover */}
        {hasVideo ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={property.coverImage}
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : !imageError ? (
          <img
            src={property.coverImage}
            alt={property.name}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F1EBE1',
              color: '#C99A32'
            }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
              {config?.brand?.brandName || 'VILLEXA'}
            </span>
          </div>
        )}

        {/* Extremely Subtle Vignette Gradient for natural contrast without darkening */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(20, 16, 12, 0.10) 0%, transparent 45%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* 2. TOP FLOATING BADGES OVER PHOTOGRAPHY: Category Badge & Favourite Heart */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Category Badge Pill */}
        <span
          style={{
            fontSize: '11.5px',
            letterSpacing: '0.04em',
            textTransform: 'capitalize',
            padding: '6px 18px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 250, 240, 0.50)',
            backdropFilter: 'blur(14px) saturate(140%)',
            WebkitBackdropFilter: 'blur(14px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.90)',
            color: '#1E1C19',
            fontWeight: 600,
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 4px 14px rgba(41, 39, 34, 0.10)'
          }}
        >
          {categoryBadgeLabel}
        </span>

        {/* Circular Glass Favourite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavourited(!isFavourited);
          }}
          aria-label="Save to Favourites"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255, 250, 240, 0.50)',
            backdropFilter: 'blur(14px) saturate(140%)',
            WebkitBackdropFilter: 'blur(14px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.90)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavourited ? '#B8831E' : '#1E1C19',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 4px 14px rgba(41, 39, 34, 0.10)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Heart size={16} fill={isFavourited ? '#B8831E' : 'none'} strokeWidth={1.8} />
        </button>
      </div>

      {/* 3. FLOATING GLASS INFORMATION PANEL (Elevated Physical Slab) */}
      <div
        className="glass-panel-integrated floating-glass-panel"
        style={{
          position: 'relative',
          zIndex: 3,
          margin: '0 16px 16px 16px',
          marginTop: 'auto',
          padding: '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '11px',
          borderRadius: '22px',
          background: isHovered
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 252, 244, 0.62) 50%, rgba(255, 248, 236, 0.72) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 252, 244, 0.54) 50%, rgba(255, 248, 236, 0.65) 100%)',
          backdropFilter: 'blur(22px) saturate(170%)',
          WebkitBackdropFilter: 'blur(22px) saturate(170%)',
          border: isHovered
            ? '1.2px solid rgba(255, 255, 255, 0.95)'
            : '1px solid rgba(255, 255, 255, 0.82)',
          transform: isHovered && !prefersReducedMotion ? 'translateY(-10px)' : 'translateY(0)',
          boxShadow: isHovered
            ? 'inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 0 16px 0 rgba(255, 240, 200, 0.35), 0 8px 18px -2px rgba(20, 16, 12, 0.18), 0 28px 56px -6px rgba(20, 16, 12, 0.28), 0 0 32px 2px rgba(212, 163, 59, 0.35)'
            : 'inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95), inset 0 0 12px 0 rgba(255, 240, 200, 0.25), 0 4px 12px -2px rgba(20, 16, 12, 0.14), 0 18px 40px -4px rgba(20, 16, 12, 0.20), 0 0 24px 0 rgba(212, 163, 59, 0.22)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, background 0.35s ease'
        }}
      >
        {/* Specular Flare Along Top Edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.98) 25%, #FFF0CD 50%, rgba(255, 255, 255, 0.98) 75%, transparent)',
            pointerEvents: 'none',
            boxShadow: '0 0 12px rgba(255, 240, 200, 0.85)',
            opacity: isHovered ? 1 : 0.9,
            transition: 'opacity 0.35s ease'
          }}
        />

        {/* Location Line with Pin Icon */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#2C2822',
            fontSize: '11.5px',
            letterSpacing: '0.04em',
            fontWeight: 500
          }}
        >
          <MapPin size={13} strokeWidth={2.2} color="#B8831E" fill="#B8831E" fillOpacity={0.2} />
          <span>{locationString}</span>
        </div>

        {/* Property Name & Explore Arrow Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <h3
            style={{
              fontSize: '1.55rem',
              fontFamily: 'var(--font-serif)',
              color: '#151311',
              fontWeight: 500,
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: '-0.01em'
            }}
          >
            <Link
              href={`/residence/${property.slug}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {property.name}
            </Link>
          </h3>

          {/* Circular Gold Explore Action Button -> */}
          <Link
            href={`/residence/${property.slug}`}
            aria-label={`View ${property.name}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ECC876 0%, #D4A33B 40%, #B07A18 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              color: '#FFFFFF',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 4px 14px rgba(168, 117, 22, 0.45), 0 0 16px rgba(212, 163, 59, 0.40)',
              flexShrink: 0,
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease'
            }}
          >
            <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
        </div>

        {/* Short Description */}
        <p
          style={{
            fontSize: '12.5px',
            color: '#38332C',
            lineHeight: 1.55,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontWeight: 450
          }}
        >
          {property.description || property.tagline}
        </p>

        {/* Specifications Strip: Beds | Baths | Area | Price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '10px',
            borderTop: '1px solid rgba(184, 131, 30, 0.25)',
            fontSize: '11.5px',
            color: '#2C2822',
            fontWeight: 500
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Bed size={14} strokeWidth={1.8} color="#B8831E" />
              <span>{property.bedrooms} Beds</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Bath size={14} strokeWidth={1.8} color="#B8831E" />
              <span>{property.bathrooms} Baths</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Maximize2 size={14} strokeWidth={1.8} color="#B8831E" />
              <span>{formattedArea}</span>
            </span>
          </div>

          {formattedPrice && (
            <span style={{ fontWeight: 700, color: '#B8831E', letterSpacing: '0.02em', fontSize: '15px' }}>
              {formattedPrice}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
