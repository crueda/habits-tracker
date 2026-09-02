import type { HabitType, LocalDate, TimeEntry } from '../types'
import { addDays, dateRange, mondayIndex, toLocalDate } from './dates'

export function entryId(habitTypeId: string, date: LocalDate): string {
  return `${habitTypeId}_${date}`
}

export function entryFor(entries: TimeEntry[], habitTypeId: string, date: LocalDate): TimeEntry | undefined {
  return entries.find((entry) => entry.id === entryId(habitTypeId, date) && !entry.deletedAt && entry.slots > 0)
}

export function isAchieved(habit: HabitType, entries: TimeEntry[], date: LocalDate): boolean {
  return (entryFor(entries, habit.id, date)?.slots ?? 0) >= habit.targetSlots
}

export function activeHabitTypes(habits: HabitType[]): HabitType[] {
  return habits
    .filter((habit) => !habit.deletedAt && !habit.archivedAt)
    .sort((left, right) => left.order - right.order || left.createdAt.localeCompare(right.createdAt))
}

export function visibleHabitTypes(habits: HabitType[]): HabitType[] {
  return habits
    .filter((habit) => !habit.deletedAt)
    .sort((left, right) => left.order - right.order || left.createdAt.localeCompare(right.createdAt))
}

export function dailyAchievement(habits: HabitType[], entries: TimeEntry[], date: LocalDate) {
  const trackable = visibleHabitTypes(habits)
  const achieved = trackable.filter((habit) => isAchieved(habit, entries, date)).length
  const percentage = trackable.length ? Math.round((achieved / trackable.length) * 100) : 0
  const totalSlots = trackable.reduce((sum, habit) => sum + (entryFor(entries, habit.id, date)?.slots ?? 0), 0)
  const totalMinutes = trackable.reduce(
    (sum, habit) => sum + (entryFor(entries, habit.id, date)?.slots ?? 0) * habit.slotMinutes,
    0,
  )
  return { achieved, total: trackable.length, percentage, totalSlots, totalMinutes }
}

export function heatmapLevel(achieved: number, total: number): 0 | 1 | 2 | 3 | 4 {
  if (!total || !achieved) return 0
  return Math.min(4, Math.max(1, Math.ceil((achieved / total) * 4))) as 1 | 2 | 3 | 4
}

export function heatmapWeeks(today = toLocalDate(), weekCount = 16): Array<Array<LocalDate | undefined>> {
  const currentMonday = addDays(today, -mondayIndex(today))
  const firstMonday = addDays(currentMonday, -(weekCount - 1) * 7)
  return Array.from({ length: weekCount }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const date = addDays(firstMonday, weekIndex * 7 + dayIndex)
      return date <= today ? date : undefined
    }),
  )
}

export function rangeAchievement(habits: HabitType[], entries: TimeEntry[], from: LocalDate, to: LocalDate) {
  const totals = dateRange(from, to).reduce(
    (sum, date) => {
      const daily = dailyAchievement(habits, entries, date)
      return { achieved: sum.achieved + daily.achieved, possible: sum.possible + daily.total }
    },
    { achieved: 0, possible: 0 },
  )
  return {
    ...totals,
    percentage: totals.possible ? Math.round((totals.achieved / totals.possible) * 100) : 0,
  }
}
