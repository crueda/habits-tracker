import type { AppSnapshot, BackupData, HabitType, LocalDate, Preferences, TimeEntry } from '../types'
import { formatDate, formatDuration, toLocalDate } from './dates'
import { isHabitIconName } from './habit-icons'
import { dailyAchievement, entryFor } from './stats'
import { LEGACY_BACKUP_FORMAT } from './compatibility'

const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const COLOR_PATTERN = /^#[0-9a-f]{6}$/i
const ID_PATTERN = /^[A-Za-z0-9_-]+$/

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

function isLocalDate(value: unknown): value is LocalDate {
  if (typeof value !== 'string' || !LOCAL_DATE_PATTERN.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(year, month - 1, day, 12)
  return toLocalDate(parsed) === value
}

function isIntegerWithin(value: unknown, minimum: number, maximum: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= maximum
}

function parseHabitType(value: unknown): HabitType | undefined {
  if (!isObject(value)) return
  if (
    typeof value.id !== 'string' || !ID_PATTERN.test(value.id)
    || typeof value.name !== 'string' || !value.name.trim() || value.name.length > 80
    || typeof value.color !== 'string' || !COLOR_PATTERN.test(value.color)
    || !isHabitIconName(value.icon)
    || !isIntegerWithin(value.slotMinutes, 1, 480)
    || !isIntegerWithin(value.targetSlots, 1, 96)
    || !isIntegerWithin(value.order, 0, 10_000)
    || !isTimestamp(value.createdAt)
    || !isTimestamp(value.updatedAt)
    || (value.archivedAt !== undefined && !isTimestamp(value.archivedAt))
  ) return

  return {
    id: value.id,
    name: value.name.trim(),
    color: value.color,
    icon: value.icon,
    slotMinutes: value.slotMinutes,
    targetSlots: value.targetSlots,
    order: value.order,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    ...(value.archivedAt ? { archivedAt: value.archivedAt } : {}),
  }
}

function parseEntry(value: unknown, habitIds: Set<string>): TimeEntry | undefined {
  if (!isObject(value)) return
  if (
    typeof value.id !== 'string' || !ID_PATTERN.test(value.id)
    || typeof value.habitTypeId !== 'string' || !habitIds.has(value.habitTypeId)
    || !isLocalDate(value.date)
    || !isIntegerWithin(value.slots, 0, 96)
    || !isTimestamp(value.createdAt)
    || !isTimestamp(value.updatedAt)
  ) return
  if (value.id !== `${value.habitTypeId}_${value.date}`) return
  return {
    id: value.id,
    habitTypeId: value.habitTypeId,
    date: value.date,
    slots: value.slots,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  }
}

function parsePreferences(value: unknown): Preferences | undefined {
  if (
    !isObject(value)
    || !['system', 'light', 'dark'].includes(String(value.theme))
    || typeof value.hasSeededDefaults !== 'boolean'
  ) return
  return { theme: value.theme as Preferences['theme'], hasSeededDefaults: value.hasSeededDefaults }
}

export function createBackup(snapshot: AppSnapshot): BackupData {
  const habitTypes = snapshot.habitTypes.filter((habit) => !habit.deletedAt)
  const habitIds = new Set(habitTypes.map((habit) => habit.id))
  return {
    format: LEGACY_BACKUP_FORMAT,
    version: 2,
    exportedAt: new Date().toISOString(),
    habitTypes,
    entries: snapshot.entries.filter((entry) => !entry.deletedAt && entry.slots > 0 && habitIds.has(entry.habitTypeId)),
    preferences: snapshot.preferences,
  }
}

export function parseBackup(value: unknown): BackupData {
  if (!isObject(value) || value.format !== LEGACY_BACKUP_FORMAT || value.version !== 2) {
    throw new Error('No es una copia de Agatsu compatible.')
  }
  if (!isTimestamp(value.exportedAt) || !Array.isArray(value.habitTypes) || !Array.isArray(value.entries)) {
    throw new Error('La copia está incompleta o dañada.')
  }

  const parsedHabits = value.habitTypes.map(parseHabitType)
  if (parsedHabits.some((habit) => !habit)) throw new Error('La copia contiene hábitos no válidos.')
  const habitTypes = parsedHabits as HabitType[]
  const habitIds = new Set(habitTypes.map((habit) => habit.id))
  if (habitIds.size !== habitTypes.length) throw new Error('La copia contiene hábitos duplicados.')

  const parsedEntries = value.entries.map((entry) => parseEntry(entry, habitIds))
  if (parsedEntries.some((entry) => !entry)) throw new Error('La copia contiene registros no válidos.')
  const entries = parsedEntries as TimeEntry[]
  if (new Set(entries.map((entry) => entry.id)).size !== entries.length) {
    throw new Error('La copia contiene registros duplicados.')
  }

  const preferences = parsePreferences(value.preferences)
  if (!preferences) throw new Error('La copia contiene preferencias no válidas.')
  return { format: LEGACY_BACKUP_FORMAT, version: 2, exportedAt: value.exportedAt, habitTypes, entries, preferences }
}

export function createMarkdownReport(snapshot: AppSnapshot): string {
  const today = toLocalDate()
  const visible = snapshot.habitTypes.filter((habit) => !habit.deletedAt)
  const daily = dailyAchievement(snapshot.habitTypes, snapshot.entries, today)
  const lines = [
    '# Mis hábitos — Agatsu',
    '',
    `Exportado el ${formatDate(today)}.`,
    '',
    `Hoy: ${daily.achieved} de ${daily.total} hábitos conseguidos (${daily.percentage}%).`,
    '',
  ]
  for (const habit of visible) {
    const entry = entryFor(snapshot.entries, habit.id, today)
    lines.push(
      `## ${habit.name}`,
      '',
      `- Estado: ${habit.archivedAt ? 'Archivado' : 'Activo'}`,
      `- Slot: ${formatDuration(habit.slotMinutes)}`,
      `- Objetivo: ${habit.targetSlots} ${habit.targetSlots === 1 ? 'slot' : 'slots'}`,
      `- Hoy: ${entry?.slots ?? 0} slots (${formatDuration((entry?.slots ?? 0) * habit.slotMinutes)})`,
      '',
    )
  }
  if (!visible.length) lines.push('_Todavía no hay hábitos._', '')
  return lines.join('\n')
}

export function downloadText(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}
