import { type Exercise, ExerciseType, MuscleGroup } from '@/@types/workout'

const API_BASE = 'https://wger.de/api/v2'

type WgerTranslation = {
  name: string
  language: number
}

type WgerExercise = {
  exercise_base_id: number
  name: string | undefined
  category: { id: number; name: string }
  muscles: { id: number; name_en: string }[]
  translations: WgerTranslation[]
}

type WgerResponse = {
  results: WgerExercise[]
}

const CATEGORY_TO_MUSCLE: Record<number, MuscleGroup> = {
  8: MuscleGroup.Biceps,
  10: MuscleGroup.Back,
  11: MuscleGroup.Legs,
  12: MuscleGroup.Shoulders,
  13: MuscleGroup.Chest,
  14: MuscleGroup.Core,
  15: MuscleGroup.Legs,
}

const MUSCLE_TO_GROUP: Record<string, MuscleGroup> = {
  'Biceps brachii': MuscleGroup.Biceps,
  'Triceps brachii': MuscleGroup.Triceps,
  'Anterior deltoid': MuscleGroup.Shoulders,
  'Medial deltoid': MuscleGroup.Shoulders,
  'Posterior deltoid': MuscleGroup.Shoulders,
  'Pectoralis major': MuscleGroup.Chest,
  'Latissimus dorsi': MuscleGroup.Back,
  Trapezius: MuscleGroup.Back,
  'Rectus abdominis': MuscleGroup.Core,
  'Quadriceps femoris': MuscleGroup.Legs,
  'Biceps femoris': MuscleGroup.Legs,
  Gastrocnemius: MuscleGroup.Legs,
}

const resolveName = (raw: WgerExercise): string | null => {
  const ptName = raw.translations.find((t) => t.language === 4 && t.name.trim() !== '')?.name
  const fallback = raw.name?.trim()
  return ptName ?? fallback ?? null
}

const toExercise = (raw: WgerExercise, name: string): Exercise => {
  const primaryMuscle = raw.muscles[0]?.name_en ?? ''

  return {
    id: `wger-${raw.exercise_base_id}`,
    name,
    type: raw.category.id === 6 ? ExerciseType.Cardio : ExerciseType.Strength,
    muscleGroup:
      MUSCLE_TO_GROUP[primaryMuscle] ?? CATEGORY_TO_MUSCLE[raw.category.id] ?? MuscleGroup.Core,
  }
}

export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${API_BASE}/exerciseinfo/?format=json&language=4&limit=80`)

    if (!response.ok) throw new Error(`Erro ${response.status}`)

    const data = (await response.json()) as WgerResponse

    return data.results
      .map((e) => ({ raw: e, name: resolveName(e) }))
      .filter(
        (e): e is { raw: WgerExercise; name: string } =>
          e.name !== null && e.raw.exercise_base_id !== undefined,
      )
      .map(({ raw, name }) => toExercise(raw, name))
  } catch (e) {
    console.error('Erro ao buscar exercícios:', e)
    return []
  }
}
