import { describe, expect, it } from 'bun:test';
import { mapCakeDoc } from '../../../core/api/firestoreMappers';
import { INITIAL_CAKES } from '../../../data/cakes';
import { CakeItemSchema } from '../models/cake.model';

describe('Catalog Module Integration', () => {
  it('should validate and parse all initial cakes against Zod schema', () => {
    expect(INITIAL_CAKES.length).toBeGreaterThan(0);
    for (const cake of INITIAL_CAKES) {
      const parsed = CakeItemSchema.safeParse(cake);
      expect(parsed.success).toBe(true);
    }
  });

  it('should map and sanitize a raw Firestore cake document with missing properties', () => {
    const rawDoc = {
      name: 'Custom Velvet',
      price: '55',
      sizes: [{ size: '8"', price: 55 }],
    };

    const cake = mapCakeDoc('cake_123', rawDoc);
    expect(cake.id).toBe('cake_123');
    expect(cake.name).toBe('Custom Velvet');
    expect(cake.price).toBe(55);
    expect(cake.category).toBe('birthdays');
    expect(cake.sizes.length).toBe(1);
    expect(cake.sizes[0].price).toBe(55);
  });
});
