// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3My_aSEKfPRyHcGBOeMryNnU8az5xJr8",
  authDomain: "project-cost-tracker-36f64.firebaseapp.com",
  projectId: "project-cost-tracker-36f64",
  storageBucket: "project-cost-tracker-36f64.firebasestorage.app",
  messagingSenderId: "417035915781",
  appId: "1:417035915781:web:463812d759e95140af826c",
  measurementId: "G-2V1P615N4Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
