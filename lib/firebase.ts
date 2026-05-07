import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeEIXxI6QJrvTO6m8oOCfRu5R6FCwymlM",
  authDomain: "notes-app-d9e15.firebaseapp.com",
  projectId: "notes-app-d9e15",
  storageBucket: "notes-app-d9e15.appspot.com",
  messagingSenderId: "1070946582540",
  appId: "1:1070946582540:web:98078335316013fb872e29",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);