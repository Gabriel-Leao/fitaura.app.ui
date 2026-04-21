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

export const getWeekRange = (dateStr: string): { start: string; end: string } => {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  }
}

export const formatWeekRange = (dateStr: string): string => {
  const { start, end } = getWeekRange(dateStr)
  const [, sm, sd] = start.split('-').map(Number)
  const [, em, ed] = end.split('-').map(Number)
  return `${String(sd).padStart(2, '0')}/${String(sm).padStart(2, '0')} a ${String(ed).padStart(2, '0')}/${String(em).padStart(2, '0')}`
}

export const getWeekStart = (): string => getWeekRange(new Date().toISOString().split('T')[0]).start
