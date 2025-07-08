import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCdjcbR-6zLjsiaOiq627bpN4ESnFclews",
    authDomain: "sobaka-101a4.firebaseapp.com",
    projectId: "sobaka-101a4",
    storageBucket: "sobaka-101a4.firebasestorage.app",
    messagingSenderId: "242814838216",
    appId: "1:242814838216:web:46332e1b5bd9f7e97f8cfd",
    measurementId: "G-4PELFHXPSQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);