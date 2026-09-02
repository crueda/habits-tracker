## Why

Writing a diary entry is now one of the owner's tracked routines, so it should be available as a first-class default habit alongside the existing four. Because the app has already been used, the addition must reach existing installations without duplicating or resurrecting a habit the owner later removes.

## What Changes

- Add a default **Diario** habit with the writing icon, a distinct color, 15-minute slots, and a one-slot daily target.
- Include Diario in fresh installations after the existing four habits.
- Add Diario once to already initialized installations and queue it for cloud synchronization.
- Treat an existing, archived, or deleted `default-diario` record as already migrated so it never reappears automatically.
- Add unit coverage for fresh-install and existing-install seed selection.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `habit-type-management`: The default set gains Diario and existing installations receive it through an idempotent migration.

## Impact

The change affects default-habit selection, IndexedDB initialization, tests, and the documented initial habit list. It introduces no data-store version change, dependency, authentication change, or destructive migration.
