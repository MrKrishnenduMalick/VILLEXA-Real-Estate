import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, Search, PhoneCall } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useClientConfig } from '../../context/ClientConfigContext';

export const Header: React.FC = () => {
  const config = useClientConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', show: true },
    { href: '/residences', label: 'Residences', show: true },
    { href: '/collections', label: 'Collections', show: config.features.enableCollections },
    { href: '/vision', label: 'Architectural Vision', show: config.features.enableCraftsmanshipStory },
    { href: '/lifestyle', label: 'Lifestyle', show: config.features.enableInspirationRooms },
    { href: '/contact', label: 'Contact', show: true }
  ].filter((l) => l.show);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          backgroundColor: isScrolled
            ? 'rgba(255, 255, 255, 0.94)'
            : 'rgba(250, 248, 245, 0.88)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          borderBottom: isScrolled
            ? '1px solid #EAE5DC'
            : '1px solid rgba(234, 229, 220, 0.8)',
          boxShadow: isScrolled
            ? '0 6px 24px 0 rgba(26, 24, 22, 0.05)'
            : 'none',
          transition: 'all var(--transition-normal)'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '80px'
          }}
        >
          {/* Brand Logo: Typographic Wordmark driven by clientConfig */}
          <Link
            href="/"
            style={{
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                letterSpacing: '0.12em',
                fontWeight: 400,
                color: 'var(--color-text-primary)',
                lineHeight: 1
              }}
            >
              {config.brand.logoText}
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-gold)',
                fontWeight: 600,
                marginTop: '4px'
              }}
            >
              {config.brand.logoSubtext}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'var(--space-8)'
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '0.82rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    fontWeight: isActive ? 500 : 400,
                    position: 'relative',
                    padding: 'var(--space-2) 0',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--color-accent-gold)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'var(--color-accent-gold)',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {/* Search Icon */}
            <Link
              href="/residences"
              aria-label="Explore Residences"
              title="Explore Residences"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-primary)',
                background: 'rgba(26, 24, 22, 0.04)',
                border: '1px solid var(--color-border-subtle)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-gold)';
                e.currentTarget.style.borderColor = 'var(--color-accent-gold)';
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-primary)';
                e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                e.currentTarget.style.background = 'rgba(26, 24, 22, 0.04)';
              }}
            >
              <Search size={16} />
            </Link>

            {/* Desktop Private Viewing CTA */}
            <Link
              href="/contact"
              className="desktop-cta"
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.4rem',
                fontSize: '0.74rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                borderRadius: '9999px',
                background: '#1A1816',
                color: '#FAF8F5',
                border: '1px solid #1A1816',
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-accent-gold)';
                e.currentTarget.style.borderColor = 'var(--color-accent-gold)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1A1816';
                e.currentTarget.style.borderColor = '#1A1816';
                e.currentTarget.style.color = '#FAF8F5';
              }}
            >
              <PhoneCall size={13} />
              <span>Private Viewing</span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open Navigation Menu"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(26, 24, 22, 0.04)',
                border: '1px solid var(--color-border-subtle)',
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
                transition: 'all 0.2s ease'
              }}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        <style>{`
          @media (min-width: 992px) {
            .desktop-nav {
              display: flex !important;
            }
            .desktop-cta {
              display: inline-flex !important;
            }
          }
        `}</style>
      </header>

      {/* Accessible Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        links={navLinks}
      />
    </>
  );
};
