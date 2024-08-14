// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIxUgpae4jZlUYKPU1V_i0R5Z2BX7NfMs",
  authDomain: "flashcard-saas-a1269.firebaseapp.com",
  projectId: "flashcard-saas-a1269",
  storageBucket: "flashcard-saas-a1269.appspot.com",
  messagingSenderId: "206211991234",
  appId: "1:206211991234:web:b33e681c864e3b9fb65d5b",
  measurementId: "G-469E85LXH8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app)

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
}

const signOutFromGoogle = () => {
  return signOut(auth)
}

export { auth, signInWithGoogle, signOutFromGoogle, db }