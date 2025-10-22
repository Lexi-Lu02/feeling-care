// Firestore helpers for user-specific data (journals and email history)
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore'
import { firebaseAuthService } from './firebaseService'

const db = getFirestore()

function requireUid() {
  const uid = firebaseAuthService.getUserId()
  if (!uid) throw new Error('User not authenticated')
  return uid
}

export async function saveEmailEventToCloud(event) {
  const uid = requireUid()
  const ref = collection(db, 'users', uid, 'emailEvents')
  await addDoc(ref, {
    to: event.to,
    subject: event.subject || '',
    status: event.status || 'sent',
    createdAt: serverTimestamp(),
    clientTs: event.timestamp || Date.now(),
  })
}

export async function saveJournalEntryToCloud(entry) {
  const uid = requireUid()
  const ref = collection(db, 'users', uid, 'journalEntries')
  await addDoc(ref, {
    mood: entry.mood || null,
    content: entry.content || '',
    createdAt: serverTimestamp(),
    clientTs: entry.timestamp || Date.now(),
  })
}

export async function getAllEmailEventsFromCloud() {
  const uid = requireUid()
  const ref = collection(db, 'users', uid, 'emailEvents')
  const q = query(ref, orderBy('clientTs', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getAllJournalEntriesFromCloud() {
  const uid = requireUid()
  const ref = collection(db, 'users', uid, 'journalEntries')
  const q = query(ref, orderBy('clientTs', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
