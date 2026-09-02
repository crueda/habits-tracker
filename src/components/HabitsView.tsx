import { useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import {
  Archive, Cloud, Download, FileText, Moon, Pencil, Plus, RefreshCw, RotateCcw,
  ShieldCheck, Smartphone, Sun, Trash2, Upload,
} from 'lucide-react'
import type { HabitType, ThemePreference } from '../types'
import { createBackup, createMarkdownReport, downloadText, parseBackup } from '../lib/backup'
import { formatDate, formatDuration, toLocalDate } from '../lib/dates'
import { HabitIcon } from '../lib/habit-icons'
import { useHabits } from '../state/HabitsContext'
import { SyncBadge } from './SyncBadge'

export function HabitsView({ onCreate, onEdit }: { onCreate: () => void; onEdit: (habit: HabitType) => void }) {
  const store = useHabits()
  const [message, setMessage] = useState<string>()
  const importRef = useRef<HTMLInputElement>(null)
  const active = store.habitTypes.filter((habit) => !habit.deletedAt && !habit.archivedAt).sort((a, b) => a.order - b.order)
  const archived = store.habitTypes.filter((habit) => !habit.deletedAt && habit.archivedAt)

  const exportJson = () => {
    downloadText(JSON.stringify(createBackup(store), null, 2), `ritmo-copia-${toLocalDate()}.json`, 'application/json;charset=utf-8')
    setMessage('Copia JSON descargada.')
  }
  const exportMarkdown = () => {
    downloadText(createMarkdownReport(store), `ritmo-resumen-${toLocalDate()}.md`, 'text/markdown;charset=utf-8')
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
          <div><h2>Tipos de hábito</h2><p>{active.length} activos · {archived.length} archivados</p></div></div>
        <div className="manage-list">
          {active.map((habit) => <article className="manage-habit" key={habit.id}>
            <span className="mini-habit-icon" style={{ '--habit-color': habit.color } as CSSProperties}><HabitIcon name={habit.icon} /></span>
            <div><strong>{habit.name}</strong><span>{habit.slotMinutes} min/slot · objetivo {habit.targetSlots} ({formatDuration(habit.slotMinutes * habit.targetSlots)})</span></div>
            <div className="row-actions">
              <button type="button" onClick={() => onEdit(habit)} aria-label={`Editar ${habit.name}`}><Pencil /></button>
              <button type="button" onClick={() => void confirmArchive(habit)} aria-label={`Archivar ${habit.name}`}><Archive /></button>
              <button className="danger" type="button" onClick={() => void confirmDelete(habit)} aria-label={`Eliminar ${habit.name}`}><Trash2 /></button>
            </div>
          </article>)}
          {!active.length && <p className="quiet-empty">No hay hábitos activos.</p>}
        </div>
        {archived.length > 0 && <details className="archived-details"><summary>Archivados ({archived.length})</summary><div className="manage-list">
          {archived.map((habit) => <article className="manage-habit" key={habit.id}>
            <span className="mini-habit-icon muted"><HabitIcon name={habit.icon} /></span><div><strong>{habit.name}</strong><span>Conserva su historial</span></div>
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
      <p className="app-version">Ritmo 0.2 · Tus hábitos, a tu manera</p>
    </section>
  )
}
