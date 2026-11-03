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
          ? '0 0 45px 3px rgba(240, 195, 100, 0.75), 0 30px 60px -10px rgba(45, 32, 20, 0.28), 0 14px 28px rgba(45, 32, 20, 0.14)'
          : '0 0 35px 2px rgba(235, 190, 95, 0.58), 0 20px 42px -10px rgba(45, 32, 20, 0.20), 0 8px 18px rgba(45, 32, 20, 0.10)',
        transition: 'transform 400ms cubic-bezier(0.2, 0.75, 0.25, 1), box-shadow 400ms ease'
      }}
    >
      {/* 1. FULL CARD GLASS FRAME (Translucent Beveled Edge & Exterior Gold Ambient Glow) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '28px',
          border: isHovered ? '2px solid rgba(255, 255, 255, 1.0)' : '2px solid rgba(255, 250, 235, 0.90)',
          boxShadow: isHovered
            ? 'inset 0 2.5px 3px rgba(255, 255, 255, 1.0), inset 0 -2px 3px rgba(255, 235, 180, 0.60), inset 2px 0 2px rgba(255, 255, 255, 0.55), inset -2px 0 2px rgba(255, 255, 255, 0.55), 0 0 30px rgba(240, 200, 110, 0.65)'
            : 'inset 0 2px 2.5px rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px rgba(255, 235, 180, 0.45), inset 1.5px 0 1.5px rgba(255, 255, 255, 0.45), inset -1.5px 0 1.5px rgba(255, 255, 255, 0.45), 0 0 22px rgba(235, 195, 105, 0.50)',
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

      {/* 3. FLOATING 3D GLASS INFORMATION PANEL (Ultra-Transparent 3D Crystal Glass Slab) */}
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
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 250, 240, 0.20) 45%, rgba(255, 255, 255, 0.32) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.36) 0%, rgba(255, 250, 240, 0.15) 45%, rgba(255, 255, 255, 0.26) 100%)',
          backdropFilter: 'blur(8px) saturate(140%)',
          WebkitBackdropFilter: 'blur(8px) saturate(140%)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          transform: isHovered && !prefersReducedMotion ? 'translateY(-10px)' : 'translateY(0)',
          boxShadow: isHovered
            ? '0 0 35px 4px rgba(245, 215, 130, 0.92), 0 0 14px 2px rgba(255, 255, 255, 1.0), 0 28px 52px -4px rgba(20, 14, 8, 0.42), inset 0 0 20px rgba(255, 248, 225, 0.55), inset 0 2.5px 3px 0 rgba(255, 255, 255, 1.0), inset 0 -2px 2.5px 0 rgba(255, 255, 255, 0.50)'
            : '0 0 24px 2px rgba(245, 210, 120, 0.80), 0 0 10px 1px rgba(255, 255, 255, 0.90), 0 20px 42px -4px rgba(20, 14, 8, 0.35), inset 0 0 14px rgba(255, 248, 225, 0.45), inset 0 2px 2.5px 0 rgba(255, 255, 255, 0.98), inset 0 -1.5px 2px 0 rgba(255, 255, 255, 0.40)',
          transition: 'transform 400ms cubic-bezier(0.2, 0.75, 0.25, 1), box-shadow 400ms ease, border-color 400ms ease, background 400ms ease'
        }}
      >
        {/* 3D Diagonal Glass Glare Reflection */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            background: 'linear-gradient(125deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 25%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Specular Flare Along Top Edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '5%',
            right: '5%',
            height: '2.5px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 1) 25%, #FFFDF2 50%, rgba(255, 255, 255, 1) 75%, transparent 100%)',
            pointerEvents: 'none',
            boxShadow: isHovered
              ? '0 0 18px rgba(255, 255, 255, 1), 0 0 30px rgba(245, 215, 130, 0.95)'
              : '0 0 14px rgba(255, 255, 255, 1), 0 0 24px rgba(240, 200, 110, 0.90)',
            opacity: 1,
            zIndex: 2,
            transition: 'opacity 0.35s ease, box-shadow 0.35s ease'
          }}
        />

        {/* Location Line with Pin Icon */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#1A1814',
            fontSize: '11.5px',
            letterSpacing: '0.04em',
            fontWeight: 650,
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.95), 0 0 6px rgba(255, 255, 255, 0.8)'
          }}
        >
          <MapPin size={13} strokeWidth={2.4} color="#B8831E" fill="#B8831E" />
          <span>{locationString}</span>
        </div>

        {/* Property Name & Explore Arrow Row */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <h3
            style={{
              fontSize: 'clamp(1.35rem, 3.8vw, 1.55rem)',
              fontFamily: 'var(--font-serif)',
              color: '#0E0C0A',
              fontWeight: 650,
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: '-0.01em',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.95), 0 0 8px rgba(255, 255, 255, 0.7)'
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
            position: 'relative',
            zIndex: 2,
            fontSize: '12px',
            color: '#181512',
            lineHeight: 1.55,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.95), 0 0 6px rgba(255, 255, 255, 0.8)'
          }}
        >
          {property.description || property.tagline}
        </p>

        {/* Specifications Strip: Beds | Baths | Area | Price */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            rowGap: '6px',
            columnGap: '8px',
            paddingTop: '9px',
            borderTop: '1px solid rgba(184, 131, 30, 0.25)',
            fontSize: '11px',
            color: '#181512',
            fontWeight: 650,
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.95)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
              <Bed size={13} strokeWidth={2.4} color="#B8831E" />
              <span>{property.bedrooms} Beds</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
              <Bath size={13} strokeWidth={2.4} color="#B8831E" />
              <span>{property.bathrooms} Baths</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
              <Maximize2 size={13} strokeWidth={2.4} color="#B8831E" />
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
                fontSize: formattedPrice.length > 10 ? '12.5px' : '15.5px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                marginLeft: 'auto',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.95)'
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
