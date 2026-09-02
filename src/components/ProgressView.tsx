import { useMemo, useState, type CSSProperties } from 'react'
import { Check, Clock3, Flame, Minus } from 'lucide-react'
import { addDays, formatDate, formatDuration, fromLocalDate, toLocalDate } from '../lib/dates'
import { dailyAchievement, entryFor, heatmapLevel, heatmapWeeks, rangeAchievement, visibleHabitTypes } from '../lib/stats'
import { HabitIcon } from '../lib/habit-icons'
import { useHabits } from '../state/HabitsContext'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export function ProgressView() {
  const { habitTypes, entries } = useHabits()
  const today = toLocalDate()
  const weeks = useMemo(() => heatmapWeeks(today, 16), [today])
  const habits = useMemo(() => visibleHabitTypes(habitTypes), [habitTypes])
  const [selected, setSelected] = useState(today)
  const selectedSummary = dailyAchievement(habitTypes, entries, selected)
  const range = rangeAchievement(habitTypes, entries, weeks[0][0]!, today)
  const lastSeven = rangeAchievement(habitTypes, entries, addDays(today, -6), today)

  const monthLabels = weeks.map((week, index) => {
    const date = week.find(Boolean)
    if (!date) return ''
    const month = fromLocalDate(date).getMonth()
    const previous = index ? weeks[index - 1].find(Boolean) : undefined
    return !previous || fromLocalDate(previous).getMonth() !== month
      ? new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(fromLocalDate(date)).replace('.', '')
      : ''
  })

  return (
    <section className="view-stack view-enter">
      <header className="view-title-row"><div><span className="eyebrow">Últimas 16 semanas</span><h1>Tu progreso</h1></div></header>

      <div className="metric-grid">
        <article className="metric-card feature"><Flame size={20} /><strong>{lastSeven.percentage}%</strong><span>últimos 7 días</span></article>
        <article className="metric-card"><Clock3 size={20} /><strong>{range.achieved}</strong><span>objetivos logrados</span></article>
      </div>

      <article className="heatmap-card">
        <header><div><h2>Actividad</h2><p>La intensidad aumenta con los hábitos conseguidos.</p></div></header>
        <div className="heatmap-scroll">
          <div className="heatmap-months" aria-hidden="true"><span />{monthLabels.map((label, index) => <span key={index}>{label}</span>)}</div>
          <div className="heatmap-body">
            <div className="heatmap-weekdays" aria-hidden="true">{WEEKDAYS.map((day) => <span key={day}>{day}</span>)}</div>
            <div className="heatmap-weeks">
              {weeks.map((week, weekIndex) => (
                <div className="heatmap-week" key={weekIndex}>
                  {week.map((date, dayIndex) => {
                    if (!date) return <span className="heatmap-cell future" key={dayIndex} />
                    const summary = dailyAchievement(habitTypes, entries, date)
                    const level = heatmapLevel(summary.achieved, summary.total)
                    return <button key={date} type="button" className={`heatmap-cell level-${level} ${selected === date ? 'selected' : ''}`}
                      aria-label={`${formatDate(date)}: ${summary.achieved} de ${summary.total} hábitos`}
                      title={`${date}: ${summary.achieved}/${summary.total}`} onClick={() => setSelected(date)} />
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <footer className="heatmap-legend"><span>Menos</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`level-${level}`} />)}<span>Más</span></footer>
      </article>

      <article className="day-detail-card">
        <header><div><span className="eyebrow">Detalle</span><h2>{formatDate(selected)}</h2></div><strong>{selectedSummary.achieved}/{selectedSummary.total}</strong></header>
        <ul className="progress-detail-list">
          {habits.map((habit) => {
            const entry = entryFor(entries, habit.id, selected)
            const achieved = (entry?.slots ?? 0) >= habit.targetSlots
            return (
              <li key={habit.id}>
                <span className="mini-habit-icon" style={{ '--habit-color': habit.color } as CSSProperties}><HabitIcon name={habit.icon} size={17} /></span>
                <span><strong>{habit.name}</strong><small>{entry?.slots ?? 0}/{habit.targetSlots} slots · {formatDuration((entry?.slots ?? 0) * habit.slotMinutes)}</small></span>
                <span className={achieved ? 'detail-state achieved' : 'detail-state'}>{achieved ? <Check /> : <Minus />}</span>
              </li>
            )
          })}
        </ul>
      </article>
    </section>
  )
}
