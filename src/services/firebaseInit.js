import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase web configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyDGrA5KWGjdQwaA8CdCYzbmDYmwMjYSYO0',
  authDomain: 'assignment3-lanxin-lu-33912645.firebaseapp.com',
  projectId: 'assignment3-lanxin-lu-33912645',
  storageBucket: 'assignment3-lanxin-lu-33912645.appspot.com',
  messagingSenderId: '561423951295',
  appId: '1:561423951295:web:732d1448c23c7eff3b6d0a',
  measurementId: 'G-MD1NWMKJH9',
}

// Centralized Firebase app initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Set auth persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence set to local')
  })
  .catch((error) => {
    console.error('Error setting Firebase persistence:', error)
  })

// Export the app instance for any services that need it
export { app }
