import { SiteConfiguration } from '../types/content';
import { getClientConfig } from '../config/clientConfig';

const activeClient = getClientConfig();

const defaultSiteConfig: SiteConfiguration = {
  hero: {
    kicker: 'BILEKSA PRIVATE RESIDENCES',
    title: 'Where Architecture Becomes Home',
    subtitle: 'Discover exceptional residences shaped by space, light and timeless design.',
    primaryCtaLabel: 'Explore Residences',
    primaryCtaLink: '/residences',
    secondaryCtaLabel: 'Discover Our Vision',
    secondaryCtaLink: '/vision',
    mediaType: 'frames',
    mediaUrl: '/real-estate-hero-frames/frame-00001.webp',
    posterUrl: '/real-estate-hero-frames/frame-00001.webp',
    frameSequence: {
      version: '2.0.0',
      frameCount: 240,
      width: 1280,
      height: 720,
      framePattern: '/real-estate-hero-frames/frame-{index}.webp',
      firstFrame: '/real-estate-hero-frames/frame-00001.webp',
      finalFrame: '/real-estate-hero-frames/frame-00240.webp',
      manifestUrl: '/real-estate-hero-frames/manifest.json',
      totalSizeBytes: 11145560,
      isPublished: true,
      publishedAt: '2026-10-31T00:00:00.000Z'
    }
  },
  showroomMedia: {
    enabled: false,
    sectionTitle: 'The Residential Atmosphere',
    sectionSubtitle: 'An intimate glimpse into our architectural living and spatial compositions.',
    videoUrl: null,
    posterUrl: null,
    autoPlay: false,
    loop: false
  },
  brand: {
    brandName: activeClient.brand.brandName,
    tagline: activeClient.brand.tagline,
    contactEmail: activeClient.contact.contactEmail,
    contactPhone: activeClient.contact.contactPhone,
    whatsappNumber: activeClient.contact.whatsappNumber,
    showroomAddress: activeClient.contact.showroomAddress,
    visitingHours: activeClient.contact.visitingHours,
    socialInstagram: activeClient.social.instagramUrl || '',
    socialPinterest: activeClient.social.pinterestUrl || ''
  }
};

export const siteConfigService = {
  getLocalFallback(): SiteConfiguration {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedHero = window.localStorage.getItem('bileksa_site_config_hero') || window.localStorage.getItem('villexa_site_config_hero');
        const storedShowroom = window.localStorage.getItem('bileksa_site_config_showroom_media') || window.localStorage.getItem('villexa_site_config_showroom_media');
        const storedBrand = window.localStorage.getItem('bileksa_site_config_brand') || window.localStorage.getItem('villexa_site_config_brand');
        const parsedHero = storedHero ? JSON.parse(storedHero) : defaultSiteConfig.hero;
        return {
          hero: {
            ...defaultSiteConfig.hero,
            ...parsedHero,
            frameSequence: parsedHero?.frameSequence || defaultSiteConfig.hero.frameSequence
          },
          showroomMedia: storedShowroom ? JSON.parse(storedShowroom) : defaultSiteConfig.showroomMedia,
          brand: storedBrand ? JSON.parse(storedBrand) : defaultSiteConfig.brand
        };
      }
    } catch {
      // Fallback safely to defaultSiteConfig
    }
    return defaultSiteConfig;
  },

  async getSiteConfig(): Promise<SiteConfiguration> {
    // Pure static frontend mode: instant reliable local resolution
    return this.getLocalFallback();
  }
};
