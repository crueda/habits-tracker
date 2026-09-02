import { useEffect, type CSSProperties } from 'react'
import { Check, Minus, X } from 'lucide-react'
import type { HabitType, LocalDate, TimeEntry } from '../types'
import { formatDate, formatDuration } from '../lib/dates'
import { dailyAchievement, entryFor } from '../lib/stats'
import { HabitIcon } from '../lib/habit-icons'

export function ProgressDaySheet({ date, habits, entries, onClose }: {
  date: LocalDate
  habits: HabitType[]
  entries: TimeEntry[]
  onClose: () => void
}) {
  const summary = dailyAchievement(habits, entries, date)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  return (
    <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="sheet progress-day-sheet" role="dialog" aria-modal="true" aria-labelledby="progress-day-title">
        <header className="sheet-header">
          <div><h2 id="progress-day-title">{formatDate(date)}</h2><small>{summary.achieved} de {summary.total} objetivos logrados</small></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar"><X /></button>
        </header>
        <ul className="progress-detail-list">
          {habits.map((habit) => {
            const entry = entryFor(entries, habit.id, date)
            const slots = entry?.slots ?? 0
            const achieved = slots >= habit.targetSlots
            return <li key={habit.id}>
              <span className="mini-habit-icon" style={{ '--habit-color': habit.color } as CSSProperties}><HabitIcon name={habit.icon} /></span>
              <span><strong>{habit.name}</strong><small>{slots}/{habit.targetSlots} slots · {formatDuration(slots * habit.slotMinutes)}</small></span>
              <span className={achieved ? 'detail-state achieved' : 'detail-state'}>{achieved ? <Check /> : <Minus />}</span>
            </li>
          })}
          {!habits.length && <li className="quiet-empty">No hay hábitos para este filtro.</li>}
        </ul>
      </section>
    </div>
  )
}
