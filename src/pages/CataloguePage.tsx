import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { PropertyCard } from '../components/property/PropertyCard';
import { propertyService } from '../services/propertyService';
import { Property, PropertyType, PropertySortOption } from '../types/property';

const CATEGORY_TABS: Array<{ id: string; label: string; type?: PropertyType }> = [
  { id: 'all', label: 'All' },
  { id: 'villa', label: 'Villas', type: 'villa' },
  { id: 'penthouse', label: 'Penthouses', type: 'penthouse' },
  { id: 'estate', label: 'Estates', type: 'waterfront' }
];

export const CataloguePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters State
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('type') || params.get('category');
      if (cat) {
        const normalized = cat.toLowerCase().replace(/s$/, '');
        if (normalized === 'waterfront' || normalized === 'estate') return 'estate';
        const matched = CATEGORY_TABS.find((t) => t.id === normalized || t.id === cat.toLowerCase());
        if (matched) return matched.id;
      }
    }
    return 'all';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const sortBy: PropertySortOption = 'featured';

  // Sync category from URL parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('type') || params.get('category');
      if (cat) {
        const normalized = cat.toLowerCase().replace(/s$/, '');
        if (normalized === 'waterfront' || normalized === 'estate') {
          setActiveCategory('estate');
        } else {
          const matched = CATEGORY_TABS.find((t) => t.id === normalized || t.id === cat.toLowerCase());
          if (matched) setActiveCategory(matched.id);
        }
      }
    }
  }, []);

  // Load properties
  useEffect(() => {
    async function loadData() {
      try {
        const allProps = await propertyService.getAllProperties();
        setProperties(allProps);
      } catch (err) {
        console.error('Failed to load catalogue residences:', err);
      }
    }
    loadData();
  }, []);

  // Compute filtered & sorted properties
  const displayedProperties = useMemo(() => {
    let result = [...properties];

    // 1. Category Filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'estate') {
        result = result.filter(
          (p) => p.propertyType === 'waterfront' || p.propertyType === 'residential_development' || p.signatureEstate
        );
      } else {
        result = result.filter((p) => p.propertyType === activeCategory);
      }
    }

    // 2. Search Filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.country.toLowerCase().includes(q) ||
          (p.location.suburb && p.location.suburb.toLowerCase().includes(q)) ||
          p.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }

    // 3. Sorting
    return propertyService.sortProperties(result, sortBy);
  }, [properties, activeCategory, searchQuery, sortBy]);

  return (
    <div
      className="catalogue-page-root marble-vein-backdrop"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        paddingTop: '110px',
        paddingBottom: '90px',
        zIndex: 10,
        overflow: 'hidden'
      }}
    >
      {/* Auric Flow Top Corner Framing (Signature Metallic-Gold Wave) */}
      <div className="auric-ribbon-top-right" />

      {/* Auric Flow Left Wave Ribbon Accent */}
      <div
        style={{
          position: 'absolute',
          top: '720px',
          left: 0,
          width: '580px',
          height: '380px',
          backgroundImage: 'url(/assets/auric-flow-gold-ribbon.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1) rotate(180deg)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
          opacity: 0.88,
          zIndex: 1
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        {/* Editorial Page Header matching Reference Top-Right */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 44px auto' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: '#A87516',
              fontWeight: 600,
              display: 'block',
              marginBottom: '10px'
            }}
          >
            RESIDENCES
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 400,
              color: '#24211D',
              lineHeight: 1.12,
              margin: '0 0 14px 0',
              letterSpacing: '-0.015em'
            }}
          >
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#A87516' }}>Our Signature</span>{' '}
            <span>Residences</span>
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              color: '#514B43',
              lineHeight: 1.65,
              margin: 0,
              fontWeight: 400
            }}
          >
            Discover our exclusive collection of villas, penthouses and estates across India's most sought-after destinations.
          </p>
        </div>

        {/* Filter Bar & Controls matching Reference Image */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            marginBottom: '36px',
            padding: '12px 20px',
            borderRadius: '9999px',
            background: 'rgba(255, 250, 240, 0.26)',
            backdropFilter: 'blur(18px) saturate(145%)',
            WebkitBackdropFilter: 'blur(18px) saturate(145%)',
            border: '1px solid rgba(255, 255, 255, 0.62)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72), 0 12px 35px rgba(70, 48, 20, 0.12)'
          }}
        >
          {/* Category Filter Pills (All | Villas | Penthouses | Estates) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  style={{
                    padding: '8px 22px',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.04em',
                    background: isActive
                      ? 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 25%, #C99A32 60%, #A9781F 100%)'
                      : 'transparent',
                    color: isActive ? '#FFFFFF' : '#514B43',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 14px rgba(168, 117, 22, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input & View Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '7px 12px 7px 32px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(216, 189, 138, 0.40)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '12px',
                  color: '#292722',
                  outline: 'none',
                  width: '180px'
                }}
              />
              <Search size={13} color="#8A7A5D" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '9px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={12} color="#8A7A5D" />
                </button>
              )}
            </div>

            {/* Grid & List View Controls */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(216, 189, 138, 0.35)'
              }}
            >
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid View"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: viewMode === 'grid' ? '#C99A32' : 'transparent',
                  color: viewMode === 'grid' ? '#FFFFFF' : '#68645D',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List View"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: viewMode === 'list' ? '#C99A32' : 'transparent',
                  color: viewMode === 'list' ? '#FFFFFF' : '#68645D',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* 3x2 Grid of 6 Complete Property Cards matching Reference */}
        {displayedProperties.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                viewMode === 'grid' ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
              gap: '24px'
            }}
          >
            {displayedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(216, 189, 138, 0.3)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#292722', marginBottom: '8px' }}>
              No Residences Found
            </h3>
            <p style={{ color: '#68645D', fontSize: '13px', marginBottom: '16px' }}>
              No architectural residences matched your filter criteria.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="btn-gold-primary"
              style={{ padding: '8px 20px', fontSize: '12px' }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
