import { describe, expect, it } from 'bun:test';
import { BakeryLocationSchema } from '../models/bakeryLocation.model';
import { BakeryMapRepository } from '../repositories/bakeryMap.repository';

describe('Map & Bakery Locations Integration', () => {
  it('should validate all bakery locations against Zod schema', () => {
    const locations = BakeryMapRepository.getLocations();
    expect(locations.length).toBeGreaterThan(0);
    for (const loc of locations) {
      expect(BakeryLocationSchema.safeParse(loc).success).toBe(true);
    }
  });

  it('should find bakery location by id', () => {
    const loc = BakeryMapRepository.getLocationById('loc-1');
    expect(loc).toBeDefined();
    expect(loc?.name).toBe('CakeBox Downtown Atelier');
  });
});
