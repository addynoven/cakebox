import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  GoogleAuthProvider,
  Auth,
} from 'firebase/auth';
import * as authModule from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, Firestore } from 'firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { config } from '../config';

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
  measurementId: config.firebase.measurementId,
};

export const firebaseApp: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth: Auth = (() => {
  try {
    const getReactNativePersistence = (authModule as any).getReactNativePersistence;
    if (typeof getReactNativePersistence === 'function') {
      return initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
    return getAuth(firebaseApp);
  } catch {
    return getAuth(firebaseApp);
  }
})();

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

if (config.firebase.oAuthClientId) {
  try {
    GoogleSignin.configure({
      webClientId: config.firebase.oAuthClientId,
    });
  } catch (e) {
    console.warn('[GoogleSignin] configure warning:', e);
  }
}

export const db: Firestore = getFirestore(
  firebaseApp,
  config.firebase.firestoreDatabaseId || '(default)'
);
