import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Import the firestore compatibility library

// =================================================================================================
// IMPORTANT: Replace this with your own Firebase project configuration!
// You can find this in your Firebase project settings under "General".
// =================================================================================================
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};

// =================================================================================================
// Configuration Check: This will throw an error if you haven't updated the credentials.
// =================================================================================================
if (firebaseConfig.apiKey === "YOUR_API_KEY" || firebaseConfig.projectId === "YOUR_PROJECT_ID") {
  throw new Error("Firebase is not configured. Please update the `firebaseConfig` object in `firebase.ts` with your actual project credentials from the Firebase console.");
}


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); // Use the v8 compatibility API for Firestore

export { app, auth, db };