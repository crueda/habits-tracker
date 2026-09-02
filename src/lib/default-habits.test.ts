import { describe, expect, it } from 'vitest'
import type { HabitType } from '../types'
import { missingDefaultHabits } from './default-habits'

const NOW = '2026-09-02T20:00:00.000Z'

function existingDiary(patch: Partial<HabitType> = {}): HabitType {
  return {
    id: 'default-diario', name: 'Diario', icon: 'notebook-pen', color: '#b85c70',
    slotMinutes: 15, targetSlots: 1, order: 4, createdAt: NOW, updatedAt: NOW, ...patch,
  }
}

describe('default habit migration', () => {
  it('creates all five ordered defaults for a fresh installation', () => {
    const habits = missingDefaultHabits([], false, NOW)

    expect(habits.map((habit) => habit.name)).toEqual(['Piano', 'Fuerza', 'Japonés', 'Piscina', 'Diario'])
    expect(habits.map((habit) => habit.order)).toEqual([0, 1, 2, 3, 4])
    expect(habits.every((habit) => habit.slotMinutes === 15 && habit.targetSlots === 1)).toBe(true)
    expect(new Set(habits.map((habit) => habit.color))).toHaveProperty('size', 5)
  })

  it('appends Diario once after the current order for an existing installation', () => {
    const existing = [existingDiary({ id: 'custom', name: 'Personalizado', order: 8 })]
    const diary = missingDefaultHabits(existing, true, NOW)[0]!

    expect(diary).toMatchObject({ id: 'default-diario', name: 'Diario', icon: 'notebook-pen', order: 9 })
    expect(missingDefaultHabits([...existing, diary], true, NOW)).toEqual([])
  })

  it.each([
    ['active', {}],
    ['archived', { archivedAt: NOW }],
    ['deleted', { deletedAt: NOW }],
  ])('does not recreate an %s Diario record', (_state, patch) => {
    expect(missingDefaultHabits([existingDiary(patch)], true, NOW)).toEqual([])
  })
})
