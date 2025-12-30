import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { encryptionService } from './encryption';
import type { Profile } from '@/data/profiles';

const firebaseConfig = {
  apiKey: "AIzaSyAHnj8m3OLHpEpRJLxJGadqrMcYuBEL9eg",
  authDomain: "progitman.firebaseapp.com",
  projectId: "progitman",
  storageBucket: "progitman.firebasestorage.app",
  messagingSenderId: "406918795300",
  appId: "1:406918795300:web:a6852c833c970a43dc88b1",
  measurementId: "G-QQLWTR9NCB"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export class FirebaseService {
  private static instance: FirebaseService;
  
  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async saveProfile(profile: Profile): Promise<void> {
    console.log('Firebase: Saving profile to Firestore:', profile.name);
    try {
      // Encrypt sensitive data before saving to Firebase
      const encryptedToken = await encryptionService.encrypt(profile.encryptedToken);
      const encryptedPin = await encryptionService.encrypt(profile.pin);
      
      // Filter out undefined values
      const cleanData = {
        name: profile.name,
        username: profile.username,
        email: profile.email,
        encryptedToken: encryptedToken,
        expiry: profile.expiry,
        pin: encryptedPin,
        ...(profile.isActive !== undefined && { isActive: profile.isActive }),
        updatedAt: new Date()
      };

      // Check if this is an existing Firebase document (has Firebase-generated ID)
      if (profile.id && profile.id.length > 15 && !profile.id.match(/^\d+$/)) {
        // Update existing Firebase document
        console.log('Firebase: Updating existing profile:', profile.id);
        const docRef = doc(db, 'profiles', profile.id);
        await updateDoc(docRef, cleanData);
        console.log('Firebase: Profile updated successfully');
      } else {
        // Create new document
        console.log('Firebase: Creating new profile');
        const docRef = await addDoc(collection(db, 'profiles'), {
          ...cleanData,
          createdAt: new Date()
        });
        profile.id = docRef.id;
        console.log('Firebase: Profile created with ID:', profile.id);
      }
    } catch (error) {
      console.error('Firebase: Error saving profile:', error);
      throw error;
    }
  }

  async loadProfiles(): Promise<Profile[]> {
    console.log('Firebase: Loading profiles from Firestore');
    try {
      const q = query(collection(db, 'profiles'), orderBy('name'));
      const querySnapshot = await getDocs(q);
      const profiles: Profile[] = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        
        // Decrypt sensitive data after loading from Firebase
        const decryptedToken = await encryptionService.decrypt(data.encryptedToken || '');
        const decryptedPin = await encryptionService.decrypt(data.pin || '');
        
        profiles.push({
          id: docSnapshot.id,
          name: data.name,
          username: data.username,
          email: data.email,
          encryptedToken: decryptedToken,
          expiry: data.expiry,
          pin: decryptedPin,
          isActive: data.isActive
        } as Profile);
      }
      
      console.log('Firebase: Loaded profiles:', profiles.length);
      return profiles;
    } catch (error) {
      console.error('Firebase: Error loading profiles:', error);
      throw error;
    }
  }

  async deleteProfile(profileId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'profiles', profileId));
    } catch (error) {
      console.error('Error deleting profile from Firebase:', error);
      throw error;
    }
  }

  // Firebase Auth methods
  async signInAdmin(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in admin:', error);
      throw error;
    }
  }

  async signOutAdmin(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out admin:', error);
      throw error;
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }
}

export const firebaseService = FirebaseService.getInstance();