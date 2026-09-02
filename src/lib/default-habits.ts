import type { HabitType } from '../types'

type HabitSeed = Pick<HabitType, 'id' | 'name' | 'icon' | 'color'>

const DIARY_SEED: HabitSeed = {
  id: 'default-diario',
  name: 'Diario',
  icon: 'notebook-pen',
  color: '#b85c70',
}

export const INITIAL_HABIT_SEEDS: ReadonlyArray<HabitSeed> = [
  { id: 'default-piano', name: 'Piano', icon: 'piano', color: '#e57542' },
  { id: 'default-fuerza', name: 'Fuerza', icon: 'dumbbell', color: '#4d8b63' },
  { id: 'default-japones', name: 'Japonés', icon: 'languages', color: '#6672a5' },
  { id: 'default-piscina', name: 'Piscina', icon: 'waves', color: '#3f7c85' },
  DIARY_SEED,
]

const UPGRADE_HABIT_SEEDS: ReadonlyArray<HabitSeed> = [DIARY_SEED]

export function missingDefaultHabits(existing: HabitType[], hasSeededDefaults: boolean, now: string): HabitType[] {
  const existingIds = new Set(existing.map((habit) => habit.id))
  const candidates = hasSeededDefaults ? UPGRADE_HABIT_SEEDS : INITIAL_HABIT_SEEDS
  let nextOrder = Math.max(-1, ...existing.map((habit) => habit.order)) + 1

  return candidates
    .filter((seed) => !existingIds.has(seed.id))
    .map((seed) => ({
      ...seed,
      slotMinutes: 15,
      targetSlots: 1,
      order: nextOrder++,
      createdAt: now,
      updatedAt: now,
    }))
}
