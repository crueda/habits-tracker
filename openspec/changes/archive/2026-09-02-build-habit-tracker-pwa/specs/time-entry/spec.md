## ADDED Requirements

### Requirement: Show responsive habit action cards
Registro SHALL display active habit types as colored cards ordered by their configured position, with each card showing its Lucide icon, name, slot duration, daily target, and today's accumulated slots.

#### Scenario: Open Registro on a phone
- **WHEN** active habit types exist
- **THEN** they SHALL appear as a responsive two-column action grid without horizontal scrolling

#### Scenario: No active habit types exist
- **WHEN** the action grid is empty
- **THEN** the system SHALL show a direct action to create a habit type

### Requirement: Open quick time entry
The system SHALL open a time-entry sheet when a habit card is activated outside order mode.

#### Scenario: Create today's first entry
- **WHEN** a habit without an entry today is activated
- **THEN** the sheet SHALL default to today's local date and one slot

#### Scenario: Edit an existing daily entry
- **WHEN** a habit with an entry on the selected date is activated
- **THEN** the sheet SHALL show the currently saved aggregate slot count

### Requirement: Adjust slots and duration
The time-entry sheet SHALL allow slots to be entered as an integer from 0 to 96 and SHALL display total minutes as slots multiplied by the habit's configured slot duration.

#### Scenario: Increase slots
- **WHEN** the user increases the slot count
- **THEN** the displayed total duration and target progress SHALL update immediately

#### Scenario: Reach target slots
- **WHEN** the entered slots equal or exceed the configured target
- **THEN** the sheet and habit card SHALL indicate the habit is achieved for that date

### Requirement: Persist one aggregate entry per habit and date
The system SHALL save a deterministic entry `<habitTypeId>_<local-date>` containing the aggregate slot count, and SHALL treat zero slots as removal.

#### Scenario: Save a positive slot count
- **WHEN** the user saves between 1 and 96 slots
- **THEN** one aggregate entry SHALL be persisted locally and queued for cloud synchronization

#### Scenario: Save zero slots
- **WHEN** an existing entry is changed to zero and saved
- **THEN** the entry SHALL become a synchronized tombstone and the card SHALL show no recorded time
