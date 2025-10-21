import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebaseInit'

// Image upload service
export const imageUploadService = {
  // Upload image to Firebase Storage (with fallback to base64)
  async uploadImage(file, path = 'blog-images') {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      // Validate file size (max 5MB for base64 fallback, 10MB for storage)
      const maxSize = 5 * 1024 * 1024 // 5MB for base64 fallback
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB')
      }

      // Check if we're in development mode and skip Firebase Storage if CORS issues
      const isDevelopment =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

      if (isDevelopment) {
        console.log('Development mode detected, using base64 encoding to avoid CORS issues')
        const base64Data = await this.getImagePreview(file)
        return {
          success: true,
          url: base64Data,
          fileName: file.name,
          path: null,
          method: 'base64',
        }
      }

      // Try Firebase Storage first (for production)
      try {
        console.log('Attempting to upload to Firebase Storage...')

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = file.name.split('.').pop()
        const fileName = `${timestamp}_${randomString}.${fileExtension}`

        console.log('Generated filename:', fileName)

        // Create storage reference
        const storageRef = ref(storage, `${path}/${fileName}`)
        console.log('Storage reference created:', storageRef.fullPath)

        // Upload file
        console.log('Starting file upload...')
        const snapshot = await uploadBytes(storageRef, file)
        console.log('Upload successful, getting download URL...')

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref)
        console.log('Download URL obtained:', downloadURL)

        return {
          success: true,
          url: downloadURL,
          fileName: fileName,
          path: `${path}/${fileName}`,
          method: 'storage',
        }
      } catch (storageError) {
        console.error('Firebase Storage upload failed:', storageError)
        console.warn('Using base64 fallback due to storage error:', storageError.message)

        // Fallback to base64 encoding
        const base64Data = await this.getImagePreview(file)

        return {
          success: true,
          url: base64Data,
          fileName: file.name,
          path: null,
          method: 'base64',
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },

  // Delete image from Firebase Storage (or skip for base64)
  async deleteImage(imagePath) {
    try {
      if (!imagePath) return { success: true }

      // If it's a base64 image, no need to delete from storage
      if (imagePath.startsWith('data:')) {
        return { success: true }
      }

      const imageRef = ref(storage, imagePath)
      await deleteObject(imageRef)

      return { success: true }
    } catch (error) {
      console.error('Error deleting image:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },

  // Validate image file
  validateImageFile(file) {
    const errors = []

    // Check if file exists
    if (!file) {
      errors.push('No file selected')
      return { isValid: false, errors }
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      errors.push('File must be an image (JPG, PNG, GIF, etc.)')
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      errors.push('File size must be less than 10MB')
    }

    // Check file name length
    if (file.name.length > 100) {
      errors.push('File name must be less than 100 characters')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  // Get image preview URL
  getImagePreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
  },
}
