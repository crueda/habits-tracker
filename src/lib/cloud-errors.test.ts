import { describe, expect, it } from 'vitest'
import { cloudErrorDetail } from './cloud-errors'

describe('cloud error details', () => {
  it('explains how to enable end-user account creation', () => {
    expect(cloudErrorDetail({ code: 'auth/admin-restricted-operation' })).toContain('Creación de cuentas')
    expect(cloudErrorDetail(new Error('Firebase: Error (auth/admin-restricted-operation).'))).toContain('Acciones de usuario')
  })

  it('distinguishes the Anonymous provider and other configuration failures', () => {
    expect(cloudErrorDetail({ code: 'auth/operation-not-allowed' })).toContain('Anónimo')
    expect(cloudErrorDetail({ code: 'auth/unauthorized-domain' })).toContain('crueda.github.io')
    expect(cloudErrorDetail({ code: 'permission-denied' })).toContain('Reglas')
  })

  it('retains unknown error messages and safely handles other values', () => {
    expect(cloudErrorDetail(new Error('Fallo inesperado'))).toBe('Fallo inesperado')
    expect(cloudErrorDetail(undefined)).toContain('guardados en este dispositivo')
  })
})
