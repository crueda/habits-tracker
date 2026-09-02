import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import type { HabitIconName, HabitType, HabitTypeDraft } from '../types'
import { formatDuration } from '../lib/dates'
import { HABIT_ICON_OPTIONS, HabitIcon } from '../lib/habit-icons'
import { useHabits } from '../state/HabitsContext'

const COLORS = ['#e57542', '#4d8b63', '#6672a5', '#3f7c85', '#b85c70', '#9a6a3a', '#6e5b88', '#4d738b']
const DEFAULT_DRAFT: HabitTypeDraft = { name: '', icon: 'target', color: COLORS[0], slotMinutes: 15, targetSlots: 1 }

export function HabitTypeEditor({ habit, onClose }: { habit?: HabitType; onClose: () => void }) {
  const { createHabitType, updateHabitType } = useHabits()
  const [draft, setDraft] = useState<HabitTypeDraft>(habit ? {
    name: habit.name, icon: habit.icon, color: habit.color,
    slotMinutes: habit.slotMinutes, targetSlots: habit.targetSlots,
  } : DEFAULT_DRAFT)
  const [saving, setSaving] = useState(false)
  const valid = draft.name.trim().length > 0 && draft.name.trim().length <= 80
    && draft.slotMinutes >= 1 && draft.slotMinutes <= 480
    && draft.targetSlots >= 1 && draft.targetSlots <= 96

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  const save = async () => {
    if (!valid) return
    setSaving(true)
    if (habit) await updateHabitType(habit.id, draft)
    else await createHabitType(draft)
    setSaving(false)
    onClose()
  }

  return (
    <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="habit-editor-title">
        <header className="sheet-header"><h2 id="habit-editor-title">{habit ? 'Editar hábito' : 'Nuevo hábito'}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar"><X /></button></header>

        <label className="field-label" htmlFor="habit-name">Nombre</label>
        <input id="habit-name" autoFocus className={`text-input ${draft.name.length > 80 ? 'invalid' : ''}`} maxLength={81}
          value={draft.name} placeholder="Por ejemplo, Meditación" onChange={(event) => setDraft({ ...draft, name: event.target.value })} />

        <fieldset className="choice-fieldset"><legend className="field-label">Icono</legend><div className="icon-choices">
          {HABIT_ICON_OPTIONS.map(({ id, label }) => <button key={id} className={`choice-icon ${draft.icon === id ? 'selected' : ''}`} type="button"
            title={label} aria-label={label} aria-pressed={draft.icon === id} onClick={() => setDraft({ ...draft, icon: id as HabitIconName })}><HabitIcon name={id} /></button>)}
        </div></fieldset>

        <fieldset className="choice-fieldset"><legend className="field-label">Color</legend><div className="color-choices">
          {COLORS.map((color) => <button key={color} className={`color-choice ${draft.color === color ? 'selected' : ''}`} style={{ background: color }}
            type="button" aria-label={`Color ${color}`} aria-pressed={draft.color === color} onClick={() => setDraft({ ...draft, color })}>{draft.color === color && <Check />}</button>)}
          <label className="custom-color" title="Elegir otro color"><input type="color" value={draft.color} onChange={(event) => setDraft({ ...draft, color: event.target.value })} /><span>+</span></label>
        </div></fieldset>

        <div className="number-fields">
          <label><span className="field-label">Minutos por slot</span><input className="text-input" type="number" inputMode="numeric" min="1" max="480" value={draft.slotMinutes}
            onChange={(event) => setDraft({ ...draft, slotMinutes: Number(event.target.value) })} /></label>
          <label><span className="field-label">Slots para conseguirlo</span><input className="text-input" type="number" inputMode="numeric" min="1" max="96" value={draft.targetSlots}
            onChange={(event) => setDraft({ ...draft, targetSlots: Number(event.target.value) })} /></label>
        </div>
        <p className="target-preview">Objetivo diario: <strong>{formatDuration(draft.slotMinutes * draft.targetSlots)}</strong></p>
        <button className="primary-button full-width sheet-submit" type="button" disabled={!valid || saving} onClick={() => void save()}>
          {saving ? 'Guardando…' : habit ? 'Guardar cambios' : 'Crear hábito'}
        </button>
      </section>
    </div>
  )
}
