## ADDED Requirements

### Requirement: Reorder habits from configuration
The active habit list in Hábitos SHALL provide an explicit order mode whenever at least two active habits exist.

#### Scenario: Enter order mode
- **WHEN** the user activates `Ordenar` in the habit-management section
- **THEN** active habit rows SHALL expose drag handles and suppress edit, archive, and delete actions until order mode ends

### Requirement: Support accessible ordering interactions
Order mode SHALL support pointer, delayed touch, and keyboard reordering of the vertical active-habit list.

#### Scenario: Move a habit
- **WHEN** the user moves a row to a different position using a supported interaction
- **THEN** the list SHALL persist normalized sequential order values through the existing local-first synchronization flow

### Requirement: Exit order mode explicitly
The ordering control SHALL change to `Listo` while order mode is active.

#### Scenario: Finish ordering
- **WHEN** the user activates `Listo`
- **THEN** drag handles SHALL disappear and normal management actions SHALL return
