import { describe, expect, it } from 'bun:test';
import { mapUserProfileDoc } from '../../../core/api/firestoreMappers';
import { SecureStorage, BiometricAuth } from '../../../core/storage';
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

  it('should securely store, retrieve and clear sensitive auth tokens', async () => {
    const testToken = 'secure_jwt_token_cakebox_xyz';
    const saved = await SecureStorage.setAuthToken(testToken);
    expect(saved).toBe(true);

    const retrieved = await SecureStorage.getAuthToken();
    expect(retrieved).toBe(testToken);

    await SecureStorage.clearAuthToken();
    const afterClear = await SecureStorage.getAuthToken();
    expect(afterClear).toBeNull();
  });

  it('should verify biometric support and authentication readiness', async () => {
    const support = await BiometricAuth.checkSupport();
    expect(support.hasHardware).toBe(true);
    expect(support.isEnrolled).toBe(true);
    expect(support.biometricTypes.length).toBeGreaterThan(0);

    const authSuccess = await BiometricAuth.authenticate('Unlock CakeBox');
    expect(authSuccess).toBe(true);
  });
});
