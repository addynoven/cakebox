import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
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
import firebaseConfig from '../../firebase-applet-config.json';
import { CakeItem, Order, UserProfile, CartItem, CustomCakeConfig } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific database ID from config
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Auth helper functions
export const signInWithGoogle = async (): Promise<UserProfile> => {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;
  
  const userProfile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Sweet Baker',
    email: fbUser.email || '',
    phone: fbUser.phoneNumber || '+1 (555) 234-5678',
    avatar: fbUser.photoURL || undefined,
    isLoggedIn: true,
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home Sweet Home',
        address: '742 Evergreen Terrace, Springfield',
        isDefault: true
      },
      {
        id: 'addr-2',
        label: 'Office Party Spot',
        address: '100 Baker Street, Suite 4B',
        isDefault: false
      }
    ],
    wishlist: []
  };

  // Sync to Firestore user profile document
  try {
    const userDocRef = doc(db, 'users', fbUser.uid);
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
  } catch (err) {
    console.warn('Firestore user profile sync warning (operating in hybrid mode):', err);
  }

  return userProfile;
};

export const signInWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const fbUser = result.user;
  const profile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || email.split('@')[0],
    email: fbUser.email || email,
    phone: '+1 (555) 234-5678',
    isLoggedIn: true,
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home',
        address: '742 Evergreen Terrace, Springfield',
        isDefault: true
      }
    ],
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
    phone: '+1 (555) 234-5678',
    isLoggedIn: true,
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home',
        address: '742 Evergreen Terrace, Springfield',
        isDefault: true
      }
    ],
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
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const snap = await getDocs(q);
    const list: Order[] = [];
    snap.forEach((d) => list.push(d.data() as Order));
    return list;
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
