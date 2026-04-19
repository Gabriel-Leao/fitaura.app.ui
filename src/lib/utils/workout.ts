import { type ExerciseEntryInput, ExerciseType } from '@/@types/workout'

export const calculateExerciseCalories = (
  entry: ExerciseEntryInput,
  userWeightKg: number,
): number => {
  const met =
    entry.type === ExerciseType.Strength ? 5.0 : entry.type === ExerciseType.Cardio ? 8.0 : 4.0

  if (entry.type === ExerciseType.Strength) {
    const timeSeconds = entry.sets * entry.reps * 3 + entry.sets * 60
    return Math.round(met * userWeightKg * (timeSeconds / 3600))
  }

  return Math.round(met * userWeightKg * (entry.durationMinutes / 60))
}

export const getWeekStart = (): string => {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  return monday.toISOString().split('T')[0]
}
