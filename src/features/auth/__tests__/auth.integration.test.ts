import { describe, expect, it } from 'bun:test';
import { mapUserProfileDoc } from '../../../core/api/firestoreMappers';
import { UserProfileSchema } from '../models/user.model';

describe('Auth Module Integration', () => {
  it('should correctly map and sanitize raw user document with wishlist and addresses', () => {
    const rawUserDoc = {
      name: 'Alice Pastry',
      email: 'alice@example.com',
      savedAddresses: [
        { id: 'addr_1', label: 'Home', address: '42 Baker St', isDefault: true },
      ],
      wishlist: ['rainbow-layer-cake'],
    };

    const user = mapUserProfileDoc('usr_999', rawUserDoc);
    expect(user.id).toBe('usr_999');
    expect(user.name).toBe('Alice Pastry');
    expect(user.savedAddresses.length).toBe(1);
    expect(user.wishlist).toContain('rainbow-layer-cake');

    const parsed = UserProfileSchema.safeParse(user);
    expect(parsed.success).toBe(true);
  });
});
