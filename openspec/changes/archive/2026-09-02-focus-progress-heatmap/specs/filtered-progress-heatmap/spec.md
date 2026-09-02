## ADDED Requirements

### Requirement: Make the heatmap the primary progress content
Progreso SHALL omit page subtitles, metric summary cards, graph explanatory subtitles, and persistent day detail, and SHALL allocate its main available viewport to the contribution heatmap.

#### Scenario: Open Progreso
- **WHEN** the user selects the Progreso destination
- **THEN** compact filters and the contribution heatmap SHALL be the only persistent destination content

### Requirement: Show a year of contribution activity
The heatmap SHALL render 52 Monday-aligned week columns ending today, using square cells, month context, weekday context, and five green levels including zero.

#### Scenario: Open the year heatmap on a phone
- **WHEN** the heatmap is wider than the available viewport
- **THEN** it SHALL support horizontal scrolling and initially position the latest dates in view

### Requirement: Filter progress by habit
The system SHALL provide a `Todos` filter and one filter for every non-deleted habit in configured order.

#### Scenario: Select an individual habit
- **WHEN** the user selects a habit filter
- **THEN** every cell SHALL represent only that habit's recorded slots relative to its current target

#### Scenario: Select all habits
- **WHEN** the user selects `Todos`
- **THEN** every cell SHALL represent the proportion of visible habits whose targets were achieved that day

### Requirement: Encode individual slot progress
For an individual habit, the system SHALL render zero slots at level 0, partial target progress at levels 1 through 3, and target-or-greater progress at level 4.

#### Scenario: Habit reaches its target
- **WHEN** the filtered habit's entry slots equal or exceed its target on a day
- **THEN** that day SHALL use the strongest green level

### Requirement: Inspect a day on demand
Activating a heatmap cell SHALL open a bottom sheet with the date and exact slot, target, duration, and achieved details for the current filter.

#### Scenario: Inspect a filtered day
- **WHEN** the user activates a day while an individual habit is selected
- **THEN** the detail sheet SHALL show only that habit's values for that day
