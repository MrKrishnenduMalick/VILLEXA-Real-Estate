import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle, Building, Sparkles, Shield, ChevronDown } from 'lucide-react';
import { useClientConfig } from '../context/ClientConfigContext';
import { SAMPLE_PROPERTIES } from '../config/sampleProperties';

export const ContactPage: React.FC = () => {
  const config = useClientConfig();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    residence: 'The Aurelia Estate',
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
    `Hello ${config.brand.brandName} Concierge,\n\nI would like to schedule a private architectural consultation.\nClient: ${formData.fullName || 'Private Client'}\nResidence: ${formData.residence}\nTimeline: ${formData.timeline}`
  );

  return (
    <div className="w-full bg-[#12100E]/70 backdrop-blur-2xl text-white min-h-screen pt-32 pb-24 sm:pt-36 sm:pb-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.25em] bg-white/10 text-[#DFCFA8] border border-white/15 backdrop-blur-md">
            <Sparkles size={12} className="text-[#C5A059]" />
            <span>PRIVATE ACQUISITION ADVISORY</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-tight">
            Confidential Consultation
          </h1>
          <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed">
            Our Private Advisory Desk orchestrates discreet viewings, bespoke site inspections, and private monograph deliveries for qualified collectors and family offices globally.
          </p>
        </div>

        {/* 2-Column Luxury Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Atelier Desk Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/20 shadow-2xl space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-light text-white mb-2">
                  The Private Desk
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  Direct engagement channels monitored continuously by Senior Acquisition Partners.
                </p>
              </div>

              <div className="space-y-6">
                {/* Channel 1: Headquarters Atelier */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 text-[#DFCFA8] border border-[#C5A059]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-[#DFCFA8] mb-1 font-medium">
                      Atelier Location
                    </span>
                    <p className="text-sm text-white/90 font-light leading-relaxed">
                      {config.contact.showroomAddress || 'Pavilion 04, Cliffside Ridge Sanctuary, North Coast'}
                    </p>
                  </div>
                </div>

                {/* Channel 2: Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 text-[#DFCFA8] border border-[#C5A059]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={17} />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-[#DFCFA8] mb-1 font-medium">
                      Confidential Dossier Dispatch
                    </span>
                    <a
                      href={`mailto:${config.contact.contactEmail}`}
                      className="text-sm text-white/90 hover:text-[#DFCFA8] font-light transition-colors"
                    >
                      {config.contact.contactEmail}
                    </a>
                  </div>
                </div>

                {/* Channel 3: Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 text-[#DFCFA8] border border-[#C5A059]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone size={17} />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-[#DFCFA8] mb-1 font-medium">
                      Private Advisory Line
                    </span>
                    <a
                      href={`tel:${config.contact.contactPhone.replace(/[^0-9+]/g, '')}`}
                      className="text-sm text-white/90 hover:text-[#DFCFA8] font-light transition-colors"
                    >
                      {config.contact.contactPhone}
                    </a>
                  </div>
                </div>

                {/* Channel 4: Operating Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 text-[#DFCFA8] border border-[#C5A059]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={17} />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-[#DFCFA8] mb-1 font-medium">
                      Operating Protocol
                    </span>
                    <p className="text-sm text-white/90 font-light">
                      Monday through Sunday · 08:00 – 21:00 IST
                    </p>
                    <p className="text-xs text-white/50 font-light mt-0.5">
                      Private weekend viewing flights by appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* Dedicated WhatsApp Concierge Fast-Track */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${config.contact.whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-[0.18em] font-medium transition-all duration-300 shadow-xl shadow-emerald-900/30 border border-emerald-400/30"
                >
                  <MessageSquare size={16} />
                  <span>Connect with WhatsApp Partner</span>
                </a>
              </div>
            </div>

            {/* Privacy Assurance Card */}
            <div className="flex items-start gap-3 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs text-white/60 leading-relaxed">
              <Shield size={18} className="text-[#DFCFA8] shrink-0 mt-0.5" />
              <span>
                All inquiries are treated under strict bilateral non-disclosure protocols. Client contact parameters are never shared with external brokerage networks.
              </span>
            </div>
          </div>

          {/* Right Column: Master Glass Consultation Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/20 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#C5A059]/20 text-[#DFCFA8] mx-auto flex items-center justify-center border border-[#C5A059]/40 shadow-xl shadow-[#C5A059]/20">
                  <CheckCircle2 size={38} className="text-[#C5A059]" />
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-white">
                  Consultation Registered
                </h3>
                <p className="text-sm sm:text-base text-white/80 max-w-md mx-auto font-light leading-relaxed">
                  Thank you, <strong className="text-white font-medium">{formData.fullName}</strong>. Your inquiry for <strong className="text-[#DFCFA8] font-medium">{formData.residence}</strong> has been assigned to the {config.brand.brandName} Private Office. A Senior Advisor will contact you directly via <strong className="text-white font-medium">{formData.email}</strong>.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        residence: 'The Aurelia Estate',
                        timeline: 'Immediate (Next 30 Days)',
                        message: ''
                      });
                    }}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 text-xs uppercase tracking-wider text-white transition-all border border-white/20 backdrop-blur-md"
                  >
                    <span>Register Another Inbound</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-white">
                    Private Viewing Registration
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#DFCFA8] font-medium">
                    Strict Confidentiality
                  </span>
                </div>

                {/* Residence of Interest Dropdown */}
                <div>
                  <label htmlFor="contact-residence" className="block text-[11px] uppercase tracking-[0.18em] text-[#DFCFA8] mb-2 font-medium">
                    Residence of Interest
                  </label>
                  <div className="relative">
                    <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    <select
                      id="contact-residence"
                      value={formData.residence}
                      onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                      className="w-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 focus:border-[#C5A059] rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white appearance-none focus:outline-none transition-all cursor-pointer backdrop-blur-md"
                    >
                      {SAMPLE_PROPERTIES.map((prop) => (
                        <option key={prop.id} value={prop.name} style={{ background: '#181614', color: '#ffffff' }}>
                          {prop.name} — {prop.location.city}
                        </option>
                      ))}
                      <option value="General Portfolio Consultation" style={{ background: '#181614', color: '#ffffff' }}>General Portfolio Consultation (Multiple Residences)</option>
                      <option value="Bespoke Architectural Commission" style={{ background: '#181614', color: '#ffffff' }}>Bespoke Land & Architectural Commission</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                  </div>
                </div>

                {/* Full Legal Name */}
                <div>
                  <label htmlFor="contact-fullname" className="block text-[11px] uppercase tracking-[0.18em] text-[#DFCFA8] mb-2 font-medium">
                    Full Legal Name *
                  </label>
                  <input
                    id="contact-fullname"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Lord Alistair Vance / Dr. Priya Sharma"
                    className={`w-full bg-white/[0.08] hover:bg-white/[0.12] border rounded-2xl px-5 py-3.5 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#C5A059] transition-all backdrop-blur-md ${
                      errors.fullName ? 'border-red-400/80 bg-red-950/20' : 'border-white/20'
                    }`}
                  />
                  {errors.fullName && (
                    <span className="flex items-center gap-1.5 text-xs text-red-300 mt-2 font-light">
                      <AlertCircle size={13} /> {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-email" className="block text-[11px] uppercase tracking-[0.18em] text-[#DFCFA8] mb-2 font-medium">
                      Private Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="client@privateoffice.com"
                      className={`w-full bg-white/[0.08] hover:bg-white/[0.12] border rounded-2xl px-5 py-3.5 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#C5A059] transition-all backdrop-blur-md ${
                        errors.email ? 'border-red-400/80 bg-red-950/20' : 'border-white/20'
                      }`}
                    />
                    {errors.email && (
                      <span className="flex items-center gap-1.5 text-xs text-red-300 mt-2 font-light">
                        <AlertCircle size={13} /> {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-[11px] uppercase tracking-[0.18em] text-[#DFCFA8] mb-2 font-medium">
                      Telephone / WhatsApp *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98000 00000"
                      className={`w-full bg-white/[0.08] hover:bg-white/[0.12] border rounded-2xl px-5 py-3.5 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#C5A059] transition-all backdrop-blur-md ${
                        errors.phone ? 'border-red-400/80 bg-red-950/20' : 'border-white/20'
                      }`}
                    />
                    {errors.phone && (
                      <span className="flex items-center gap-1.5 text-xs text-red-300 mt-2 font-light">
                        <AlertCircle size={13} /> {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline Dropdown */}
                <div>
                  <label htmlFor="contact-timeline" className="block text-[11px] uppercase tracking-[0.18em] text-[#DFCFA8] mb-2 font-medium">
                    Acquisition Horizon
                  </label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    <select
                      id="contact-timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 focus:border-[#C5A059] rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white appearance-none focus:outline-none transition-all cursor-pointer backdrop-blur-md"
                    >
                      <option value="Immediate (Next 30 Days)" style={{ background: '#181614', color: '#ffffff' }}>Immediate Horizon (Next 30 Days)</option>
                      <option value="Quarterly (Next 90 Days)" style={{ background: '#181614', color: '#ffffff' }}>Quarterly Review (Next 90 Days)</option>
                      <option value="Long-term Strategic Allocation (6-12 Months)" style={{ background: '#181614', color: '#ffffff' }}>Strategic Allocation (6–12 Months)</option>
                      <option value="Family Office Mandate / Discretionary" style={{ background: '#181614', color: '#ffffff' }}>Discretionary Mandate / Family Office</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                  </div>
                </div>

                {/* Advisory Message Textarea */}
                <div>
                  <label htmlFor="contact-message" className="block text-[11px] uppercase tracking-[0.18em] text-[#DFCFA8] mb-2 font-medium">
                    Bespoke Requirements / Advisory Notes
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide relevant parameters: privacy preferences, architectural typology, staff quarter requirements, or private helipad access."
                    className="w-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 rounded-2xl p-4 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#C5A059] transition-all resize-none backdrop-blur-md"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-full bg-[#C5A059] hover:bg-[#b08d47] text-white font-medium text-xs uppercase tracking-[0.22em] transition-all duration-300 shadow-2xl shadow-[#C5A059]/25 disabled:opacity-50 border border-[#DFCFA8]/30"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? 'Registering Consultation...' : 'Request Private Consultation'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
