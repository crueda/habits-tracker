## 1. Updated foundation

- [x] 1.1 Maintain the Vite React TypeScript, lint, test, and PWA foundation
- [x] 1.2 Add accessible drag-and-drop dependencies and a controlled Lucide habit-icon catalog
- [x] 1.3 Replace provisional habit/completion types with versioned habit-type, time-entry, and seed-preference models

## 2. Slot domain and persistence

- [x] 2.1 Implement slot duration, target achievement, daily totals, and heatmap-level utilities with tests
- [x] 2.2 Upgrade IndexedDB and synchronization queues for habit types and aggregate time entries
- [x] 2.3 Implement first-use creation of Piano, Fuerza, Japonés, and Piscina without later reseeding
- [x] 2.4 Implement store actions for habit-type lifecycle, normalized ordering, and aggregate slot entries

## 3. Recording experience

- [x] 3.1 Change primary navigation to Registro, Progreso, and Hábitos with Registro as the default
- [x] 3.2 Build the responsive colored habit-card grid with names, Lucide icons, targets, and today's slots
- [x] 3.3 Add explicit pointer, touch, and keyboard order mode with persisted drag-and-drop results
- [x] 3.4 Build the date-and-slot entry sheet with today/one-slot defaults, duration preview, target state, validation, and removal

## 4. Habit-type configuration

- [x] 4.1 Build create/edit controls for name, Lucide icon, color, slot minutes, and target slots
- [x] 4.2 Build management for active/archived habit types with edit, confirmed archive, restore, and confirmed deletion

## 5. Progress and portability

- [x] 5.1 Build the 16-week GitHub-style heatmap with four intensity levels, month/weekday context, and accessible cells
- [x] 5.2 Build selected-day detail and range summaries from achieved habit targets
- [x] 5.3 Migrate JSON backup validation/import and Markdown reporting to format version 2 slot data
- [x] 5.4 Retain theme, sync diagnostics, recovery guidance, and backup controls in the Hábitos destination

## 6. Firebase and delivery

- [x] 6.1 Update Firestore synchronization paths and rule tests for `habitTypes` and `entries`
- [ ] 6.2 Update documentation and verify GitHub Pages path, offline artifacts, lint, unit tests, build, OpenSpec, and mobile layout
