// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_APIKEY || "AIzaSyDCUhOCQI4Us_CX3q4zlC5reFqfirkIryU",
  authDomain: "mern-estate-f48c4.firebaseapp.com",
  projectId: "mern-estate-f48c4",
  storageBucket: "mern-estate-f48c4.appspot.com",
  messagingSenderId: "853707227900",
  appId: "1:853707227900:web:95f447cfa68b9c6be18d79"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);