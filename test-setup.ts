import { mock } from 'bun:test';

mock.module('react-native', () => ({
  Platform: { OS: 'ios', select: (obj: any) => obj.ios || obj.default },
  StyleSheet: { create: (styles: any) => styles },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  ActivityIndicator: 'ActivityIndicator',
  TextInput: 'TextInput',
}));

mock.module('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
    clear: async () => {},
  },
}));

mock.module('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: () => {},
    hasPlayServices: async () => true,
    signIn: async () => ({ data: { idToken: 'mock_token' } }),
    signOut: async () => {},
  },
}));

mock.module('@react-native-community/netinfo', () => ({
  default: {
    addEventListener: () => () => {},
    fetch: async () => ({ isConnected: true, isInternetReachable: true }),
  },
  useNetInfo: () => ({ isConnected: true, isInternetReachable: true }),
}));

mock.module('react-native-mmkv', () => ({
  createMMKV: () => ({
    getString: () => undefined,
    set: () => {},
    getNumber: () => undefined,
    getBoolean: () => undefined,
    remove: () => {},
    clearAll: () => {},
    getAllKeys: () => [],
  }),
}));

const mockSecureStore: Record<string, string> = {};

mock.module('expo-secure-store', () => ({
  getItemAsync: async (key: string) => mockSecureStore[key] ?? null,
  setItemAsync: async (key: string, value: string) => {
    mockSecureStore[key] = value;
  },
  deleteItemAsync: async (key: string) => {
    delete mockSecureStore[key];
  },
  isAvailableAsync: async () => true,
}));

mock.module('expo-local-authentication', () => ({
  hasHardwareAsync: async () => true,
  isEnrolledAsync: async () => true,
  supportedAuthenticationTypesAsync: async () => [1, 2],
  authenticateAsync: async () => ({ success: true }),
  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
    IRIS: 3,
  },
}));

mock.module('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

mock.module('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => children,
  useFrame: () => {},
  useThree: () => ({}),
}));

mock.module('expo-gl', () => ({
  GLView: 'GLView',
}));

