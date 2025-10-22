// Offline-first helpers: local storage, 30-day trimming, and sync queue

const LS_KEYS = {
  EMAILS: 'fc_local_email_events',
  JOURNALS: 'fc_local_journal_entries',
  QUEUE: 'fc_sync_queue',
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function trim30Days(items) {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  return items.filter((i) => (i.timestamp || i.clientTs || 0) >= cutoff)
}

export function addLocalEmailEvent(event) {
  const list = load(LS_KEYS.EMAILS, [])
  list.unshift({ ...event, timestamp: event.timestamp || Date.now() })
  // Trim to last 30 days and cap to last 100 records to save space
  const trimmed = trim30Days(list)
  save(LS_KEYS.EMAILS, trimmed.slice(0, 100))
}

export function addLocalJournalEntry(entry) {
  const list = load(LS_KEYS.JOURNALS, [])

  // Create date key for the entry
  const entryDate = new Date(entry.timestamp || Date.now())
  const dateKey = entryDate.toISOString().split('T')[0]

  // Check if there's already an entry for this date
  const existingIndex = list.findIndex((item) => {
    const itemDate = new Date(item.timestamp || item.clientTs || 0)
    const itemDateKey = itemDate.toISOString().split('T')[0]
    return itemDateKey === dateKey
  })

  // If entry exists for this date, replace it; otherwise add new one
  if (existingIndex >= 0) {
    list[existingIndex] = { ...entry, timestamp: entry.timestamp || Date.now(), dateKey }
  } else {
    list.unshift({ ...entry, timestamp: entry.timestamp || Date.now(), dateKey })
  }

  save(LS_KEYS.JOURNALS, trim30Days(list))
}

export function getLocalEmails() {
  return load(LS_KEYS.EMAILS, [])
}

export function getLocalJournals() {
  return load(LS_KEYS.JOURNALS, [])
}

export function clearDuplicateJournalEntries() {
  const list = load(LS_KEYS.JOURNALS, [])
  const uniqueEntries = []
  const seenDates = new Set()

  // Sort by timestamp (newest first) to keep the most recent entry for each date
  const sortedList = list.sort(
    (a, b) => (b.timestamp || b.clientTs || 0) - (a.timestamp || a.clientTs || 0),
  )

  for (const entry of sortedList) {
    const entryDate = new Date(entry.timestamp || entry.clientTs || 0)
    const dateKey = entryDate.toISOString().split('T')[0]

    if (!seenDates.has(dateKey)) {
      uniqueEntries.push(entry)
      seenDates.add(dateKey)
    }
  }

  save(LS_KEYS.JOURNALS, uniqueEntries)
  console.log(`Cleaned up duplicate entries. Kept ${uniqueEntries.length} unique entries.`)
}

export function enqueueSync(task) {
  const q = load(LS_KEYS.QUEUE, [])
  q.push({ ...task, enqueuedAt: Date.now() })
  save(LS_KEYS.QUEUE, q)
}

export function dequeueAll() {
  const q = load(LS_KEYS.QUEUE, [])
  save(LS_KEYS.QUEUE, [])
  return q
}

export function onOnline(callback) {
  window.addEventListener('online', callback)
}
