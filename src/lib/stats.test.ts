import { describe, expect, it } from 'vitest'
import type { HabitType, TimeEntry } from '../types'
import { dailyAchievement, heatmapLevel, heatmapWeeks, isAchieved } from './stats'

const habits: HabitType[] = [
  {
    id: 'piano', name: 'Piano', icon: 'piano', color: '#e57542', slotMinutes: 15, targetSlots: 2,
    order: 0, createdAt: '2026-09-01T08:00:00.000Z', updatedAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'fuerza', name: 'Fuerza', icon: 'dumbbell', color: '#4d8b63', slotMinutes: 20, targetSlots: 1,
    order: 1, createdAt: '2026-09-01T08:00:00.000Z', updatedAt: '2026-09-01T08:00:00.000Z',
  },
]

function entry(habitTypeId: string, slots: number): TimeEntry {
  return {
    id: `${habitTypeId}_2026-09-02`, habitTypeId, date: '2026-09-02', slots,
    createdAt: '2026-09-02T08:00:00.000Z', updatedAt: '2026-09-02T08:00:00.000Z',
  }
}

describe('slot progress', () => {
  it('requires the configured number of slots', () => {
    expect(isAchieved(habits[0], [entry('piano', 1)], '2026-09-02')).toBe(false)
    expect(isAchieved(habits[0], [entry('piano', 2)], '2026-09-02')).toBe(true)
  })

  it('summarizes achieved habits, slots, and minutes', () => {
    expect(dailyAchievement(habits, [entry('piano', 2), entry('fuerza', 1)], '2026-09-02')).toEqual({
      achieved: 2, total: 2, percentage: 100, totalSlots: 3, totalMinutes: 50,
    })
  })

  it('maps ratios to four non-empty heat levels', () => {
    expect([0, 1, 2, 3, 4].map((value) => heatmapLevel(value, 4))).toEqual([0, 1, 2, 3, 4])
  })

  it('builds sixteen Monday-aligned weeks ending at today', () => {
    const weeks = heatmapWeeks('2026-09-02')
    expect(weeks).toHaveLength(16)
    expect(weeks[0]?.[0]).toBe('2026-05-18')
    expect(weeks.at(-1)?.[2]).toBe('2026-09-02')
    expect(weeks.at(-1)?.[3]).toBeUndefined()
  })
})
