## Context

Habit icon identifiers are persisted in IndexedDB and Firestore and are validated during backup import. The application owns a small, explicit Lucide mapping so it never persists SVG markup or arbitrary component names. The editor currently renders the twelve options as one flat wrapping row.

## Goals / Non-Goals

**Goals:**

- Cover common movement, wellbeing, learning, creative, work, home, and social habits with approximately forty stable choices.
- Keep the picker quick to scan on a narrow mobile sheet by grouping related choices.
- Retain the existing identifiers and the `Target` fallback for complete backward compatibility.
- Keep the catalog as the single source for rendering and validation.

**Non-Goals:**

- Loading the entire Lucide set dynamically or allowing custom uploaded artwork.
- Changing existing saved habits, seed data, backups, or Firestore records.
- Adding a new icon package.

## Decisions

The catalog will expose category objects, each with a localized label and an ordered list of icon options. A flattened export derived from those groups will continue to drive the rendering map and identifier validation. This avoids duplicated lists while preserving the simple API used outside the editor.

The editor will render a small heading and compact grid for each category. Forty curated choices remain easier to browse visually than a text search on a mobile sheet, while categories prevent the longer list from becoming an undifferentiated wall of symbols.

The persisted `HabitIconName` union remains explicit. Although deriving it from the runtime catalog could remove duplication, doing so would introduce an undesirable type/runtime dependency from the central data model to a React module.

## Risks / Trade-offs

- [The larger picker increases sheet height] → The existing sheet scrolls, and dense category spacing keeps all controls reachable on small screens.
- [A new identifier could be added to only the type or only the catalog] → Tests assert catalog uniqueness, expected size, category coverage, and validation of every option.
- [More imported icons increase the main bundle] → Only the curated Lucide components are statically imported; the full library is not bundled.

## Migration Plan

Deploy as a normal backward-compatible frontend release. Existing icon names remain unchanged and need no data migration. Rollback is safe because habits that selected a newly introduced identifier would display the existing `Target` fallback in an older frontend while their stored value remains intact.

## Open Questions

None.
