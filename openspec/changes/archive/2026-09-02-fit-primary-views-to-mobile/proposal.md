## Why

The two everyday destinations still waste or overflow the phone viewport: Registro can scroll despite being a compact action grid, and Progreso presents a continuous year strip instead of letting each month occupy the available screen. The unexplained cloud-status badge in the global header also distracts from those primary actions.

## What Changes

- Make Registro a viewport-fitted grid whose rows and cards resize from the number of active habits, without vertical page scrolling.
- Replace the continuous 52-week strip with twelve full monthly panels that snap horizontally, opening on the current month.
- Keep habit filters and day inspection while fitting persistent Progreso content above the bottom navigation without vertical page scrolling.
- Remove the cloud-status badge from the global header and retain its labelled, actionable presentation in the cloud settings section.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `focused-recording-layout`: Registro must fit its action grid into the available mobile viewport.
- `filtered-progress-heatmap`: Progreso changes from a continuous weekly strip to horizontally paged monthly contribution calendars.

## Impact

This affects the application shell, Registro grid sizing, progress range generation and tests, and responsive styles. Persisted records, Firebase paths, and synchronization behavior do not change.
