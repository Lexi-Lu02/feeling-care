import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth'

// Firebase web configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDGrA5KWGjdQwaA8CdCYzbmDYmwMjYSYO0',
  authDomain: 'assignment3-lanxin-lu-33912645.firebaseapp.com',
  projectId: 'assignment3-lanxin-lu-33912645',
  storageBucket: 'assignment3-lanxin-lu-33912645.appspot.com',
  messagingSenderId: '561423951295',
  appId: '1:561423951295:web:732d1448c23c7eff3b6d0a',
  measurementId: 'G-MD1NWMKJH9',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence set to local')
  })
  .catch((error) => {
    console.error(' Error setting Firebase persistence:', error)
  })

// ========== Optional class wrapper for extra helpers ==========
class FirebaseAuthService {
  constructor() {
    this.auth = auth
    this.currentUser = null
    this.listeners = []

    // Track auth state changes globally
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user
      this.notifyListeners(user)
    })
  }

  // Return the current Firebase user object
  getCurrentUser() {
    return this.currentUser
  }

  // Return whether the user is signed in
  isAuthenticated() {
    return this.currentUser !== null
  }

  // Add a listener that triggers when auth state changes
  addAuthStateListener(callback) {
    this.listeners.push(callback)
    callback(this.currentUser) // immediately call once
  }

  // Remove a listener
  removeAuthStateListener(callback) {
    this.listeners = this.listeners.filter((fn) => fn !== callback)
  }

  // Notify all listeners when user state changes
  notifyListeners(user) {
    this.listeners.forEach((fn) => fn(user))
  }

  // Utility getters
  getUserDisplayName() {
    return this.currentUser?.displayName || this.currentUser?.email || 'Anonymous'
  }

  getUserEmail() {
    return this.currentUser?.email || null
  }

  getUserId() {
    return this.currentUser?.uid || null
  }
}

// Export both the class and the reusable auth instance
export const firebaseAuthService = new FirebaseAuthService()
export { auth, firebaseConfig }
