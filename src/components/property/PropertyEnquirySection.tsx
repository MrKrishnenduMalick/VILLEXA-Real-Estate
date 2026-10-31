import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Shield, Lock, AlertCircle, Phone, Mail, User } from 'lucide-react';
import { Property } from '../../types/property';
import { useClientConfig } from '../../context/ClientConfigContext';

interface PropertyEnquirySectionProps {
  property: Property;
}

export const PropertyEnquirySection: React.FC<PropertyEnquirySectionProps> = ({ property }) => {
  const clientConfig = useClientConfig();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [timeline, setTimeline] = useState('Immediate (Next 30 Days)');
  const [message, setMessage] = useState(
    `I am interested in scheduling a private architectural consultation and viewing of ${property.name}.`
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full legal name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'A valid private or executive email is required';
    }
    if (!phone.trim() || phone.trim().length < 8) {
      errs.phone = 'Valid telephone with country code is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Frontend-only simulation of bespoke concierge transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${clientConfig.brand.brandName} Concierge,\n\nI would like to schedule a private architectural consultation for:\nResidence: ${property.name}\nReference: ${property.id}\nClient: ${fullName || 'Private Client'}\nPhone: ${phone || 'Not provided'}`
  );

  return (
    <section id="private-enquiry" className="py-20 sm:py-28 bg-[#12100E]/70 backdrop-blur-2xl text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Advisory Protocol & WhatsApp Concierge (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#C5A059] mb-3">
                <Shield size={13} />
                <span>CONFIDENTIAL CLIENT ADVISORY</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight">
                Arrange a Private In-Residence Consultation
              </h2>
              <p className="mt-4 text-base text-white/70 font-light leading-relaxed">
                Direct engagement with the {clientConfig.brand.brandName} Private Advisory Board. All inquiries are treated under strict client-confidentiality protocols.
              </p>
            </div>

            {/* Direct WhatsApp Concierge Channel */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.04] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.16em] text-[#C5A059] font-medium">
                  Instant Executive Concierge
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#25D366]">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  Active
                </span>
              </div>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Prefer immediate messaging? Connect directly with our Senior Client Advisor on WhatsApp.
              </p>
              <a
                href={`https://wa.me/${clientConfig.contact.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 shadow-lg shadow-[#25D366]/20"
              >
                <MessageSquare size={15} />
                <span>Open WhatsApp Concierge</span>
              </a>
            </div>

            {/* Privacy Guarantee */}
            <div className="flex items-start gap-3 text-xs text-white/50 pt-2">
              <Lock size={15} className="text-[#C5A059] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Your credentials are kept strictly private. We never share prospective owner records with third-party listing services or marketing agencies.
              </p>
            </div>
          </div>

          {/* Right Column: Reservation Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#181614] p-8 sm:p-12 rounded-3xl border border-white/15 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 text-[#C5A059] mx-auto flex items-center justify-center border border-[#C5A059]/40">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-light text-white mb-2">
                    Consultation Request Registered
                  </h3>
                  <p className="text-sm text-white/70 max-w-md mx-auto font-light leading-relaxed">
                    Thank you, <strong className="text-white">{fullName}</strong>. Your enquiry for <strong className="text-[#C5A059]">{property.name}</strong> has been assigned to our Senior Architectural Advisor. You will be contacted at <strong className="text-white">{email}</strong> within four business hours.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs uppercase tracking-wider text-white transition-colors"
                  >
                    <span>Submit Another Inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
                    Selected Residence
                  </span>
                  <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-serif text-lg">
                    {property.name} · Ref. {property.id}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="prop-fullname" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      id="prop-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Lord Alistair Vance / Dr. Priya Sharma"
                      className={`w-full bg-white/[0.06] border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059] transition-colors ${
                        errors.fullName ? 'border-red-400' : 'border-white/15'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <span className="flex items-center gap-1 text-[11px] text-red-400 mt-1.5">
                      <AlertCircle size={12} /> {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="prop-email" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                      Private Email *
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        id="prop-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@residence.com"
                        className={`w-full bg-white/[0.06] border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059] transition-colors ${
                          errors.email ? 'border-red-400' : 'border-white/15'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <span className="flex items-center gap-1 text-[11px] text-red-400 mt-1.5">
                        <AlertCircle size={12} /> {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="prop-phone" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                      Telephone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        id="prop-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98000 00000"
                        className={`w-full bg-white/[0.06] border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059] transition-colors ${
                          errors.phone ? 'border-red-400' : 'border-white/15'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <span className="flex items-center gap-1 text-[11px] text-red-400 mt-1.5">
                        <AlertCircle size={12} /> {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline Selection */}
                <div>
                  <label htmlFor="prop-timeline" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                    Prospective Acquisition Horizon
                  </label>
                  <select
                    id="prop-timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full bg-[#201D1A] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Immediate (Next 30 Days)">Immediate Acquisition (Next 30 Days)</option>
                    <option value="Quarter 1 (Within 90 Days)">Quarterly Allocation (Within 90 Days)</option>
                    <option value="Longer Range (6-12 Months)">Strategic Portfolio Allocation (6–12 Months)</option>
                    <option value="Advisory Inquiry Only">General Advisory & Monograph Request</option>
                  </select>
                </div>

                {/* Confidential Message */}
                <div>
                  <label htmlFor="prop-message" className="block text-xs uppercase tracking-[0.16em] text-white/70 mb-2">
                    Bespoke Notes or Viewing Availability
                  </label>
                  <textarea
                    id="prop-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                    <span>Transmitting Credentials...</span>
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
    </section>
  );
};

