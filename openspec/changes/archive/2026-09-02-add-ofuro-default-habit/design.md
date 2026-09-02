## Context

Default-habit selection already separates the full first-install set from incremental seeds and uses deterministic IDs to respect active, archived, and deleted records. Ofuro can extend that mechanism without a storage migration, while its bathtub artwork requires one additional controlled Lucide identifier.

## Goals / Non-Goals

**Goals:**

- Define Ofuro as `default-ofuro` with a bathtub icon, distinct blue color, 15-minute slot, and one-slot target.
- Add it after Diario for new installations and once at the end of existing installations.
- Preserve all idempotency and deletion behavior covered by the default migration.
- Make the bathtub available when configuring any habit.

**Non-Goals:**

- Adding a bedtime field, reminders, or a special relationship with sleep habits.
- Recording bath details beyond the existing slot model.
- Changing existing configured habits or their order.

## Decisions

Ofuro will be included in both the initial seed array and the incremental upgrade array. The existing missing-ID selection will append it after the largest current order and automatically queue it through the same IndexedDB transaction used by Diario.

The icon catalog will add the stable `bath` identifier and Lucide `Bath` component to the Bienestar group. Persisting the controlled identifier retains existing backup validation and fallback behavior without storing SVG markup.

Migration tests will describe incremental defaults generically enough to cover both Diario and Ofuro and will explicitly verify that an Ofuro tombstone prevents recreation.

## Risks / Trade-offs

- [The owner already has a custom bath habit] → Deterministic IDs, rather than editable names, remain the reliable migration marker; either habit can be removed normally.
- [Several incremental defaults are missing] → They are appended in release order with sequential positions.
- [The user later removes Ofuro] → Its retained tombstone prevents automatic resurrection.

## Migration Plan

The first load after deployment appends Ofuro if `default-ofuro` is absent and queues it for synchronization. Fresh databases create six defaults. Rollback leaves the ordinary habit record intact and requires no conversion.

## Open Questions

None.
