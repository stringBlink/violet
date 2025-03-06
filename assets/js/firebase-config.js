// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEd9hxnIEs-flsbcjcrkV6AGsFEFK74Bs",
  authDomain: "violet-store.firebaseapp.com",
  databaseURL: "https://violet-store-default-rtdb.firebaseio.com",
  projectId: "violet-store",
  storageBucket: "violet-store.firebasestorage.app",
  messagingSenderId: "161702643857",
  appId: "1:161702643857:web:f2e4ba4d28598a9c025730",
  measurementId: "G-X2NFHM84BC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase modules
export { auth, db };
