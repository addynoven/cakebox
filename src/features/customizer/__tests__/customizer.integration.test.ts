import { describe, expect, it } from 'bun:test';
import { BASE_SPONGES, FROSTING_OPTIONS, DRIP_OPTIONS, TOPPER_STYLES } from '../data/customizerOptions';

describe('Customizer Module Integration', () => {
  it('should have valid sponges with required visual colors and images', () => {
    expect(BASE_SPONGES.length).toBeGreaterThan(0);
    for (const sponge of BASE_SPONGES) {
      expect(sponge.id).toBeDefined();
      expect(sponge.name).toBeDefined();
      expect(sponge.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(sponge.image).toContain('http');
    }
  });

  it('should have valid frosting bowls and drip options', () => {
    expect(FROSTING_OPTIONS.length).toBeGreaterThan(0);
    expect(DRIP_OPTIONS.length).toBeGreaterThan(0);
    expect(TOPPER_STYLES.length).toBeGreaterThan(0);
  });
});
