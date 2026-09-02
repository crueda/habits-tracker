## Context

The target is a personal phone-first tracker served at `/habits-tracker/`. Its core activity is now time entry: the user chooses a configured habit, records one or more fixed-duration slots for a local date, and reaches the daily target once enough slots are accumulated. Firebase anonymous authentication, Firestore in `eur3`, and `crueda.github.io` are already configured.

## Goals / Non-Goals

**Goals:**

- Make logging today's practice a short, one-hand interaction.
- Allow the action grid's identity and ordering to be personalized.
- Express consistency with a dense calendar heatmap instead of a conventional checklist history.
- Preserve offline operation, private cloud synchronization, and user-controlled recovery.
- Stay comfortably inside Firebase Spark's free quotas.

**Non-Goals:**

- Timers, background activity detection, reminders, social sharing, or coaching.
- Multiple entries for the same habit and date; the daily entry stores the aggregate slot count.
- Automatic cross-device recovery for an anonymous account.
- Server-side rendering or a custom application server.

## Decisions

### Three-destination mobile shell

Use bottom navigation with exactly `Registro`, `Progreso`, and `Hábitos`. Registro is the default destination. Each destination is selected through application state without URL routing, avoiding GitHub Pages fallback concerns.

### Lucide icon identifiers

Habit types store a stable icon identifier selected from an application-owned Lucide catalog. Components resolve that identifier to the corresponding Lucide React component. Storing identifiers rather than SVG markup keeps Firestore records small and prevents untrusted markup. The initial mappings are Piano, Dumbbell, Languages, and Waves.

### Sortable responsive action grid

Registro uses a two-column grid on common phone widths and expands on larger viewports. `@dnd-kit` provides pointer, touch, and keyboard sensors for reordering. A visible `Ordenar` mode separates dragging from the normal tap-to-record action. New order values are normalized to sequential integers and persisted on drop.

### Slot-based domain model

A `HabitType` contains `slotMinutes`, `targetSlots`, and `order` in addition to its visual identity. A `TimeEntry` has the deterministic ID `<habitTypeId>_<local-date>` and stores the aggregate positive integer `slots` for that date. A habit is achieved when `entry.slots >= habit.targetSlots`; duration is `entry.slots * habit.slotMinutes`.

Firestore paths are:

```text
users/{uid}/habitTypes/{habitTypeId}
users/{uid}/entries/{habitTypeId_date}
```

Records retain `createdAt`, `updatedAt`, and optional `deletedAt` fields for last-write-wins synchronization and propagated deletion.

### First-run seed data

After IndexedDB initializes, a persisted `hasSeededDefaults` preference controls one-time creation of Piano, Fuerza, Japonés, and Piscina. Each starts with a 15-minute slot, a one-slot daily target, a distinct color, and sequential order. Deleting all habits later does not recreate them.

### Date and slot entry sheet

Tapping a habit opens an accessible bottom sheet. Date defaults to today's local `YYYY-MM-DD`. Slot count defaults to the existing count for that habit/date, or one for a new entry. Plus/minus buttons and numeric input expose the aggregate count and computed minutes. Saving zero is treated as removing that day's entry.

### Contribution-style progress grid

Render the most recent 16 weeks as week columns and weekday rows, ordered like GitHub's contribution grid. Each square calculates how many non-deleted habit types reached their target that day. Intensity uses five levels: none and four proportional bands based on the achieved/trackable ratio. Selecting a square displays per-habit slots, target, and duration for that date.

### IndexedDB first, Firestore second

All writes commit to IndexedDB and update UI before entering the sync queue. After the persisted anonymous identity is available, cloud records are pulled, merged by `updatedAt`, and pending local records are pushed. Firebase is dynamically loaded after local UI startup so daily entry is not blocked by the cloud bundle.

### Versioned backup

JSON format version 2 stores habit types, entries, and preferences. Imports validate types, ranges, unique IDs, and entry relationships before destructive confirmation. Markdown exports summarize configured targets, accumulated minutes, and achievement counts.

## Risks / Trade-offs

- **Touch dragging can conflict with opening a card** -> Require an explicit order mode and show drag handles only in that mode.
- **Changing target or slot duration alters historical achievement interpretation** -> Progress intentionally evaluates entries using the current habit configuration; historical configuration snapshots are deferred.
- **Anonymous identity is device-bound** -> Keep IndexedDB primary and present prominent JSON backup/import controls.
- **Clock skew can select a wrong conflict winner** -> Use record-level updates and surface synchronization state; multi-device account linking is outside this release.
- **A public site can create anonymous users** -> Apply strict UID rules and remain on Spark so quota exhaustion stops requests rather than producing automatic charges.
- **Heatmap density on narrow screens** -> Use horizontal scrolling with weekday anchors and make individual squares selectable.

## Migration Plan

1. Replace the provisional boolean completion model before any production deployment.
2. Recreate IndexedDB at schema version 2; no production user data exists yet, so provisional stores can be cleared during upgrade.
3. Deploy Firestore rules for `habitTypes` and `entries` paths.
4. Publish through GitHub Actions and verify seed creation, slot entry, reorder, heatmap intensity, offline restart, and cloud isolation.
5. Roll back by deploying the previous static artifact; Firestore data remains separated below the same user root.

## Open Questions

None blocking implementation. Historical configuration snapshots, timers, and permanent accounts can be proposed later.
