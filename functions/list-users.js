import admin from 'firebase-admin'

export async function onRequestGet(context) {
  try {
    const serviceAccount = JSON.parse(context.env.FIREBASE_SERVICE_ACCOUNT)

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    }

    const list = await admin.auth().listUsers(1000) // up to 1000 users
    const users = list.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
      disabled: user.disabled,
    }))

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (err) {
    console.error(' Error listing users:', err)
    return new Response(JSON.stringify({ error: 'Failed to list users: ' + err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
