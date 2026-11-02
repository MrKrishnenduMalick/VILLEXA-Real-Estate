import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, Search, ArrowRight } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';

export const CrownIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg
    width={size}
    height={Math.round(size * 0.72)}
    viewBox="0 0 24 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block' }}
  >
    <defs>
      <linearGradient id="headerCrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF5DE" />
        <stop offset="40%" stopColor="#D8BD8A" />
        <stop offset="70%" stopColor="#C99A32" />
        <stop offset="100%" stopColor="#A9781F" />
      </linearGradient>
    </defs>
    <path
      d="M2.5 13.5L4.5 4.5L9 8.5L12 2.5L15 8.5L19.5 4.5L21.5 13.5H2.5Z"
      stroke="url(#headerCrownGold)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="url(#headerCrownGold)"
      fillOpacity="0.35"
    />
    <circle cx="12" cy="2.5" r="1" fill="#F5E8C7" />
    <circle cx="4.5" cy="4.5" r="0.9" fill="#F5E8C7" />
    <circle cx="19.5" cy="4.5" r="0.9" fill="#F5E8C7" />
    <line x1="2" y1="15" x2="22" y2="15" stroke="url(#headerCrownGold)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Header: React.FC = () => {
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
    { href: '/residences', label: 'Residences', show: true },
    { href: '/collections', label: 'Collections', show: true },
    { href: '/craftsmanship', label: 'Craftsmanship', show: true },
    { href: '/experience', label: 'Experience', show: true },
    { href: '/contact', label: 'Contact', show: true }
  ].filter((l) => l.show);

  const brandDisplayName = 'VILLEXA';
  const isOverHero = isHomePage && !isScrolled;

  return (
    <>
      <header
        id="site-header"
        className={`site-header-nav ${isScrolled ? 'is-scrolled' : ''} ${!isHomePage ? 'is-static-page' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: isScrolled ? '70px' : '82px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          background: isOverHero
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.06) 65%, transparent 100%)'
            : isScrolled
            ? 'rgba(250, 248, 244, 0.88)'
            : 'linear-gradient(180deg, rgba(250, 248, 244, 0.92) 0%, rgba(250, 248, 244, 0.70) 75%, transparent 100%)',
          backdropFilter: isOverHero ? 'blur(14px) saturate(140%)' : 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: isOverHero ? 'blur(14px) saturate(140%)' : 'blur(20px) saturate(140%)',
          borderBottom: isOverHero
            ? '1px solid rgba(255, 255, 255, 0.30)'
            : isScrolled
            ? '1px solid rgba(216, 189, 138, 0.45)'
            : '1px solid rgba(216, 189, 138, 0.25)',
          boxShadow: isScrolled
            ? '0 10px 30px rgba(41, 39, 34, 0.06)'
            : isOverHero
            ? '0 4px 20px rgba(0, 0, 0, 0.12)'
            : 'none'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          {/* Brand Logo with Crown */}
          <Link
            href="/"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textDecoration: 'none',
              gap: '2px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CrownIcon size={19} />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '22px',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  lineHeight: 1,
                  color: isOverHero ? '#FFFFFF' : '#24211D',
                  transition: 'color 0.3s ease'
                }}
              >
                {brandDisplayName}
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '8px',
                letterSpacing: '0.34em',
                textTransform: 'uppercase',
                color: isOverHero ? '#D8BD8A' : '#74644D',
                fontWeight: 600,
                paddingLeft: '27px',
                transition: 'color 0.3s ease'
              }}
            >
              PRIVATE RESIDENCES
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="desktop-nav-links">
            <ul
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                listStyle: 'none',
                margin: 0,
                padding: 0
              }}
            >
              {navLinks.map((link) => {
                const isActive = location === link.href;
                const linkDefaultColor = isOverHero ? 'rgba(255, 255, 255, 0.90)' : '#24211D';
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        letterSpacing: '0.06em',
                        color: isActive ? '#A87516' : linkDefaultColor,
                        textDecoration: 'none',
                        padding: '6px 0',
                        transition: 'color 0.25s ease'
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#A87516')}
                      onMouseLeave={(e) => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.color = linkDefaultColor;
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
                            borderRadius: '1px',
                            background: 'linear-gradient(90deg, #D8BD8A, #A87516)'
                          }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Header Action Controls (Search + Private Viewing CTA + Mobile Trigger) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Search Icon Trigger */}
            <Link
              href="/residences"
              aria-label="Search residences"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: isOverHero ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 250, 240, 0.35)',
                border: isOverHero ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.65)',
                color: isOverHero ? '#FFFFFF' : '#24211D',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.25s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = isOverHero ? 'rgba(255, 255, 255, 0.25)' : '#FFFFFF';
                (e.currentTarget as HTMLElement).style.color = '#C99A32';
                (e.currentTarget as HTMLElement).style.borderColor = '#C99A32';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = isOverHero ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.65)';
                (e.currentTarget as HTMLElement).style.color = isOverHero ? '#FFFFFF' : '#292722';
                (e.currentTarget as HTMLElement).style.borderColor = isOverHero ? 'rgba(255, 255, 255, 0.35)' : 'rgba(216, 189, 138, 0.35)';
              }}
            >
              <Search size={16} strokeWidth={2} />
            </Link>

            {/* Gold Gradient Pill Button: Private Viewing -> */}
            <Link
              href="/contact"
              className="header-cta-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 25%, #C99A32 60%, #A9781F 100%)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                boxShadow: '0 4px 16px rgba(201, 154, 50, 0.30), inset 0 1px 1px rgba(255, 255, 255, 0.85)',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(201, 154, 50, 0.45)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(201, 154, 50, 0.30)';
              }}
            >
              <span>Private Viewing</span>
              <ArrowRight size={13} strokeWidth={2.2} />
            </Link>

            {/* Hamburger Trigger for Mobile / Tablet */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open Mobile Navigation"
              className="mobile-nav-trigger-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: isOverHero ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.70)',
                border: isOverHero ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(216, 189, 138, 0.40)',
                color: isOverHero ? '#FFFFFF' : '#292722',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <Menu size={18} strokeWidth={2} />
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
