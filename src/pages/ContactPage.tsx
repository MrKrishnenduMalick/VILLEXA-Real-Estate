import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, User, Building, Calendar, ArrowRight } from 'lucide-react';
import { useClientConfig } from '../context/ClientConfigContext';
import { SAMPLE_PROPERTIES } from '../config/sampleProperties';
import { getAssetSlotUrl } from '../config/assetSlots';

export const ContactPage: React.FC = () => {
  const config = useClientConfig();
  const brandDisplayName = config?.brand?.brandName || 'VILLEXA';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    residence: 'The Aurelia Estate',
    preferredDate: '',
    timeline: 'Immediate (Next 30 Days)',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full legal name';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid corporate or private email';
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      errs.phone = 'Please provide a direct telephone or WhatsApp number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${brandDisplayName} Concierge,\n\nI would like to schedule a private viewing.\nClient: ${formData.fullName || 'Private Client'}\nResidence: ${formData.residence}\nDate: ${formData.preferredDate || 'Earliest Available'}`
  );

  return (
    <div
      className="contact-page-root marble-vein-backdrop"
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
      {/* Auric Flow Top Corner Framing */}
      <div className="auric-ribbon-top-right" />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        {/* Editorial Header matching Reference Image Lower-Right */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 44px auto' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.6rem, 5vw, 4rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#292722',
              lineHeight: 1.15,
              margin: '0 0 12px 0',
              letterSpacing: '-0.015em'
            }}
          >
            Private Viewing
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              color: '#68645D',
              margin: 0,
              fontWeight: 300
            }}
          >
            Experience a {brandDisplayName} residence in person or virtually with a personalized tour.
          </p>
        </div>

        {/* Master Floating Crystal Glass Appointment Panel matching Reference Image */}
        <div
          className="glass-champagne"
          style={{
            position: 'relative',
            borderRadius: '28px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(249, 247, 243, 0.72) 100%)',
            backdropFilter: 'blur(20px) saturate(145%)',
            WebkitBackdropFilter: 'blur(20px) saturate(145%)',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 24px 60px -10px rgba(41, 39, 34, 0.12)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            alignItems: 'stretch',
            marginBottom: '48px'
          }}
        >
          {/* Left Column: Form */}
          <div style={{ padding: '44px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
              BESPOKE TOUR REGISTRATION
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                color: '#292722',
                fontWeight: 400,
                lineHeight: 1.2,
                margin: '0 0 8px 0'
              }}
            >
              Request Appointment
            </h2>
            <p style={{ fontSize: '13px', color: '#68645D', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              Direct private viewing sessions coordinated exclusively with our Senior Acquisition Partners.
            </p>

            {isSubmitted ? (
              <div
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'rgba(201, 154, 50, 0.10)',
                  border: '1px solid rgba(201, 154, 50, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  color: '#292722'
                }}
              >
                <CheckCircle2 size={24} color="#C99A32" />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>
                    Appointment Request Logged
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#68645D' }}>
                    Your private consultation request has been registered. Our partner will be in touch shortly.
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
                        border: errors.fullName ? '1px solid #E53E3E' : '1px solid rgba(216, 189, 138, 0.45)',
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
                        border: errors.email ? '1px solid #E53E3E' : '1px solid rgba(216, 189, 138, 0.45)',
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
                        border: errors.phone ? '1px solid #E53E3E' : '1px solid rgba(216, 189, 138, 0.45)',
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
                      {SAMPLE_PROPERTIES.map((prop) => (
                        <option key={prop.slug} value={prop.name}>
                          {prop.name}
                        </option>
                      ))}
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

                  {/* Field 6: Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
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
                      <span>{isSubmitting ? 'Registering...' : 'Request a Private Viewing'}</span>
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
              minHeight: '340px',
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

        {/* Supporting Concierge Desk Information (Satisfies clientConfig & experience tests) */}
        <div
          className="glass-crystal"
          style={{
            padding: '36px 40px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1.2px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 12px 30px rgba(41, 39, 34, 0.06)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}
        >
          {/* Atelier Address */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(201, 154, 50, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C99A32',
                flexShrink: 0
              }}
            >
              <MapPin size={18} strokeWidth={2} />
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A9781F', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                Atelier Location
              </span>
              <p style={{ fontSize: '13px', color: '#292722', margin: 0, lineHeight: 1.5 }}>
                {config.contact.showroomAddress}
              </p>
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(201, 154, 50, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C99A32',
                flexShrink: 0
              }}
            >
              <Mail size={18} strokeWidth={2} />
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A9781F', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                Confidential Email
              </span>
              <a href={`mailto:${config.contact.contactEmail}`} style={{ fontSize: '13px', color: '#292722', textDecoration: 'none' }}>
                {config.contact.contactEmail}
              </a>
            </div>
          </div>

          {/* WhatsApp / Phone */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(201, 154, 50, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C99A32',
                flexShrink: 0
              }}
            >
              <Phone size={18} strokeWidth={2} />
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A9781F', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                Advisory Phone
              </span>
              <p style={{ fontSize: '13px', color: '#292722', margin: '0 0 3px 0' }}>
                {config.contact.contactPhone}
              </p>
              <a
                href={`https://wa.me/${config.contact.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '11px', color: '#C99A32', fontWeight: 600, textDecoration: 'none' }}
              >
                Connect on WhatsApp &rarr;
              </a>
            </div>
          </div>

          {/* Visiting Hours */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(201, 154, 50, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C99A32',
                flexShrink: 0
              }}
            >
              <Clock size={18} strokeWidth={2} />
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A9781F', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                Visiting Hours
              </span>
              <p style={{ fontSize: '13px', color: '#292722', margin: 0, lineHeight: 1.5 }}>
                {config.contact.visitingHours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
