## ADDED Requirements

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
