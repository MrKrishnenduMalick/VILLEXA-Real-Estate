import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import { Property } from '../../types/property';
import { PropertyCard } from '../property/PropertyCard';

export const FeaturedResidencesSection: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const all = await propertyService.getAllProperties();
        setProperties(all);
      } catch (err) {
        console.error('Failed to load featured residences:', err);
      }
    }
    loadData();
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'villa', label: 'Villas' },
    { id: 'penthouse', label: 'Penthouses' },
    { id: 'waterfront', label: 'Estates' }
  ];

  const filteredProperties = properties.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'villa') return p.propertyType === 'villa';
    if (activeCategory === 'penthouse') return p.propertyType === 'penthouse';
    if (activeCategory === 'waterfront') return p.propertyType === 'waterfront' || p.propertyType === 'estate' || p.signatureEstate;
    return true;
  });

  // Display 3 featured cards
  const displayProperties = filteredProperties.slice(currentIndex, currentIndex + 3);
  // Fallback if less than 3
  const visibleCards = displayProperties.length >= 3 ? displayProperties : filteredProperties.slice(0, 3);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, filteredProperties.length - 3)));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 3 < filteredProperties.length ? prev + 1 : 0));
  };

  return (
    <section
      id="featured-residences"
      style={{
        position: 'relative',
        padding: '80px 0 60px 0',
        zIndex: 10
      }}
    >
      <div className="container">
        {/* Section Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '40px'
          }}
        >
          {/* Left Title & Kicker */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#A9781F',
                fontWeight: 600,
                display: 'block',
                marginBottom: '8px'
              }}
            >
              FEATURED RESIDENCES
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 400,
                color: '#292722',
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: '-0.015em'
              }}
            >
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#C99A32' }}>Iconic Homes.</span>{' '}
              <span>Extraordinary Living.</span>
            </h2>
          </div>

          {/* Right Filters & Carousel Arrow Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* Category Filter Pills */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(216, 189, 138, 0.35)'
              }}
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setCurrentIndex(0);
                    }}
                    style={{
                      padding: '7px 18px',
                      borderRadius: '9999px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: '0.04em',
                      background: isActive ? 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 25%, #C99A32 60%, #A9781F 100%)' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#68645D',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 4px 12px rgba(201, 154, 50, 0.30)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Carousel Navigation Arrows < > */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handlePrev}
                aria-label="Previous properties"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(216, 189, 138, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#292722',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next properties"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.65)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(216, 189, 138, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#292722',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Luxury Property Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {visibleCards.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View All Residences Link */}
        <div style={{ marginTop: '36px', textAlign: 'center' }}>
          <Link
            href="/residences"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#A9781F',
              textDecoration: 'none',
              padding: '8px 16px',
              borderBottom: '1px solid rgba(201, 154, 50, 0.4)',
              transition: 'all 0.25s ease'
            }}
          >
            <span>Explore Entire Master Collection</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

