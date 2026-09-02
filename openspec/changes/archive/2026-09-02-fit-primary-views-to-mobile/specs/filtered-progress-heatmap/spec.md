## MODIFIED Requirements

### Requirement: Show a year of contribution activity
The heatmap SHALL render twelve calendar months ending with the current month, using square cells, weekday context, a visible month and year heading, and five green levels including zero. Each month SHALL be a separate full-width panel in a horizontal snap-scrolling rail.

#### Scenario: Open monthly progress on a phone
- **WHEN** the user opens Progreso
- **THEN** the current month SHALL fill the graph viewport without vertical page scrolling

#### Scenario: Browse an earlier month
- **WHEN** the user swipes the graph horizontally
- **THEN** the viewport SHALL snap to the adjacent monthly panel

#### Scenario: Reach a date after today
- **WHEN** the current-month calendar contains a cell after today
- **THEN** that cell SHALL remain visually empty and non-interactive
