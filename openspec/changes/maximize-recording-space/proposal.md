## Why

Registro is the application's primary, repeated-use screen, but headings, progress summary, and ordering controls currently consume valuable phone space before the habit actions. The screen should prioritize immediate access to the habit cards and move infrequent organization into configuration.

## What Changes

- Remove the Registro title/date block and daily achieved counter from the populated recording screen.
- Remove ordering controls and drag behavior from Registro so every habit card is always an action.
- Add an explicit reorder mode to the habit-type management section under Hábitos.
- Preserve the existing persisted order and accessible pointer, touch, and keyboard reordering.

## Capabilities

### New Capabilities

- `focused-recording-layout`: Defines a dense primary screen dedicated to habit action cards.
- `configured-habit-ordering`: Defines reorder controls within habit-type configuration.

### Modified Capabilities

None.

## Impact

The change affects `RegisterView`, `HabitsView`, and their layout styles. It reuses the existing reorder store action and drag-and-drop dependencies, without changing data or synchronization schemas.
