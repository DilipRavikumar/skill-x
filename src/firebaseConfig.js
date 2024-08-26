  // firebaseConfig.js
  import { initializeApp } from "firebase/app";

  import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
  import { getFirestore } from "firebase/firestore"
  import { getAnalytics } from 'firebase/analytics';
  
  const firebaseConfig = {
    apiKey: "AIzaSyAeKXYGkz1JoclrBgvJBqhssY_D0molHMI",
    authDomain: "skillx-a741e.firebaseapp.com",
    projectId: "skillx-a741e",
    storageBucket: "skillx-a741e.appspot.com",
    messagingSenderId: "138763954816",
    appId: "1:138763954816:web:dfbef3ac208a9b3d789465",
    measurementId: "G-KBRK4ZWEB7"
  };
  
  const app = initializeApp(firebaseConfig);  
  const auth = getAuth(app);
  
  // Enable session persistence
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      console.log("Session persistence enabled");
    })
    .catch((error) => {
      console.error("Error enabling session persistence: ", error);
    });
  
  const db = getFirestore(app);
  const analytics = getAnalytics(app);
  
  export {app, analytics, auth, db};