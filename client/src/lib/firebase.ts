import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, addDoc, updateDoc, collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication helper
export const signInUser = async (): Promise<User | null> => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Error signing in:', error);
    return null;
  }
};

// Collection paths
export const COLLECTIONS = {
  USERS: 'users',
  RANCHES: 'ranches',
  USER_PROGRESS: 'userProgress',
  REWARD_NFTS: 'rewardNfts',
  CHARACTERS: 'characters',
  BUILDINGS: 'buildings'
};

// Helper function to get user document reference
export const getUserDocRef = (userId: string) => {
  return doc(db, COLLECTIONS.USERS, userId);
};

// Helper function to get user's subcollection reference
export const getUserSubcollectionRef = (userId: string, subcollection: string) => {
  return collection(db, COLLECTIONS.USERS, userId, subcollection);
};

// Initialize auth state listener
export const initializeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};