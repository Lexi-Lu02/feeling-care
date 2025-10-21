// src/services/userManagementService.js
import { getAuth } from 'firebase/auth'

export const userManagementService = {
  async getUsers() {
    try {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error('User not authenticated')
      }

      // Get the ID token for authentication
      const token = await user.getIdToken()

      // Use the correct Firebase Functions URL format
      const response = await fetch(
        'https://us-central1-assignment3-lanxin-lu-33912645.cloudfunctions.net/listUsers',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (err) {
      console.error('Error fetching users:', err)
      return []
    }
  },
}
