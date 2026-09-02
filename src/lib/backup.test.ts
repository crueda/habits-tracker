import { describe, expect, it } from 'vitest'
import { createBackup, parseBackup } from './backup'
import type { AppSnapshot } from '../types'

const snapshot: AppSnapshot = {
  habitTypes: [{
    id: 'walk', name: 'Pasear', icon: 'footprints', color: '#e57542', slotMinutes: 15,
    targetSlots: 2, order: 0, createdAt: '2026-09-01T09:00:00.000Z', updatedAt: '2026-09-01T09:00:00.000Z',
  }],
  entries: [{
    id: 'walk_2026-09-01', habitTypeId: 'walk', date: '2026-09-01', slots: 2,
    createdAt: '2026-09-01T09:00:00.000Z', updatedAt: '2026-09-01T09:00:00.000Z',
  }],
  preferences: { theme: 'system', hasSeededDefaults: true },
}

describe('backup validation', () => {
  it('round-trips a valid version 2 backup', () => {
    expect(parseBackup(createBackup(snapshot)).habitTypes[0]?.name).toBe('Pasear')
  })

  it('rejects unknown formats', () => {
    expect(() => parseBackup({ format: 'other', version: 2 })).toThrow('compatible')
  })

  it('rejects entries for an unknown habit', () => {
    const backup = createBackup(snapshot)
    backup.entries[0] = { ...backup.entries[0], habitTypeId: 'missing' }
    expect(() => parseBackup(backup)).toThrow('registros')
  })
})
