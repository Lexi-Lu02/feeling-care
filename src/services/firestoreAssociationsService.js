import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore'
import { db } from './firebaseInit'
import { ref } from 'vue'

// Reactive associations data
export const allAssociations = ref([])
export const isLoading = ref(false)
export const error = ref(null)

let associationsUnsubscribe = null

// Initialize real-time listener for associations
export const initializeAssociationsListener = () => {
  if (associationsUnsubscribe) {
    associationsUnsubscribe()
  }

  isLoading.value = true
  error.value = null

  const associationsQuery = query(collection(db, 'associations'), orderBy('name', 'asc'))

  associationsUnsubscribe = onSnapshot(
    associationsQuery,
    (snapshot) => {
      allAssociations.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      isLoading.value = false
    },
    (err) => {
      console.error('Error listening to associations:', err)
      error.value = err.message
      isLoading.value = false
    },
  )
}

// Clean up associations listener
export const cleanupAssociationsListener = () => {
  if (associationsUnsubscribe) {
    associationsUnsubscribe()
    associationsUnsubscribe = null
  }
}

// Get all associations
export const getAllAssociations = async () => {
  try {
    isLoading.value = true
    const associationsQuery = query(collection(db, 'associations'), orderBy('name', 'asc'))
    const snapshot = await getDocs(associationsQuery)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (err) {
    console.error('Error fetching associations:', err)
    error.value = err.message
    return []
  } finally {
    isLoading.value = false
  }
}

// Get associations by focus area
export const getAssociationsByFocus = async (focus) => {
  try {
    isLoading.value = true
    const associationsQuery = query(
      collection(db, 'associations'),
      where('focus', '==', focus),
      orderBy('name', 'asc'),
    )
    const snapshot = await getDocs(associationsQuery)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (err) {
    console.error('Error fetching associations by focus:', err)
    error.value = err.message
    return []
  } finally {
    isLoading.value = false
  }
}

// Search associations
export const searchAssociations = async (searchTerm) => {
  try {
    const allAssociationsData = await getAllAssociations()
    const searchLower = searchTerm.toLowerCase()

    return allAssociationsData.filter(
      (association) =>
        association.name.toLowerCase().includes(searchLower) ||
        association.description.toLowerCase().includes(searchLower) ||
        association.suburb.toLowerCase().includes(searchLower) ||
        association.focus.toLowerCase().includes(searchLower) ||
        association.services.some((service) => service.toLowerCase().includes(searchLower)),
    )
  } catch (err) {
    console.error('Error searching associations:', err)
    error.value = err.message
    return []
  }
}

// Create new association (admin only)
export const createAssociation = async (associationData) => {
  try {
    isLoading.value = true
    const docRef = await addDoc(collection(db, 'associations'), {
      ...associationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { success: true, id: docRef.id }
  } catch (err) {
    console.error('Error creating association:', err)
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    isLoading.value = false
  }
}

// Update association (admin only)
export const updateAssociation = async (id, associationData) => {
  try {
    isLoading.value = true
    const associationRef = doc(db, 'associations', id)
    await updateDoc(associationRef, {
      ...associationData,
      updatedAt: new Date(),
    })
    return { success: true }
  } catch (err) {
    console.error('Error updating association:', err)
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    isLoading.value = false
  }
}

// Delete association (admin only)
export const deleteAssociation = async (id) => {
  try {
    isLoading.value = true
    await deleteDoc(doc(db, 'associations', id))
    return { success: true }
  } catch (err) {
    console.error('Error deleting association:', err)
    error.value = err.message
    return { success: false, error: err.message }
  } finally {
    isLoading.value = false
  }
}
