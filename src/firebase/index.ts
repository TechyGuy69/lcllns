import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
  const isConfigValid = !!firebaseConfig.apiKey && 
                        firebaseConfig.apiKey !== "" && 
                        !firebaseConfig.apiKey.includes("AI_GENERATED");

  // Use a placeholder that satisfies the SDK's format requirements if the real key is missing
  // to prevent the app from crashing during the initial render.
  const app = getApps().length > 0 
    ? getApp() 
    : initializeApp(isConfigValid ? firebaseConfig : { 
        ...firebaseConfig, 
        apiKey: "AIzaSy_PLACEHOLDER_FOR_INITIALIZATION" 
      });

  const firestore = getFirestore(app);
  const auth = getAuth(app);

  if (!isConfigValid && typeof window !== 'undefined') {
    console.warn(
      "Firebase Configuration is missing or invalid. Please ensure your .env file has NEXT_PUBLIC_FIREBASE_API_KEY and other required variables for features to work correctly."
    );
  }

  return { firebaseApp: app, firestore, auth };
}

export * from './provider';
export * from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
