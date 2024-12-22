// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyDqTTbxXBuHAZYZZObHYJwuYd3vT3hRfWM",
    authDomain: "financial-tools-bf042.firebaseapp.com",
    projectId: "financial-tools-bf042",
    storageBucket: "financial-tools-bf042.firebasestorage.app",
    messagingSenderId: "481737517594",
    appId: "1:481737517594:web:c0a474e75b5b09fc5fbfa3",
    measurementId: "G-7V23WVLBTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
    auth, 
    googleProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged,
    signOut
};
