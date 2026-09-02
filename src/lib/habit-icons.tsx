/* eslint-disable react-refresh/only-export-components */
import {
  Activity, Apple, BedDouble, Bike, BookOpen, Brain, BriefcaseBusiness, Broom,
  Calculator, Camera, Code2, Coffee, Dog, Droplets, Drum, Dumbbell, Footprints,
  GraduationCap, Guitar, HeartPulse, House, Languages, Lightbulb, Moon, Mountain,
  Music, NotebookPen, Palette, PenLine, PersonStanding, Piano, Pill, SportShoe,
  Target, TreePine, Trophy, Users, Utensils, WalletCards, Waves, type LucideIcon,
} from 'lucide-react'
import type { ComponentProps } from 'react'
import type { HabitIconName } from '../types'

export interface HabitIconOption {
  id: HabitIconName
  label: string
  icon: LucideIcon
}

export interface HabitIconGroup {
  id: string
  label: string
  options: ReadonlyArray<HabitIconOption>
}

export const HABIT_ICON_GROUPS: ReadonlyArray<HabitIconGroup> = [
  { id: 'movement', label: 'Movimiento', options: [
    { id: 'dumbbell', label: 'Fuerza', icon: Dumbbell },
    { id: 'waves', label: 'Natación', icon: Waves },
    { id: 'footprints', label: 'Caminar', icon: Footprints },
    { id: 'bike', label: 'Bicicleta', icon: Bike },
    { id: 'person-standing', label: 'Movilidad', icon: PersonStanding },
    { id: 'activity', label: 'Actividad', icon: Activity },
    { id: 'heart-pulse', label: 'Cardio', icon: HeartPulse },
    { id: 'sport-shoe', label: 'Correr', icon: SportShoe },
    { id: 'mountain', label: 'Montaña', icon: Mountain },
    { id: 'trophy', label: 'Deporte', icon: Trophy },
  ] },
  { id: 'wellbeing', label: 'Bienestar', options: [
    { id: 'brain', label: 'Concentración', icon: Brain },
    { id: 'coffee', label: 'Pausa', icon: Coffee },
    { id: 'moon', label: 'Descanso', icon: Moon },
    { id: 'bed-double', label: 'Dormir', icon: BedDouble },
    { id: 'droplets', label: 'Hidratación', icon: Droplets },
    { id: 'apple', label: 'Alimentación', icon: Apple },
    { id: 'utensils', label: 'Comida', icon: Utensils },
    { id: 'pill', label: 'Medicación', icon: Pill },
  ] },
  { id: 'learning-work', label: 'Aprendizaje y trabajo', options: [
    { id: 'languages', label: 'Idiomas', icon: Languages },
    { id: 'book-open', label: 'Lectura', icon: BookOpen },
    { id: 'graduation-cap', label: 'Estudio', icon: GraduationCap },
    { id: 'notebook-pen', label: 'Escritura', icon: NotebookPen },
    { id: 'code', label: 'Programación', icon: Code2 },
    { id: 'briefcase', label: 'Trabajo', icon: BriefcaseBusiness },
    { id: 'calculator', label: 'Cuentas', icon: Calculator },
    { id: 'lightbulb', label: 'Aprender', icon: Lightbulb },
  ] },
  { id: 'creativity', label: 'Creatividad', options: [
    { id: 'piano', label: 'Piano', icon: Piano },
    { id: 'music', label: 'Música', icon: Music },
    { id: 'guitar', label: 'Guitarra', icon: Guitar },
    { id: 'drum', label: 'Percusión', icon: Drum },
    { id: 'palette', label: 'Arte', icon: Palette },
    { id: 'camera', label: 'Fotografía', icon: Camera },
    { id: 'pen-line', label: 'Dibujo', icon: PenLine },
  ] },
  { id: 'daily-life', label: 'Vida diaria', options: [
    { id: 'target', label: 'Objetivo', icon: Target },
    { id: 'house', label: 'Hogar', icon: House },
    { id: 'broom', label: 'Limpieza', icon: Broom },
    { id: 'dog', label: 'Mascota', icon: Dog },
    { id: 'tree-pine', label: 'Naturaleza', icon: TreePine },
    { id: 'wallet-cards', label: 'Finanzas', icon: WalletCards },
    { id: 'users', label: 'Social', icon: Users },
  ] },
]

export const HABIT_ICON_OPTIONS: ReadonlyArray<HabitIconOption> = HABIT_ICON_GROUPS.flatMap((group) => group.options)

const ICON_MAP = Object.fromEntries(HABIT_ICON_OPTIONS.map((option) => [option.id, option.icon])) as Record<HabitIconName, LucideIcon>

export function HabitIcon({ name, ...props }: { name: HabitIconName } & ComponentProps<LucideIcon>) {
  const Icon = ICON_MAP[name] ?? Target
  return <Icon {...props} />
}

export function isHabitIconName(value: unknown): value is HabitIconName {
  return typeof value === 'string' && value in ICON_MAP
}
