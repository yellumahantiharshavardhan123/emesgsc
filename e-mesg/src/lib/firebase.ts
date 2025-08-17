import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - Your production Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAor1Aq2Myi8BwI6Eosiz7elTtPl2WgwLs",
  authDomain: "emesg-mvp-sc.firebaseapp.com",
  projectId: "emesg-mvp-sc",
  storageBucket: "emesg-mvp-sc.firebasestorage.app",
  messagingSenderId: "157751238183",
  appId: "1:157751238183:web:7196e759c8f9e556263802",
  measurementId: "G-L00GR5FN5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;