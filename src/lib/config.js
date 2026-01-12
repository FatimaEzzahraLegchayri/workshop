import { initializeApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { app } from './firebase';

// export const auth = getAuth(app);


// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// All env vars need NEXT_PUBLIC_ prefix to be accessible in client components
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate that required config values are present
const requiredFields = ['apiKey', 'projectId', 'appId'];
const missingFields = requiredFields.filter(
  (field) => !firebaseConfig[field] || firebaseConfig[field].trim() === ''
);

if (missingFields.length > 0) {
  const errorMessage = `Missing Firebase configuration values: ${missingFields.join(', ')}. ` +
    `Please ensure all NEXT_PUBLIC_FIREBASE_* environment variables are set in your .env.local file ` +
    `and restart your development server.`;
  console.error('Firebase Config:', firebaseConfig);
  throw new Error(errorMessage);
}

// Initialize Firebase only if it hasn't been initialized already
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);


// Initialize Analytics only on client side
// let analytics;
// if (typeof window !== 'undefined') {
//   try {
//     analytics = getAnalytics(app);
//   } catch (error) {
//     console.warn('Firebase Analytics initialization failed:', error);
//   }
// }

export default app;