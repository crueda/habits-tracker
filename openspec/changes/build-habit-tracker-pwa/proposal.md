## Why

The repository needs a simple, mobile-first habit tracker that records time spent instead of reducing practice to a binary checkbox. Daily entry must be fast, configurable habit types must remain personal, and progress should be understandable at a glance without a visible sign-in flow.

## What Changes

- Add an installable, responsive PWA with exactly three primary destinations: Registro, Progreso, and Hábitos.
- Present configured habits as colored, reorderable action cards with a Lucide icon and name.
- Open a quick entry sheet from each habit card with today's date by default and a configurable number of time slots.
- Configure each habit type's name, icon, color, minutes per slot, required slots, and display order.
- Consider a habit achieved for a date when its recorded slots reach the configured target.
- Seed first use with Piano, Fuerza, Japonés, and Piscina habit types.
- Show a GitHub-style contribution heatmap whose daily color intensity represents how many configured habits reached their target.
- Persist locally and synchronize private records through anonymous Firebase authentication on the no-cost Spark plan.
- Add JSON backup import/export, Markdown reporting, and automated GitHub Pages deployment.

## Capabilities

### New Capabilities

- `mobile-pwa`: Installable, responsive application shell with three-item bottom navigation and offline loading.
- `habit-type-management`: Configurable habit types, visual identity, time-slot targets, lifecycle, and ordering.
- `time-entry`: Fast date-and-slot recording from a responsive grid of habit actions.
- `progress-heatmap`: GitHub-style daily achievement visualization and progress detail.
- `offline-cloud-persistence`: Local-first habit-type and time-entry storage with transparent Firebase synchronization and per-user isolation.
- `data-portability`: User-controlled versioned backup, validated import, and readable Markdown export.

### Modified Capabilities

None.

## Impact

- Introduces a TypeScript React application, Firebase web SDK, IndexedDB persistence, PWA service worker, automated tests, Lucide icons, and accessible drag-and-drop tooling.
- Adds Cloud Firestore collections for habit types and time entries under Firebase project `habits-tracker-78d9b` in `eur3`.
- Adds a GitHub Actions workflow that deploys the static application to `/habits-tracker/` on GitHub Pages.
- Stores only Firebase's public web configuration in the repository; no service-account credentials or private keys are required.
