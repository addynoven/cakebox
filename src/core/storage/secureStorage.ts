import * as SecureStore from 'expo-secure-store';
import { captureError } from '../errors';

const SECURE_KEYS = {
  AUTH_TOKEN: 'cakebox_secure_auth_token',
  REFRESH_TOKEN: 'cakebox_secure_refresh_token',
  PAYMENT_SESSION_KEY: 'cakebox_secure_payment_key',
} as const;

export class SecureStorage {
  /**
   * Save a sensitive string to iOS Keychain / Android Keystore
   */
  static async setItem(key: string, value: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      return true;
    } catch (error) {
      captureError(error, { source: 'SecureStorage', action: 'setItem', metadata: { key } });
      return false;
    }
  }

  /**
   * Retrieve a sensitive string from hardware-encrypted storage
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      captureError(error, { source: 'SecureStorage', action: 'getItem', metadata: { key } });
      return null;
    }
  }

  /**
   * Delete an item from hardware-encrypted storage
   */
  static async deleteItem(key: string): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      captureError(error, { source: 'SecureStorage', action: 'deleteItem', metadata: { key } });
      return false;
    }
  }

  // --- Specialized High-Security Domain Methods ---

  static async setAuthToken(token: string): Promise<boolean> {
    return this.setItem(SECURE_KEYS.AUTH_TOKEN, token);
  }

  static async getAuthToken(): Promise<string | null> {
    return this.getItem(SECURE_KEYS.AUTH_TOKEN);
  }

  static async clearAuthToken(): Promise<boolean> {
    return this.deleteItem(SECURE_KEYS.AUTH_TOKEN);
  }

  static async setRefreshToken(token: string): Promise<boolean> {
    return this.setItem(SECURE_KEYS.REFRESH_TOKEN, token);
  }

  static async getRefreshToken(): Promise<string | null> {
    return this.getItem(SECURE_KEYS.REFRESH_TOKEN);
  }

  static async clearAllCredentials(): Promise<void> {
    await Promise.all([
      this.deleteItem(SECURE_KEYS.AUTH_TOKEN),
      this.deleteItem(SECURE_KEYS.REFRESH_TOKEN),
      this.deleteItem(SECURE_KEYS.PAYMENT_SESSION_KEY),
    ]);
  }
}
