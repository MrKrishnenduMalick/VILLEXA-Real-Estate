import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
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
            promise.catch(() => {
              // Autoplay policy fallback
            });
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
    villa: 'Architectural Villa',
    penthouse: 'Sky Penthouse',
    waterfront: 'Waterfront Residence',
    estate: 'Private Estate',
    apartment: 'Luxury Apartment',
    residential_development: 'Residential Enclave'
  };
  const typologyLabel = typologyLabels[property.propertyType] || 'Private Residence';

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
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '540px',
        border: '1px solid rgba(197, 160, 89, 0.28)',
        borderColor: isHovered ? 'rgba(197, 160, 89, 0.55)' : 'rgba(197, 160, 89, 0.28)',
        boxShadow: isHovered
          ? '0 24px 60px -10px rgba(0, 0, 0, 0.55), inset 0 1px 1px 0 rgba(255, 255, 255, 0.30)'
          : '0 16px 40px -8px rgba(0, 0, 0, 0.40), inset 0 1px 1px 0 rgba(255, 255, 255, 0.20)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.45s ease',
        backgroundColor: '#070C18'
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
              transform: isHovered && !prefersReducedMotion ? 'scale(1.06)' : 'scale(1)',
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
              transform: isHovered && !prefersReducedMotion ? 'scale(1.06)' : 'scale(1)',
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
              backgroundColor: '#0A1124',
              color: 'var(--color-accent-gold)'
            }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', letterSpacing: '0.1em' }}>
              {config?.brand?.brandName || 'VILLEXA'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#8A7E72', marginTop: '4px' }}>
              Architectural Commission
            </span>
          </div>
        )}

        {/* Directional Vignette Gradient to ensure glass transmission contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(6, 11, 24, 0.35) 0%, rgba(6, 11, 24, 0.06) 45%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* 2. TOP FLOATING BADGES OVER ARCHITECTURAL PHOTOGRAPHY */}
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
            fontSize: '0.66rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(8, 14, 28, 0.68)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(197, 160, 89, 0.32)',
            color: '#DFCFA8',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(2, 6, 14, 0.35)'
          }}
        >
          {typologyLabel}
        </span>

        {property.signatureEstate ? (
          <span
            style={{
              fontSize: '0.66rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-accent-gold)',
              color: '#FFFFFF',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(184, 149, 82, 0.35)'
            }}
          >
            Signature Estate
          </span>
        ) : property.status === 'under_construction' ? (
          <span
            style={{
              fontSize: '0.66rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(8, 14, 28, 0.68)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: 'rgba(250, 248, 245, 0.85)',
              fontWeight: 500
            }}
          >
            Completing {property.completionYear || 'Soon'}
          </span>
        ) : null}
      </div>

      {/* 3. REFINED TRANSLUCENT GLASS INFORMATION PANEL (Integrated Lower Portion) */}
      <div
        className="glass-panel-integrated glass-royal-sapphire"
        style={{
          position: 'relative',
          zIndex: 3,
          margin: '14px',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: isHovered
            ? 'linear-gradient(145deg, rgba(22, 34, 60, 0.52) 0%, rgba(12, 20, 38, 0.44) 100%)'
            : 'linear-gradient(145deg, rgba(16, 26, 48, 0.46) 0%, rgba(8, 15, 30, 0.40) 100%)',
          backdropFilter: 'blur(14px) saturate(135%)',
          WebkitBackdropFilter: 'blur(14px) saturate(135%)',
          border: '1px solid rgba(197, 160, 89, 0.32)',
          borderRadius: '12px',
          boxShadow: isHovered
            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.52), inset 0 0 0 1px rgba(197, 160, 89, 0.22), 0 20px 48px -4px rgba(2, 6, 16, 0.55)'
            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.42), inset 0 0 0 1px rgba(197, 160, 89, 0.14), 0 16px 36px -4px rgba(2, 6, 16, 0.45)',
          transition: 'all 0.35s ease'
        }}
      >
        <div>
          {/* Location Line */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-accent-gold)',
              fontSize: '0.72rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '6px'
            }}
          >
            <MapPin size={12} strokeWidth={2} />
            <span>{locationString}</span>
          </div>

          {/* Property Name */}
          <h3
            style={{
              fontSize: '1.65rem',
              fontFamily: 'var(--font-serif)',
              color: '#FFFFFF',
              fontWeight: 300,
              lineHeight: 1.15,
              margin: '0 0 6px 0',
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

          {/* Tagline */}
          <p
            style={{
              fontSize: '0.82rem',
              color: 'rgba(250, 248, 245, 0.80)',
              lineHeight: 1.55,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontWeight: 300
            }}
          >
            {property.tagline}
          </p>
        </div>

        {/* Spatial Metrics Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderTop: '1px solid rgba(197, 160, 89, 0.22)',
            borderBottom: '1px solid rgba(197, 160, 89, 0.22)',
            fontSize: '0.80rem',
            color: 'rgba(250, 248, 245, 0.88)',
            fontWeight: 400
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bed size={13} color="var(--color-accent-gold)" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bath size={13} color="var(--color-accent-gold)" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Maximize2 size={12} color="var(--color-accent-gold)" />
            <span>{formattedArea}</span>
          </div>
        </div>

        {/* PRICE & CTA ACTION ROW */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2px'
          }}
        >
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.64rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-gold)',
                fontWeight: 600,
                marginBottom: '2px'
              }}
            >
              {property.priceDisplayPrefix || 'Guide Price'}
            </span>
            <span
              style={{
                fontSize: '1.35rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                color: '#FAF8F5'
              }}
            >
              {formattedPrice}
            </span>
          </div>

          <Link
            href={`/residence/${property.slug}`}
            style={{
              padding: '8px 18px',
              fontSize: '0.74rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: isHovered ? 'rgba(197, 160, 89, 0.35)' : 'rgba(255, 255, 255, 0.10)',
              color: '#FAF8F5',
              border: '1px solid',
              borderColor: isHovered ? '#C5A059' : 'rgba(197, 160, 89, 0.35)',
              borderRadius: '9999px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              fontWeight: 500,
              transition: 'all 0.25s ease'
            }}
          >
            <span>Inspect</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
};
