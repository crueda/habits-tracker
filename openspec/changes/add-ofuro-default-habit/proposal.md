## Why

Taking an ofuro before bed is another routine the owner wants to track, and it should appear as a ready-to-use habit rather than requiring manual configuration. The app must add it to both fresh and already initialized installations without duplicating or resurrecting it later.

## What Changes

- Add a default **Ofuro** habit with a bathtub icon, distinct color, 15-minute slots, and a one-slot daily target.
- Add the bathtub icon to the controlled habit icon catalog under Bienestar.
- Include Ofuro after Diario on fresh installations.
- Add Ofuro once to existing installations, append it after the current order, and queue it for cloud synchronization.
- Respect any active, archived, or deleted `default-ofuro` record as already migrated.
- Extend migration and icon-catalog tests and update the documented default list.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `habit-type-management`: The default set gains Ofuro and existing installations receive it idempotently.

## Impact

The change affects the icon type and catalog, default-habit definitions, migration tests, and documentation. It does not alter the IndexedDB schema, authentication, Firestore rules, or dependencies.
