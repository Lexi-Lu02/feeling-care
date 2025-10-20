/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

admin.initializeApp()
const db = admin.firestore()

// Fetch Auth users + Firestore roles + post count
exports.listUsers = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const authUsers = await admin.auth().listUsers(1000)
      const users = []

      for (const user of authUsers.users) {
        // Read user role from Firestore if exists
        const doc = await db.collection('users').doc(user.uid).get()
        const userData = doc.exists ? doc.data() : {}

        // Count user posts
        const postSnap = await db.collection('posts').where('authorId', '==', user.uid).get()

        users.push({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || userData.displayName || 'N/A',
          role: userData.role || 'user',
          createdAt: user.metadata.creationTime,
          postCount: postSnap.size,
          disabled: user.disabled,
        })
      }

      res.status(200).json(users)
    } catch (error) {
      console.error('Error listing users:', error)
      res.status(500).json({ error: error.message })
    }
  })
})
