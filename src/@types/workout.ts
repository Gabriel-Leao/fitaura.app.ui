export enum ExerciseType {
  Strength = 'strength',
  Cardio = 'cardio',
  Aerobic = 'aerobic',
}

export enum MuscleGroup {
  Chest = 'Peito',
  Back = 'Costas',
  Legs = 'Pernas',
  Shoulders = 'Ombros',
  Biceps = 'Bíceps',
  Triceps = 'Tríceps',
  Core = 'Core',
  Cardio = 'Cardio',
  Aerobic = 'Aeróbico',
}

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  [ExerciseType.Strength]: 'Musculação',
  [ExerciseType.Cardio]: 'Cardio',
  [ExerciseType.Aerobic]: 'Aeróbico',
}

export const EXERCISE_TYPE_COLORS: Record<ExerciseType, string> = {
  [ExerciseType.Strength]: '#B872FF',
  [ExerciseType.Cardio]: '#ef4444',
  [ExerciseType.Aerobic]: '#22c55e',
}

export type Exercise = {
  id: string
  name: string
  type: ExerciseType
  muscleGroup: MuscleGroup
  isCustom?: boolean
}

export type ExerciseEntryInput = {
  exerciseId: string
  exerciseName: string
  type: ExerciseType
  sets: number
  reps: number
  weightKg: number
  durationMinutes: number
  distanceKm: number
}

export type ExerciseEntry = ExerciseEntryInput & {
  id: string
  caloriesBurned: number
}

export type WorkoutTemplate = {
  id: string
  name: string
  goalTag?: string
  exercises: ExerciseEntryInput[]
  isCustom?: boolean
  isSuggested?: boolean
}

export type WorkoutLog = {
  id: string
  date: string
  templateName: string
  exercises: ExerciseEntry[]
  totalCalories: number
  totalWeightLifted: number
  totalDistanceKm: number
  totalDurationMinutes: number
}

export type WeeklyStats = {
  totalCalories: number
  totalWeightLifted: number
  totalDistanceKm: number
  totalDurationMinutes: number
  totalWorkouts: number
}
