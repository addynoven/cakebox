import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth, db } from '../../../core/api/firebase';
import { mapUserProfileDoc } from '../../../core/api/firestoreMappers';
import { AppError, captureError } from '../../../core/errors';
import { SecureStorage } from '../../../core/storage';
import { UserProfile } from '../models/user.model';

export class AuthRepository {
  static async signInWithGoogle(): Promise<UserProfile> {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;
      if (!idToken) {
        throw new AppError('No ID token received from Google Sign-In', 'AUTH_NO_TOKEN', 401);
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      const fbUser = result.user;

      // Securely store hardware-encrypted token
      const token = await fbUser.getIdToken();
      await SecureStorage.setAuthToken(token);

      const userDocRef = doc(db, 'users', fbUser.uid);
      const existingSnap = await getDoc(userDocRef);
      if (existingSnap.exists()) {
        return mapUserProfileDoc(fbUser.uid, existingSnap.data());
      } else {
        const baseProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Sweet Baker',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '',
          avatar: fbUser.photoURL || undefined,
          isLoggedIn: true,
          savedAddresses: [],
          wishlist: [],
        };
        await setDoc(userDocRef, {
          ...baseProfile,
          updatedAt: new Date().toISOString(),
        });
        return baseProfile;
      }
    } catch (err: unknown) {
      throw captureError(err, { source: 'AuthRepository', action: 'signInWithGoogle' });
    }
  }

  static async signInWithEmail(email: string, pass: string): Promise<UserProfile> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = result.user;

      // Securely store hardware-encrypted token
      const token = await fbUser.getIdToken();
      await SecureStorage.setAuthToken(token);

      const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
      if (userDoc.exists()) {
        return mapUserProfileDoc(fbUser.uid, userDoc.data());
      }

      return {
        id: fbUser.uid,
        name: fbUser.displayName || email.split('@')[0],
        email: fbUser.email || email,
        phone: fbUser.phoneNumber || '',
        isLoggedIn: true,
        savedAddresses: [],
        wishlist: [],
      };
    } catch (err: unknown) {
      throw captureError(err, { source: 'AuthRepository', action: 'signInWithEmail' });
    }
  }

  static async signUpWithEmail(name: string, email: string, pass: string): Promise<UserProfile> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = result.user;

      await updateProfile(fbUser, { displayName: name });

      // Securely store hardware-encrypted token
      const token = await fbUser.getIdToken();
      await SecureStorage.setAuthToken(token);

      const newProfile: UserProfile = {
        id: fbUser.uid,
        name: name,
        email: email,
        phone: '',
        isLoggedIn: true,
        savedAddresses: [],
        wishlist: [],
      };

      await setDoc(doc(db, 'users', fbUser.uid), {
        ...newProfile,
        createdAt: new Date().toISOString(),
      });

      return newProfile;
    } catch (err: unknown) {
      throw captureError(err, { source: 'AuthRepository', action: 'signUpWithEmail' });
    }
  }

  static async signOut(): Promise<void> {
    try {
      await fbSignOut(auth);
      await SecureStorage.clearAllCredentials();
    } catch (err: unknown) {
      throw captureError(err, { source: 'AuthRepository', action: 'signOut' });
    }
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
      throw captureError(err, { source: 'AuthRepository', action: 'resetPassword' });
    }
  }

  static async syncWishlist(userId: string, wishlist: string[]): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { wishlist });
    } catch (err: unknown) {
      throw captureError(err, { source: 'AuthRepository', action: 'syncWishlist' });
    }
  }

  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}
