import { useMemo, type CSSProperties } from 'react'
import { Check, Plus } from 'lucide-react'
import type { HabitType } from '../types'
import { formatDuration, toLocalDate } from '../lib/dates'
import { activeHabitTypes, entryFor } from '../lib/stats'
import { HabitIcon } from '../lib/habit-icons'
import { useHabits } from '../state/HabitsContext'

function HabitCard({ habit, onOpen }: { habit: HabitType; onOpen: () => void }) {
  const { entries } = useHabits()
  const slots = entryFor(entries, habit.id, toLocalDate())?.slots ?? 0
  const achieved = slots >= habit.targetSlots

  return (
    <button
      style={{ '--habit-color': habit.color } as CSSProperties}
      className={`record-card ${achieved ? 'achieved' : ''}`}
      type="button"
      onClick={onOpen}
    >
      <span className="record-card-top">
        <span className="record-icon"><HabitIcon name={habit.icon} size={29} strokeWidth={1.8} /></span>
        {achieved && <span className="done-mark"><Check size={16} /></span>}
      </span>
      <span className="record-card-copy">
        <strong>{habit.name}</strong>
        <small>{slots}/{habit.targetSlots} slots · {formatDuration(slots * habit.slotMinutes)}</small>
      </span>
    </button>
  )
}

export function RegisterView({ onOpen, onCreate }: {
  onOpen: (habit: HabitType) => void
  onCreate: () => void
}) {
  const { habitTypes } = useHabits()
  const habits = useMemo(() => activeHabitTypes(habitTypes), [habitTypes])
  const gridStyle = {
    '--record-columns': Math.min(2, habits.length),
    '--record-columns-wide': Math.min(3, habits.length),
  } as CSSProperties

  return (
    <section className="register-view view-enter" aria-label="Registro de hábitos">
      {habits.length ? (
        <div className={`record-grid ${habits.length > 6 ? 'dense' : ''}`} style={gridStyle}>
          {habits.map((habit) => <HabitCard key={habit.id} habit={habit} onOpen={() => onOpen(habit)} />)}
        </div>
      ) : (
        <div className="empty-card"><h3>Aún no tienes hábitos</h3><p>Crea el primero para empezar a registrar tiempo.</p>
          <button className="primary-button" type="button" onClick={onCreate}><Plus size={17} /> Crear hábito</button></div>
      )}
    </section>
  )
}
