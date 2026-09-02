import { useEffect, useMemo, useRef, useState } from 'react'
import { LayoutGrid } from 'lucide-react'
import type { LocalDate } from '../types'
import { formatDate, fromLocalDate, toLocalDate } from '../lib/dates'
import { dailyAchievement, entryFor, habitSlotLevel, heatmapLevel, heatmapWeeks, visibleHabitTypes } from '../lib/stats'
import { HabitIcon } from '../lib/habit-icons'
import { useHabits } from '../state/HabitsContext'
import { ProgressDaySheet } from './ProgressDaySheet'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export function ProgressView() {
  const { habitTypes, entries } = useHabits()
  const habits = useMemo(() => visibleHabitTypes(habitTypes), [habitTypes])
  const weeks = useMemo(() => heatmapWeeks(toLocalDate(), 52), [])
  const [filterId, setFilterId] = useState<'all' | string>('all')
  const [selectedDate, setSelectedDate] = useState<LocalDate>()
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedHabit = filterId === 'all' ? undefined : habits.find((habit) => habit.id === filterId)
  const filteredHabits = selectedHabit ? [selectedHabit] : habits

  useEffect(() => {
    const viewport = scrollRef.current
    if (viewport) viewport.scrollLeft = viewport.scrollWidth
  }, [weeks])

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
    <section className="progress-focus view-enter" aria-label="Progreso de hábitos">
      <div className="habit-filter-rail" role="group" aria-label="Filtrar gráfico por hábito">
        <button className={!selectedHabit ? 'selected' : ''} type="button" aria-pressed={!selectedHabit} onClick={() => setFilterId('all')}><LayoutGrid /> Todos</button>
        {habits.map((habit) => <button key={habit.id} className={selectedHabit?.id === habit.id ? 'selected' : ''} type="button"
          aria-pressed={selectedHabit?.id === habit.id} onClick={() => setFilterId(habit.id)}><HabitIcon name={habit.icon} /> {habit.name}</button>)}
      </div>

      <article className="heatmap-card focused" aria-label={`Actividad de ${selectedHabit?.name ?? 'todos los hábitos'} durante las últimas 52 semanas`}>
        <div ref={scrollRef} className="heatmap-scroll focused-scroll">
          <div className="heatmap-months year" aria-hidden="true"><span />{monthLabels.map((label, index) => <span key={index}>{label}</span>)}</div>
          <div className="heatmap-body year">
            <div className="heatmap-weekdays year" aria-hidden="true">{WEEKDAYS.map((day) => <span key={day}>{day}</span>)}</div>
            <div className="heatmap-weeks year">
              {weeks.map((week, weekIndex) => <div className="heatmap-week year" key={weekIndex}>
                {week.map((date, dayIndex) => {
                  if (!date) return <span className="heatmap-cell year future" key={dayIndex} />
                  const entry = selectedHabit ? entryFor(entries, selectedHabit.id, date) : undefined
                  const summary = selectedHabit ? undefined : dailyAchievement(habits, entries, date)
                  const level = selectedHabit
                    ? habitSlotLevel(entry?.slots ?? 0, selectedHabit.targetSlots)
                    : heatmapLevel(summary?.achieved ?? 0, summary?.total ?? 0)
                  const detail = selectedHabit
                    ? `${entry?.slots ?? 0} de ${selectedHabit.targetSlots} slots`
                    : `${summary?.achieved ?? 0} de ${summary?.total ?? 0} hábitos`
                  return <button key={date} type="button" className={`heatmap-cell year level-${level}`}
                    aria-label={`${formatDate(date)}: ${detail}`} title={`${date}: ${detail}`}
                    onClick={() => setSelectedDate(date)} />
                })}
              </div>)}
            </div>
          </div>
        </div>
        <footer className="heatmap-legend"><span>Menos</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`level-${level}`} />)}<span>Más</span></footer>
      </article>

      {selectedDate && <ProgressDaySheet date={selectedDate} habits={filteredHabits} entries={entries} onClose={() => setSelectedDate(undefined)} />}
    </section>
  )
}
