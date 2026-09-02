## Context

Registro and Progreso use a height-constrained focused shell, while Hábitos intentionally uses normal document scrolling. Its header currently participates in that document flow.

## Goals / Non-Goals

**Goals:**

- Keep the brand visible while settings scroll.
- Preserve safe-area spacing, themes, and readable content beneath the header.

**Non-Goals:**

- Pinning settings section headings or changing the bottom navigation.
- Constraining the settings destination to one viewport.

## Decisions

- Add an explicit settings-only header class from the current view state and use `position: sticky` with `top: 0`. Sticky positioning keeps the header bounded to the application shell and requires no scroll listeners.
- Use the themed background with transparency and backdrop blur, plus a subtle lower border, to separate moving content without introducing another visual component.

## Risks / Trade-offs

- [Sticky elements can obscure anchored content] → The header remains in normal layout flow, so content starts below it.
