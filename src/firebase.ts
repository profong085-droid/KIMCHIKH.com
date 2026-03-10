// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged} from "firebase/auth";

// TODO: Add your Firebase project config here
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Add web app and copy the firebaseConfig
// 4. Replace the config below with your actual config
const firebaseConfig = {
 apiKey: "YOUR_API_KEY",
 authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
 projectId: "YOUR_PROJECT_ID",
 storageBucket: "YOUR_PROJECT_ID.appspot.com",
 messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
 appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign In
export const signInWithGoogle = async () => {
 try {
   const result = await signInWithPopup(auth, googleProvider);
  return result.user;
 } catch (error) {
   console.error("Google Sign In Error:", error);
   throw error;
 }
};

// Email/Password Sign In
export const loginWithEmail = async (email: string, password: string) => {
 try {
   const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
 } catch (error) {
   console.error("Email Login Error:", error);
   throw error;
 }
};

// Email/Password Sign Up
export const signupWithEmail = async (email: string, password: string) => {
 try {
   const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
 } catch (error) {
   console.error("Signup Error:", error);
   throw error;
 }
};

// Logout
export const logout = async () => {
 try {
   await signOut(auth);
 } catch (error) {
   console.error("Logout Error:", error);
   throw error;
 }
};

// Auth State Listener
export const onAuthChange = (callback: (user: any) => void) => {
 return onAuthStateChanged(auth, callback);
};
