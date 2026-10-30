import React from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { useClientConfig } from '../../context/ClientConfigContext';

export const Footer: React.FC = () => {
  const config = useClientConfig();

  return (
    <footer
      style={{
        backgroundColor: '#F3EFEA',
        color: '#1A1816',
        borderTop: '1px solid #EAE5DC',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-10)',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-10)',
            paddingBottom: 'var(--space-12)',
            borderBottom: '1px solid #EAE5DC'
          }}
        >
          {/* Brand Column */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                letterSpacing: '0.12em',
                fontWeight: 400,
                color: '#1A1816',
                display: 'block',
                marginBottom: 'var(--space-3)'
              }}
            >
              {config.brand.brandName}
            </span>
            <p
              style={{
                color: '#6E6860',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                maxWidth: '300px',
                marginBottom: 'var(--space-4)'
              }}
            >
              {config.brand.description}
            </p>
            <div className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '4px 12px' }}>
              {config.brand.badge}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-gold)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                marginBottom: 'var(--space-4)'
              }}
            >
              Residences &amp; Portfolio
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <li>
                <Link
                  href="/residences"
                  style={{
                    color: '#3D3934',
                    fontSize: '0.88rem',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-gold)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#3D3934')}
                >
                  Master Residences
                </Link>
              </li>
              {config.features.enableCollections && (
                <li>
                  <Link
                    href="/collections"
                    style={{
                      color: '#3D3934',
                      fontSize: '0.88rem',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#3D3934')}
                  >
                    Curated Collections
                  </Link>
                </li>
              )}
              {config.features.enableCraftsmanshipStory && (
                <li>
                  <Link
                    href="/vision"
                    style={{
                      color: '#3D3934',
                      fontSize: '0.88rem',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#3D3934')}
                  >
                    Architectural Vision
                  </Link>
                </li>
              )}
              {config.features.enableInspirationRooms && (
                <li>
                  <Link
                    href="/lifestyle"
                    style={{
                      color: '#3D3934',
                      fontSize: '0.88rem',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#3D3934')}
                  >
                    Curated Lifestyle
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/contact"
                  style={{
                    color: '#3D3934',
                    fontSize: '0.88rem',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-gold)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#3D3934')}
                >
                  Private Client Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Concierge Column */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-gold)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                marginBottom: 'var(--space-4)'
              }}
            >
              Sales Gallery &amp; Enquiries
            </h4>
            <div style={{ color: '#6E6860', fontSize: '0.88rem', lineHeight: 1.7 }}>
              <p style={{ marginBottom: 'var(--space-2)' }}>
                {config.contact.showroomAddress}
              </p>
              <p style={{ marginBottom: 'var(--space-4)' }}>
                {config.contact.visitingHours}
              </p>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: '#1A1816',
                  fontSize: '0.82rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#1A1816')}
              >
                <span>Schedule Private Viewing</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            paddingTop: 'var(--space-8)',
            fontSize: '0.82rem',
            color: '#6E6860'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} {config.brand.brandName} {config.brand.tagline}. All architectural rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            <span
              style={{
                color: 'var(--color-accent-gold)',
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600
              }}
            >
              {config.brand.badge}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
