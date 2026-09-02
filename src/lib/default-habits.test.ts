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

function existingOfuro(patch: Partial<HabitType> = {}): HabitType {
  return {
    id: 'default-ofuro', name: 'Ofuro', icon: 'bath', color: '#4d738b',
    slotMinutes: 15, targetSlots: 1, order: 5, createdAt: NOW, updatedAt: NOW, ...patch,
  }
}

describe('default habit migration', () => {
  it('creates all six ordered defaults for a fresh installation', () => {
    const habits = missingDefaultHabits([], false, NOW)

    expect(habits.map((habit) => habit.name)).toEqual(['Piano', 'Fuerza', 'Japonés', 'Piscina', 'Diario', 'Ofuro'])
    expect(habits.map((habit) => habit.order)).toEqual([0, 1, 2, 3, 4, 5])
    expect(habits.every((habit) => habit.slotMinutes === 15 && habit.targetSlots === 1)).toBe(true)
    expect(new Set(habits.map((habit) => habit.color))).toHaveProperty('size', 6)
  })

  it('appends missing later defaults once in release order', () => {
    const existing = [existingDiary({ id: 'custom', name: 'Personalizado', order: 8 })]
    const upgrades = missingDefaultHabits(existing, true, NOW)

    expect(upgrades).toEqual([
      expect.objectContaining({ id: 'default-diario', icon: 'notebook-pen', order: 9 }),
      expect.objectContaining({ id: 'default-ofuro', icon: 'bath', order: 10 }),
    ])
    expect(missingDefaultHabits([...existing, ...upgrades], true, NOW)).toEqual([])
  })

  it.each([
    ['active', {}],
    ['archived', { archivedAt: NOW }],
    ['deleted', { deletedAt: NOW }],
  ])('does not recreate an %s Ofuro record', (_state, patch) => {
    expect(missingDefaultHabits([existingDiary(), existingOfuro(patch)], true, NOW)).toEqual([])
  })
})
