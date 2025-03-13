import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDnb3VYMiA-DLFu8YxFLXNKKQVPa9QbqAs",
  authDomain: "test-eval-37611.firebaseapp.com",
  projectId: "test-eval-37611",
  storageBucket: "test-eval-37611.appspot.com",
  messagingSenderId: "580263145057",
  appId: "1:580263145057:web:424e6ec5edfb6a68839c420",
}

// Initialisation Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }

