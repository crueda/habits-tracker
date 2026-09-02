import { readFileSync } from 'node:fs'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc } from 'firebase/firestore'

let environment: RulesTestEnvironment

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-ritmo',
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8'),
    },
  })
})

beforeEach(async () => environment.clearFirestore())
afterAll(async () => environment.cleanup())

describe('Firestore user isolation', () => {
  it('allows a user to read and write their own records', async () => {
    const db = environment.authenticatedContext('user-a').firestore()
    const habit = doc(db, 'users/user-a/habitTypes/walk')
    const entry = doc(db, 'users/user-a/entries/walk_2026-09-01')
    await assertSucceeds(setDoc(habit, { name: 'Pasear', updatedAt: new Date().toISOString() }))
    await assertSucceeds(setDoc(entry, { habitTypeId: 'walk', date: '2026-09-01', slots: 2 }))
    await assertSucceeds(getDoc(habit))
    await assertSucceeds(getDoc(entry))
  })

  it('denies access to another user records', async () => {
    const db = environment.authenticatedContext('user-a').firestore()
    await assertFails(setDoc(doc(db, 'users/user-b/habitTypes/walk'), { name: 'No permitido' }))
    await assertFails(getDoc(doc(db, 'users/user-b/entries/walk_2026-09-01')))
  })

  it('denies unauthenticated access', async () => {
    const db = environment.unauthenticatedContext().firestore()
    await assertFails(setDoc(doc(db, 'users/user-a/habitTypes/walk'), { name: 'No permitido' }))
    await assertFails(getDoc(doc(db, 'users/user-a/entries/walk_2026-09-01')))
  })
})
