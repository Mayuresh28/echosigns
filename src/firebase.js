import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBJhLVPIESi3S7R3MeFpUtpPM266rHgFU",
  authDomain: "echosigns-8eb13.firebaseapp.com",
  projectId: "echosigns-8eb13",
  storageBucket: "echosigns-8eb13.firebasestorage.app",
  messagingSenderId: "153105415205",
  appId: "1:153105415205:web:e2955620bfb8f9411ad3cc",
  measurementId: "G-ZLDYSY4B5Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 