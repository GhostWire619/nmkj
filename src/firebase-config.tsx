// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYtYRbZS0iQ5gf8xG0fGltnbJxbPy2BCk",
  authDomain: "sms-app-trial.firebaseapp.com",
  projectId: "sms-app-trial",
  storageBucket: "sms-app-trial.appspot.com",
  messagingSenderId: "228288065959",
  appId: "1:228288065959:web:1f96ee6b4e32fd41944682",
  measurementId: "G-JC1QBS7LNJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
