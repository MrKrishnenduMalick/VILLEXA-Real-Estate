import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { X, ArrowRight } from 'lucide-react';
import { useClientConfig } from '../../context/ClientConfigContext';
import { CrownIcon } from './Header';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ href: string; label: string; desc?: string }>;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  links
}) => {
  const config = useClientConfig();
  const [location] = useLocation();

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const brandDisplayName = config?.brand?.brandName || 'VILLEXA';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(41, 39, 34, 0.45)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '360px',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(249, 247, 243, 0.97) 0%, rgba(241, 235, 225, 0.98) 100%)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderLeft: '1px solid rgba(216, 189, 138, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 24px',
          boxShadow: '-16px 0 44px rgba(41, 39, 34, 0.12)',
          color: '#292722',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(216, 189, 138, 0.35)',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CrownIcon size={18} />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                color: '#292722'
              }}
            >
              {brandDisplayName}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(216, 189, 138, 0.35)',
              color: '#292722',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Links Navigation */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {links.map((link) => {
              const isActive = location === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: isActive ? 'linear-gradient(135deg, rgba(245, 232, 199, 0.6) 0%, rgba(216, 189, 138, 0.25) 100%)' : 'transparent',
                      border: isActive ? '1px solid rgba(201, 154, 50, 0.45)' : '1px solid transparent',
                      color: isActive ? '#C99A32' : '#292722',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: '0.04em',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={14} color={isActive ? '#C99A32' : '#8A7A5D'} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Drawer Footer CTA */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(216, 189, 138, 0.35)', marginTop: '24px' }}>
          <Link
            href="/contact"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '13px 24px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 25%, #C99A32 60%, #A9781F 100%)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 6px 20px rgba(201, 154, 50, 0.35)',
              textDecoration: 'none'
            }}
          >
            <span>Request Private Viewing</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
