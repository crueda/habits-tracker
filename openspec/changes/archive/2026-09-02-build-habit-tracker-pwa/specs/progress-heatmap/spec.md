## ADDED Requirements

### Requirement: Show a contribution-style progress heatmap
Progreso SHALL display the most recent 16 weeks as weekday rows and week columns of square cells, including days with no activity.

#### Scenario: Open progress
- **WHEN** the Progreso destination is selected
- **THEN** the heatmap SHALL cover a continuous local-date range ending today and SHALL identify month and weekday context

### Requirement: Calculate daily achieved habits
The system SHALL count a non-deleted habit as achieved on a date when its non-deleted entry has at least the habit's current target slot count.

#### Scenario: Some habits reach target
- **WHEN** two of four trackable habits have entries meeting their targets on a date
- **THEN** the date SHALL report two achieved habits and 50 percent completion

#### Scenario: Entry is below target
- **WHEN** an entry has fewer slots than its habit's target
- **THEN** that habit SHALL not count as achieved for the date

### Requirement: Encode progress with color intensity
Each heatmap cell SHALL use an empty state or one of four increasing color levels based on the proportion of trackable habits achieved that date.

#### Scenario: All habits are achieved
- **WHEN** every trackable habit reaches its target on a date
- **THEN** the corresponding square SHALL use the strongest color level

#### Scenario: No habits are achieved
- **WHEN** no trackable habit reaches its target
- **THEN** the corresponding square SHALL use the empty color level

### Requirement: Inspect a heatmap day
The system SHALL allow a heatmap day to be selected and SHALL show each habit's slots, target, duration, and achieved state for that date.

#### Scenario: Select a past square
- **WHEN** the user activates a heatmap cell
- **THEN** a dated detail section SHALL list progress for each habit represented in history

### Requirement: Summarize recent progress
The system SHALL show total achieved-habit count and achievement percentage for the heatmap range.

#### Scenario: Heatmap has tracked days
- **WHEN** at least one habit exists in the displayed range
- **THEN** the summary SHALL calculate achieved instances divided by trackable habit-days
