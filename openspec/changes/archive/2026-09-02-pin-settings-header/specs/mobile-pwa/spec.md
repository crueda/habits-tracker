## MODIFIED Requirements

### Requirement: Mobile-first application shell
The system SHALL remain usable from 320 CSS pixels wide, respect safe-area insets, and provide touch targets and keyboard focus for all primary actions. The Hábitos destination SHALL remain vertically scrollable while its branded application header stays pinned at the top of the viewport.

#### Scenario: Use a narrow phone viewport
- **WHEN** the viewport is 320 CSS pixels wide
- **THEN** primary content SHALL not overflow horizontally except for the intentionally scrollable progress heatmap

#### Scenario: Navigate by keyboard
- **WHEN** the user tabs through the interface
- **THEN** every primary action SHALL be reachable and SHALL show visible focus

#### Scenario: Scroll habit settings
- **WHEN** the user scrolls vertically through the Hábitos destination
- **THEN** the Agatsu icon and application name SHALL remain visible in a pinned header
