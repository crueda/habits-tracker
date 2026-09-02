## Context

The first app release used a boolean preference to seed four deterministic default habit records exactly once. Existing installations therefore skip the seed path entirely, while new defaults added only to that original array would never reach the owner. Habit deletion is represented by a retained tombstone, which can safely distinguish “never added” from “deliberately removed.”

## Goals / Non-Goals

**Goals:**

- Create Diario with stable ID `default-diario`, writing icon, a distinct color, 15-minute slot, and one-slot target.
- Append it once to existing installations and queue it for Firebase synchronization.
- Preserve archived and deleted choices and avoid duplicates across repeated starts.
- Keep initial and incremental seed decisions independently testable.

**Non-Goals:**

- Storing diary text or linking to an external diary application.
- Modifying the existing four default records.
- Bumping the IndexedDB schema or resetting the first-use preference.

## Decisions

Default definitions and seed selection will move into a pure module. A fresh installation receives all five defaults; an initialized installation receives only upgrade defaults whose deterministic ID is completely absent from local records. Because archived and deleted records remain present, they count as already migrated and will not be recreated.

The persistence layer will materialize the selected definitions in one read-write transaction. Their order starts after the largest existing order, so Diario appears after the owner's current cards even if those cards have been reordered or custom habits were added.

The migration runs from the existing snapshot-load initialization rather than an IndexedDB version upgrade. This keeps the storage schema unchanged and also lets the same deterministic check protect every later load.

## Risks / Trade-offs

- [An existing custom habit may also be named Diario] → The deterministic default is still added because names are editable and not reliable migration keys; the owner can remove either record.
- [Repeated or concurrent initialization attempts] → The deterministic record and queue IDs make repeated writes idempotent.
- [The owner deletes Diario after migration] → Its tombstone satisfies the migration check, so the default stays deleted.

## Migration Plan

On the first load after deployment, initialized databases without `default-diario` append and queue the new habit. New databases create all five defaults. Rollback leaves the normal editable habit record intact and requires no data conversion.

## Open Questions

None.
