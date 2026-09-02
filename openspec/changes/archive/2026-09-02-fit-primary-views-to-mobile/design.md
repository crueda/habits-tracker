## Context

The fixed bottom navigation and compact header define a bounded content area on phones, but both focused views currently rely on minimum heights that can overflow. Progreso also lays out 52 week columns in one very wide element, so month boundaries are incidental rather than the navigation unit.

## Goals / Non-Goals

**Goals:**

- Keep Registro and Progreso within the visible phone viewport.
- Preserve every existing action, filter, intensity calculation, and day-detail sheet.
- Make one calendar month the unit of horizontal progress navigation.
- Keep cloud state available where it can be understood and acted upon.

**Non-Goals:**

- Changing habit or entry persistence.
- Adding month selectors, remote integrations, or new dependencies.
- Preventing the settings destination or modal sheets from scrolling when their content requires it.

## Decisions

- The focused shell uses the dynamic viewport height and reserves explicit header and navigation regions. Only Registro and Progreso suppress document overflow; Hábitos remains a normal scrolling document.
- Registro exposes computed row and column counts as CSS custom properties. CSS grid then shares all available height equally, avoiding fixed card minimum heights.
- A pure statistics helper creates twelve six-week calendar matrices. Progreso renders them in a `scroll-snap-type: x mandatory` rail and positions the last panel on mount.
- The global cloud badge is removed from the header. The existing labelled badge, error detail, and retry control remain together under Hábitos > Copia en la nube.

## Risks / Trade-offs

- [Many active habits can make cards dense] → Reduce spacing and typography progressively while preserving tap targets for the current expected habit counts.
- [Mobile browser bars alter available height] → Use `100dvh` with the existing `100vh` fallback.
- [Programmatic initial scrolling can miss layout timing] → Scroll the final month panel into view after mount with a direct container scroll position.
