import { useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import {
  DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Archive, Cloud, Download, FileText, GripVertical, Moon, Pencil, Plus, RefreshCw, RotateCcw,
  ShieldCheck, Smartphone, Sun, Trash2, Upload,
} from 'lucide-react'
import type { HabitType, ThemePreference } from '../types'
import { createBackup, createMarkdownReport, downloadText, parseBackup } from '../lib/backup'
import { formatDate, formatDuration, toLocalDate } from '../lib/dates'
import { HabitIcon } from '../lib/habit-icons'
import { useHabits } from '../state/HabitsContext'
import { SyncBadge } from './SyncBadge'

function SortableHabitRow({ habit, ordering, onEdit, onArchive, onDelete }: {
  habit: HabitType
  ordering: boolean
  onEdit: () => void
  onArchive: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: habit.id,
    disabled: !ordering,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
    zIndex: isDragging ? 2 : undefined,
  } as CSSProperties

  return (
    <article ref={setNodeRef} className={`manage-habit ${ordering ? 'ordering' : ''}`} style={style}>
      {ordering && <button className="order-handle" type="button" aria-label={`Mover ${habit.name}`} {...attributes} {...listeners}><GripVertical /></button>}
      <span className="mini-habit-icon" style={{ '--habit-color': habit.color } as CSSProperties}><HabitIcon name={habit.icon} /></span>
      <div className="manage-habit-copy"><strong>{habit.name}</strong><span>{habit.slotMinutes} min/slot · objetivo {habit.targetSlots} ({formatDuration(habit.slotMinutes * habit.targetSlots)})</span></div>
      {!ordering && <div className="row-actions">
        <button type="button" onClick={onEdit} aria-label={`Editar ${habit.name}`}><Pencil /></button>
        <button type="button" onClick={onArchive} aria-label={`Archivar ${habit.name}`}><Archive /></button>
        <button className="danger" type="button" onClick={onDelete} aria-label={`Eliminar ${habit.name}`}><Trash2 /></button>
      </div>}
    </article>
  )
}

export function HabitsView({ onCreate, onEdit }: { onCreate: () => void; onEdit: (habit: HabitType) => void }) {
  const store = useHabits()
  const [message, setMessage] = useState<string>()
  const [ordering, setOrdering] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)
  const active = store.habitTypes.filter((habit) => !habit.deletedAt && !habit.archivedAt).sort((a, b) => a.order - b.order)
  const archived = store.habitTypes.filter((habit) => !habit.deletedAt && habit.archivedAt)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const dragEnd = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) return
    const previousIndex = active.findIndex((habit) => habit.id === event.active.id)
    const nextIndex = active.findIndex((habit) => habit.id === event.over?.id)
    if (previousIndex < 0 || nextIndex < 0) return
    void store.reorderHabitTypes(arrayMove(active, previousIndex, nextIndex).map((habit) => habit.id))
  }

  const exportJson = () => {
    downloadText(JSON.stringify(createBackup(store), null, 2), `agatsu-copia-${toLocalDate()}.json`, 'application/json;charset=utf-8')
    setMessage('Copia JSON descargada.')
  }
  const exportMarkdown = () => {
    downloadText(createMarkdownReport(store), `agatsu-resumen-${toLocalDate()}.md`, 'text/markdown;charset=utf-8')
    setMessage('Resumen Markdown descargado.')
  }
  const importJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const backup = parseBackup(JSON.parse(await file.text()) as unknown)
      const exportDate = formatDate(toLocalDate(new Date(backup.exportedAt)), { day: 'numeric', month: 'long', year: 'numeric' })
      if (!window.confirm(`Copia del ${exportDate}\n${backup.habitTypes.length} hábitos y ${backup.entries.length} registros.\n\nEsto sustituirá los datos actuales. ¿Continuar?`)) return
      await store.importBackup(backup)
      setMessage('Copia restaurada y preparada para sincronizar.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo leer la copia.')
    }
  }
  const confirmArchive = async (habit: HabitType) => {
    if (window.confirm(`¿Archivar “${habit.name}”? Conservarás todo su historial.`)) await store.archiveHabitType(habit.id)
  }
  const confirmDelete = async (habit: HabitType) => {
    if (window.confirm(`¿Eliminar “${habit.name}” definitivamente? También se eliminarán sus registros.`)) await store.deleteHabitType(habit.id)
  }
  const setTheme = (theme: ThemePreference) => void store.updatePreferences({ ...store.preferences, theme })

  return (
    <section className="view-stack settings-view view-enter">
      <header className="view-title-row"><div><span className="eyebrow">Personaliza tu rutina</span><h1>Hábitos</h1></div>
        <button className="primary-button compact" type="button" onClick={onCreate}><Plus size={17} /> Nuevo</button></header>

      <section className="settings-section">
        <div className="settings-title-row"><div className="settings-icon orange"><Smartphone /></div>
          <div><h2>Tipos de hábito</h2><p>{active.length} activos · {archived.length} archivados</p></div>
          {active.length > 1 && <button className={`soft-button compact ${ordering ? 'selected' : ''}`} type="button" onClick={() => setOrdering(!ordering)}><GripVertical /> {ordering ? 'Listo' : 'Ordenar'}</button>}
        </div>
        {ordering && <p className="manage-order-hint">Arrastra cada fila para cambiar el orden de Registro.</p>}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}>
          <SortableContext items={active.map((habit) => habit.id)} strategy={verticalListSortingStrategy}>
            <div className="manage-list">
              {active.map((habit) => <SortableHabitRow key={habit.id} habit={habit} ordering={ordering}
                onEdit={() => onEdit(habit)} onArchive={() => void confirmArchive(habit)} onDelete={() => void confirmDelete(habit)} />)}
              {!active.length && <p className="quiet-empty">No hay hábitos activos.</p>}
            </div>
          </SortableContext>
        </DndContext>
        {archived.length > 0 && <details className="archived-details"><summary>Archivados ({archived.length})</summary><div className="manage-list">
          {archived.map((habit) => <article className="manage-habit" key={habit.id}>
            <span className="mini-habit-icon muted"><HabitIcon name={habit.icon} /></span><div className="manage-habit-copy"><strong>{habit.name}</strong><span>Conserva su historial</span></div>
            <div className="row-actions"><button type="button" onClick={() => void store.restoreHabitType(habit.id)} aria-label={`Restaurar ${habit.name}`}><RotateCcw /></button>
              <button className="danger" type="button" onClick={() => void confirmDelete(habit)} aria-label={`Eliminar ${habit.name}`}><Trash2 /></button></div>
          </article>)}
        </div></details>}
      </section>

      <section className="settings-section">
        <div className="settings-title-row"><div className="settings-icon green"><Cloud /></div><div><h2>Copia en la nube</h2><p>Firebase · identidad anónima</p></div><SyncBadge status={store.sync.status} /></div>
        <div className="sync-panel"><div><ShieldCheck /><div><strong>Sin pedirte iniciar sesión</strong><span>Este navegador recibe una identidad privada automática.</span></div></div>
          {(store.sync.status === 'error' || store.sync.status === 'offline') && <button className="soft-button" type="button" onClick={() => void store.retrySync()}><RefreshCw /> Reintentar</button>}
          {store.sync.detail && store.sync.status === 'error' && <p className="error-detail">{store.sync.detail}</p>}
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-title-row"><div className="settings-icon purple"><Moon /></div><div><h2>Apariencia</h2><p>Claro, oscuro o según tu móvil</p></div></div>
        <div className="theme-options" role="group" aria-label="Tema de la aplicación">
          {([['system', Smartphone, 'Sistema'], ['light', Sun, 'Claro'], ['dark', Moon, 'Oscuro']] as const).map(([value, Icon, label]) =>
            <button key={value} className={store.preferences.theme === value ? 'selected' : ''} type="button" onClick={() => setTheme(value)} aria-pressed={store.preferences.theme === value}><Icon /> {label}</button>)}
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-title-row"><div className="settings-icon blue"><Download /></div><div><h2>Tus datos</h2><p>Copias y portabilidad</p></div></div>
        <div className="recovery-note"><ShieldCheck /><p><strong>Guarda una copia de vez en cuando.</strong> Si borras los datos del navegador, la identidad anónima podría dejar de ser recuperable.</p></div>
        <div className="data-actions">
          <button type="button" onClick={exportJson}><Download /><span><strong>Descargar copia</strong><small>JSON restaurable</small></span></button>
          <button type="button" onClick={() => importRef.current?.click()}><Upload /><span><strong>Restaurar copia</strong><small>Sustituye los datos</small></span></button>
          <button type="button" onClick={exportMarkdown}><FileText /><span><strong>Resumen legible</strong><small>Documento Markdown</small></span></button>
        </div>
        <input ref={importRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={(event) => void importJson(event)} />
        {message && <p className="settings-message" role="status">{message}</p>}
      </section>
      <p className="app-version">Agatsu 0.2 · Tu progreso, cada día</p>
    </section>
  )
}
