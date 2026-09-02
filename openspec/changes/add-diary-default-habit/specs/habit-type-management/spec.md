## MODIFIED Requirements

### Requirement: Seed initial habit types once
The system SHALL create Piano, Fuerza, Japonés, Piscina, and Diario as deterministic default habit types, each with a distinct color, matching catalog icon, 15-minute slots, a one-slot daily target, and sequential display order. It SHALL add Diario once to installations initialized before Diario existed.

#### Scenario: Start with an empty new installation
- **WHEN** local storage has never been initialized
- **THEN** the five default habit types SHALL be created and queued for synchronization

#### Scenario: Upgrade an existing installation
- **WHEN** first-use initialization is complete and no record with the Diario default ID exists
- **THEN** Diario SHALL be appended after the current habit order and queued for synchronization

#### Scenario: Diario was already migrated or removed
- **WHEN** an active, archived, or deleted record with the Diario default ID exists
- **THEN** Diario SHALL NOT be created again

#### Scenario: User later removes all defaults
- **WHEN** the user has completed first-use initialization and removes every habit type
- **THEN** the defaults SHALL NOT be recreated automatically
