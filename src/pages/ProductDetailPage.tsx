import React, { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, ArrowRight, MapPin, Bed, Bath, Maximize2, Heart } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { EmptyState } from '../components/common/EmptyState';

// Luxury Real Estate Property Components
import { PropertyGallery } from '../components/property/PropertyGallery';
import { PropertyVideoTour } from '../components/property/PropertyVideoTour';
import { PropertyFloorPlans } from '../components/property/PropertyFloorPlans';
import { PropertyAmenities } from '../components/property/PropertyAmenities';
import { PropertyLocation } from '../components/property/PropertyLocation';
import { PropertyEnquirySection } from '../components/property/PropertyEnquirySection';
import { PropertyAdjacentNav } from '../components/property/PropertyAdjacentNav';

type DetailTab = 'overview' | 'gallery' | '3d' | 'floorplan' | 'amenities' | 'location';

export const ProductDetailPage: React.FC = () => {
  const [, residenceParams] = useRoute('/residence/:slug');
  const [, residencesParams] = useRoute('/residences/:slug');
  const [, productParams] = useRoute('/product/:slug');
  const slug = residenceParams?.slug || residencesParams?.slug || productParams?.slug || '';

  const [property, setProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [isFavourited, setIsFavourited] = useState(false);
  const [adjacentProps, setAdjacentProps] = useState<{ prev: Property | null; next: Property | null }>({ prev: null, next: null });
  const [relatedProps, setRelatedProps] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) {
        setIsLoading(false);
        return;
      }
      try {
        const foundProperty = await propertyService.getPropertyBySlug(slug);
        if (foundProperty) {
          setProperty(foundProperty);
          const [adjacent, related] = await Promise.all([
            propertyService.getAdjacentProperties(slug),
            propertyService.getRelatedProperties(slug, 3)
          ]);
          setAdjacentProps(adjacent);
          setRelatedProps(related);
        } else {
          setProperty(null);
        }
      } catch (err) {
        console.error('Failed to load residence detail:', err);
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--space-24) 0', textAlign: 'center', backgroundColor: '#FAF8F5' }}>
        <span className="kicker">LOCATING ARCHITECTURAL RESIDENCE...</span>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ padding: 'var(--space-24) 0', backgroundColor: '#FAF8F5' }}>
        <div className="container">
          <EmptyState
            type="catalogue"
            title="Residence Outside Registry"
            description="The architectural residence or private estate reference you requested does not exist."
            actionLabel="Return to Master Residences"
            actionHref="/residences"
          />
        </div>
      </div>
    );
  }

  const formattedPrice = propertyService.formatPrice(property);
  const formattedArea = propertyService.formatArea(property.carpetArea || property.builtUpArea);
  const locationString = property.location.suburb
    ? `${property.location.suburb}, ${property.location.city}`
    : `${property.location.city}, ${property.location.country}`;

  const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'gallery', label: 'Gallery' },
    { id: '3d', label: '3D Experience' },
    { id: 'floorplan', label: 'Floor Plan' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'location', label: 'Location' }
  ];

  return (
    <div
      className="residence-detail-root marble-vein-backdrop"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '80px',
        zIndex: 10,
        overflow: 'hidden'
      }}
    >
      {/* Auric Flow Top Corner Framing */}
      <div className="auric-ribbon-top-right" />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        {/* Top Back Breadcrumb Link */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            href="/residences"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 500,
              color: '#74644D',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Residences</span>
          </Link>
        </div>

        {/* Master Top Residence Hero Card matching Reference Image Middle-Left */}
        <div
          className="glass-champagne"
          style={{
            position: 'relative',
            borderRadius: '26px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.12) 50%, rgba(246, 239, 224, 0.18) 100%)',
            backdropFilter: 'blur(10px) saturate(155%)',
            WebkitBackdropFilter: 'blur(10px) saturate(155%)',
            border: '1.5px solid rgba(255, 255, 255, 0.85)',
            boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.95), 0 16px 40px rgba(70, 48, 20, 0.12), 0 0 28px rgba(220, 175, 75, 0.25)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            alignItems: 'stretch',
            marginBottom: '32px'
          }}
        >
          {/* Left Info Column */}
          <div
            style={{
              padding: '36px 38px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div>
              {/* Location Line with Pin */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#74644D',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginBottom: '8px'
                }}
              >
                <MapPin size={13} color="#A87516" />
                <span>{locationString}</span>
              </div>

              {/* Property Title */}
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  fontWeight: 400,
                  color: '#24211D',
                  lineHeight: 1.12,
                  margin: '0 0 14px 0',
                  letterSpacing: '-0.015em'
                }}
              >
                {property.name}
              </h1>

              {/* Specs Bar (Beds | Baths | Area) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  fontSize: '13px',
                  color: '#514B43',
                  fontWeight: 500,
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255, 250, 240, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.70), 0 4px 12px rgba(70, 48, 20, 0.08)',
                  width: 'fit-content',
                  marginBottom: '16px'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Bed size={15} color="#A87516" />
                  <span>{property.bedrooms} Beds</span>
                </span>
                <span style={{ color: 'rgba(216, 189, 138, 0.6)' }}>|</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Bath size={15} color="#A87516" />
                  <span>{property.bathrooms} Baths</span>
                </span>
                <span style={{ color: 'rgba(216, 189, 138, 0.6)' }}>|</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Maximize2 size={15} color="#A87516" />
                  <span>{formattedArea}</span>
                </span>
              </div>

              {/* Price Display */}
              {formattedPrice && (
                <div style={{ fontSize: '15px', color: '#A87516', fontWeight: 600, marginBottom: '6px' }}>
                  {formattedPrice}
                </div>
              )}
            </div>

            {/* CTAs: Book a Private Viewing + Favourite Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                href="/contact"
                className="btn-gold-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 26px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 25%, #C99A32 60%, #A9781F 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 6px 20px rgba(168, 117, 22, 0.35)',
                  textDecoration: 'none'
                }}
              >
                <span>Book a Private Viewing</span>
                <ArrowRight size={14} />
              </Link>

              <button
                onClick={() => setIsFavourited(!isFavourited)}
                aria-label="Add to favourites"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(255, 250, 240, 0.38)',
                  backdropFilter: 'blur(14px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                  border: '1px solid rgba(255, 255, 255, 0.75)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.70), 0 4px 12px rgba(70, 48, 20, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isFavourited ? '#A87516' : '#24211D',
                  cursor: 'pointer'
                }}
              >
                <Heart size={18} fill={isFavourited ? '#A87516' : 'none'} strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Right Panoramic Photography Preview */}
          <div
            style={{
              position: 'relative',
              minHeight: '340px',
              overflow: 'hidden'
            }}
          >
            <img
              src={property.coverImage}
              alt={property.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(249, 247, 243, 0.35) 0%, transparent 60%)'
              }}
            />
          </div>
        </div>

        {/* Navigation Tabs (Overview | Gallery | 3D Experience | Floor Plan | Amenities | Location) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '32px',
            borderBottom: '1px solid rgba(216, 189, 138, 0.30)'
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '9px 22px',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.04em',
                  background: isActive ? 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 25%, #C99A32 60%, #A9781F 100%)' : 'rgba(255, 250, 240, 0.35)',
                  color: isActive ? '#FFFFFF' : '#514B43',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.65)',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 14px rgba(168, 117, 22, 0.30)' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Overview Editorial Quote & Narrative Panel */}
            <div
              className="glass-crystal"
              style={{
                padding: '36px 40px',
                borderRadius: '24px',
                background: 'rgba(255, 250, 240, 0.26)',
                backdropFilter: 'blur(18px) saturate(145%)',
                WebkitBackdropFilter: 'blur(18px) saturate(145%)',
                border: '1px solid rgba(255, 255, 255, 0.62)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72), 0 12px 35px rgba(70, 48, 20, 0.12)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                alignItems: 'center'
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: '#24211D',
                    lineHeight: 1.2,
                    marginBottom: '16px'
                  }}
                >
                  "A coastal masterpiece of privacy and light."
                </h2>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.96rem', color: '#514B43', lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
                  {property.description}
                </p>
                {property.architecturalNarrative && (
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.94rem', color: '#514B43', lineHeight: 1.7, marginTop: '14px', fontWeight: 400 }}>
                    {property.architecturalNarrative}
                  </p>
                )}
              </div>

              {/* Curated Mini Thumbnails */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {property.gallery.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: '14px',
                      overflow: 'hidden',
                      height: '110px',
                      position: 'relative',
                      border: '1px solid rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <img src={img.url} alt={img.caption || property.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Comprehensive Amenities Grid */}
            <PropertyAmenities amenities={property.amenities} />

            {/* Regional Map & Location Highlights */}
            <PropertyLocation
              propertyName={property.name}
              location={property.location}
              address={property.address}
              highlights={property.locationHighlights}
            />
          </div>
        )}

        {activeTab === 'gallery' && (
          <PropertyGallery
            propertyName={property.name}
            coverImage={property.coverImage}
            gallery={property.gallery}
          />
        )}

        {activeTab === '3d' && (
          <PropertyVideoTour
            propertyName={property.name}
            videos={property.videos}
            defaultPoster={property.coverImage}
          />
        )}

        {activeTab === 'floorplan' && (
          <PropertyFloorPlans
            propertyName={property.name}
            floorPlans={property.floorPlans}
          />
        )}

        {activeTab === 'amenities' && (
          <PropertyAmenities amenities={property.amenities} />
        )}

        {activeTab === 'location' && (
          <PropertyLocation
            propertyName={property.name}
            location={property.location}
            address={property.address}
            highlights={property.locationHighlights}
          />
        )}

        {/* Adjacent Property Sequential Navigation */}
        <div style={{ marginTop: '48px' }}>
          <PropertyAdjacentNav
            currentProperty={property}
            prevProperty={adjacentProps.prev}
            nextProperty={adjacentProps.next}
            relatedProperties={relatedProps}
          />
        </div>

        {/* Private Viewing Consultation Form */}
        <div style={{ marginTop: '48px' }}>
          <PropertyEnquirySection property={property} />
        </div>
      </div>
    </div>
  );
};
