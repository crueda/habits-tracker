## Context

Progreso currently shows 16 weeks in small cells below a large title and two metric cards, followed by an always-visible selected-day panel. The existing heatmap utility already creates Monday-aligned week columns and the data model can calculate aggregate or per-habit progress without migration.

## Goals / Non-Goals

**Goals:**

- Make a GitHub-style green contribution map the dominant progress surface.
- Provide immediate all-habit and per-habit filtering.
- Retain accessible day inspection without occupying permanent screen space.
- Show a useful year-scale history while remaining phone friendly.

**Non-Goals:**

- Change stored entries, daily targets, synchronization, or habit configuration.
- Add charts other than the contribution heatmap.
- Add date-range controls in this iteration.

## Decisions

### Show 52 horizontally scrollable weeks

Use the existing Monday-aligned generator with 52 weeks. Fixed square cells preserve the contribution-graph visual language; the viewport scrolls horizontally and positions itself at the newest week on entry. Month and weekday labels remain as graph axes, not explanatory subtitles.

### Use one compact filter rail

Render `Todos` followed by every non-deleted habit in configured order. The rail scrolls horizontally on narrow screens. Filtering changes only the graph and selected-day detail, not the stored data.

### Distinguish aggregate and individual intensity

For `Todos`, retain the achieved-habit ratio across visible habits. For an individual habit, map zero slots to level 0, partial target progress to levels 1–3, and target-or-greater to level 4. Every rendered level uses the same green palette regardless of the habit's configured card color.

### Move day detail into a sheet

Selecting a square opens an accessible bottom sheet. The sheet lists all habits for `Todos` or only the selected habit for an individual filter, preserving inspection without permanently shrinking the main graph.

## Risks / Trade-offs

- **A full year is wider than a phone** → Auto-scroll to the latest dates and retain native horizontal panning.
- **Individual filters have a different intensity basis** → Expose slots and target in each cell's accessible label and in the day sheet.
- **No always-visible numeric summary** → The user's requested visual focus takes priority; exact values remain one tap away.
