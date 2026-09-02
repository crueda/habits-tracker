## ADDED Requirements

### Requirement: Prioritize habit actions on Registro
When active habits exist, Registro SHALL place the responsive habit-card grid immediately below the global application header without a page title, date subtitle, aggregate achievement counter, progress bar, order control, or order instruction.

#### Scenario: Open populated Registro on a phone
- **WHEN** the user opens Registro with active habits
- **THEN** the first destination content SHALL be the habit action grid

### Requirement: Keep recording cards actionable
Every habit card on Registro SHALL activate its time-entry sheet and SHALL continue to show the habit's own slots, target, and achieved state.

#### Scenario: Activate any habit card
- **WHEN** the user activates a card on Registro
- **THEN** the corresponding time-entry sheet SHALL open

### Requirement: Preserve an empty-state creation path
Registro SHALL display a create-habit action when no active habit exists.

#### Scenario: Open empty Registro
- **WHEN** no active habit exists
- **THEN** the user SHALL be able to create a habit from the empty state
