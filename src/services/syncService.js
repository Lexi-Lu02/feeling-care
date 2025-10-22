import { onOnline, dequeueAll, enqueueSync } from './offlineService'
import { saveEmailEventToCloud, saveJournalEntryToCloud } from './userDataService'

async function processOne(task) {
  if (!task || !task.type) return
  if (task.type === 'email') {
    await saveEmailEventToCloud(task.payload)
  } else if (task.type === 'journal') {
    await saveJournalEntryToCloud(task.payload)
  }
}

export async function processSyncQueue() {
  const tasks = dequeueAll()
  for (const t of tasks) {
    try {
      await processOne(t)
    } catch (e) {
      // put back to queue if still failing
      enqueueSync(t)
    }
  }
}

export function initializeOfflineSync() {
  // try once on startup
  processSyncQueue()
  // when connection comes back
  onOnline(() => {
    processSyncQueue()
  })
}
