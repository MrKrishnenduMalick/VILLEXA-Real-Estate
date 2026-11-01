import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useClientConfig } from '../../context/ClientConfigContext';
import { getAssetSlotUrl } from '../../config/assetSlots';

export const BrandIntroduction: React.FC = () => {
  const config = useClientConfig();

  return (
    <div id="introduction" className="transition-wrapper">
      <div className="container">
        {/* Floating Translucent Ivory Editorial Surface */}
        <div className="editorial-glass-slab">
          <div className="curatorial-grid">
            {/* Left Column: Curatorial Statement & Numerical Metrics */}
            <div className="curatorial-text">
              <span className="eyebrow mb-3">
                <Sparkles size={12} className="text-[#B89552]" />
                <span>{config.brand.tagline || 'CURATORIAL STATEMENT & PHILOSOPHY'}</span>
              </span>

              <h2 className="curatorial-heading">
                Where Sanctuary Transcends Structure
              </h2>

              <p className="curatorial-body">
                {config.brand.brandName} does not construct houses; we orchestrate permanent architectural sanctuaries. Each residence is an autonomous masterwork, sculpted to dialogue with light, wind, and geological strata.
              </p>

              <p className="curatorial-body">
                {config.brand.description ||
                  'Engineered with monolithic Roman travertine, patinated bronze, and triple-laminated frameless glazing, these estates offer supreme acoustic quiet, off-grid autonomy, and generational permanence.'}
              </p>

              {/* Numerical Metrics Strip */}
              <div className="curatorial-metrics">
                <div>
                  <div className="metric-value">06</div>
                  <span className="metric-label">Master Commissions Worldwide</span>
                </div>
                <div>
                  <div className="metric-value">Passive</div>
                  <span className="metric-label">Bioclimatic Engineering</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/vision"
                  className="btn btn-outline-dark"
                >
                  <span>Read Architectural Philosophy</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Column: Architectural Photography Plaque & Specifications */}
            <div className="curatorial-media">
              <div className="plaque-image-card">
                <div className="plaque-image-frame bg-[#EAE5DC]">
                  <img
                    src={getAssetSlotUrl('PROPERTY_ARCHITECTURAL_ENTRANCE')}
                    alt="The Aurelia Cantilever Architectural Study"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = '/real-estate-hero-frames/frame-00240.webp';
                    }}
                  />
                </div>
                <div className="plaque-caption">
                  <span className="plaque-title">The Aurelia Cantilever</span>
                  <span className="plaque-meta">Plate 01 · Structural Study</span>
                </div>
              </div>

              {/* Distinct Architectural Vision Specification Bar */}
              <div className="structural-badge-bar">
                <span className="structural-tag">
                  Monolithic Travertine
                </span>
                <div className="structural-badge-group">
                  <span className="structural-spec">Triple Glazing</span>
                  <span className="structural-dot" aria-hidden="true" />
                  <span className="structural-spec">Acoustic Isolation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
