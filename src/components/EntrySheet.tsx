import { useEffect, useState, type CSSProperties } from 'react'
import { Check, Minus, Plus, X } from 'lucide-react'
import type { HabitType, LocalDate, TimeEntry } from '../types'
import { formatDuration, toLocalDate } from '../lib/dates'
import { entryFor } from '../lib/stats'
import { HabitIcon } from '../lib/habit-icons'
import { useHabits } from '../state/HabitsContext'

export function EntrySheet({ habit, entries, onClose }: {
  habit: HabitType
  entries: TimeEntry[]
  onClose: () => void
}) {
  const { saveTimeEntry } = useHabits()
  const today = toLocalDate()
  const [date, setDate] = useState<LocalDate>(today)
  const [slots, setSlots] = useState(() => entryFor(entries, habit.id, today)?.slots ?? 1)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  const achieved = slots >= habit.targetSlots
  const save = async () => {
    setSaving(true)
    await saveTimeEntry(habit.id, date, slots)
    setSaving(false)
    onClose()
  }

  return (
    <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="sheet entry-sheet" role="dialog" aria-modal="true" aria-labelledby="entry-title">
        <header className="sheet-header">
          <div className="entry-heading">
            <span className="entry-icon" style={{ '--habit-color': habit.color } as CSSProperties}>
              <HabitIcon name={habit.icon} size={25} />
            </span>
            <div><small>Registrar tiempo</small><h2 id="entry-title">{habit.name}</h2></div>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar"><X /></button>
        </header>

        <label className="field-label" htmlFor="entry-date">Día</label>
        <input id="entry-date" className="text-input" type="date" value={date} max={today}
          onChange={(event) => {
            const nextDate = event.target.value as LocalDate
            setDate(nextDate)
            setSlots(entryFor(entries, habit.id, nextDate)?.slots ?? 1)
          }} />

        <span className="field-label">Slots de tiempo</span>
        <div className="slot-stepper">
          <button type="button" onClick={() => setSlots((value) => Math.max(0, value - 1))} aria-label="Quitar un slot"><Minus /></button>
          <label>
            <input type="number" inputMode="numeric" min="0" max="96" value={slots}
              onChange={(event) => setSlots(Number.isFinite(event.currentTarget.valueAsNumber)
                ? Math.min(96, Math.max(0, event.currentTarget.valueAsNumber)) : 0)} />
            <span>{slots === 1 ? 'slot' : 'slots'}</span>
          </label>
          <button type="button" onClick={() => setSlots((value) => Math.min(96, value + 1))} aria-label="Añadir un slot"><Plus /></button>
        </div>

        <div className={`entry-result ${achieved ? 'achieved' : ''}`}>
          <div><strong>{formatDuration(slots * habit.slotMinutes)}</strong><span>{habit.slotMinutes} min por slot</span></div>
          <div>{achieved && <Check size={17} />}<span>{achieved ? 'Objetivo conseguido' : `Faltan ${habit.targetSlots - slots} slots`}</span></div>
        </div>

        <button className="primary-button full-width sheet-submit" type="button" disabled={saving || !date || date > today} onClick={() => void save()}>
          {saving ? 'Guardando…' : slots === 0 ? 'Borrar registro' : 'Guardar registro'}
        </button>
      </section>
    </div>
  )
}
