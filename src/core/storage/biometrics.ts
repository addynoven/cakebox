import * as LocalAuthentication from 'expo-local-authentication';
import { captureError } from '../errors';

export interface BiometricStatus {
  hasHardware: boolean;
  isEnrolled: boolean;
  biometricTypes: string[];
}

export class BiometricAuth {
  /**
   * Check if device supports Fingerprint / FaceID and has user enrolled
   */
  static async checkSupport(): Promise<BiometricStatus> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      const typeNames: string[] = [];
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        typeNames.push('FaceID');
      }
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        typeNames.push('Fingerprint');
      }
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        typeNames.push('Iris');
      }

      return {
        hasHardware,
        isEnrolled,
        biometricTypes: typeNames,
      };
    } catch (error) {
      captureError(error, { source: 'BiometricAuth', action: 'checkSupport' });
      return { hasHardware: false, isEnrolled: false, biometricTypes: [] };
    }
  }

  /**
   * Prompt user with native FaceID / Fingerprint biometric sensor
   */
  static async authenticate(promptMessage = 'Unlock CakeBox with Biometrics'): Promise<boolean> {
    try {
      const { hasHardware, isEnrolled } = await this.checkSupport();
      if (!hasHardware || !isEnrolled) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      captureError(error, { source: 'BiometricAuth', action: 'authenticate' });
      return false;
    }
  }
}
