import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Firebase Auth service
export class FirebaseAuthService {
  constructor() {
    this.auth = getAuth()
    this.currentUser = null
    this.listeners = []

    // Listen for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user
      this.notifyListeners(user)
    })
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null
  }

  // Add listener for auth state changes
  addAuthStateListener(callback) {
    this.listeners.push(callback)
    // Call immediately with current state
    callback(this.currentUser)
  }

  // Remove listener
  removeAuthStateListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  }

  // Notify all listeners
  notifyListeners(user) {
    this.listeners.forEach((listener) => listener(user))
  }

  // Get user display name
  getUserDisplayName() {
    return this.currentUser?.displayName || this.currentUser?.email || 'Anonymous'
  }

  // Get user email
  getUserEmail() {
    return this.currentUser?.email || null
  }

  // Get user ID
  getUserId() {
    return this.currentUser?.uid || null
  }
}

// Create singleton instance
export const firebaseAuthService = new FirebaseAuthService()
