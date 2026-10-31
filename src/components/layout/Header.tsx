import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useClientConfig } from '../../context/ClientConfigContext';

export const Header: React.FC = () => {
  const config = useClientConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [location] = useLocation();

  const isHomePage = location === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview', show: true },
    { href: '/residences', label: 'The Residences', show: true },
    { href: '/collections', label: 'Collections', show: config.features.enableCollections },
    { href: '/vision', label: 'Architectural Vision', show: config.features.enableCraftsmanshipStory },
    { href: '/lifestyle', label: 'Sanctuary & Living', show: config.features.enableInspirationRooms },
    { href: '/contact', label: 'Private Desk', show: true }
  ].filter((l) => l.show);

  // Dynamic header state classes
  const headerClasses = [
    'site-header-nav',
    isScrolled ? 'is-scrolled' : '',
    !isHomePage ? 'is-static-page' : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      <header id="site-header" className={headerClasses}>
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          {/* Brand Logo & Subtext */}
          <Link
            href="/"
            style={{
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none'
            }}
          >
            <span className="brand-wordmark-text">
              {config.brand.logoText || 'BILEKSA'}
            </span>
            <span className="brand-subtext-text">
              {config.brand.logoSubtext || 'Private Residences'}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation">
            <ul className="nav-links-list">
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`nav-link-item ${isActive ? 'active' : ''}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Header Action & Mobile Menu Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/contact"
              className="btn-header-advisory-control"
            >
              Private Viewing
            </Link>

            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="mobile-nav-trigger-btn"
              aria-label="Open Mobile Navigation"
            >
              <Menu size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        links={navLinks}
      />
    </>
  );
};
