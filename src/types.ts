export type LocalDate = `${number}-${number}-${number}`

export type HabitIconName =
  | 'piano'
  | 'dumbbell'
  | 'languages'
  | 'waves'
  | 'book-open'
  | 'footprints'
  | 'bike'
  | 'brain'
  | 'music'
  | 'coffee'
  | 'person-standing'
  | 'target'
  | 'activity'
  | 'apple'
  | 'bath'
  | 'bed-double'
  | 'briefcase'
  | 'broom'
  | 'calculator'
  | 'camera'
  | 'code'
  | 'dog'
  | 'droplets'
  | 'drum'
  | 'graduation-cap'
  | 'guitar'
  | 'heart-pulse'
  | 'house'
  | 'lightbulb'
  | 'moon'
  | 'mountain'
  | 'notebook-pen'
  | 'palette'
  | 'pen-line'
  | 'pill'
  | 'sport-shoe'
  | 'tree-pine'
  | 'trophy'
  | 'users'
  | 'utensils'
  | 'wallet-cards'

export interface HabitType {
  id: string
  name: string
  color: string
  icon: HabitIconName
  slotMinutes: number
  targetSlots: number
  order: number
  createdAt: string
  updatedAt: string
  archivedAt?: string
  deletedAt?: string
}

export interface TimeEntry {
  id: string
  habitTypeId: string
  date: LocalDate
  slots: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export type ThemePreference = 'system' | 'light' | 'dark'

export interface Preferences {
  theme: ThemePreference
  hasSeededDefaults: boolean
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'system',
  hasSeededDefaults: false,
}

export type SyncEntity = 'habitType' | 'entry'

export interface PendingOperation {
  id: string
  entity: SyncEntity
  recordId: string
  queuedAt: string
}

export type SyncStatus =
  | 'local-only'
  | 'connecting'
  | 'syncing'
  | 'synced'
  | 'offline'
  | 'error'

export interface AppSnapshot {
  habitTypes: HabitType[]
  entries: TimeEntry[]
  preferences: Preferences
}

export interface BackupData {
  format: 'ritmo-habits-backup'
  version: 2
  exportedAt: string
  habitTypes: HabitType[]
  entries: TimeEntry[]
  preferences: Preferences
}

export interface HabitTypeDraft {
  name: string
  color: string
  icon: HabitIconName
  slotMinutes: number
  targetSlots: number
}
