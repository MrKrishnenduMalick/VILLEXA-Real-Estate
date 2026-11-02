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
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '520px',
        transform: isHovered && !prefersReducedMotion ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 30px 60px -10px rgba(45, 32, 20, 0.22), 0 14px 28px rgba(45, 32, 20, 0.12), 0 0 42px rgba(225, 180, 85, 0.50), 0 0 85px rgba(225, 180, 85, 0.25)'
          : '0 20px 42px -10px rgba(45, 32, 20, 0.16), 0 8px 18px rgba(45, 32, 20, 0.08), 0 0 28px rgba(225, 180, 85, 0.35), 0 0 60px rgba(225, 180, 85, 0.16)',
        transition: 'transform 400ms cubic-bezier(0.2, 0.75, 0.25, 1), box-shadow 400ms ease'
      }}
    >
      {/* 1. FULL CARD GLASS FRAME (Translucent Beveled Edge & Exterior Gold Ambient Glow) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '28px',
          border: isHovered ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1.5px solid rgba(255, 250, 235, 0.88)',
          boxShadow: isHovered
            ? 'inset 0 2px 2px rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px rgba(255, 255, 255, 0.40), inset 1.5px 0 1.5px rgba(255, 255, 255, 0.45), inset -1.5px 0 1.5px rgba(255, 255, 255, 0.45), 0 0 24px rgba(230, 190, 100, 0.45)'
            : 'inset 0 1.5px 1.5px rgba(255, 255, 255, 0.90), inset 0 -1px 1px rgba(255, 255, 255, 0.30), inset 1px 0 1px rgba(255, 255, 255, 0.35), inset -1px 0 1px rgba(255, 255, 255, 0.35), 0 0 16px rgba(230, 190, 100, 0.30)',
          pointerEvents: 'none',
          zIndex: 3,
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease'
        }}
      />

      {/* Top Specular Reflection Line along Card Top Rim */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '5%',
          right: '5%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.95) 20%, #FFF8E8 50%, rgba(255, 255, 255, 0.95) 80%, transparent 100%)',
          pointerEvents: 'none',
          boxShadow: isHovered
            ? '0 0 14px rgba(255, 255, 255, 1), 0 0 26px rgba(235, 195, 110, 0.85)'
            : '0 0 10px rgba(255, 255, 255, 0.90), 0 0 18px rgba(235, 195, 110, 0.65)',
          zIndex: 4,
          transition: 'all 0.35s ease'
        }}
      />

      {/* Diagonal Glass Specular Sheen (Subtle glass glare across top corner) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '190px',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.08) 30%, transparent 65%)',
          borderRadius: '28px 28px 0 0',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: isHovered ? 0.95 : 0.80,
          transition: 'opacity 0.4s ease'
        }}
      />

      {/* 2. LARGE ARCHITECTURAL PHOTOGRAPHY (Dominant, Crisp Visual Backbone) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: '28px',
          zIndex: 1,
          backgroundColor: '#FAF8F5'
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
      </div>

      {/* 2. TOP FLOATING BADGES OVER PHOTOGRAPHY: Category Badge & Favourite Heart */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
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
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px) saturate(140%)',
            WebkitBackdropFilter: 'blur(16px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            color: '#161412',
            fontWeight: 650,
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 4px 16px rgba(41, 39, 34, 0.12)'
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
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px) saturate(140%)',
            WebkitBackdropFilter: 'blur(16px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavourited ? '#B8831E' : '#1E1C19',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 4px 16px rgba(41, 39, 34, 0.12)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Heart size={16} fill={isFavourited ? '#B8831E' : 'none'} strokeWidth={1.8} />
        </button>
      </div>

      {/* 3. FLOATING GLASS INFORMATION PANEL (Elevated Translucent Glass Slab) */}
      <div
        className="property-glass-card glass-panel-integrated floating-glass-panel"
        style={{
          position: 'relative',
          zIndex: 5,
          margin: '0 18px 24px 18px',
          marginTop: 'auto',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '9px',
          borderRadius: '24px',
          background: isHovered
            ? 'rgba(246, 239, 224, 0.28)'
            : 'rgba(246, 239, 224, 0.24)',
          backdropFilter: 'blur(12px) saturate(155%)',
          WebkitBackdropFilter: 'blur(12px) saturate(155%)',
          border: isHovered
            ? '1px solid rgba(255, 255, 255, 0.92)'
            : '1px solid rgba(255, 255, 255, 0.78)',
          transform: isHovered && !prefersReducedMotion ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: isHovered
            ? '0 28px 52px rgba(42, 27, 12, 0.28), 0 12px 22px rgba(42, 27, 12, 0.16), 0 0 35px rgba(218, 169, 75, 0.45), 0 0 65px rgba(218, 169, 75, 0.22), inset 0 1.5px 0 rgba(255, 255, 255, 1.0), inset 0 -1px 0 rgba(255, 255, 255, 0.30)'
            : '0 20px 38px rgba(42, 27, 12, 0.22), 0 8px 16px rgba(42, 27, 12, 0.12), 0 0 25px rgba(218, 169, 75, 0.30), 0 0 50px rgba(218, 169, 75, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.90), inset 0 -1px 0 rgba(255, 255, 255, 0.20)',
          transition: 'transform 400ms cubic-bezier(0.2, 0.75, 0.25, 1), box-shadow 400ms ease, border-color 400ms ease, background 400ms ease'
        }}
      >
        {/* Specular Flare Along Top Edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '6%',
            right: '6%',
            height: '2.5px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.98) 25%, #FFFBEA 50%, rgba(255, 255, 255, 0.98) 75%, transparent 100%)',
            pointerEvents: 'none',
            boxShadow: isHovered
              ? '0 0 16px rgba(255, 255, 255, 1), 0 0 28px rgba(245, 215, 130, 0.95)'
              : '0 0 12px rgba(255, 255, 255, 0.95), 0 0 22px rgba(240, 200, 110, 0.80)',
            opacity: isHovered ? 1 : 0.88,
            transition: 'opacity 0.35s ease, box-shadow 0.35s ease'
          }}
        />

        {/* Location Line with Pin Icon */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#201D18',
            fontSize: '11.5px',
            letterSpacing: '0.04em',
            fontWeight: 600,
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.85)'
          }}
        >
          <MapPin size={13} strokeWidth={2.4} color="#B8831E" fill="#B8831E" />
          <span>{locationString}</span>
        </div>

        {/* Property Name & Explore Arrow Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <h3
            style={{
              fontSize: 'clamp(1.35rem, 3.8vw, 1.55rem)',
              fontFamily: 'var(--font-serif)',
              color: '#110F0D',
              fontWeight: 600,
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: '-0.01em',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.90)'
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
              background: isHovered
                ? 'linear-gradient(135deg, #F5D588 0%, #DEAC45 40%, #BA821C 100%)'
                : 'linear-gradient(135deg, #ECC876 0%, #D4A33B 40%, #B07A18 100%)',
              border: isHovered ? '1.5px solid #FFFFFF' : '1.5px solid rgba(255, 255, 255, 0.95)',
              color: '#FFFFFF',
              boxShadow: isHovered
                ? 'inset 0 1px 1px rgba(255, 255, 255, 0.95), 0 6px 20px rgba(168, 117, 22, 0.55), 0 0 22px rgba(212, 163, 59, 0.60)'
                : 'inset 0 1px 1px rgba(255, 255, 255, 0.85), 0 4px 14px rgba(168, 117, 22, 0.40), 0 0 16px rgba(212, 163, 59, 0.45)',
              filter: isHovered ? 'brightness(1.10)' : 'brightness(1)',
              flexShrink: 0,
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'all 350ms ease'
            }}
          >
            <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
        </div>

        {/* Short Description */}
        <p
          style={{
            fontSize: '12px',
            color: '#26221C',
            lineHeight: 1.55,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontWeight: 450,
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.80)'
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
            paddingTop: '9px',
            borderTop: '1px solid rgba(184, 131, 30, 0.30)',
            fontSize: '11px',
            color: '#1C1915',
            fontWeight: 550,
            gap: '6px',
            textShadow: '0 1px 1px rgba(255, 255, 255, 0.80)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flexWrap: 'nowrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
              <Bed size={13} strokeWidth={2.0} color="#B8831E" />
              <span>{property.bedrooms} Beds</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
              <Bath size={13} strokeWidth={2.0} color="#B8831E" />
              <span>{property.bathrooms} Baths</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
              <Maximize2 size={13} strokeWidth={2.0} color="#B8831E" />
              <span>{formattedArea}</span>
            </span>
          </div>

          {formattedPrice && (
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                color: '#B8831E',
                letterSpacing: '0.01em',
                fontSize: '14.5px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.90)'
              }}
            >
              {formattedPrice}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
