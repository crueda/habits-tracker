import { useEffect, useMemo, useRef, useState } from 'react'
import { LayoutGrid } from 'lucide-react'
import type { LocalDate } from '../types'
import { formatDate, fromLocalDate, toLocalDate } from '../lib/dates'
import { dailyAchievement, entryFor, habitSlotLevel, heatmapLevel, heatmapMonths, visibleHabitTypes } from '../lib/stats'
import { HabitIcon } from '../lib/habit-icons'
import { useHabits } from '../state/HabitsContext'
import { ProgressDaySheet } from './ProgressDaySheet'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export function ProgressView() {
  const { habitTypes, entries } = useHabits()
  const habits = useMemo(() => visibleHabitTypes(habitTypes), [habitTypes])
  const months = useMemo(() => heatmapMonths(toLocalDate(), 12), [])
  const [filterId, setFilterId] = useState<'all' | string>('all')
  const [selectedDate, setSelectedDate] = useState<LocalDate>()
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedHabit = filterId === 'all' ? undefined : habits.find((habit) => habit.id === filterId)
  const filteredHabits = selectedHabit ? [selectedHabit] : habits

  useEffect(() => {
    const viewport = scrollRef.current
    if (viewport) viewport.scrollLeft = viewport.scrollWidth - viewport.clientWidth
  }, [months])

  return (
    <section className="progress-focus view-enter" aria-label="Progreso de hábitos">
      <div className="habit-filter-rail" role="group" aria-label="Filtrar gráfico por hábito">
        <button className={!selectedHabit ? 'selected' : ''} type="button" aria-pressed={!selectedHabit} onClick={() => setFilterId('all')}><LayoutGrid /> Todos</button>
        {habits.map((habit) => <button key={habit.id} className={selectedHabit?.id === habit.id ? 'selected' : ''} type="button"
          aria-pressed={selectedHabit?.id === habit.id} onClick={() => setFilterId(habit.id)}><HabitIcon name={habit.icon} /> {habit.name}</button>)}
      </div>

      <article className="heatmap-card focused monthly" aria-label={`Actividad de ${selectedHabit?.name ?? 'todos los hábitos'} durante los últimos 12 meses`}>
        <div ref={scrollRef} className="monthly-scroll">
          {months.map((month) => {
            const monthDate = fromLocalDate(`${month.id}-01` as LocalDate)
            const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(monthDate)
            return <section className="month-panel" key={month.id} aria-label={`${monthName} de ${monthDate.getFullYear()}`}>
              <h2><span>{monthName}</span> {monthDate.getFullYear()}</h2>
              <div className="month-weekdays" aria-hidden="true">{WEEKDAYS.map((day) => <span key={day}>{day}</span>)}</div>
              <div className="month-grid">
                {month.days.map((date, cellIndex) => {
                  if (!date) return <span className="month-cell empty" key={cellIndex} />
                  const entry = selectedHabit ? entryFor(entries, selectedHabit.id, date) : undefined
                  const summary = selectedHabit ? undefined : dailyAchievement(habits, entries, date)
                  const level = selectedHabit
                    ? habitSlotLevel(entry?.slots ?? 0, selectedHabit.targetSlots)
                    : heatmapLevel(summary?.achieved ?? 0, summary?.total ?? 0)
                  const detail = selectedHabit
                    ? `${entry?.slots ?? 0} de ${selectedHabit.targetSlots} slots`
                    : `${summary?.achieved ?? 0} de ${summary?.total ?? 0} hábitos`
                  return <button key={date} type="button" className={`month-cell heatmap-cell level-${level}`}
                    aria-label={`${formatDate(date)}: ${detail}`} title={`${date}: ${detail}`}
                    onClick={() => setSelectedDate(date)} />
                })}
              </div>
            </section>
          })}
        </div>
        <footer className="heatmap-legend"><span>Menos</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`level-${level}`} />)}<span>Más</span></footer>
      </article>

      {selectedDate && <ProgressDaySheet date={selectedDate} habits={filteredHabits} entries={entries} onClose={() => setSelectedDate(undefined)} />}
    </section>
  )
}
