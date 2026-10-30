import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Shield, Lock, AlertCircle, Building } from 'lucide-react';
import { useClientConfig } from '../context/ClientConfigContext';
import { SAMPLE_PROPERTIES } from '../config/sampleProperties';

export const ContactPage: React.FC = () => {
  const config = useClientConfig();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialResidenceSlug = searchParams?.get('residence') || searchParams?.get('product') || '';

  // Match initial property if query param provided
  const matchedInitialProp = SAMPLE_PROPERTIES.find(
    (p) => p.slug === initialResidenceSlug || p.name.toLowerCase() === initialResidenceSlug.toLowerCase()
  );

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    residence: matchedInitialProp ? matchedInitialProp.name : (initialResidenceSlug || 'The Aurelia Estate'),
    timeline: 'Immediate (Next 30 Days)',
    message: matchedInitialProp
      ? `I would like to arrange a confidential architectural viewing of ${matchedInitialProp.name}.`
      : 'I would like to schedule a private architectural consultation with the BILEKSA Advisory Board.'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full legal name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid private or executive email is required';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      errs.phone = 'Valid telephone with country code is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Frontend-only simulation of transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${config.brand.brandName} Concierge,\n\nI would like to schedule a private architectural consultation.\nClient: ${formData.fullName || 'Private Client'}\nResidence: ${formData.residence}\nTimeline: ${formData.timeline}`
  );

  return (
    <div className="w-full bg-[#12100E] text-white min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] uppercase tracking-[0.25em] bg-white/10 text-[#C5A059] border border-white/15 backdrop-blur-md">
            <Shield size={12} />
            <span>PRIVATE CLIENT ADVISORY</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-tight">
            Private Residences &amp; Viewing Arrangements
          </h1>
          <p className="text-base sm:text-lg text-white/75 font-light leading-relaxed">
            Our Senior Client Advisors collaborate directly with principals, family offices, and collectors to coordinate confidential private viewings, physical site inspections, and customized portfolio monographs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Advisory Desk & Static Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl bg-white/[0.04] border border-white/10 space-y-6">
              <h3 className="font-serif text-2xl font-light text-white border-b border-white/10 pb-4">
                {config.contact.flagshipLocationName || 'Private Advisory Office'}
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center shrink-0">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block mb-0.5">
                      Flagship Gallery
                    </span>
                    <span className="text-white/85 leading-relaxed block">
                      {config.contact.showroomAddress}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center shrink-0">
                    <Clock size={17} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block mb-0.5">
                      Visiting Protocol
                    </span>
                    <span className="text-white/85 leading-relaxed block">
                      {config.contact.visitingHours}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center shrink-0">
                    <Mail size={17} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block mb-0.5">
                      Advisory Email
                    </span>
                    <a
                      href={`mailto:${config.contact.contactEmail}`}
                      className="text-white/85 hover:text-[#C5A059] transition-colors"
                    >
                      {config.contact.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center shrink-0">
                    <Phone size={17} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block mb-0.5">
                      Direct Telephone
                    </span>
                    <a
                      href={`tel:${config.contact.contactPhone.replace(/[^0-9+]/g, '')}`}
                      className="text-white/85 hover:text-[#C5A059] transition-colors"
                    >
                      {config.contact.contactPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Concierge Channel */}
              <div className="pt-4 border-t border-white/10">
                <a
                  href={`https://wa.me/${config.contact.whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 shadow-lg shadow-[#25D366]/20"
                >
                  <MessageSquare size={16} />
                  <span>Connect on WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white/50">
              <Lock size={15} className="text-[#C5A059] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                All client communications are strictly confidential. We never disclose prospective owner inquiries or client identities to third parties.
              </p>
            </div>
          </div>

          {/* Right Column: Private Viewing Request Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-[#181614] border border-white/15 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 text-[#C5A059] mx-auto flex items-center justify-center border border-[#C5A059]/40">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-serif text-3xl font-light text-white">
                  Consultation Request Registered
                </h3>
                <p className="text-sm text-white/75 max-w-md mx-auto font-light leading-relaxed">
                  Thank you, <strong className="text-white">{formData.fullName}</strong>. Your enquiry for <strong className="text-[#C5A059]">{formData.residence}</strong> has been logged with the {config.brand.brandName} Private Advisory Board. Our Senior Advisor will reach out via <strong className="text-white">{formData.email}</strong> within four business hours.
                </p>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/50 max-w-sm mx-auto">
                  Demonstration mode: Enquiry logged locally. For live engagement, please use the WhatsApp Concierge channel.
                </div>
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
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs uppercase tracking-wider text-white transition-colors"
                  >
                    <span>Submit Another Request</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-serif text-2xl font-light text-white">
                    Private Viewing Consultation
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059]">
                    Confidential
                  </span>
                </div>

                {/* Residence of Interest Dropdown */}
                <div>
                  <label htmlFor="contact-residence" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                    Residence of Interest
                  </label>
                  <div className="relative">
                    <Building size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <select
                      id="contact-residence"
                      value={formData.residence}
                      onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                      className="w-full bg-[#201D1A] border border-white/15 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      {SAMPLE_PROPERTIES.map((prop) => (
                        <option key={prop.id} value={prop.name}>
                          {prop.name} ({prop.location.city})
                        </option>
                      ))}
                      <option value="General Portfolio Consultation">General Portfolio Consultation (Multiple Residences)</option>
                      <option value="Bespoke Architectural Commission">Bespoke Architectural Land Commission</option>
                    </select>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="contact-fullname" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                    Full Legal Name *
                  </label>
                  <input
                    id="contact-fullname"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Lord Alistair Vance / Dr. Priya Sharma"
                    className={`w-full bg-white/[0.06] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059] transition-colors ${
                      errors.fullName ? 'border-red-400' : 'border-white/15'
                    }`}
                  />
                  {errors.fullName && (
                    <span className="flex items-center gap-1 text-[11px] text-red-400 mt-1.5">
                      <AlertCircle size={12} /> {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-email" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                      Private Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="client@privateoffice.com"
                      className={`w-full bg-white/[0.06] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059] transition-colors ${
                        errors.email ? 'border-red-400' : 'border-white/15'
                      }`}
                    />
                    {errors.email && (
                      <span className="flex items-center gap-1 text-[11px] text-red-400 mt-1.5">
                        <AlertCircle size={12} /> {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                      Telephone / WhatsApp *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98000 00000"
                      className={`w-full bg-white/[0.06] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059] transition-colors ${
                        errors.phone ? 'border-red-400' : 'border-white/15'
                      }`}
                    />
                    {errors.phone && (
                      <span className="flex items-center gap-1 text-[11px] text-red-400 mt-1.5">
                        <AlertCircle size={12} /> {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Acquisition Horizon */}
                <div>
                  <label htmlFor="contact-timeline" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                    Prospective Acquisition Horizon
                  </label>
                  <select
                    id="contact-timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full bg-[#201D1A] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Immediate (Next 30 Days)">Immediate Acquisition (Next 30 Days)</option>
                    <option value="Quarter 1 (Within 90 Days)">Quarterly Allocation (Within 90 Days)</option>
                    <option value="Longer Range (6-12 Months)">Strategic Portfolio Allocation (6–12 Months)</option>
                    <option value="Advisory Inquiry Only">General Advisory &amp; Monograph Request</option>
                  </select>
                </div>

                {/* Confidential Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                    Confidential Requirements or Preferred Viewing Dates
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[#C5A059] hover:bg-[#b08d47] text-white font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-[#C5A059]/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Consultation...</span>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Request Confidential Consultation</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
