# offline-cloud-persistence Specification

## Purpose
TBD - created by archiving change build-habit-tracker-pwa. Update Purpose after archive.
## Requirements
### Requirement: Persist domain data locally first
The system SHALL persist habit types, time entries, preferences, seed state, and pending synchronization operations in IndexedDB before reporting a mutation as saved.

#### Scenario: Record slots while offline
- **WHEN** the user saves a time entry without connectivity
- **THEN** it SHALL survive application restart and remain queued for later synchronization

### Requirement: Establish identity without visible login
The system SHALL restore a persisted Firebase session or create an anonymous identity when online without presenting a login form.

#### Scenario: Return on the same browser
- **WHEN** a persisted anonymous session exists
- **THEN** the tracker SHALL restore it without requesting credentials

#### Scenario: First visit is offline
- **WHEN** no identity exists and Firebase is unreachable
- **THEN** local use SHALL remain available and identity creation SHALL be deferred

### Requirement: Synchronize record changes
The system SHALL synchronize `habitTypes` and `entries` records with Firestore using last-write-wins timestamps and tombstones.

#### Scenario: Connectivity returns
- **WHEN** pending mutations exist and authentication becomes available
- **THEN** remote records SHALL be merged before newer local records are pushed and acknowledged operations SHALL leave the queue

#### Scenario: Synchronization fails
- **WHEN** a cloud operation is rejected or interrupted
- **THEN** local data and pending operations SHALL remain intact and a non-blocking status SHALL be shown

### Requirement: Isolate cloud data by user
Firestore rules SHALL deny unauthenticated access and SHALL allow an authenticated user to access only descendants of `users/{request.auth.uid}`.

#### Scenario: Access own records
- **WHEN** an authenticated request targets the requesting user's habit types or entries
- **THEN** Firestore SHALL allow the supported read or write

#### Scenario: Access another user or access anonymously
- **WHEN** a request targets another UID or has no authenticated identity
- **THEN** Firestore SHALL deny the request

### Requirement: Communicate durability state
The system SHALL distinguish local-only, connecting, syncing, synchronized, offline, and error states without disabling local entry.

#### Scenario: Writes are pending
- **WHEN** at least one mutation is not acknowledged by Firestore
- **THEN** the interface SHALL show a pending state while leaving habit cards usable

### Requirement: Explain recoverable cloud configuration errors
The system SHALL translate recognized Firebase Authentication and Firestore configuration failures into concise, actionable recovery guidance while retaining useful details for unknown errors.

#### Scenario: End-user account creation is restricted
- **WHEN** anonymous authentication fails with `auth/admin-restricted-operation`
- **THEN** the cloud panel SHALL instruct the owner to enable end-user account creation in Firebase Authentication settings

#### Scenario: Anonymous provider is disabled
- **WHEN** anonymous authentication fails with `auth/operation-not-allowed`
- **THEN** the cloud panel SHALL instruct the owner to enable the Anonymous sign-in provider

#### Scenario: Unknown cloud failure occurs
- **WHEN** synchronization fails with an unrecognized error
- **THEN** the cloud panel SHALL retain the original error message without blocking local habit entry

