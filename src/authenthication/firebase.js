// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCGb5M3wiMaSimfuFV-iO2gpoMRK53jbyI",
    authDomain: "recipe-web-007.firebaseapp.com",
    projectId: "recipe-web-007",
    storageBucket: "recipe-web-007.appspot.com",
    messagingSenderId: "379020809149",
    appId: "1:379020809149:web:c68244e7cc501882c138d4",
    measurementId: "G-84JDBTY161"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const db=getFirestore()
const analytics = getAnalytics(app);