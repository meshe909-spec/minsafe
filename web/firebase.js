import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDydSJvdlkQ7k5L0Zn9ArIbk81JG6G5vdM",
  authDomain: "minisafe-5985a.firebaseapp.com",
  projectId: "minisafe-5985a",
  storageBucket: "minisafe-5985a.firebasestorage.app",
  messagingSenderId: "297299425815",
  appId: "1:297299425815:web:e1078f412f0ebf82517a52"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
