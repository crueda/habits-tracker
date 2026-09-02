## ADDED Requirements

### Requirement: Present the Agatsu identity
The system SHALL use Agatsu as the application name in visible navigation, loading, document, installation, reporting, and documentation surfaces.

#### Scenario: Open the application
- **WHEN** the application loads in a browser
- **THEN** the page title, header brand, and loading state SHALL identify it as Agatsu

#### Scenario: Install the PWA
- **WHEN** the browser presents or completes PWA installation
- **THEN** the full and short installed application names SHALL identify it as Agatsu

### Requirement: Use coherent Agatsu artwork
The system SHALL use an A mark in compact brand surfaces and SHALL provide install icon artwork aligned with the existing visual palette.

#### Scenario: View the header or loading screen
- **WHEN** a compact brand mark is shown
- **THEN** it SHALL display an A rather than the previous R mark

### Requirement: Preserve existing user data compatibility
The rebrand SHALL retain existing IndexedDB, theme-preference, and version-2 backup identifiers even when those identifiers contain the previous brand name.

#### Scenario: Update an existing installation
- **WHEN** a user who already has local habits opens the Agatsu release
- **THEN** the application SHALL load those habits from the existing IndexedDB database

#### Scenario: Restore an existing backup
- **WHEN** the user imports a valid version-2 backup created under the previous visible brand
- **THEN** the system SHALL accept and restore the backup

### Requirement: Keep the existing public address
The rebrand SHALL continue to deploy under the `/habits-tracker/` GitHub Pages path.

#### Scenario: Open a saved link
- **WHEN** a user opens the existing GitHub Pages URL after deployment
- **THEN** the Agatsu application SHALL load without a redirect or path change
