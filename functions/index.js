/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https')
const authV1 = require('firebase-functions/v1/auth')

const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

admin.initializeApp()
const db = admin.firestore()

// Define admin emails - these will automatically get admin role
const ADMIN_EMAILS = ['admin@feelingcare.com']

// Auto-clean Firestore when a Firebase Auth user is deleted (non-blocking)
exports.deleteUserDataOnAuthDelete = authV1.user().onDelete(async (user) => {
  try {
    const { uid, email } = user

    // Delete user doc
    await db.collection('users').doc(uid).delete()

    // Delete posts authored by the user
    const postsSnap = await db.collection('posts').where('authorId', '==', uid).get()
    if (!postsSnap.empty) {
      const batch = db.batch()
      postsSnap.forEach((doc) => batch.delete(doc.ref))
      await batch.commit()
    }

    console.log(`🧹 Cleaned Firestore for deleted Auth user: ${email || uid}`)
  } catch (error) {
    console.error('❌ Error in deleteUserDataOnAuthDelete:', error)
  }
})

// Return merged Auth + Firestore user info for admin dashboard
exports.listUsers = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Verify admin access
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const token = authHeader.split('Bearer ')[1]
      const decodedToken = await admin.auth().verifyIdToken(token)

      // Check if user is admin using custom claims
      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' })
      }

      const authList = await admin.auth().listUsers(1000)
      const users = []

      for (const authUser of authList.users) {
        const doc = await db.collection('users').doc(authUser.uid).get()
        const data = doc.exists ? doc.data() : {}

        const postSnap = await db.collection('posts').where('authorId', '==', authUser.uid).get()

        users.push({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName || data.displayName || 'N/A',
          role: data.role || 'user',
          createdAt: authUser.metadata.creationTime,
          postCount: postSnap.size,
          disabled: authUser.disabled,
          isAdminEmail: ADMIN_EMAILS.includes(authUser.email?.toLowerCase()),
        })
      }

      res.status(200).json(users)
    } catch (error) {
      console.error('❌ Error listing users:', error)
      res.status(500).json({ error: error.message })
    }
  })
})

// Secure admin role management
exports.updateUserRole = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Verify admin access
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const token = authHeader.split('Bearer ')[1]
      const decodedToken = await admin.auth().verifyIdToken(token)

      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' })
      }

      const { userId, newRole } = req.body

      if (!userId || !newRole) {
        return res.status(400).json({ error: 'Missing userId or newRole' })
      }

      // Get user data
      const userRecord = await admin.auth().getUser(userId)
      const isAdminEmail = ADMIN_EMAILS.includes(userRecord.email?.toLowerCase())

      // Prevent changing admin email roles
      if (isAdminEmail && newRole !== 'admin') {
        return res.status(400).json({
          error: 'Cannot change role for admin email addresses',
        })
      }

      // Update Firestore
      await db.collection('users').doc(userId).update({
        role: newRole,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })

      // Update custom claims
      await admin.auth().setCustomUserClaims(userId, {
        admin: newRole === 'admin',
        role: newRole,
      })

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
      })
    } catch (error) {
      console.error('❌ Error updating user role:', error)
      res.status(500).json({ error: error.message })
    }
  })
})

// Verify admin status
exports.verifyAdmin = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const token = authHeader.split('Bearer ')[1]
      const decodedToken = await admin.auth().verifyIdToken(token)

      res.status(200).json({
        isAdmin: decodedToken.admin || false,
        role: decodedToken.role || 'user',
      })
    } catch (error) {
      console.error('❌ Error verifying admin:', error)
      res.status(500).json({ error: error.message })
    }
  })
})

// Clean up user data (and optionally delete the Auth user) via admin-only HTTP endpoint
exports.cleanupUserData = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Verify admin access
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const token = authHeader.split('Bearer ')[1]
      const decodedToken = await admin.auth().verifyIdToken(token)

      if (!decodedToken.admin) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' })
      }

      const { userId } = req.body

      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' })
      }

      // Try to delete Auth user first (ignore if already deleted)
      try {
        await admin.auth().deleteUser(userId)
      } catch (e) {
        // If the user is already deleted in Auth, continue to Firestore cleanup
        if (e?.code !== 'auth/user-not-found') {
          console.warn('Auth delete warning:', e?.message || e)
        }
      }

      // Delete user document from Firestore
      await db.collection('users').doc(userId).delete()

      // Delete any posts created by this user
      const postsSnapshot = await db.collection('posts').where('authorId', '==', userId).get()
      const batch = db.batch()

      postsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })

      await batch.commit()

      res.status(200).json({
        success: true,
        message: 'Auth user and Firestore data cleaned up successfully',
        deletedPosts: postsSnapshot.size,
      })
    } catch (error) {
      console.error('❌ Error cleaning up user data:', error)
      res.status(500).json({ error: error.message })
    }
  })
})
