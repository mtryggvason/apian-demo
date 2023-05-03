import { initializeApp } from "@firebase/app";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "apian-demo.firebaseapp.com",
    projectId: "apian-demo",
    storageBucket: "apian-demo.appspot.com",
    messagingSenderId: "979868886823",
    appId: "1:979868886823:web:7da126b62db8baee176b02"
  };


// Initialize Firebase
export const app = initializeApp(firebaseConfig);