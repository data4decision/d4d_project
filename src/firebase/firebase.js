// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC-558XK1PK2J2GZwCGOd38WNqg7_N70TU",
  authDomain: "login-auth-98e55.firebaseapp.com",
  projectId: "login-auth-98e55",
  storageBucket: "login-auth-98e55.appspot.com",
  messagingSenderId: "747576189024",
  appId: "1:747576189024:web:ea22c019dc42f52b5d2305",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export necessary Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
