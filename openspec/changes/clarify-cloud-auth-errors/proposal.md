## Why

When Firebase blocks anonymous account creation, Agatsu currently exposes the raw `auth/admin-restricted-operation` message, which does not tell the owner how to restore cloud synchronization. Local data remains safe, but the configuration problem is needlessly difficult to diagnose.

## What Changes

- Translate known Firebase Authentication and Firestore setup errors into concise Spanish recovery instructions.
- Keep unknown error details available without changing retry or local-first behavior.
- Document both Firebase switches required for anonymous synchronization: end-user account creation and the Anonymous sign-in provider.
- Refresh stale README descriptions and OpenSpec links while documenting the setup.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `offline-cloud-persistence`: Cloud configuration failures gain actionable, non-blocking recovery messages.

## Impact

The change affects cloud error presentation, its unit tests, and Firebase setup documentation. It does not change the authentication model, stored data, Firestore paths or rules, dependencies, or the free Spark plan.
