
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
  const isConfigValid = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "";

  if (!isConfigValid && typeof window !== 'undefined') {
    console.warn(
      "Firebase Configuration is missing or invalid. Please ensure your .env file has NEXT_PUBLIC_FIREBASE_API_KEY and other required variables."
    );
  }

  // Use a dummy config if invalid to prevent initializeApp from throwing, 
  // but we should be careful as this might just move the error elsewhere.
  // The most robust way is to ensure we don't call services that require a valid key if it's missing.
  
  const app = getApps().length > 0 
    ? getApp() 
    : initializeApp(isConfigValid ? firebaseConfig : { ...firebaseConfig, apiKey: "AI_GENERATED_PLACEHOLDER" });

  // Only get services if config is valid to avoid "invalid-api-key" error
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  return { firebaseApp: app, firestore, auth };
}

export * from './provider';
export * from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
