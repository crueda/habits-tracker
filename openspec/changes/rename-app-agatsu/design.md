## Context

The deployed PWA currently presents Ritmo in its header, loading state, document metadata, install manifest, export presentation, and documentation. Users may already have local IndexedDB data, theme preferences, and version-2 backups whose internal identifiers contain `ritmo`.

## Goals / Non-Goals

**Goals:**

- Present Agatsu consistently across every user-visible brand surface.
- Give the header/loading mark and install icon a coherent A-shaped identity.
- Preserve existing installations, local data, Firebase data, backups, and the published URL.

**Non-Goals:**

- Rename the GitHub repository, Firebase project, Firestore paths, or GitHub Pages route.
- Migrate IndexedDB or alter the backup schema.
- Add Japanese characters to functional controls or change product behavior.

## Decisions

### Separate display identity from compatibility identifiers

Replace visible Ritmo strings and newly downloaded filenames with Agatsu, but retain `ritmo-habits`, `ritmo-theme`, and `ritmo-habits-backup`. These identifiers are implementation contracts: renaming the IndexedDB database would make existing data appear lost, while changing the backup discriminator would reject previously exported version-2 files.

### Use an A mark and progress motif

The compact header and loading mark use the letter A. The install icon uses a simple code-native geometric A/progress path in the existing forest, cream, and orange palette so no new image dependency is required and the visual remains recognizable after an update.

### Keep the deployment address stable

The PWA remains at `/habits-tracker/`. Renaming the repository now would invalidate saved links, require Firebase authorized-domain review, and add no benefit to the installed application name.

## Risks / Trade-offs

- **Old installed icon can remain cached temporarily** → The next production service-worker release updates the asset; users can refresh or reinstall if their launcher delays icon refresh.
- **Legacy `ritmo` identifiers remain visible in source and JSON** → Document them as compatibility identifiers and test that existing backups continue to parse.
- **Agatsu has a martial-arts association rather than literally meaning habit** → Use a neutral Spanish tagline, “Tu progreso, cada día,” to make the product purpose clear.
