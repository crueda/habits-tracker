## MODIFIED Requirements

### Requirement: Seed initial habit types once
The system SHALL create Piano, Fuerza, Japonés, Piscina, Diario, and Ofuro as deterministic default habit types, each with a distinct color, matching catalog icon, 15-minute slots, a one-slot daily target, and sequential display order. It SHALL add later default habits once to installations initialized before they existed.

#### Scenario: Start with an empty new installation
- **WHEN** local storage has never been initialized
- **THEN** the six default habit types SHALL be created and queued for synchronization

#### Scenario: Upgrade an existing installation
- **WHEN** first-use initialization is complete and no record exists for Diario or Ofuro
- **THEN** each missing later default SHALL be appended after the current habit order in release order and queued for synchronization

#### Scenario: Later default was already migrated or removed
- **WHEN** an active, archived, or deleted record exists with the Diario or Ofuro default ID
- **THEN** that default SHALL NOT be created again

#### Scenario: User later removes all defaults
- **WHEN** the user has completed first-use initialization and removes every habit type
- **THEN** the defaults SHALL NOT be recreated automatically
