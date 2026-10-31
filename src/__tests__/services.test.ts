import { describe, it, expect } from 'vitest';
import { siteConfigService } from '../services/siteConfigService';

describe('BILEKSA Site Config Service Foundation', () => {
  it('returns fallback hero and disabled showroom video reliably offline', async () => {
    const config = await siteConfigService.getSiteConfig();
    expect(config.hero.mediaType).toBe('frames');
    expect(config.hero.mediaUrl).toBe('/real-estate-hero-frames/frame-00001.webp');
    expect(config.hero.frameSequence?.frameCount).toBe(240);
    expect(config.showroomMedia.enabled).toBe(false);
    expect(config.showroomMedia.videoUrl).toBeNull();
    expect(config.brand.brandName).toBe('BILEKSA');
  });
});
