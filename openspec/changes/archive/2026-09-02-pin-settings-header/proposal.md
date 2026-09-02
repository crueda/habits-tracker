## Why

Hábitos needs vertical scrolling for its configuration sections, but the application identity currently disappears as soon as the user scrolls. Keeping the compact brand bar visible preserves orientation without reducing the flexibility of the settings content.

## What Changes

- Keep the Agatsu icon and name pinned to the top while Hábitos scrolls.
- Give the pinned header an opaque, lightly blurred surface so settings content remains readable beneath it.
- Preserve the existing free scrolling behavior of the complete settings destination.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `mobile-pwa`: The mobile shell gains a persistent branded header specifically for the scrolling Hábitos destination.

## Impact

This is limited to the application header class selection and shell styles. Navigation, data, Firebase, and settings behavior are unchanged.
