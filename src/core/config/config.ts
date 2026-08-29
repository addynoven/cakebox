import { ConfigSchema, type AppConfig } from './config.schema';

let localAppletConfig: Record<string, any> = {};
try {
  localAppletConfig = require('../../../firebase-applet-config.json');
} catch {
  // Ignored in environments where file is absent
}

const rawConfig = {
  env: (process.env.NODE_ENV as any) || 'development',
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || localAppletConfig.apiKey || '',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || localAppletConfig.authDomain || 'cakebox-28faf.firebaseapp.com',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || localAppletConfig.projectId || 'cakebox-28faf',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || localAppletConfig.storageBucket || 'cakebox-28faf.firebasestorage.app',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || localAppletConfig.messagingSenderId || '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || localAppletConfig.appId || '',
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || localAppletConfig.measurementId || '',
    oAuthClientId: process.env.EXPO_PUBLIC_FIREBASE_OAUTH_CLIENT_ID || localAppletConfig.oAuthClientId || '',
    firestoreDatabaseId: process.env.EXPO_PUBLIC_FIRESTORE_DATABASE_ID || localAppletConfig.firestoreDatabaseId || '(default)',
  },
  gemini: {
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
    models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite'],
  },
};

export const config: AppConfig = ConfigSchema.parse(rawConfig);
