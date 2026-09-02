import { useEffect, useState } from 'react'
import { BarChart3, ListChecks, Settings2 } from 'lucide-react'
import type { HabitType } from './types'
import { getGreeting } from './lib/dates'
import { LEGACY_THEME_STORAGE_KEY } from './lib/compatibility'
import { useHabits } from './state/HabitsContext'
import { RegisterView } from './components/RegisterView'
import { ProgressView } from './components/ProgressView'
import { HabitsView } from './components/HabitsView'
import { EntrySheet } from './components/EntrySheet'
import { HabitTypeEditor } from './components/HabitTypeEditor'
import { PwaStatus } from './components/PwaStatus'

type View = 'register' | 'progress' | 'habits'

const NAVIGATION = [
  { id: 'register', label: 'Registro', icon: ListChecks },
  { id: 'progress', label: 'Progreso', icon: BarChart3 },
  { id: 'habits', label: 'Hábitos', icon: Settings2 },
] satisfies Array<{ id: View; label: string; icon: typeof ListChecks }>

export default function App() {
  const { ready, preferences, entries } = useHabits()
  const [view, setView] = useState<View>('register')
  const [entryHabit, setEntryHabit] = useState<HabitType>()
  const [editor, setEditor] = useState<{ open: boolean; habit?: HabitType }>({ open: false })

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = preferences.theme === 'dark' || (preferences.theme === 'system' && media.matches)
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      localStorage.setItem(LEGACY_THEME_STORAGE_KEY, preferences.theme)
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [preferences.theme])

  if (!ready) return <main className="loading-screen"><div className="brand-mark"><span>A</span></div><h1>Agatsu</h1><p>Preparando tu espacio…</p><i /></main>

  return (
    <div className={`app-shell ${view !== 'habits' ? 'focus-shell' : ''}`}>
      <header className={`app-header ${view !== 'habits' ? 'focus-header' : ''}`}>
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="Agatsu, inicio"><span className="brand-symbol">A</span><span><strong>Agatsu</strong>{view === 'habits' && <small>{getGreeting()}</small>}</span></a>
      </header>
      <main className={`main-content ${view === 'register' ? 'register-content' : view === 'progress' ? 'progress-content' : ''}`}>
        {view === 'register' && <RegisterView onOpen={setEntryHabit} onCreate={() => setEditor({ open: true })} />}
        {view === 'progress' && <ProgressView />}
        {view === 'habits' && <HabitsView onCreate={() => setEditor({ open: true })} onEdit={(habit) => setEditor({ open: true, habit })} />}
      </main>
      <nav className="bottom-navigation" aria-label="Navegación principal">
        {NAVIGATION.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} type="button" onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}><Icon size={21} strokeWidth={view === id ? 2.6 : 2} /><span>{label}</span></button>)}
      </nav>
      {entryHabit && <EntrySheet habit={entryHabit} entries={entries} onClose={() => setEntryHabit(undefined)} />}
      {editor.open && <HabitTypeEditor habit={editor.habit} onClose={() => setEditor({ open: false })} />}
      <PwaStatus />
    </div>
  )
}
