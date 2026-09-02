## MODIFIED Requirements

### Requirement: Prioritize habit actions on Registro
When active habits exist, Registro SHALL place the responsive habit-card grid immediately below the global application header without a page title, date subtitle, aggregate achievement counter, progress bar, order control, order instruction, or global cloud-status badge. The grid SHALL calculate enough rows for all active habits and distribute the available height between them so the destination itself does not require vertical scrolling on a supported phone viewport.

#### Scenario: Open populated Registro on a phone
- **WHEN** the user opens Registro with active habits
- **THEN** every active habit card SHALL be visible between the application header and bottom navigation without vertical page scrolling

#### Scenario: Open Registro with a different habit count
- **WHEN** the number of active habits changes
- **THEN** the grid SHALL recompute its rows and fit the cards into the available height
