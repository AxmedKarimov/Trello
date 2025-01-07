import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAl72xS2tkf3YDqYxDRK4JZMqnQQaP8pbs",
  authDomain: "real-time-7671f.firebaseapp.com",
  projectId: "real-time-7671f",
  storageBucket: "real-time-7671f.firebasestorage.app",
  messagingSenderId: "110485360537",
  appId: "1:110485360537:web:df43e0ad0bd903d3f20d08",
  measurementId: "G-CN67ZL0GBQ",
};

const app = initializeApp(firebaseConfig);
export const store = getFirestore(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
