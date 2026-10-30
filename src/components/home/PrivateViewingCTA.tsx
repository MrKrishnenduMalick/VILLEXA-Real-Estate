import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, MessageSquare, Shield } from 'lucide-react';
import { useClientConfig } from '../../context/ClientConfigContext';

export const PrivateViewingCTA: React.FC = () => {
  const config = useClientConfig();

  const whatsappMessage = encodeURIComponent(
    `Hello ${config.brand.brandName} Concierge,\n\nI would like to schedule a confidential consultation regarding the BILEKSA Private Residences portfolio.`
  );

  return (
    <section id="private-viewing-cta" className="py-28 sm:py-36 bg-[#FAF8F5] text-[#1A1816] overflow-hidden border-t border-[#EAE5DC] relative">
      {/* Background Subtle Warm Ambient Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#B89552]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10 space-y-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] uppercase tracking-[0.26em] bg-white text-[#B89552] border border-[#EAE5DC] shadow-sm font-semibold">
          <Shield size={13} />
          <span>CONFIDENTIAL ADVISORY</span>
        </span>

        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#1A1816] leading-[1.06] tracking-tight">
          Initiate Your Private Acquisition Journey.
        </h2>

        <p className="text-base sm:text-lg text-[#3D3934] font-light leading-relaxed max-w-2xl mx-auto">
          Our Senior Client Advisors collaborate directly with principals, family offices, and architectural collectors to coordinate confidential consultations, physical site inspections, and customized portfolio monographs.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-[#1A1816] hover:bg-[#B89552] text-[#FAF8F5] hover:text-white font-medium text-xs uppercase tracking-[0.18em] transition-all duration-300 shadow-xl shadow-[#1A1816]/10"
          >
            <span>Request Private Viewing</span>
            <ArrowRight size={14} />
          </Link>

          <a
            href={`https://wa.me/${config.contact.whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-[#F3EFEA] border border-[#DCD5C9] text-xs uppercase tracking-[0.18em] text-[#1A1816] font-medium transition-all duration-300 shadow-sm"
          >
            <MessageSquare size={14} className="text-[#25D366]" />
            <span>WhatsApp Concierge</span>
          </a>
        </div>
      </div>
    </section>
  );
};
