## Context

Registro currently renders a large title/date header, achieved counter, progress bar, reorder toggle, and optional reorder hint above its two-column card grid. Reordering is implemented directly on the cards with dnd-kit even though it is an occasional configuration task.

## Goals / Non-Goals

**Goals:**

- Put habit actions immediately below the global application header.
- Ensure every card tap on Registro opens time entry.
- Retain reorder functionality in a more appropriate configuration location.
- Preserve touch, pointer, and keyboard access to reordering.

**Non-Goals:**

- Remove progress information from individual cards or the Progreso destination.
- Change card size, stored order format, habit data, or navigation.

## Decisions

### Make Registro a plain action grid when populated

The populated state renders only the card grid. The global Agatsu header continues to provide identity and synchronization status, while each card retains today's slot/target status. The empty state keeps its create-habit call to action.

### Move drag-and-drop to the management list

Hábitos exposes an `Ordenar`/`Listo` control beside the type count. In order mode, management actions are hidden and each active row becomes a sortable element with a visible grip. Reuse dnd-kit's pointer, delayed touch, and keyboard sensors and the existing normalized persistence action.

### Use vertical-list collision and sorting behavior

The configuration view is a single-column list, so use `verticalListSortingStrategy` with closest-center collision. This produces predictable movement on phones and with keyboard controls.

## Risks / Trade-offs

- **Daily summary is no longer visible on Registro** → Individual cards still show slots and achieved state; aggregate insight remains in Progreso.
- **Users may not discover reordering immediately** → Keep a clearly labeled button in the primary habit-management section and show a short instruction while active.
- **Editing is unavailable during order mode** → Hide row actions and provide `Listo` to exit, preventing accidental destructive actions while dragging.
