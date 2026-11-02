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
        borderRadius: '22px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '480px',
        border: '1.5px solid rgba(255, 255, 255, 0.75)',
        borderColor: isHovered ? 'rgba(201, 154, 50, 0.55)' : 'rgba(216, 189, 138, 0.35)',
        boxShadow: isHovered
          ? '0 24px 60px -10px rgba(41, 39, 34, 0.16), 0 0 20px rgba(201, 154, 50, 0.20)'
          : '0 16px 40px -10px rgba(41, 39, 34, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
        transform: isHovered && !prefersReducedMotion ? 'translateY(-4px)' : 'translateY(0)',
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
        {/* Video Preview or Cover Image */}
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
              objectFit: 'cover',
              transform: isHovered && !prefersReducedMotion ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
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
              objectFit: 'cover',
              transform: isHovered && !prefersReducedMotion ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
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

        {/* Subtle Vignette Gradient for Glass Contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(20, 16, 12, 0.20) 0%, transparent 55%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* 2. TOP FLOATING BADGES OVER PHOTOGRAPHY: Category Badge & Favourite Heart */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '16px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Category Badge Pill */}
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'capitalize',
            padding: '5px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            color: '#292722',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(41, 39, 34, 0.08)'
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
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavourited ? '#C99A32' : '#292722',
            boxShadow: '0 4px 12px rgba(41, 39, 34, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Heart size={15} fill={isFavourited ? '#C99A32' : 'none'} strokeWidth={1.8} />
        </button>
      </div>

      {/* 3. REFINED TRANSLUCENT GLASS INFORMATION PANEL (Integrated Lower Portion) */}
      <div
        className="glass-panel-integrated glass-champagne"
        style={{
          position: 'relative',
          zIndex: 3,
          margin: '12px',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: isHovered
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.62) 0%, rgba(250, 246, 238, 0.44) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.52) 0%, rgba(245, 238, 228, 0.35) 100%)',
          backdropFilter: 'blur(16px) saturate(150%)',
          WebkitBackdropFilter: 'blur(16px) saturate(150%)',
          border: '1.2px solid rgba(255, 255, 255, 0.88)',
          borderRadius: '18px',
          boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(216, 189, 138, 0.30), 0 16px 36px -8px rgba(41, 39, 34, 0.12)',
          transition: 'all 0.35s ease'
        }}
      >
        {/* Location Line with Pin Icon */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            color: '#8A7A5D',
            fontSize: '11px',
            letterSpacing: '0.04em',
            fontWeight: 500
          }}
        >
          <MapPin size={12} strokeWidth={2} color="#C99A32" />
          <span>{locationString}</span>
        </div>

        {/* Property Name & Explore Arrow Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <h3
            style={{
              fontSize: '1.45rem',
              fontFamily: 'var(--font-serif)',
              color: '#292722',
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

          {/* Circular Glass Explore Action Button -> */}
          <Link
            href={`/residence/${property.slug}`}
            aria-label={`View ${property.name}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 30%, #C99A32 100%)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(201, 154, 50, 0.30)',
              flexShrink: 0,
              transition: 'transform 0.25s ease'
            }}
          >
            <ArrowRight size={14} strokeWidth={2.4} />
          </Link>
        </div>

        {/* Short Description */}
        <p
          style={{
            fontSize: '12px',
            color: '#68645D',
            lineHeight: 1.5,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontWeight: 300
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
            paddingTop: '8px',
            borderTop: '1px solid rgba(216, 189, 138, 0.25)',
            fontSize: '11px',
            color: '#44403C',
            fontWeight: 500
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Bed size={13} strokeWidth={1.8} color="#C99A32" />
              <span>{property.bedrooms} Beds</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Bath size={13} strokeWidth={1.8} color="#C99A32" />
              <span>{property.bathrooms} Baths</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Maximize2 size={13} strokeWidth={1.8} color="#C99A32" />
              <span>{formattedArea}</span>
            </span>
          </div>

          {formattedPrice && (
            <span style={{ fontWeight: 600, color: '#C99A32', letterSpacing: '0.02em' }}>
              {formattedPrice}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
