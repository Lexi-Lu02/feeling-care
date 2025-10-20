/**
 * Secure Admin Setup Script
 *
 * This script helps you set up the first admin user for your Firebase application
 * using the secure custom claims system.
 *
 * Prerequisites:
 * 1. Deploy your Firebase Functions first
 * 2. Have a user account created through your app
 * 3. Download Firebase service account key
 *
 * Usage:
 * 1. Update ADMIN_EMAILS in functions/index.js with your admin email
 * 2. Deploy Firebase Functions: firebase deploy --only functions
 * 3. Create user account through your app
 * 4. Run this script: node setup-admin-secure.js <user-email>
 *
 * Example:
 * node setup-admin-secure.js admin@feelingcare.com
 */

const admin = require('firebase-admin')

async function setupSecureAdmin(userEmail) {
  try {
    console.log('🔐 Setting up secure admin system...')
    console.log('')

    // Check if Firebase Admin is initialized
    if (!admin.apps.length) {
      console.log('⚠️  Firebase Admin SDK not initialized.')
      console.log('📋 To set up your admin user:')
      console.log('')
      console.log('1. Go to Firebase Console > Project Settings > Service Accounts')
      console.log('2. Generate a new private key and download the JSON file')
      console.log('3. Place the JSON file in your project root')
      console.log('4. Update this script with the correct path to the JSON file')
      console.log('5. Update the databaseURL with your project URL')
      console.log('')
      console.log('📧 Target user email:', userEmail)
      console.log('')
      console.log('🔄 Alternative method (Recommended):')
      console.log('1. Update ADMIN_EMAILS array in functions/index.js:')
      console.log('   const ADMIN_EMAILS = [')
      console.log(`     '${userEmail}',`)
      console.log('     // Add more admin emails here')
      console.log('   ]')
      console.log('')
      console.log('2. Deploy Firebase Functions:')
      console.log('   firebase deploy --only functions')
      console.log('')
      console.log('3. Create a new user account with the admin email through your app')
      console.log('4. The user will automatically get admin role and custom claims')
      console.log('')
      console.log('🎯 This method is more secure because:')
      console.log('   - Admin roles are set server-side')
      console.log('   - Uses Firebase custom claims')
      console.log('   - Cannot be bypassed by client-side manipulation')
      console.log('   - Automatically handles role assignment on user creation')

      return
    }

    // If Firebase Admin is initialized, proceed with setup
    const userRecord = await admin.auth().getUserByEmail(userEmail)

    // Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: 'admin',
    })

    // Update Firestore
    const db = admin.firestore()
    await db.collection('users').doc(userRecord.uid).update({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log('✅ Admin role assigned successfully!')
    console.log(`📧 User: ${userEmail}`)
    console.log('🔑 Custom claims set: { admin: true, role: "admin" }')
    console.log('📄 Firestore document updated')
    console.log('')
    console.log('🎉 The user can now access the admin dashboard!')
  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message)

    if (error.code === 'auth/user-not-found') {
      console.log('')
      console.log('💡 User not found. Make sure to:')
      console.log('1. Create the user account through your app first')
      console.log('2. Use the exact email address used during registration')
    }
  }
}

// Get user email from command line arguments
const userEmail = process.argv[2]

if (!userEmail) {
  console.log('❌ Please provide a user email as an argument')
  console.log('Usage: node setup-admin-secure.js <user-email>')
  console.log('Example: node setup-admin-secure.js admin@feelingcare.com')
  process.exit(1)
}

setupSecureAdmin(userEmail)
