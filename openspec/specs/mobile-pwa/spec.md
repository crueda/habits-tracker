# mobile-pwa Specification

## Purpose
TBD - created by archiving change build-habit-tracker-pwa. Update Purpose after archive.
## Requirements
### Requirement: Three-item mobile navigation
The system SHALL provide bottom navigation with exactly Registro, Progreso, and Hábitos as primary destinations, and SHALL open Registro by default.

#### Scenario: Open the application
- **WHEN** the application finishes loading
- **THEN** Registro SHALL be selected and the three primary destinations SHALL remain reachable without a page reload

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

### Requirement: Installable offline shell
The system SHALL provide a manifest, maskable icon, and service worker scoped to `/habits-tracker/`, and SHALL cache the application shell after a successful load.

#### Scenario: Reopen without connectivity
- **WHEN** the application was loaded successfully before and is reopened offline
- **THEN** the shell and locally stored data SHALL remain available

#### Scenario: Update becomes available
- **WHEN** a new service worker is ready
- **THEN** the system SHALL offer a user-controlled refresh

### Requirement: Respect presentation preferences
The system SHALL support system, light, and dark themes and SHALL suppress non-essential motion when reduced motion is requested.

#### Scenario: Select dark theme
- **WHEN** the user selects the dark theme
- **THEN** the application SHALL persist and apply it on subsequent loads

