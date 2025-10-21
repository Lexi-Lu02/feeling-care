import {
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from './firebaseInit'
import { ref } from 'vue'

// Reactive posts data
export const allPosts = ref([])
export const isLoading = ref(false)
export const error = ref(null)

// Real-time listener for posts
let postsUnsubscribe = null

// Initialize posts listener
export const initializePostsListener = () => {
  if (postsUnsubscribe) {
    postsUnsubscribe() // Clean up existing listener
  }

  isLoading.value = true
  error.value = null

  const postsQuery = query(collection(db, 'posts'), orderBy('publishedAt', 'desc'))

  postsUnsubscribe = onSnapshot(
    postsQuery,
    (snapshot) => {
      allPosts.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to JavaScript dates
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
        publishedAt: doc.data().publishedAt?.toDate?.() || new Date(),
      }))
      isLoading.value = false
    },
    (err) => {
      console.error('Error listening to posts:', err)
      error.value = err.message
      isLoading.value = false
    },
  )
}

// Clean up listener
export const cleanupPostsListener = () => {
  if (postsUnsubscribe) {
    postsUnsubscribe()
    postsUnsubscribe = null
  }
}

// Get all posts (for non-reactive usage)
export const getAllPosts = async () => {
  try {
    isLoading.value = true
    const postsQuery = query(collection(db, 'posts'), orderBy('publishedAt', 'desc'))
    const snapshot = await getDocs(postsQuery)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      publishedAt: doc.data().publishedAt?.toDate?.() || new Date(),
    }))
  } catch (err) {
    console.error('Error fetching posts:', err)
    error.value = err.message
    return []
  } finally {
    isLoading.value = false
  }
}

// Get a single post by ID
export const getPostById = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', postId))
    if (postDoc.exists()) {
      return {
        id: postDoc.id,
        ...postDoc.data(),
        createdAt: postDoc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: postDoc.data().updatedAt?.toDate?.() || new Date(),
        publishedAt: postDoc.data().publishedAt?.toDate?.() || new Date(),
      }
    }
    return null
  } catch (err) {
    console.error('Error fetching post:', err)
    error.value = err.message
    return null
  }
}

// Create a new post (admin only)
export const createPost = async (postData) => {
  try {
    const newPost = {
      ...postData,
      status: postData.status || 'draft',
      featured: postData.featured || false,
      reviews: 0,
      averageRating: 0,
      ratingCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: postData.status === 'published' ? new Date() : null,
    }

    const docRef = await addDoc(collection(db, 'posts'), newPost)
    console.log('✅ Post created with ID:', docRef.id)
    return { success: true, id: docRef.id }
  } catch (err) {
    console.error('Error creating post:', err)
    return { success: false, error: err.message }
  }
}

// Update an existing post (admin only)
export const updatePost = async (postId, updateData) => {
  try {
    const postRef = doc(db, 'posts', postId)
    const updatePayload = {
      ...updateData,
      updatedAt: new Date(),
    }

    // If status is changing to published, set publishedAt
    if (updateData.status === 'published') {
      updatePayload.publishedAt = new Date()
    }

    await updateDoc(postRef, updatePayload)
    console.log('✅ Post updated:', postId)
    return { success: true }
  } catch (err) {
    console.error('Error updating post:', err)
    return { success: false, error: err.message }
  }
}

// Delete a post (admin only)
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId))
    console.log('✅ Post deleted:', postId)
    return { success: true }
  } catch (err) {
    console.error('Error deleting post:', err)
    return { success: false, error: err.message }
  }
}

// Get posts by status
export const getPostsByStatus = async (status) => {
  try {
    const postsQuery = query(
      collection(db, 'posts'),
      where('status', '==', status),
      orderBy('publishedAt', 'desc'),
    )
    const snapshot = await getDocs(postsQuery)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      publishedAt: doc.data().publishedAt?.toDate?.() || new Date(),
    }))
  } catch (err) {
    console.error('Error fetching posts by status:', err)
    return []
  }
}

// Get featured posts
export const getFeaturedPosts = async () => {
  try {
    const postsQuery = query(
      collection(db, 'posts'),
      where('featured', '==', true),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
    )
    const snapshot = await getDocs(postsQuery)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      publishedAt: doc.data().publishedAt?.toDate?.() || new Date(),
    }))
  } catch (err) {
    console.error('Error fetching featured posts:', err)
    return []
  }
}

// Search posts by title or content
export const searchPosts = async (searchTerm) => {
  try {
    const allPostsData = await getAllPosts()
    const searchLower = searchTerm.toLowerCase()

    return allPostsData.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  } catch (err) {
    console.error('Error searching posts:', err)
    return []
  }
}

// Utility function for image error handling
export const handleImageError = (event) => {
  event.target.style.display = 'none'
  const fallback = event.target.nextElementSibling
  if (fallback) {
    fallback.style.display = 'flex'
  }
}

// Format date for display
export const formatPostDate = (date) => {
  if (!date) return 'N/A'

  const dateObj = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

// Get posts by tag
export const getPostsByTag = async (tag) => {
  try {
    const allPostsData = await getAllPosts()
    return allPostsData.filter(
      (post) => post.tags && post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    )
  } catch (err) {
    console.error('Error fetching posts by tag:', err)
    return []
  }
}
