import { describe, expect, it } from 'vitest'
import { createBackup, parseBackup } from './backup'
import type { AppSnapshot } from '../types'
import { LEGACY_BACKUP_FORMAT, LEGACY_DATABASE_NAME, LEGACY_THEME_STORAGE_KEY } from './compatibility'

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
    const backup = createBackup(snapshot)
    expect(backup.format).toBe('ritmo-habits-backup')
    expect(parseBackup(backup).habitTypes[0]?.name).toBe('Pasear')
  })

  it('retains the pre-rebrand storage compatibility identifiers', () => {
    expect(LEGACY_DATABASE_NAME).toBe('ritmo-habits')
    expect(LEGACY_THEME_STORAGE_KEY).toBe('ritmo-theme')
    expect(LEGACY_BACKUP_FORMAT).toBe('ritmo-habits-backup')
  })

  it('accepts identifiers from the expanded icon catalog', () => {
    const backup = createBackup(snapshot)
    backup.habitTypes[0] = { ...backup.habitTypes[0], icon: 'heart-pulse' }
    expect(parseBackup(backup).habitTypes[0]?.icon).toBe('heart-pulse')
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
