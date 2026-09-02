import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type {
  AppSnapshot, BackupData, HabitType, PendingOperation, Preferences, SyncEntity, TimeEntry,
} from '../types'
import { DEFAULT_PREFERENCES } from '../types'

interface RitmoDatabase extends DBSchema {
  habitTypes: { key: string; value: HabitType }
  entries: { key: string; value: TimeEntry; indexes: { 'by-habit': string; 'by-date': string } }
  preferences: { key: 'current'; value: Preferences }
  queue: { key: string; value: PendingOperation; indexes: { 'by-queued-at': string } }
}

const SEED_HABITS: ReadonlyArray<Pick<HabitType, 'id' | 'name' | 'icon' | 'color'>> = [
  { id: 'default-piano', name: 'Piano', icon: 'piano', color: '#e57542' },
  { id: 'default-fuerza', name: 'Fuerza', icon: 'dumbbell', color: '#4d8b63' },
  { id: 'default-japones', name: 'Japonés', icon: 'languages', color: '#6672a5' },
  { id: 'default-piscina', name: 'Piscina', icon: 'waves', color: '#3f7c85' },
]

let databasePromise: Promise<IDBPDatabase<RitmoDatabase>> | undefined

function database() {
  databasePromise ??= openDB<RitmoDatabase>('ritmo-habits', 2, {
    upgrade(db) {
      for (const oldName of ['habits', 'completions', 'habitTypes', 'entries', 'preferences', 'queue']) {
        if (db.objectStoreNames.contains(oldName as never)) db.deleteObjectStore(oldName as never)
      }
      db.createObjectStore('habitTypes', { keyPath: 'id' })
      const entries = db.createObjectStore('entries', { keyPath: 'id' })
      entries.createIndex('by-habit', 'habitTypeId')
      entries.createIndex('by-date', 'date')
      db.createObjectStore('preferences')
      const queue = db.createObjectStore('queue', { keyPath: 'id' })
      queue.createIndex('by-queued-at', 'queuedAt')
    },
  })
  return databasePromise
}

function pending(entity: SyncEntity, recordId: string): PendingOperation {
  return { id: `${entity}:${recordId}`, entity, recordId, queuedAt: new Date().toISOString() }
}

async function seedIfNeeded(db: IDBPDatabase<RitmoDatabase>): Promise<void> {
  const stored = await db.get('preferences', 'current')
  const preferences = stored ?? DEFAULT_PREFERENCES
  if (preferences.hasSeededDefaults) return

  const transaction = db.transaction(['habitTypes', 'preferences', 'queue'], 'readwrite')
  const now = new Date().toISOString()
  for (const [order, seed] of SEED_HABITS.entries()) {
    const habit: HabitType = {
      ...seed,
      slotMinutes: 15,
      targetSlots: 1,
      order,
      createdAt: now,
      updatedAt: now,
    }
    await transaction.objectStore('habitTypes').put(habit)
    await transaction.objectStore('queue').put(pending('habitType', habit.id))
  }
  await transaction.objectStore('preferences').put({ ...preferences, hasSeededDefaults: true }, 'current')
  await transaction.done
}

export async function loadSnapshot(): Promise<AppSnapshot> {
  const db = await database()
  await seedIfNeeded(db)
  const [habitTypes, entries, preferences] = await Promise.all([
    db.getAll('habitTypes'), db.getAll('entries'), db.get('preferences', 'current'),
  ])
  return { habitTypes, entries, preferences: preferences ?? { ...DEFAULT_PREFERENCES, hasSeededDefaults: true } }
}

export async function saveHabitType(habit: HabitType, queue = true): Promise<void> {
  const db = await database()
  const transaction = db.transaction(['habitTypes', 'queue'], 'readwrite')
  await transaction.objectStore('habitTypes').put(habit)
  if (queue) await transaction.objectStore('queue').put(pending('habitType', habit.id))
  await transaction.done
}

export async function saveHabitTypes(habits: HabitType[], queue = true): Promise<void> {
  const db = await database()
  const transaction = db.transaction(['habitTypes', 'queue'], 'readwrite')
  for (const habit of habits) {
    await transaction.objectStore('habitTypes').put(habit)
    if (queue) await transaction.objectStore('queue').put(pending('habitType', habit.id))
  }
  await transaction.done
}

export async function saveEntry(entry: TimeEntry, queue = true): Promise<void> {
  const db = await database()
  const transaction = db.transaction(['entries', 'queue'], 'readwrite')
  await transaction.objectStore('entries').put(entry)
  if (queue) await transaction.objectStore('queue').put(pending('entry', entry.id))
  await transaction.done
}

export async function savePreferences(preferences: Preferences): Promise<void> {
  await (await database()).put('preferences', preferences, 'current')
}

export async function getPendingOperations(): Promise<PendingOperation[]> {
  return (await database()).getAllFromIndex('queue', 'by-queued-at')
}

export async function removePendingOperation(id: string): Promise<void> {
  await (await database()).delete('queue', id)
}

export async function getRecord(entity: SyncEntity, id: string): Promise<HabitType | TimeEntry | undefined> {
  const db = await database()
  return entity === 'habitType' ? db.get('habitTypes', id) : db.get('entries', id)
}

export async function mergeRemoteRecords(entity: SyncEntity, records: Array<HabitType | TimeEntry>): Promise<boolean> {
  const db = await database()
  let changed = false
  if (entity === 'habitType') {
    const transaction = db.transaction('habitTypes', 'readwrite')
    for (const record of records as HabitType[]) {
      const local = await transaction.store.get(record.id)
      if (!local || record.updatedAt > local.updatedAt) {
        await transaction.store.put(record)
        changed = true
      }
    }
    await transaction.done
  } else {
    const transaction = db.transaction('entries', 'readwrite')
    for (const record of records as TimeEntry[]) {
      const local = await transaction.store.get(record.id)
      if (!local || record.updatedAt > local.updatedAt) {
        await transaction.store.put(record)
        changed = true
      }
    }
    await transaction.done
  }
  return changed
}

export async function replaceWithBackup(backup: BackupData): Promise<void> {
  const db = await database()
  const current = await loadSnapshot()
  const transaction = db.transaction(['habitTypes', 'entries', 'preferences', 'queue'], 'readwrite')
  const habitStore = transaction.objectStore('habitTypes')
  const entryStore = transaction.objectStore('entries')
  const queueStore = transaction.objectStore('queue')
  const now = new Date().toISOString()
  await Promise.all([habitStore.clear(), entryStore.clear(), queueStore.clear()])

  const importedHabitIds = new Set(backup.habitTypes.map((habit) => habit.id))
  const importedEntryIds = new Set(backup.entries.map((entry) => entry.id))
  for (const habit of backup.habitTypes) {
    const imported = { ...habit, updatedAt: now, deletedAt: undefined }
    await habitStore.put(imported)
    await queueStore.put(pending('habitType', imported.id))
  }
  for (const entry of backup.entries) {
    const imported = { ...entry, updatedAt: now, deletedAt: undefined }
    await entryStore.put(imported)
    await queueStore.put(pending('entry', imported.id))
  }
  for (const habit of current.habitTypes.filter((item) => !importedHabitIds.has(item.id))) {
    const tombstone: HabitType = { ...habit, updatedAt: now, deletedAt: now }
    await habitStore.put(tombstone)
    await queueStore.put(pending('habitType', tombstone.id))
  }
  for (const entry of current.entries.filter((item) => !importedEntryIds.has(item.id))) {
    const tombstone: TimeEntry = { ...entry, slots: 0, updatedAt: now, deletedAt: now }
    await entryStore.put(tombstone)
    await queueStore.put(pending('entry', tombstone.id))
  }
  await transaction.objectStore('preferences').put({ ...backup.preferences, hasSeededDefaults: true }, 'current')
  await transaction.done
}
