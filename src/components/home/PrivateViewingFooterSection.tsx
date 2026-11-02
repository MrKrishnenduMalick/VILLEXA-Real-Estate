import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, CheckCircle2, Calendar, Phone, Mail, User, Building } from 'lucide-react';
import { CrownIcon } from '../layout/Header';
import { useClientConfig } from '../../context/ClientConfigContext';
import { getAssetSlotUrl } from '../../config/assetSlots';

export const PrivateViewingFooterSection: React.FC = () => {
  const config = useClientConfig();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    residence: 'The Aurelia Estate',
    preferredDate: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const brandDisplayName = config?.brand?.brandName || 'VILLEXA';

  return (
    <section
      id="private-viewing-section"
      style={{
        position: 'relative',
        padding: '70px 0 0 0',
        zIndex: 10
      }}
    >
      <div className="container">
        {/* Private Viewing Floating Glass Showcase Card */}
        <div
          className="glass-form-panel"
          style={{
            position: 'relative',
            borderRadius: '28px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.62)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72), 0 12px 35px rgba(70, 48, 20, 0.12)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'stretch',
            background: 'rgba(255, 250, 240, 0.26)',
            backdropFilter: 'blur(18px) saturate(145%)',
            WebkitBackdropFilter: 'blur(18px) saturate(145%)'
          }}
        >
          {/* Left Column: Form & Narrative */}
          <div style={{ padding: '44px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#A87516',
                fontWeight: 600,
                display: 'block',
                marginBottom: '8px'
              }}
            >
              PRIVATE APPOINTMENT
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 3.6vw, 2.8rem)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#24211D',
                lineHeight: 1.15,
                margin: '0 0 10px 0',
                letterSpacing: '-0.015em'
              }}
            >
              Private Viewing
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.94rem',
                color: '#514B43',
                margin: '0 0 28px 0',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Experience a {brandDisplayName} residence in person or virtually with a personalized tour.
            </p>

            {isSubmitted ? (
              <div
                style={{
                  padding: '32px',
                  borderRadius: '20px',
                  background: 'rgba(201, 154, 50, 0.12)',
                  border: '1px solid rgba(201, 154, 50, 0.40)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  color: '#292722'
                }}
              >
                <CheckCircle2 size={28} color="#C99A32" />
                <div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600 }}>
                    Viewing Request Received
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#68645D', lineHeight: 1.5 }}>
                    Our Senior Private Client Partner will contact you discreetly within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '14px',
                    alignItems: 'center'
                  }}
                >
                  {/* Field 1: Full Name */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '0 18px 0 44px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(216, 189, 138, 0.45)',
                        background: 'rgba(255, 255, 255, 0.75)',
                        fontSize: '13px',
                        color: '#292722',
                        outline: 'none',
                        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(41, 39, 34, 0.03)',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#C99A32';
                        e.target.style.boxShadow = '0 0 0 3px rgba(201, 154, 50, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(216, 189, 138, 0.45)';
                        e.target.style.boxShadow = 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(41, 39, 34, 0.03)';
                      }}
                    />
                    <User size={15} color="#8A7A5D" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>

                  {/* Field 2: Email Address */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '0 18px 0 44px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(216, 189, 138, 0.45)',
                        background: 'rgba(255, 255, 255, 0.75)',
                        fontSize: '13px',
                        color: '#292722',
                        outline: 'none',
                        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(41, 39, 34, 0.03)',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#C99A32';
                        e.target.style.boxShadow = '0 0 0 3px rgba(201, 154, 50, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(216, 189, 138, 0.45)';
                        e.target.style.boxShadow = 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(41, 39, 34, 0.03)';
                      }}
                    />
                    <Mail size={15} color="#8A7A5D" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>

                  {/* Field 3: Phone Number */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '0 18px 0 44px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(216, 189, 138, 0.45)',
                        background: 'rgba(255, 255, 255, 0.75)',
                        fontSize: '13px',
                        color: '#292722',
                        outline: 'none',
                        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(41, 39, 34, 0.03)',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#C99A32';
                        e.target.style.boxShadow = '0 0 0 3px rgba(201, 154, 50, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(216, 189, 138, 0.45)';
                        e.target.style.boxShadow = 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(41, 39, 34, 0.03)';
                      }}
                    />
                    <Phone size={15} color="#8A7A5D" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>

                  {/* Field 4: Select Residence */}
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formData.residence}
                      onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '0 18px 0 44px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(216, 189, 138, 0.45)',
                        background: 'rgba(255, 255, 255, 0.75)',
                        fontSize: '13px',
                        color: '#292722',
                        outline: 'none',
                        cursor: 'pointer',
                        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(41, 39, 34, 0.03)',
                        appearance: 'none',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#C99A32';
                        e.target.style.boxShadow = '0 0 0 3px rgba(201, 154, 50, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(216, 189, 138, 0.45)';
                        e.target.style.boxShadow = 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(41, 39, 34, 0.03)';
                      }}
                    >
                      <option value="The Aurelia Estate">The Aurelia Estate (Vagator Cliffs)</option>
                      <option value="The Celestia Penthouse">The Celestia Penthouse (Worli)</option>
                      <option value="The Ocean Crest">The Ocean Crest (Mandrem Beach)</option>
                      <option value="The Serene Villa">The Serene Villa (Alibaug)</option>
                      <option value="The Skyline Penthouse">The Skyline Penthouse (Bandra)</option>
                      <option value="The Laguna Estate">The Laguna Estate (Goa South)</option>
                    </select>
                    <Building size={15} color="#8A7A5D" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>

                  {/* Field 5: Preferred Date */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      style={{
                        width: '100%',
                        height: '48px',
                        padding: '0 18px 0 44px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(216, 189, 138, 0.45)',
                        background: 'rgba(255, 255, 255, 0.75)',
                        fontSize: '13px',
                        color: '#292722',
                        outline: 'none',
                        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(41, 39, 34, 0.03)',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#C99A32';
                        e.target.style.boxShadow = '0 0 0 3px rgba(201, 154, 50, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(216, 189, 138, 0.45)';
                        e.target.style.boxShadow = 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(41, 39, 34, 0.03)';
                      }}
                    />
                    <Calendar size={15} color="#8A7A5D" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>

                  {/* Field 6: Request a Private Viewing CTA */}
                  <div>
                    <button
                      type="submit"
                      className="btn-gold-primary"
                      style={{
                        width: '100%',
                        height: '48px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 25%, #C99A32 60%, #A9781F 100%)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.75)',
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '0.03em',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(201, 154, 50, 0.35)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                    >
                      <span>Request a Private Viewing</span>
                      <ArrowRight size={14} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Architectural Photography Preview */}
          <div
            style={{
              position: 'relative',
              minHeight: '320px',
              overflow: 'hidden'
            }}
          >
            <img
              src={getAssetSlotUrl('PROPERTY_EXTERIOR_POOL')}
              alt="Private Sanctuary"
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

        {/* Compact Luxury Global Footer */}
        <footer
          style={{
            marginTop: '60px',
            padding: '36px 0 44px 0',
            borderTop: '1px solid rgba(216, 189, 138, 0.30)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px'
            }}
          >
            {/* Brand Logo & Crown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CrownIcon size={20} />
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '18px',
                    fontWeight: 600,
                    letterSpacing: '0.22em',
                    color: '#24211D',
                    display: 'block',
                    lineHeight: 1
                  }}
                >
                  {brandDisplayName}
                </span>
                <span
                  style={{
                    fontSize: '8px',
                    letterSpacing: '0.30em',
                    textTransform: 'uppercase',
                    color: '#74644D',
                    display: 'block',
                    marginTop: '3px',
                    fontWeight: 500
                  }}
                >
                  PRIVATE RESIDENCES
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <Link href="/" style={{ fontSize: '12.5px', color: '#51483D', textDecoration: 'none', fontWeight: 500 }}>
                Overview
              </Link>
              <Link href="/residences" style={{ fontSize: '12.5px', color: '#51483D', textDecoration: 'none', fontWeight: 500 }}>
                Residences
              </Link>
              <Link href="/collections" style={{ fontSize: '12.5px', color: '#51483D', textDecoration: 'none', fontWeight: 500 }}>
                Collections
              </Link>
              <Link href="/craftsmanship" style={{ fontSize: '12.5px', color: '#51483D', textDecoration: 'none', fontWeight: 500 }}>
                Craftsmanship
              </Link>
              <Link href="/experience" style={{ fontSize: '12.5px', color: '#51483D', textDecoration: 'none', fontWeight: 500 }}>
                Experience
              </Link>
              <Link href="/contact" style={{ fontSize: '12.5px', color: '#51483D', textDecoration: 'none', fontWeight: 500 }}>
                Private Viewing
              </Link>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '11.5px',
              color: '#51483D',
              paddingTop: '16px',
              borderTop: '1px solid rgba(216, 189, 138, 0.28)'
            }}
          >
            <span>
              &copy; {new Date().getFullYear()} {brandDisplayName} Private Residences. All rights reserved.
            </span>
            <div style={{ display: 'flex', gap: '18px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Commission</span>
              <span>Discreet Advisory</span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

