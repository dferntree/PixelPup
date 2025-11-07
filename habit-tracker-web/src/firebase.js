// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgf64KqYAH-p1jNEVrriJiu9ToTYiA5Aw",
  authDomain: "pixelpup-3f81e.firebaseapp.com",
  projectId: "pixelpup-3f81e",
  storageBucket: "pixelpup-3f81e.firebasestorage.app",
  messagingSenderId: "154946230527",
  appId: "1:154946230527:web:2bfab61c6391f82e3d94ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inititalize Firebase Authentication and export it
export const auth = getAuth(app)