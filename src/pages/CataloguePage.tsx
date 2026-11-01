import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { Search, X, ArrowRight, RotateCcw, Building, Sparkles, ShieldCheck, Lock, MessageSquare } from 'lucide-react';
import { PropertyCard } from '../components/property/PropertyCard';
import { propertyService } from '../services/propertyService';
import { useClientConfig } from '../context/ClientConfigContext';
import { Property, PropertyType, PropertySortOption } from '../types/property';

const CATEGORY_TABS: Array<{ id: string; label: string; type?: PropertyType }> = [
  { id: 'all', label: 'All Residences' },
  { id: 'villa', label: 'Villas & Estates', type: 'villa' },
  { id: 'penthouse', label: 'Sky Penthouses', type: 'penthouse' },
  { id: 'waterfront', label: 'Waterfront', type: 'waterfront' },
  { id: 'apartment', label: 'Apartments', type: 'apartment' },
  { id: 'residential_development', label: 'Enclaves', type: 'residential_development' }
];

const BEDROOM_OPTIONS = [
  { value: 'all', label: 'All Bedrooms' },
  { value: '4', label: '4+ Bedrooms' },
  { value: '5', label: '5+ Bedrooms' },
  { value: '6', label: '6+ Bedrooms' }
];

const PRICE_RANGE_OPTIONS = [
  { id: 'all', label: 'All Price Ranges', min: undefined, max: undefined },
  { id: 'under_30cr', label: 'Under ₹30 Cr', min: undefined, max: 300000000 },
  { id: '30cr_50cr', label: '₹30 Cr – ₹50 Cr', min: 300000000, max: 500000000 },
  { id: 'above_50cr', label: 'Above ₹50 Cr', min: 500000000, max: undefined }
];

export const CataloguePage: React.FC = () => {
  const config = useClientConfig();
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperty, setFeaturedProperty] = useState<Property | null>(null);

  // Filters State
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('type') || params.get('category');
      if (cat) {
        const normalized = cat.toLowerCase().replace(/s$/, '');
        const matched = CATEGORY_TABS.find((t) => t.id === normalized || t.id === cat.toLowerCase());
        if (matched) return matched.id;
      }
    }
    return 'all';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bedroomFilter, setBedroomFilter] = useState<string>('all');
  const [priceFilterId, setPriceFilterId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<PropertySortOption>('featured');

  // Sync category from URL parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('type') || params.get('category');
      if (cat) {
        // Map common aliases (e.g. 'villas' -> 'villa', 'penthouses' -> 'penthouse')
        const normalized = cat.toLowerCase().replace(/s$/, '');
        const matched = CATEGORY_TABS.find((t) => t.id === normalized || t.id === cat.toLowerCase());
        if (matched) {
          setActiveCategory(matched.id);
        }
      }
    }
  }, []);

  // Load properties
  useEffect(() => {
    async function loadData() {
      try {
        const [allProps, featuredProps] = await Promise.all([
          propertyService.getAllProperties(),
          propertyService.getFeaturedProperties()
        ]);
        setProperties(allProps);
        if (featuredProps.length > 0) {
          setFeaturedProperty(featuredProps[0]);
        }
      } catch {
        // Fallback handled gracefully
      }
    }
    loadData();
  }, []);

  // Compute filtered & sorted properties
  const displayedProperties = useMemo(() => {
    let result = [...properties];

    // 1. Category Filter
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.propertyType === activeCategory);
    }

    // 2. Bedrooms Filter
    if (bedroomFilter !== 'all') {
      const minBeds = Number(bedroomFilter);
      result = result.filter((p) => p.bedrooms >= minBeds);
    }

    // 3. Price Filter
    const selectedPriceConfig = PRICE_RANGE_OPTIONS.find((opt) => opt.id === priceFilterId);
    if (selectedPriceConfig) {
      if (typeof selectedPriceConfig.min === 'number') {
        result = result.filter((p) => p.price !== null && p.price >= selectedPriceConfig.min!);
      }
      if (typeof selectedPriceConfig.max === 'number') {
        result = result.filter((p) => p.price !== null && p.price <= selectedPriceConfig.max!);
      }
    }

    // 4. Search Filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.country.toLowerCase().includes(q) ||
        (p.location.suburb && p.location.suburb.toLowerCase().includes(q)) ||
        p.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }

    // 5. Sorting
    return propertyService.sortProperties(result, sortBy);
  }, [properties, activeCategory, bedroomFilter, priceFilterId, searchQuery, sortBy]);

  const hasActiveFilters = activeCategory !== 'all' || bedroomFilter !== 'all' || priceFilterId !== 'all' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setActiveCategory('all');
    setBedroomFilter('all');
    setPriceFilterId('all');
    setSearchQuery('');
    setSortBy('featured');
    if (typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState({}, '', '/residences');
    }
  };

  return (
    <div className="w-full bg-[#070C18]/80 backdrop-blur-xl text-white" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-24)', position: 'relative', zIndex: 10 }}>
      <div className="container">
        {/* 1. EDITORIAL HEADER */}
        <div style={{ marginBottom: 'var(--space-10)', textAlign: 'left' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.74rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-gold)',
              marginBottom: 'var(--space-3)',
              fontWeight: 600
            }}
          >
            <Sparkles size={13} />
            <span>RESIDENTIAL PORTFOLIO REGISTRY</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 300,
              color: '#ffffff',
              lineHeight: 1.12,
              marginBottom: 'var(--space-4)',
              letterSpacing: '-0.015em'
            }}
          >
            Curated Private Residences
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              color: 'rgba(255, 255, 255, 0.78)',
              maxWidth: '680px',
              lineHeight: 1.7,
              margin: 0
            }}
          >
            A distinguished collection of architectural villas, horizon penthouses, and private coastal estates engineered for permanence, tranquility, and generational equity.
          </p>
        </div>

        {/* 2. EDITORIAL FEATURED RESIDENCE SHOWCASE (Architectural Magazine Spread) */}
        {featuredProperty && !hasActiveFilters && (
          <section
            style={{
              marginBottom: 'var(--space-14)',
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative'
            }}
            className="luxury-glass-card"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                alignItems: 'stretch'
              }}
            >
              {/* Left Large Cover Media */}
              <div
                style={{
                  position: 'relative',
                  minHeight: '380px',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={featuredProperty.coverImage}
                  alt={featuredProperty.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(16, 14, 12, 0.2) 0%, rgba(16, 14, 12, 0.7) 100%)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(18, 16, 14, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(197, 160, 89, 0.45)',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    fontSize: '0.68rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent-gold)',
                    fontWeight: 600
                  }}
                >
                  <Building size={12} />
                  <span>SIGNATURE MONOGRAPH</span>
                </div>
              </div>

              {/* Right Architectural Narrative */}
              <div
                style={{
                  padding: 'clamp(2rem, 4vw, 3.5rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-6)'
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent-gold)',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '6px'
                    }}
                  >
                    {featuredProperty.location.suburb}, {featuredProperty.location.city}
                  </span>

                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                      color: '#ffffff',
                      fontWeight: 300,
                      lineHeight: 1.15,
                      marginBottom: 'var(--space-3)'
                    }}
                  >
                    {featuredProperty.name}
                  </h2>

                  <p
                    style={{
                      fontSize: '0.94rem',
                      color: 'rgba(255, 255, 255, 0.82)',
                      lineHeight: 1.65,
                      marginBottom: 'var(--space-6)'
                    }}
                  >
                    {featuredProperty.architecturalNarrative || featuredProperty.description}
                  </p>

                  {/* Highlights Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-4) 0',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
                        Accommodations
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 500 }}>
                        {featuredProperty.bedrooms} Suites
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
                        Built-Up Area
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 500 }}>
                        {propertyService.formatArea(featuredProperty.builtUpArea)}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
                        Acquisition
                      </span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--color-accent-gold)', fontFamily: 'var(--font-serif)' }}>
                        {propertyService.formatPrice(featuredProperty)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <Link
                    href={`/residence/${featuredProperty.slug}`}
                    className="btn btn-gold"
                    style={{ padding: '0.85rem 2rem', fontSize: '0.8rem', letterSpacing: '0.12em' }}
                  >
                    <span>Explore Signature Residence</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. CONTROLS BAR: CATEGORY PILLS, SEARCH, FILTERS & SORTING */}
        <div
          style={{
            marginBottom: 'var(--space-8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)'
          }}
        >
          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              overflowX: 'auto',
              paddingBottom: '6px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    backgroundColor: isActive ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#070C18' : '#FAF8F5',
                    fontWeight: isActive ? 600 : 400,
                    border: isActive ? '1px solid var(--color-accent-gold)' : '1px solid rgba(197, 160, 89, 0.22)'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls Bar: Search, Dropdowns & Sort */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexGrow: 1,
                minWidth: '240px',
                maxWidth: '420px',
                position: 'relative'
              }}
            >
              <Search size={15} color="var(--color-accent-gold)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="text"
                placeholder="Search residence, location, or amenity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 34px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(20, 18, 16, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label="Clear search query"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Dropdown Filters (Bedrooms, Price Range, Sort) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                flexWrap: 'wrap'
              }}
            >
              {/* Bedrooms Dropdown */}
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(10, 18, 36, 0.80)',
                  border: '1px solid rgba(197, 160, 89, 0.30)',
                  color: '#FAF8F5',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none'
                }}
              >
                {BEDROOM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: '#0A1224' }}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Price Range Dropdown */}
              <select
                value={priceFilterId}
                onChange={(e) => setPriceFilterId(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(10, 18, 36, 0.80)',
                  border: '1px solid rgba(197, 160, 89, 0.30)',
                  color: '#FAF8F5',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none'
                }}
              >
                {PRICE_RANGE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} style={{ background: '#0A1224' }}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as PropertySortOption)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(10, 18, 36, 0.80)',
                  border: '1px solid rgba(197, 160, 89, 0.38)',
                  color: 'var(--color-accent-gold)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  outline: 'none'
                }}
              >
                <option value="featured" style={{ background: '#0A1224' }}>Sort: Featured Precedence</option>
                <option value="price_desc" style={{ background: '#0A1224' }}>Sort: Price (High to Low)</option>
                <option value="price_asc" style={{ background: '#0A1224' }}>Sort: Price (Low to High)</option>
                <option value="area_desc" style={{ background: '#0A1224' }}>Sort: Built-Up Area</option>
                <option value="name_asc" style={{ background: '#0A1224' }}>Sort: Residence Name</option>
              </select>

              {/* Clear Filters Button (When active) */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  title="Reset all search filters"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Count Summary */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.65)',
              padding: '0 4px'
            }}
          >
            <span>
              Exhibiting <strong style={{ color: '#ffffff' }}>{displayedProperties.length}</strong> of{' '}
              {properties.length} Private Residences
            </span>
          </div>
        </div>

        {/* 4. PROPERTY CARDS GRID */}
        {displayedProperties.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 'var(--space-8)'
            }}
          >
            {displayedProperties.map((property, idx) => (
              <PropertyCard
                key={property.id}
                property={property}
                priority={idx < 3}
              />
            ))}
          </div>
        ) : (
          /* 5. DESIGNED EMPTY STATE */
          <div
            className="luxury-glass-card"
            style={{
              padding: 'var(--space-16) var(--space-8)',
              textAlign: 'center',
              borderRadius: '24px',
              maxWidth: '640px',
              margin: 'var(--space-8) auto'
            }}
          >
            <Building size={36} color="var(--color-accent-gold)" style={{ margin: '0 auto var(--space-4)' }} />
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                color: '#ffffff',
                fontWeight: 300,
                marginBottom: 'var(--space-2)'
              }}
            >
              No Residences Match Current Criteria
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.72)',
                lineHeight: 1.6,
                maxWidth: '460px',
                margin: '0 auto var(--space-6)'
              }}
            >
              We curate an exclusive, discreet registry. Adjust your bedroom parameters, price brackets, or clear the search query to view available demonstration residences.
            </p>
            <button
              onClick={handleResetFilters}
              className="btn btn-gold"
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.8rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset Search Criteria</span>
            </button>
          </div>
        )}

        {/* 6. CONCIERGE ADVISORY CALL-TO-ACTION FOOTER — REDESIGNED ARCHITECTURAL MONOGRAPH */}
        <section
          style={{
            marginTop: 'var(--space-20)',
            maxWidth: '1080px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 'clamp(2rem, 4vw, 3.2rem) clamp(1.8rem, 4vw, 3.5rem)',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, rgba(10, 18, 36, 0.58) 0%, rgba(6, 11, 24, 0.48) 100%)',
            backdropFilter: 'blur(20px) saturate(140%)',
            WebkitBackdropFilter: 'blur(20px) saturate(140%)',
            border: '1px solid rgba(197, 160, 89, 0.35)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.38), inset 0 0 0 1px rgba(197, 160, 89, 0.14), 0 24px 60px -8px rgba(2, 6, 14, 0.55)'
          }}
        >
          {/* Architectural Registration Crosshairs in 4 corners */}
          <div style={{ position: 'absolute', top: '14px', left: '16px', color: 'rgba(197, 160, 89, 0.45)', fontSize: '11px', fontFamily: 'monospace', pointerEvents: 'none' }}>+</div>
          <div style={{ position: 'absolute', top: '14px', right: '16px', color: 'rgba(197, 160, 89, 0.45)', fontSize: '11px', fontFamily: 'monospace', pointerEvents: 'none' }}>+</div>
          <div style={{ position: 'absolute', bottom: '14px', left: '16px', color: 'rgba(197, 160, 89, 0.45)', fontSize: '11px', fontFamily: 'monospace', pointerEvents: 'none' }}>+</div>
          <div style={{ position: 'absolute', bottom: '14px', right: '16px', color: 'rgba(197, 160, 89, 0.45)', fontSize: '11px', fontFamily: 'monospace', pointerEvents: 'none' }}>+</div>

          {/* Balanced Two-Column Composition */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(24px, 4vw, 48px)',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Left Column: Monograph Heading & Statement */}
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--color-accent-gold)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '10px'
                }}
              >
                <ShieldCheck size={14} className="text-[#C5A059]" />
                <span>CONFIDENTIAL ACQUISITION PROTOCOL</span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.9rem, 2.8vw, 2.5rem)',
                  color: '#FAF8F5',
                  fontWeight: 300,
                  lineHeight: 1.15,
                  margin: '0 0 14px 0',
                  letterSpacing: '-0.01em'
                }}
              >
                Private Client Representation &amp; Off-Market Portfolio
              </h2>

              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'rgba(250, 248, 245, 0.82)',
                  lineHeight: 1.65,
                  margin: 0,
                  fontWeight: 300
                }}
              >
                A selective portion of our architectural estate portfolio remains strictly confidential. Our advisory directors are available for discreet acquisition briefings, private aviation coordination, and confidential viewings under signed non-disclosure protocols.
              </p>
            </div>

            {/* Right Column: Reassurance Capsules & Prominent Action */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '22px 24px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(197, 160, 89, 0.20)',
                backdropFilter: 'blur(16px)',
                textAlign: 'left'
              }}
            >
              {/* Protocol Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#FAF8F5' }}>
                  <Lock size={13} color="var(--color-accent-gold)" />
                  <span>Discreet Non-Disclosure &amp; Identity Privacy</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#FAF8F5' }}>
                  <Building size={13} color="var(--color-accent-gold)" />
                  <span>Direct Advisory Desk &amp; Partner Briefing</span>
                </div>
              </div>

              {/* Consultation Action */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                <Link
                  href="/contact"
                  className="btn btn-gold"
                  style={{
                    padding: '0.85rem 1.8rem',
                    fontSize: '0.76rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '9999px',
                    boxShadow: '0 8px 24px rgba(184, 149, 82, 0.35)',
                    textDecoration: 'none'
                  }}
                >
                  <span>Consult Private Concierge</span>
                  <ArrowRight size={13} />
                </Link>

                <a
                  href={`https://wa.me/${config.contact.whatsappNumber}?text=${encodeURIComponent(`Hello ${config.brand.brandName} Concierge,\n\nI would like to arrange a confidential private consultation regarding off-market acquisitions.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.74rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#DFCFA8',
                    textDecoration: 'none',
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(197, 160, 89, 0.25)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <MessageSquare size={13} className="text-[#25D366]" />
                  <span>Direct Desk</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
