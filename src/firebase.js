// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByMxPe8Z2R2v_ryIA5bqx356BrFRgUO7U",
  authDomain: "shirly04-6c0f7.firebaseapp.com",
  projectId: "shirly04-6c0f7",
  storageBucket: "shirly04-6c0f7.appspot.com",
  messagingSenderId: "1066929755034",
  appId: "1:1066929755034:web:47a5a73dfca42ff66ee023",
  measurementId: "G-MZHHR31X7W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)