const functions = require('firebase-functions/v1')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()

// Define admin emails - these will automatically get admin role
const ADMIN_EMAILS = ['admin@feelingcare.com']

// Auto-create Firestore doc when a new Firebase Auth user registers
exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
  try {
    const userRef = db.collection('users').doc(user.uid)

    // Check if user is admin based on email
    const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase())
    const userRole = isAdmin ? 'admin' : 'user'

    // Create Firestore document
    await userRef.set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      role: userRole,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    // Set custom claims for admin users
    if (isAdmin) {
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
        role: 'admin',
      })
      console.log(`✅ Admin user created with custom claims: ${user.email}`)
    } else {
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: false,
        role: 'user',
      })
      console.log(`✅ Regular user created: ${user.email}`)
    }

    console.log(`✅ Firestore user doc created for ${user.email}`)
  } catch (error) {
    console.error('❌ Error creating user doc:', error)
  }
})
