import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  AppSnapshot,
  BackupData,
  HabitType,
  HabitTypeDraft,
  LocalDate,
  Preferences,
  SyncStatus,
  TimeEntry,
} from '../types'
import { DEFAULT_PREFERENCES } from '../types'
import { entryId } from '../lib/stats'
import {
  loadSnapshot,
  replaceWithBackup,
  saveEntry,
  saveHabitType,
  saveHabitTypes,
  savePreferences,
} from '../data/local-db'
import type { CloudSync as CloudSyncInstance } from '../data/cloud-sync'

interface SyncState {
  status: SyncStatus
  detail?: string
}

interface HabitsContextValue extends AppSnapshot {
  ready: boolean
  sync: SyncState
  createHabitType: (draft: HabitTypeDraft) => Promise<void>
  updateHabitType: (id: string, draft: HabitTypeDraft) => Promise<void>
  archiveHabitType: (id: string) => Promise<void>
  restoreHabitType: (id: string) => Promise<void>
  deleteHabitType: (id: string) => Promise<void>
  reorderHabitTypes: (orderedIds: string[]) => Promise<void>
  saveTimeEntry: (habitTypeId: string, date: LocalDate, slots: number) => Promise<void>
  updatePreferences: (preferences: Preferences) => Promise<void>
  importBackup: (backup: BackupData) => Promise<void>
  retrySync: () => Promise<void>
}

const HabitsContext = createContext<HabitsContextValue | undefined>(undefined)

function upsert<T extends { id: string }>(items: T[], value: T): T[] {
  return items.some((item) => item.id === value.id)
    ? items.map((item) => (item.id === value.id ? value : item))
    : [...items, value]
}

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<AppSnapshot>({
    habitTypes: [],
    entries: [],
    preferences: DEFAULT_PREFERENCES,
  })
  const snapshotRef = useRef(snapshot)
  const [ready, setReady] = useState(false)
  const [sync, setSync] = useState<SyncState>({ status: 'local-only' })
  const cloudRef = useRef<CloudSyncInstance | undefined>(undefined)

  const updateSnapshot = useCallback((updater: (current: AppSnapshot) => AppSnapshot) => {
    setSnapshot((current) => {
      const next = updater(current)
      snapshotRef.current = next
      return next
    })
  }, [])

  useEffect(() => {
    let active = true
    void loadSnapshot().then(async (initial) => {
      if (!active) return
      snapshotRef.current = initial
      setSnapshot(initial)
      setReady(true)

      const { CloudSync } = await import('../data/cloud-sync')
      if (!active) return
      const cloud = new CloudSync({
        onRecords: async () => {
          const latest = await loadSnapshot()
          if (active) updateSnapshot(() => latest)
        },
        onStatus: (status, detail) => {
          if (active) setSync({ status, detail })
        },
      })
      cloudRef.current = cloud
      cloud.start()
    })

    return () => {
      active = false
      cloudRef.current?.stop()
    }
  }, [updateSnapshot])

  const notifyCloud = useCallback(() => {
    void cloudRef.current?.notifyLocalChange()
  }, [])

  const createHabitType = useCallback(async (draft: HabitTypeDraft) => {
    const now = new Date().toISOString()
    const nextOrder = Math.max(-1, ...snapshotRef.current.habitTypes.map((habit) => habit.order)) + 1
    const habit: HabitType = {
      id: crypto.randomUUID(),
      ...draft,
      name: draft.name.trim(),
      order: nextOrder,
      createdAt: now,
      updatedAt: now,
    }
    await saveHabitType(habit)
    updateSnapshot((current) => ({ ...current, habitTypes: upsert(current.habitTypes, habit) }))
    notifyCloud()
  }, [notifyCloud, updateSnapshot])

  const updateHabitType = useCallback(async (id: string, draft: HabitTypeDraft) => {
    const current = snapshotRef.current.habitTypes.find((habit) => habit.id === id)
    if (!current) return
    const habit: HabitType = {
      ...current,
      ...draft,
      name: draft.name.trim(),
      updatedAt: new Date().toISOString(),
    }
    await saveHabitType(habit)
    updateSnapshot((state) => ({ ...state, habitTypes: upsert(state.habitTypes, habit) }))
    notifyCloud()
  }, [notifyCloud, updateSnapshot])

  const patchHabitType = useCallback(async (id: string, patch: Partial<HabitType>) => {
    const current = snapshotRef.current.habitTypes.find((habit) => habit.id === id)
    if (!current) return
    const habit: HabitType = { ...current, ...patch, updatedAt: new Date().toISOString() }
    await saveHabitType(habit)
    updateSnapshot((state) => ({ ...state, habitTypes: upsert(state.habitTypes, habit) }))
    notifyCloud()
  }, [notifyCloud, updateSnapshot])

  const archiveHabitType = useCallback(
    (id: string) => patchHabitType(id, { archivedAt: new Date().toISOString() }),
    [patchHabitType],
  )

  const restoreHabitType = useCallback(
    (id: string) => patchHabitType(id, { archivedAt: undefined }),
    [patchHabitType],
  )

  const deleteHabitType = useCallback(async (id: string) => {
    const current = snapshotRef.current.habitTypes.find((habit) => habit.id === id)
    if (!current) return
    const now = new Date().toISOString()
    const habit: HabitType = { ...current, deletedAt: now, updatedAt: now }
    const deletedEntries = snapshotRef.current.entries
      .filter((entry) => entry.habitTypeId === id && !entry.deletedAt)
      .map<TimeEntry>((entry) => ({ ...entry, slots: 0, deletedAt: now, updatedAt: now }))
    await saveHabitType(habit)
    await Promise.all(deletedEntries.map((entry) => saveEntry(entry)))
    updateSnapshot((state) => ({
      ...state,
      habitTypes: upsert(state.habitTypes, habit),
      entries: deletedEntries.reduce(upsert, state.entries),
    }))
    notifyCloud()
  }, [notifyCloud, updateSnapshot])

  const reorderHabitTypes = useCallback(async (orderedIds: string[]) => {
    const now = new Date().toISOString()
    const positions = new Map(orderedIds.map((id, order) => [id, order]))
    const changed = snapshotRef.current.habitTypes
      .filter((habit) => positions.has(habit.id) && habit.order !== positions.get(habit.id))
      .map((habit) => ({ ...habit, order: positions.get(habit.id)!, updatedAt: now }))
    if (!changed.length) return
    await saveHabitTypes(changed)
    updateSnapshot((state) => ({
      ...state,
      habitTypes: changed.reduce(upsert, state.habitTypes),
    }))
    notifyCloud()
  }, [notifyCloud, updateSnapshot])

  const saveTimeEntry = useCallback(async (habitTypeId: string, date: LocalDate, slots: number) => {
    const id = entryId(habitTypeId, date)
    const existing = snapshotRef.current.entries.find((entry) => entry.id === id)
    const now = new Date().toISOString()
    const normalizedSlots = Number.isFinite(slots) ? Math.min(96, Math.max(0, Math.round(slots))) : 0
    const entry: TimeEntry = {
      id,
      habitTypeId,
      date,
      slots: normalizedSlots,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      deletedAt: normalizedSlots > 0 ? undefined : now,
    }
    await saveEntry(entry)
    updateSnapshot((state) => ({ ...state, entries: upsert(state.entries, entry) }))
    notifyCloud()
  }, [notifyCloud, updateSnapshot])

  const updatePreferences = useCallback(async (preferences: Preferences) => {
    await savePreferences(preferences)
    updateSnapshot((state) => ({ ...state, preferences }))
  }, [updateSnapshot])

  const importBackup = useCallback(async (backup: BackupData) => {
    await replaceWithBackup(backup)
    const latest = await loadSnapshot()
    updateSnapshot(() => latest)
    notifyCloud()
  }, [notifyCloud, updateSnapshot])

  const value = useMemo<HabitsContextValue>(() => ({
    ...snapshot,
    ready,
    sync,
    createHabitType,
    updateHabitType,
    archiveHabitType,
    restoreHabitType,
    deleteHabitType,
    reorderHabitTypes,
    saveTimeEntry,
    updatePreferences,
    importBackup,
    retrySync: async () => cloudRef.current?.retry(),
  }), [
    snapshot,
    ready,
    sync,
    createHabitType,
    updateHabitType,
    archiveHabitType,
    restoreHabitType,
    deleteHabitType,
    reorderHabitTypes,
    saveTimeEntry,
    updatePreferences,
    importBackup,
  ])

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
}

// The context and hook share this module to encapsulate the persistence lifecycle.
// eslint-disable-next-line react-refresh/only-export-components
export function useHabits() {
  const value = useContext(HabitsContext)
  if (!value) throw new Error('useHabits must be used inside HabitsProvider')
  return value
}
