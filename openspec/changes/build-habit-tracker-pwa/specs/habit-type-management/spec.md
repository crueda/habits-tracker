## ADDED Requirements

### Requirement: Seed initial habit types once
The system SHALL create Piano, Fuerza, Japonés, and Piscina on first use only, each with a distinct color, matching Lucide icon, 15-minute slots, a one-slot daily target, and sequential display order.

#### Scenario: Start with an empty new installation
- **WHEN** local storage has never been initialized
- **THEN** the four default habit types SHALL be created and queued for synchronization

#### Scenario: User later removes all defaults
- **WHEN** the user has completed first-use initialization and removes every habit type
- **THEN** the defaults SHALL NOT be recreated automatically

### Requirement: Create a configurable habit type
The system SHALL allow a habit type to be created with a non-empty name, a catalog icon, a color, slot duration from 1 to 480 minutes, and a target from 1 to 96 slots.

#### Scenario: Save valid configuration
- **WHEN** the user submits all valid fields
- **THEN** the habit type SHALL be appended to the action grid and persisted

#### Scenario: Submit invalid configuration
- **WHEN** a name is blank or a numeric value falls outside its allowed range
- **THEN** the editor SHALL remain open and identify each invalid field

### Requirement: Edit a habit type
The system SHALL allow name, icon, color, slot duration, and target slots to be changed without deleting existing time entries.

#### Scenario: Change a daily target
- **WHEN** the user saves a new target slot count
- **THEN** existing entries SHALL remain and progress SHALL be evaluated against the current target

### Requirement: Reorder habit types
The system SHALL allow active habit types to be reordered using pointer, touch, or keyboard interaction and SHALL persist normalized sequential order values.

#### Scenario: Finish a drag operation
- **WHEN** a habit card is moved before another card in order mode
- **THEN** the action grid SHALL immediately reflect and persist the new order

#### Scenario: Cancel order mode
- **WHEN** the user exits order mode without moving a card
- **THEN** normal card activation SHALL resume without changing order

### Requirement: Archive and permanently delete habit types
The system SHALL allow archive, restore, and confirmed permanent deletion while retaining entries for archived types and tombstoning entries for deleted types.

#### Scenario: Archive a habit type
- **WHEN** the user confirms archive
- **THEN** the type SHALL leave the Registro grid but remain visible in management and historical progress

#### Scenario: Delete a habit type
- **WHEN** the user confirms permanent deletion
- **THEN** the type and its entries SHALL be removed from visible data and their deletion SHALL be synchronized
