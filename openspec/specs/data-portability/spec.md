# data-portability Specification

## Purpose
TBD - created by archiving change build-habit-tracker-pwa. Update Purpose after archive.
## Requirements
### Requirement: Export a versioned slot-data backup
The system SHALL download non-deleted habit types, non-deleted time entries, preferences, and seed state as version 2 UTF-8 JSON.

#### Scenario: Download JSON backup
- **WHEN** the user requests a backup
- **THEN** the file SHALL include format, version, export time, habit types, entries, and portable preferences

### Requirement: Validate before importing
The system SHALL validate format, ranges, unique IDs, icon identifiers, and entry-to-habit relationships before changing data, and SHALL require destructive confirmation.

#### Scenario: Choose a valid backup
- **WHEN** a supported backup is selected
- **THEN** the system SHALL show its date and record counts before asking for confirmation

#### Scenario: Choose an invalid backup
- **WHEN** a malformed or unsupported backup is selected
- **THEN** the system SHALL explain the failure and leave current data unchanged

#### Scenario: Confirm replacement
- **WHEN** the user confirms a valid import
- **THEN** local domain data SHALL be replaced, missing cloud records SHALL be tombstoned, and imported records SHALL be queued

### Requirement: Export a readable Markdown report
The system SHALL download a Markdown snapshot containing habit targets, slot duration, accumulated time, and achieved-day statistics.

#### Scenario: Request readable report
- **WHEN** the user selects Markdown export
- **THEN** the browser SHALL download a UTF-8 `.md` report

### Requirement: Explain recovery limitations
The backup controls SHALL explain that clearing browser data or changing devices can make anonymous cloud data inaccessible.

#### Scenario: Open data settings
- **WHEN** backup controls are displayed
- **THEN** the system SHALL recommend keeping a recent JSON backup

