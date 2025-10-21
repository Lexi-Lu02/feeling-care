const functions = require('firebase-functions/v1')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()

// Define admin emails - these will automatically get admin role
const ADMIN_EMAILS = ['admin@feelingcare.com']

// Auto-create Firestore doc when a new Firebase Auth user registers
exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
  try {
    console.log('🚀 Firebase Function triggered for user:', user.email)
    console.log('📝 User data from Auth:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    })

    const userRef = db.collection('users').doc(user.uid)

    // Check if user is admin based on email
    const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase())
    console.log('🔍 Is admin email?', isAdmin)

    // For admin emails, always set role to admin
    // For regular users, let the frontend set the role they selected
    const userRole = isAdmin ? 'admin' : 'user'
    console.log('📝 Setting initial role:', userRole)

    // Check if document already exists (created by frontend)
    const existingDoc = await userRef.get()

    if (existingDoc.exists()) {
      console.log('📝 Document already exists, only updating missing fields...')
      const existingData = existingDoc.data()

      // Only update fields that are missing or empty
      const updateData = {}

      if (!existingData.displayName || existingData.displayName === '') {
        updateData.displayName = user.displayName || ''
      }

      if (!existingData.role || existingData.role === 'user') {
        updateData.role = userRole
      }

      if (!existingData.createdAt) {
        updateData.createdAt = admin.firestore.FieldValue.serverTimestamp()
      }

      updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp()

      if (Object.keys(updateData).length > 1) {
        // More than just updatedAt
        console.log('📝 Updating existing document with:', updateData)
        await userRef.update(updateData)
        console.log('✅ Existing document updated successfully')
      } else {
        console.log('📝 No updates needed for existing document')
      }
    } else {
      console.log('📝 Creating new Firestore document...')
      // Create Firestore document with basic info
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        role: userRole,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }

      console.log('📝 Creating Firestore document with:', userData)
      await userRef.set(userData)
      console.log('✅ New Firestore document created successfully')
    }

    // Set custom claims for admin users only
    if (isAdmin) {
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
        role: 'admin',
      })
      console.log(`✅ Admin user created with custom claims: ${user.email}`)
    } else {
      // For regular users, set basic claims
      // The frontend will handle setting the specific role
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: false,
        role: 'user', // Default role, will be updated by frontend
      })
      console.log(`✅ Regular user created: ${user.email}`)
    }

    console.log(
      `✅ Firestore user doc created for ${user.email} with displayName: ${user.displayName || 'empty'}`,
    )
  } catch (error) {
    console.error('❌ Error creating user doc:', error)
  }
})
