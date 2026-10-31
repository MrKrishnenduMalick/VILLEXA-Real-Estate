import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight, MessageSquare, ShieldCheck } from 'lucide-react';
import { useClientConfig } from '../../context/ClientConfigContext';

export const PrivateViewingCTA: React.FC = () => {
  const config = useClientConfig();

  const whatsappMessage = encodeURIComponent(
    `Hello ${config.brand.brandName} Concierge,\n\nI would like to arrange a confidential private consultation regarding the BILEKSA Private Residences portfolio.`
  );

  return (
    <section id="concierge" className="section-concierge">
      <div className="container concierge-box">
        <span className="eyebrow justify-center mb-4 text-[#DFCFA8]">
          <ShieldCheck size={14} className="text-[#DFCFA8]" />
          <span>CONFIDENTIAL ACQUISITION PROTOCOL</span>
        </span>

        <h2 className="concierge-title">
          Arrange a Private Viewing
        </h2>

        <p className="concierge-body">
          Private commissions and confidential acquisitions are handled strictly under discreet non-disclosure protocol. Connect directly with our Senior Advisory Desks in Mayfair, London or Cap d&apos;Antibes, France.
        </p>

        <div className="concierge-actions">
          {/* Direct WhatsApp Concierge CTA */}
          <a
            href={`https://wa.me/${config.contact.whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-solid-white font-semibold text-[#1A1816]"
          >
            <MessageSquare size={14} className="text-[#25D366]" />
            <span>Direct WhatsApp Concierge</span>
            <ArrowUpRight size={14} className="text-[#1A1816]" />
          </a>

          {/* Acquisition Dossier CTA with Guaranteed White Text */}
          <Link
            href="/contact"
            className="btn bg-white/10 hover:bg-white/20 text-white border border-white/40 font-medium tracking-[0.16em] backdrop-blur-md"
            style={{ color: '#FFFFFF' }}
          >
            <span>Request Acquisition Dossier</span>
            <ArrowRight size={14} className="text-white" />
          </Link>
        </div>

        {/* 3 Distinct Evenly Spaced Reassurance Capsules */}
        <div className="concierge-reassurance-grid">
          <div className="reassurance-capsule">
            <span>Non-Disclosure Protocol</span>
          </div>
          <div className="reassurance-capsule">
            <span>Principals &amp; Family Offices</span>
          </div>
          <div className="reassurance-capsule">
            <span>Direct Concierge Advisory</span>
          </div>
        </div>
      </div>
    </section>
  );
};
