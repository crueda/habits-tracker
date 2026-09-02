import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { HabitIconName } from '../types'
import { HABIT_ICON_GROUPS, HABIT_ICON_OPTIONS, HabitIcon, isHabitIconName } from './habit-icons'

const LEGACY_ICON_NAMES: HabitIconName[] = [
  'piano', 'dumbbell', 'languages', 'waves', 'book-open', 'footprints',
  'bike', 'brain', 'music', 'coffee', 'person-standing', 'target',
]

describe('habit icon catalog', () => {
  it('offers at least forty unique choices across useful categories', () => {
    const ids = HABIT_ICON_OPTIONS.map((option) => option.id)
    const labels = HABIT_ICON_OPTIONS.map((option) => option.label)

    expect(HABIT_ICON_GROUPS.map((group) => group.label)).toEqual([
      'Movimiento', 'Bienestar', 'Aprendizaje y trabajo', 'Creatividad', 'Vida diaria',
    ])
    expect(HABIT_ICON_GROUPS.every((group) => group.options.length > 0)).toBe(true)
    expect(HABIT_ICON_OPTIONS).toHaveLength(41)
    expect(new Set(ids)).toHaveProperty('size', 41)
    expect(new Set(labels)).toHaveProperty('size', 41)
    expect(HABIT_ICON_OPTIONS).toContainEqual(expect.objectContaining({ id: 'bath', label: 'Baño' }))
  })

  it('retains every legacy identifier and validates every catalog choice', () => {
    expect(LEGACY_ICON_NAMES.every((name) => HABIT_ICON_OPTIONS.some((option) => option.id === name))).toBe(true)
    expect(HABIT_ICON_OPTIONS.every((option) => isHabitIconName(option.id))).toBe(true)
    expect(isHabitIconName('not-a-habit-icon')).toBe(false)
  })

  it('falls back to the target icon for an unknown identifier', () => {
    render(<HabitIcon name={'unknown' as HabitIconName} data-testid="fallback-icon" />)
    expect(screen.getByTestId('fallback-icon')).toHaveClass('lucide-target')
  })
})
