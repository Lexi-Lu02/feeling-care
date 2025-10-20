// src/services/userManagementService.js
export const userManagementService = {
  async getUsers() {
    try {
      // ⚙️ Replace with YOUR deployed Cloud Function URL
      const response = await fetch('https://listusers-rfheamm3sa-uc.a.run.app')
      if (!response.ok) throw new Error('Failed to fetch users')
      return await response.json()
    } catch (err) {
      console.error('Error fetching users:', err)
      return []
    }
  },
}
