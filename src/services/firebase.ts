import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  // @ts-ignore
  initializeAuth,
  // @ts-ignore
  getReactNativePersistence,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { signInWithCredential } from "firebase/auth";
import { CakeItem, Order, UserProfile, CartItem, CustomCakeConfig } from '../types';
import { INITIAL_CAKES } from '../data/cakes';

// Safe environment configuration loader
let localConfig: Record<string, any> = {};
try {
  // @ts-ignore
  localConfig = require('../../firebase-applet-config.json');
} catch {
  // Fallback to environment variables when config file is not present
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || localConfig.apiKey || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || "cakebox-28faf.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || localConfig.projectId || "cakebox-28faf",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || "cakebox-28faf.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || localConfig.appId || "",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || localConfig.measurementId || "",
  oAuthClientId: process.env.EXPO_PUBLIC_FIREBASE_OAUTH_CLIENT_ID || localConfig.oAuthClientId || "",
  firestoreDatabaseId: process.env.EXPO_PUBLIC_FIRESTORE_DATABASE_ID || localConfig.firestoreDatabaseId || "(default)",
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with React Native Persistence
export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch {
    return getAuth(app);
  }
})();
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const googleWebClientId = firebaseConfig.oAuthClientId;
if (googleWebClientId) {
  GoogleSignin.configure({
    webClientId: googleWebClientId,
  });
}

// Initialize Firestore with specific database ID from config
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Auth helper functions
export const signInWithGoogle = async (): Promise<UserProfile> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    
    // v16 places idToken in signInResult.data.idToken
    const idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error("No ID token found from Google Sign-In");
    }

    const googleCredential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, googleCredential);
    const fbUser = result.user;

    const userProfile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || "Sweet Baker",
      email: fbUser.email || "",
      phone: fbUser.phoneNumber || "+1 (555) 000-0000",
      avatar: fbUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      isLoggedIn: true,
      savedAddresses: [],
      wishlist: []
    };

    const userDocRef = doc(db, "users", fbUser.uid);
    const existingSnap = await getDoc(userDocRef);
    if (existingSnap.exists()) {
      const data = existingSnap.data() as Partial<UserProfile>;
      return {
        ...userProfile,
        ...data,
        id: fbUser.uid,
        isLoggedIn: true
      };
    } else {
      await setDoc(userDocRef, {
        ...userProfile,
        updatedAt: new Date().toISOString()
      });
    }

    return userProfile;
  } catch (err: any) {
    console.error("Google Sign-In Error:", err);
    throw err;
  }
};

export const signInWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const fbUser = result.user;
  const profile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || email.split('@')[0],
    email: fbUser.email || email,
    phone: fbUser.phoneNumber || '',
    isLoggedIn: true,
    savedAddresses: [],
    wishlist: []
  };

  try {
    const userDocRef = doc(db, 'users', fbUser.uid);
    const existingSnap = await getDoc(userDocRef);
    if (existingSnap.exists()) {
      return { ...profile, ...(existingSnap.data() as any), isLoggedIn: true };
    } else {
      await setDoc(userDocRef, profile);
    }
  } catch (err) {
    console.warn('Firestore user sync warning:', err);
  }
  return profile;
};

export const registerWithEmail = async (name: string, email: string, pass: string): Promise<UserProfile> => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const fbUser = result.user;
  await updateProfile(fbUser, { displayName: name });

  const profile: UserProfile = {
    id: fbUser.uid,
    name: name,
    email: email,
    phone: '',
    isLoggedIn: true,
    savedAddresses: [],
    wishlist: []
  };

  try {
    await setDoc(doc(db, 'users', fbUser.uid), profile);
  } catch (err) {
    console.warn('Firestore register sync warning:', err);
  }
  return profile;
};

export const logoutFirebase = async (): Promise<void> => {
  await fbSignOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Firestore Order Syncing
export const saveOrderToFirestore = async (order: Order, userId?: string): Promise<boolean> => {
  try {
    const orderDocRef = doc(db, 'orders', order.id);
    await setDoc(orderDocRef, {
      ...order,
      userId: userId || auth.currentUser?.uid || 'guest',
      syncedAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.warn('Failed to push order to Firestore (stored locally for retry):', err);
    return false;
  }
};

export const fetchOrdersFromFirestore = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      limit(50)
    );
    const snap = await getDocs(q);
    const list: Order[] = [];
    snap.forEach((d) => list.push(d.data() as Order));
    return list.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  } catch (err) {
    console.warn('Could not query Firestore orders:', err);
    return [];
  }
};

// Custom Creations Sharing & Saving in Firestore
export const saveCustomCreationToFirestore = async (config: CustomCakeConfig, authorName: string): Promise<string> => {
  try {
    const colRef = collection(db, 'customCreations');
    const docRef = await addDoc(colRef, {
      ...config,
      authorName,
      createdAt: new Date().toISOString(),
      likes: 0
    });
    return docRef.id;
  } catch (err) {
    console.warn('Failed to save custom creation to Firestore:', err);
    return 'local-creation';
  }
};

// Sync Wishlist to Firestore
export const syncWishlistToFirestore = async (userId: string, wishlist: string[]): Promise<void> => {
  try {
    if (!userId || userId === 'guest') return;
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { wishlist, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('Firestore wishlist sync error:', err);
  }
};

// Firestore Cakes Catalog Management
export const fetchCakesFromFirestore = async (): Promise<CakeItem[]> => {
  try {
    const cakesCol = collection(db, 'cakes');
    const snap = await getDocs(cakesCol);
    const cakes: CakeItem[] = [];
    snap.forEach((d) => {
      cakes.push({ id: d.id, ...d.data() } as CakeItem);
    });
    if (cakes.length > 0) {
      return cakes;
    }
    // If empty in Firestore, seed and return initial
    await seedCakesToFirestore();
    return INITIAL_CAKES;
  } catch (err) {
    console.warn('Could not fetch cakes from Firestore, using cached/initial:', err);
    return INITIAL_CAKES;
  }
};

export const subscribeCakesFromFirestore = (
  onCakesUpdated: (cakes: CakeItem[]) => void
) => {
  try {
    const cakesCol = collection(db, 'cakes');
    return onSnapshot(
      cakesCol,
      (snap) => {
        const list: CakeItem[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as CakeItem));
        if (list.length > 0) {
          onCakesUpdated(list);
        }
      },
      (err) => {
        console.warn('Cakes snapshot listener warning:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe to cakes from Firestore:', err);
    return () => {};
  }
};

export const seedCakesToFirestore = async (): Promise<void> => {
  try {
    for (const cake of INITIAL_CAKES) {
      const cakeDocRef = doc(db, 'cakes', cake.id);
      await setDoc(cakeDocRef, {
        ...cake,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Failed to seed cakes to Firestore:', err);
  }
};

