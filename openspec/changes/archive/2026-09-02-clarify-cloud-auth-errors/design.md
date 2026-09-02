## Context

Agatsu authenticates with `signInAnonymously` before reading or writing the user's Firestore subtree. Cloud failures are caught by `CloudSync`, but their raw SDK message is currently sent directly to the settings view. Firebase configuration errors therefore look like internal application failures even though local-first persistence continues working.

## Goals / Non-Goals

**Goals:**

- Recognize common Firebase error codes and explain the exact console setting needed to recover.
- Use the same translation for connection, flush, and snapshot errors.
- Preserve raw messages for unknown failures and keep local data and retries unchanged.
- Make the project setup checklist complete and current.

**Non-Goals:**

- Changing Firebase project settings from the public client.
- Replacing anonymous authentication or modifying Firestore security rules.
- Hiding unexpected error details that remain useful for diagnosis.

## Decisions

A small pure formatter will inspect the Firebase `code` property and return a Spanish recovery message for known configuration failures. Keeping this outside React and Firebase initialization makes it straightforward to test and lets every cloud-sync catch path use identical behavior.

The formatter will cover blocked account creation, a disabled Anonymous provider, an unauthorized GitHub Pages domain, and denied Firestore access. Unknown `Error` instances retain their original message; non-error values use a safe generic fallback.

The UI will continue showing these details only in the non-blocking cloud panel. Local entry remains available and the existing retry button can be used immediately after the console setting is corrected.

## Risks / Trade-offs

- [Firebase console labels can change] → Mention both the stable setting concept and its current Spanish navigation path.
- [An SDK error may not expose a structured code] → Also recognize a Firebase code embedded in the message before falling back to the raw text.
- [The client cannot repair an administrator restriction] → Give an exact recovery action and keep data queued locally until the owner completes it.

## Migration Plan

Deploy as a frontend-only release. No stored data or cloud documents are migrated. Rolling back restores raw error text but does not affect queued local operations.

## Open Questions

None.
