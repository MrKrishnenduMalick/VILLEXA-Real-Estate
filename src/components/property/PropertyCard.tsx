import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { Property } from '../../types/property';
import { propertyService } from '../../services/propertyService';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, priority = false }) => {
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
      className="property-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.45s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        border: '1px solid #EAE5DC',
        borderColor: isHovered ? 'var(--color-accent-gold)' : '#EAE5DC',
        boxShadow: isHovered
          ? '0 20px 44px -12px rgba(26, 24, 22, 0.12)'
          : '0 8px 28px -6px rgba(26, 24, 22, 0.05)'
      }}
    >
      {/* 1. MEDIA PRESENTATION WRAPPER */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          backgroundColor: '#FAF8F5'
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
              transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
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
              transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
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
              backgroundColor: '#FAF8F5',
              color: 'var(--color-accent-gold)'
            }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', letterSpacing: '0.1em' }}>
              BILEKSA
            </span>
            <span style={{ fontSize: '0.72rem', color: '#6E6860', marginTop: '4px' }}>
              Architectural Commission
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 3,
            pointerEvents: 'none'
          }}
        >
          <span
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid #EAE5DC',
              color: '#1A1816',
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
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
                boxShadow: '0 2px 10px rgba(184, 149, 82, 0.3)'
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
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                border: '1px solid #EAE5DC',
                color: '#6E6860',
                fontWeight: 500
              }}
            >
              Completing {property.completionYear || 'Soon'}
            </span>
          ) : null}
        </div>
      </div>

      {/* 2. CARD CONTENT NARRATIVE */}
      <div
        style={{
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          backgroundColor: '#FFFFFF'
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
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: '8px'
            }}
          >
            <MapPin size={12} strokeWidth={2} />
            <span>{locationString}</span>
          </div>

          {/* Property Name */}
          <h3
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-serif)',
              color: '#1A1816',
              fontWeight: 400,
              lineHeight: 1.25,
              margin: '0 0 8px 0',
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
              fontSize: '0.88rem',
              color: '#6E6860',
              lineHeight: 1.6,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
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
            padding: '12px 0',
            borderTop: '1px solid #EAE5DC',
            borderBottom: '1px solid #EAE5DC',
            fontSize: '0.82rem',
            color: '#3D3934',
            fontWeight: 400
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bed size={14} color="var(--color-accent-gold)" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bath size={14} color="var(--color-accent-gold)" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Maximize2 size={13} color="var(--color-accent-gold)" />
            <span>{formattedArea}</span>
          </div>
        </div>

        {/* 3. PRICE & CTA ACTION ROW */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '4px'
          }}
        >
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
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
                color: '#1A1816'
              }}
            >
              {formattedPrice}
            </span>
          </div>

          <Link
            href={`/residence/${property.slug}`}
            style={{
              padding: '9px 18px',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1A1816',
              color: '#FAF8F5',
              borderRadius: '9999px',
              fontWeight: 500,
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-accent-gold)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1A1816';
              e.currentTarget.style.color = '#FAF8F5';
            }}
          >
            <span>Explore</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
};
