/* eslint-disable react-refresh/only-export-components */
import {
  Bike, BookOpen, Brain, Coffee, Dumbbell, Footprints, Languages, Music,
  PersonStanding, Piano, Target, Waves, type LucideIcon,
} from 'lucide-react'
import type { ComponentProps } from 'react'
import type { HabitIconName } from '../types'

export const HABIT_ICON_OPTIONS: ReadonlyArray<{ id: HabitIconName; label: string; icon: LucideIcon }> = [
  { id: 'piano', label: 'Piano', icon: Piano },
  { id: 'dumbbell', label: 'Fuerza', icon: Dumbbell },
  { id: 'languages', label: 'Idiomas', icon: Languages },
  { id: 'waves', label: 'Natación', icon: Waves },
  { id: 'book-open', label: 'Lectura', icon: BookOpen },
  { id: 'footprints', label: 'Caminar', icon: Footprints },
  { id: 'bike', label: 'Bicicleta', icon: Bike },
  { id: 'brain', label: 'Concentración', icon: Brain },
  { id: 'music', label: 'Música', icon: Music },
  { id: 'coffee', label: 'Pausa', icon: Coffee },
  { id: 'person-standing', label: 'Movilidad', icon: PersonStanding },
  { id: 'target', label: 'Objetivo', icon: Target },
]

const ICON_MAP = Object.fromEntries(HABIT_ICON_OPTIONS.map((option) => [option.id, option.icon])) as Record<HabitIconName, LucideIcon>

export function HabitIcon({ name, ...props }: { name: HabitIconName } & ComponentProps<LucideIcon>) {
  const Icon = ICON_MAP[name] ?? Target
  return <Icon {...props} />
}

export function isHabitIconName(value: unknown): value is HabitIconName {
  return typeof value === 'string' && value in ICON_MAP
}
