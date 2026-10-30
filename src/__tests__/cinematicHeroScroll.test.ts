import { describe, it, expect } from 'vitest';
import { siteConfigService } from '../services/siteConfigService';

describe('Cinematic Hero Scroll Engine (Phase 2 Luxury Villa Sequence)', () => {
  it('loads site configuration with exactly 240 luxury villa walkthrough frames', async () => {
    const config = await siteConfigService.getSiteConfig();
    const frameSeq = config.hero.frameSequence;

    expect(frameSeq).toBeDefined();
    expect(frameSeq?.frameCount).toBe(240);
    expect(frameSeq?.width).toBe(1280);
    expect(frameSeq?.height).toBe(720);
    expect(frameSeq?.firstFrame).toBe('/real-estate-hero-frames/frame-00001.webp');
    expect(frameSeq?.finalFrame).toBe('/real-estate-hero-frames/frame-00240.webp');
    expect(frameSeq?.framePattern).toBe('/real-estate-hero-frames/frame-{index}.webp');
  });

  it('deterministically maps scroll progress (0.0 -> 1.0) to frame index (1 -> 240)', () => {
    const frameCount = 240;

    const calculateTargetFrame = (progress: number): number => {
      const clamped = Math.min(Math.max(progress, 0), 1);
      return Math.min(Math.max(Math.round(clamped * (frameCount - 1)) + 1, 1), frameCount);
    };

    // Scroll progress 0% should show frame 1
    expect(calculateTargetFrame(0.0)).toBe(1);

    // Negative progress (overscroll top) clamps to frame 1
    expect(calculateTargetFrame(-0.15)).toBe(1);

    // Scroll progress 50% should map to frame 120 or 121
    expect(calculateTargetFrame(0.5)).toBe(121);

    // Scroll progress 100% should map to final frame 240
    expect(calculateTargetFrame(1.0)).toBe(240);

    // Overscroll bottom clamps to final frame 240
    expect(calculateTargetFrame(1.25)).toBe(240);
  });

  it('guarantees bidirectional reversibility and stationary freeze', () => {
    const frameCount = 240;
    const calculateTargetFrame = (progress: number): number => {
      const clamped = Math.min(Math.max(progress, 0), 1);
      return Math.min(Math.max(Math.round(clamped * (frameCount - 1)) + 1, 1), frameCount);
    };

    // Forward scroll progression: 0.25 -> 0.30
    const frameFwd = calculateTargetFrame(0.30);

    // Reverse scroll progression: 0.30 -> 0.25
    const frameRev = calculateTargetFrame(0.25);
    expect(frameRev).toBeLessThan(frameFwd);

    // Stationary scroll: progress stays 0.30
    const frameStationary = calculateTargetFrame(0.30);
    expect(frameStationary).toBe(frameFwd);
  });

  it('protects bookend frames from LRU distance-based eviction', () => {
    const cache = new Map<number, boolean>();
    const MAX_CACHE_SIZE = 96;
    const frameCount = 240;
    const activeTarget = 150;

    // Populate dummy cache
    for (let i = 1; i <= MAX_CACHE_SIZE + 1; i++) {
      cache.set(i, true);
    }

    // Eviction simulation matching CinematicShowroomBackground.tsx logic
    if (cache.size > MAX_CACHE_SIZE) {
      let furthestKey = -1;
      let maxDist = -1;
      for (const key of cache.keys()) {
        if (key === 1 || key === frameCount) continue; // Protect bookends
        const dist = Math.abs(key - activeTarget);
        if (dist > maxDist) {
          maxDist = dist;
          furthestKey = key;
        }
      }
      if (furthestKey !== -1) {
        cache.delete(furthestKey);
      }
    }

    // Bookend frame 1 must remain intact in cache
    expect(cache.has(1)).toBe(true);
    // The frame furthest from 150 (which is frame 2) should have been evicted
    expect(cache.has(2)).toBe(false);
  });

  it('generates strictly 5-digit zero-padded frame URLs', () => {
    const frameSeq = {
      frameCount: 240,
      framePattern: '/real-estate-hero-frames/frame-{index}.webp'
    };

    const getFrameUrl = (index: number): string => {
      const clamped = Math.min(Math.max(Math.round(index), 1), frameSeq.frameCount);
      const padded = String(clamped).padStart(5, '0');
      return frameSeq.framePattern.replace('{index}', padded);
    };

    expect(getFrameUrl(1)).toBe('/real-estate-hero-frames/frame-00001.webp');
    expect(getFrameUrl(42)).toBe('/real-estate-hero-frames/frame-00042.webp');
    expect(getFrameUrl(240)).toBe('/real-estate-hero-frames/frame-00240.webp');
    expect(getFrameUrl(999)).toBe('/real-estate-hero-frames/frame-00240.webp'); // Clamped
  });
});

