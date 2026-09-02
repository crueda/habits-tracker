## ADDED Requirements

### Requirement: Curated expanded icon catalog
The system SHALL offer at least forty curated habit icons covering movement, wellbeing, learning and work, creativity, and everyday life while retaining every previously supported icon identifier.

#### Scenario: User chooses an icon for a new habit
- **WHEN** the user opens the icon picker in the habit editor
- **THEN** the system presents at least forty distinct choices including all previously available choices

### Requirement: Categorized mobile picker
The system SHALL present icon choices in labeled categories with accessible names and selected state, using a layout suitable for a narrow mobile sheet.

#### Scenario: User browses icon categories
- **WHEN** the icon picker is displayed on a mobile-width screen
- **THEN** the user can scan labeled groups and select any icon without horizontal scrolling

#### Scenario: Assistive technology reads a choice
- **WHEN** an icon choice receives focus
- **THEN** it exposes its descriptive label and whether it is selected

### Requirement: Stable icon persistence and validation
The system SHALL use stable catalog identifiers for persistence, rendering, and backup validation and SHALL preserve fallback rendering for unknown identifiers.

#### Scenario: Existing habit is loaded
- **WHEN** a habit contains any previously supported icon identifier
- **THEN** the system renders the same icon without modifying the habit

#### Scenario: Expanded catalog backup is validated
- **WHEN** a backup contains one of the newly added catalog identifiers
- **THEN** the system accepts that identifier as valid
