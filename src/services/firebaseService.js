import { onAuthStateChanged } from 'firebase/auth'
import { auth, firebaseConfig } from './firebaseInit'

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
