// Import required Firebase modules
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDUJ8ThDfGOhS6RjRXhO_7Peaun6rhmOiA",
  authDomain: "retro-service.firebaseapp.com",
  projectId: "retro-service",
  storageBucket: "retro-service.appspot.com",
  messagingSenderId: "950638929085",
  appId: "1:950638929085:web:fdf465558a45d26028c3d4",
  measurementId: "G-DE56W5MD67",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
    