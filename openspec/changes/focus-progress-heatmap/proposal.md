## Why

The progress destination currently spends most of its initial viewport on headings, subtitles, summary cards, and persistent day details, leaving the contribution graph visually secondary. Progress should instead be a focused, GitHub-like green activity map that can be explored globally or habit by habit.

## What Changes

- Remove page subtitles, metric cards, graph explanatory copy, and persistent day detail from the main progress layout.
- Expand the heatmap to 52 weeks and make it the dominant content area, with green contribution-style intensity levels and automatic positioning at the latest dates.
- Add compact filters for all habits and each individual non-deleted habit.
- For an individual habit, calculate cell intensity from recorded slots relative to that habit's target; for all habits, retain proportional achieved-habit intensity.
- Open selected-day details in a bottom sheet so inspection remains available without permanently reducing graph space.

## Capabilities

### New Capabilities

- `filtered-progress-heatmap`: Defines the focused year heatmap, habit filters, intensity calculation, and on-demand day details.

### Modified Capabilities

None.

## Impact

The change affects the progress view, statistics utilities and tests, responsive heatmap styles, and a new day-detail sheet. It does not alter persisted records, Firestore paths, or the slot-entry model.
