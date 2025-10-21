// Simple migration runner - can be called from browser console
import { migratePostsToFirestore, checkMigrationStatus } from '../services/postMigration'
import { getAllPosts } from '../services/firestoreBlogService'

// Make functions available globally for console access
window.runMigration = async () => {
  console.log('🚀 Starting manual migration...')
  try {
    const status = await checkMigrationStatus()
    console.log('Migration status:', status)

    if (status.needsMigration) {
      console.log('Running posts migration...')
      const result = await migratePostsToFirestore()
      if (result.success) {
        console.log('✅ Migration completed successfully!')
        console.log('Posts should now be visible on the Information & Resources page.')
      } else {
        console.error('❌ Migration failed:', result.message)
      }
    } else {
      console.log(`✅ Posts already migrated. Found ${status.postCount} posts.`)
    }
  } catch (error) {
    console.error('❌ Error during migration:', error)
  }
}

window.debugPosts = async () => {
  console.log('🔍 Debugging posts...')
  try {
    const posts = await getAllPosts()
    console.log('Posts from Firestore:', posts)
    console.log('Number of posts:', posts.length)
    console.log(
      'Published posts:',
      posts.filter((p) => p.status === 'published'),
    )
  } catch (error) {
    console.error('❌ Error fetching posts:', error)
  }
}

window.checkMigration = async () => {
  try {
    const status = await checkMigrationStatus()
    console.log('Migration status:', status)
    return status
  } catch (error) {
    console.error('Error checking migration:', error)
  }
}

console.log('📝 Migration utilities loaded!')
console.log('Run window.runMigration() to migrate posts')
console.log('Run window.checkMigration() to check migration status')
console.log('Run window.debugPosts() to debug posts loading')
