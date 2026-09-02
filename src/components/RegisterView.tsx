import { useMemo, useState } from 'react'
import {
  DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates, useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical, Pencil, Plus } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { HabitType } from '../types'
import { formatDuration, formatDate, toLocalDate } from '../lib/dates'
import { activeHabitTypes, dailyAchievement, entryFor } from '../lib/stats'
import { HabitIcon } from '../lib/habit-icons'
import { useHabits } from '../state/HabitsContext'

function SortableHabitCard({ habit, ordering, onOpen }: {
  habit: HabitType
  ordering: boolean
  onOpen: () => void
}) {
  const { entries } = useHabits()
  const today = toLocalDate()
  const slots = entryFor(entries, habit.id, today)?.slots ?? 0
  const achieved = slots >= habit.targetSlots
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: habit.id,
    disabled: !ordering,
  })
  const style = {
    '--habit-color': habit.color,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  } as CSSProperties

  return (
    <button ref={setNodeRef} style={style} className={`record-card ${achieved ? 'achieved' : ''} ${ordering ? 'ordering' : ''}`}
      type="button" onClick={ordering ? undefined : onOpen} {...(ordering ? { ...attributes, ...listeners } : {})}>
      <span className="record-card-top">
        <span className="record-icon"><HabitIcon name={habit.icon} size={29} strokeWidth={1.8} /></span>
        {ordering ? <GripVertical className="drag-mark" size={22} /> : achieved && <span className="done-mark"><Check size={16} /></span>}
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
  const { habitTypes, entries, reorderHabitTypes } = useHabits()
  const habits = useMemo(() => activeHabitTypes(habitTypes), [habitTypes])
  const [ordering, setOrdering] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const today = toLocalDate()
  const progress = dailyAchievement(habits, entries, today)

  const dragEnd = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) return
    const oldIndex = habits.findIndex((habit) => habit.id === event.active.id)
    const newIndex = habits.findIndex((habit) => habit.id === event.over?.id)
    void reorderHabitTypes(arrayMove(habits, oldIndex, newIndex).map((habit) => habit.id))
  }

  return (
    <section className="view-stack view-enter">
      <header className="view-title-row">
        <div><span className="eyebrow">{formatDate(today)}</span><h1>Registra tu ritmo</h1></div>
        {habits.length > 1 && (
          <button className={`soft-button compact ${ordering ? 'selected' : ''}`} type="button" onClick={() => setOrdering(!ordering)}>
            <Pencil size={15} /> {ordering ? 'Listo' : 'Ordenar'}
          </button>
        )}
      </header>

      <div className="today-summary">
        <span><strong>{progress.achieved}</strong> de {progress.total} conseguidos</span>
        <div><i style={{ width: `${progress.percentage}%` }} /></div>
      </div>

      {ordering && <p className="order-hint">Arrastra los botones para colocarlos a tu gusto.</p>}
      {habits.length ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}>
          <SortableContext items={habits.map((habit) => habit.id)} strategy={rectSortingStrategy}>
            <div className="record-grid">
              {habits.map((habit) => <SortableHabitCard key={habit.id} habit={habit} ordering={ordering} onOpen={() => onOpen(habit)} />)}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="empty-card"><h3>Aún no tienes hábitos</h3><p>Crea el primero para empezar a registrar tiempo.</p>
          <button className="primary-button" type="button" onClick={onCreate}><Plus size={17} /> Crear hábito</button></div>
      )}
    </section>
  )
}
