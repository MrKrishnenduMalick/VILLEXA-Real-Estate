import React from 'react';
import { Link } from 'wouter';
import { useClientConfig } from '../../context/ClientConfigContext';

export const Footer: React.FC = () => {
  const config = useClientConfig();

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Master 4-Column Architectural Grid */}
        <div className="footer-grid">
          {/* Column 1: Atelier Manifesto & Wordmark */}
          <div className="footer-col-manifesto">
            <span className="footer-brand-title">
              {config.brand.brandName}
            </span>
            <p className="footer-brand-desc">
              Atelier for exceptional residential commissions, monolithic architectural retreats, and private portfolio acquisitions across Europe, North America, and the Middle East.
            </p>
            <div className="footer-brand-badge">
              {config.brand.badge || 'Architectural Master Template'}
            </div>
          </div>

          {/* Column 2: The Registry Links */}
          <div className="footer-col">
            <h5 className="footer-col-title">
              The Registry
            </h5>
            <ul className="footer-links">
              <li>
                <Link href="/residence/the-aurelia-estate" className="footer-link">
                  The Cliff Villa
                </Link>
              </li>
              <li>
                <Link href="/residence/the-ocean-crest" className="footer-link">
                  The Ocean Villa
                </Link>
              </li>
              <li>
                <Link href="/residence/the-elysian-gardens" className="footer-link">
                  The Garden Villa
                </Link>
              </li>
              <li>
                <Link href="/residence/the-celestia-penthouse" className="footer-link">
                  The Skyline Residence
                </Link>
              </li>
              <li>
                <Link href="/residence/the-solstice-residences" className="footer-link">
                  The Beachfront Compound
                </Link>
              </li>
              <li>
                <Link href="/residence/the-highland-manor" className="footer-link">
                  The Hillside Retreat
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Advisory & Monographs */}
          <div className="footer-col">
            <h5 className="footer-col-title">
              Advisory
            </h5>
            <ul className="footer-links">
              <li>
                <Link href="/vision" className="footer-link">
                  Architectural Vision
                </Link>
              </li>
              <li>
                <Link href="/lifestyle" className="footer-link">
                  Curated Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/residences" className="footer-link">
                  Master Residences
                </Link>
              </li>
              <li>
                <Link href="/collections" className="footer-link">
                  Curated Collections
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Private Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Jurisdictions & Advisory Desk */}
          <div className="footer-col">
            <h5 className="footer-col-title">
              Jurisdictions
            </h5>
            <div className="footer-desk-block">
              <strong className="footer-desk-heading">
                Mayfair Advisory Desk
              </strong>
              <p className="footer-desk-text">
                {config.contact.showroomAddress}
              </p>
            </div>
            <div className="footer-desk-block">
              <strong className="footer-desk-heading">
                Consultation Hours
              </strong>
              <p className="footer-desk-text">
                {config.contact.visitingHours}
              </p>
            </div>
            <div className="footer-jurisdictions-tag">
              Cap d&apos;Antibes &middot; Monaco &middot; Dubai &middot; St. Moritz
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} {config.brand.brandName} Private Residences Ltd. All rights reserved.
          </span>
          <span className="text-[10.5px] text-[#51483D] tracking-wide">
            Demonstration Portfolio: Fictional architectural commissions conceived for digital luxury presentation.
          </span>
          <span>
            Architectural Master Template v2.0 &middot; Revision 3
          </span>
        </div>
      </div>
    </footer>
  );
};
