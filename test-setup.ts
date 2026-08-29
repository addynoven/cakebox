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
