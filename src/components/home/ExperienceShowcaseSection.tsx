import React, { useState, useRef } from 'react';
import { Link } from 'wouter';
import { Play, Pause, Compass, Film, Sparkles, Calendar } from 'lucide-react';
import { getAssetSlotUrl } from '../../config/assetSlots';

export const ExperienceShowcaseSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const featureBadges = [
    {
      icon: Compass,
      title: 'Virtual Tour',
      subtitle: 'Step inside',
      href: '/residences'
    },
    {
      icon: Film,
      title: 'Immersive Video',
      subtitle: '1-2 min',
      href: '/experience'
    },
    {
      icon: Sparkles,
      title: 'Lifestyle',
      subtitle: 'The VILLEXA Life',
      href: '/experience'
    },
    {
      icon: Calendar,
      title: 'Private Viewing',
      subtitle: 'By Appointment',
      href: '/contact'
    }
  ];

  return (
    <section
      id="experience-showcase"
      style={{
        position: 'relative',
        padding: '70px 0 60px 0',
        zIndex: 10
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#24211D',
              lineHeight: 1.15,
              margin: '0 0 10px 0',
              letterSpacing: '-0.015em'
            }}
          >
            Experience
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.96rem',
              color: '#514B43',
              margin: 0,
              fontWeight: 400
            }}
          >
            A closer look at the VILLEXA way of living.
          </p>
        </div>

        {/* Cinematic Video Showcase Panel */}
        <div
          className="glass-champagne"
          style={{
            position: 'relative',
            borderRadius: '26px',
            overflow: 'hidden',
            maxHeight: '440px',
            aspectRatio: '16/8.5',
            border: '1.5px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 20px 50px -10px rgba(41, 39, 34, 0.12)'
          }}
        >
          <video
            ref={videoRef}
            src="/hero.mp4"
            poster={getAssetSlotUrl('PROPERTY_DINING_TERRACE')}
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* Central Play/Pause Trigger */}
          <div
            onClick={togglePlay}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isPlaying ? 'transparent' : 'rgba(41, 39, 34, 0.25)',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5E8C7 0%, #D8BD8A 25%, #C99A32 60%, #A9781F 100%)',
                border: '2px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 8px 30px rgba(201, 154, 50, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                opacity: isPlaying ? 0 : 0.95,
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                transform: 'scale(1)'
              }}
              className="hover:scale-105"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} fill="#FFFFFF" style={{ marginLeft: '3px' }} />}
            </div>
          </div>
        </div>

        {/* 4 Feature Badges Strip Below Video */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '24px'
          }}
        >
          {featureBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <Link
                key={idx}
                href={badge.href}
                className="glass-crystal"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: 'rgba(255, 250, 240, 0.24)',
                  backdropFilter: 'blur(18px) saturate(145%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(145%)',
                  border: '1px solid rgba(255, 255, 255, 0.62)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72), 0 12px 35px rgba(70, 48, 20, 0.12)',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(168, 117, 22, 0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A87516',
                    flexShrink: 0
                  }}
                >
                  <Icon size={18} strokeWidth={2} />
                </div>
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#24211D'
                    }}
                  >
                    {badge.title}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11.5px',
                      color: '#514B43',
                      fontWeight: 400
                    }}
                  >
                    {badge.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
