import { createContext, useCallback, useEffect, useState } from 'react'

import * as Crypto from 'expo-crypto'

import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  type Exercise,
  type ExerciseEntry,
  type ExerciseEntryInput,
  ExerciseType,
  type WeeklyStats,
  type WorkoutLog,
  type WorkoutTemplate,
} from '@/@types/workout'
import {
  CUSTOM_EXERCISES_KEY,
  CUSTOM_TEMPLATES_KEY,
  DEFAULT_EXERCISES,
  WORKOUT_LOGS_KEY,
} from '@/constants/workout'
import { calculateExerciseCalories, getWeekRange } from '@/lib/utils/workout'

type WorkoutContextType = {
  customTemplates: WorkoutTemplate[]
  customExercises: Exercise[]
  allExercises: Exercise[]
  getDayLogs: (date: string) => WorkoutLog[]
  getWeeklyStats: (date: string) => WeeklyStats
  logWorkout: (
    date: string,
    name: string,
    entries: ExerciseEntryInput[],
    userWeightKg: number,
  ) => Promise<void>
  updateLog: (id: string, entries: ExerciseEntryInput[], userWeightKg: number) => Promise<void>
  updateAllLogsByTemplateName: (
    templateName: string,
    entries: ExerciseEntryInput[],
    userWeightKg: number,
  ) => Promise<void>
  removeLog: (id: string) => Promise<void>
  removeLogsByTemplateName: (templateName: string) => Promise<void>
  addCustomTemplate: (template: Omit<WorkoutTemplate, 'id' | 'isCustom'>) => Promise<void>
  updateCustomTemplate: (id: string, data: Partial<WorkoutTemplate>) => Promise<void>
  deleteCustomTemplate: (id: string) => Promise<void>
  addCustomExercise: (exercise: Omit<Exercise, 'id' | 'isCustom'>) => Promise<void>
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

const buildExerciseEntries = (entries: ExerciseEntryInput[], weight: number): ExerciseEntry[] =>
  entries.map((entry) => ({
    ...entry,
    id: String(Crypto.randomUUID()),
    caloriesBurned: calculateExerciseCalories(entry, weight),
  }))

const buildLogStats = (exercises: ExerciseEntry[]) => ({
  totalCalories: exercises.reduce((s, e) => s + e.caloriesBurned, 0),
  totalWeightLifted: exercises.reduce(
    (s, e) => s + (e.type === ExerciseType.Strength ? e.sets * e.reps * e.weightKg : 0),
    0,
  ),
  totalDistanceKm: exercises.reduce((s, e) => s + e.distanceKm, 0),
  totalDurationMinutes: exercises.reduce((s, e) => {
    if (e.type === ExerciseType.Strength) {
      return s + Math.ceil((e.sets * e.reps * 3 + e.sets * 60) / 60)
    }
    return s + e.durationMinutes
  }, 0),
})

export const WorkoutProvider = ({ children }: React.PropsWithChildren) => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [customTemplates, setCustomTemplates] = useState<WorkoutTemplate[]>([])
  const [customExercises, setCustomExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const allExercises = [...DEFAULT_EXERCISES, ...customExercises]

  useEffect(() => {
    const load = async () => {
      try {
        const [logsJson, templatesJson, exercisesJson] = await Promise.all([
          AsyncStorage.getItem(WORKOUT_LOGS_KEY),
          AsyncStorage.getItem(CUSTOM_TEMPLATES_KEY),
          AsyncStorage.getItem(CUSTOM_EXERCISES_KEY),
        ])
        if (logsJson) setWorkoutLogs(JSON.parse(logsJson))
        if (templatesJson) setCustomTemplates(JSON.parse(templatesJson))
        if (exercisesJson) setCustomExercises(JSON.parse(exercisesJson))
      } catch (e) {
        console.error('Erro ao carregar treinos:', e)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!isLoading) AsyncStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(workoutLogs))
  }, [workoutLogs, isLoading])

  useEffect(() => {
    if (!isLoading) AsyncStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(customTemplates))
  }, [customTemplates, isLoading])

  useEffect(() => {
    if (!isLoading) AsyncStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(customExercises))
  }, [customExercises, isLoading])

  const getDayLogs = useCallback(
    (date: string) => workoutLogs.filter((l) => l.date === date),
    [workoutLogs],
  )

  const getWeeklyStats = useCallback(
    (date: string): WeeklyStats => {
      const { start, end } = getWeekRange(date)
      const logs = workoutLogs.filter((l) => l.date >= start && l.date <= end)
      return {
        totalCalories: logs.reduce((s, l) => s + l.totalCalories, 0),
        totalWeightLifted: logs.reduce((s, l) => s + l.totalWeightLifted, 0),
        totalDistanceKm: Math.round(logs.reduce((s, l) => s + l.totalDistanceKm, 0) * 10) / 10,
        totalDurationMinutes: logs.reduce((s, l) => s + l.totalDurationMinutes, 0),
        totalWorkouts: logs.length,
      }
    },
    [workoutLogs],
  )

  const logWorkout = useCallback(
    async (date: string, name: string, entries: ExerciseEntryInput[], userWeightKg: number) => {
      const weight = userWeightKg || 70
      const exercises = buildExerciseEntries(entries, weight)
      const log: WorkoutLog = {
        id: String(Crypto.randomUUID()),
        date,
        templateName: name,
        exercises,
        ...buildLogStats(exercises),
      }
      setWorkoutLogs((prev) => [...prev, log])
    },
    [],
  )

  const updateLog = useCallback(
    async (id: string, entries: ExerciseEntryInput[], userWeightKg: number) => {
      const weight = userWeightKg || 70
      setWorkoutLogs((prev) =>
        prev.map((log) => {
          if (log.id !== id) return log
          const exercises = buildExerciseEntries(entries, weight)
          return { ...log, exercises, ...buildLogStats(exercises) }
        }),
      )
    },
    [],
  )

  const updateAllLogsByTemplateName = useCallback(
    async (templateName: string, entries: ExerciseEntryInput[], userWeightKg: number) => {
      const weight = userWeightKg || 70
      setWorkoutLogs((prev) =>
        prev.map((log) => {
          if (log.templateName !== templateName) return log
          const exercises = buildExerciseEntries(entries, weight)
          return { ...log, exercises, ...buildLogStats(exercises) }
        }),
      )
    },
    [],
  )

  const removeLog = useCallback(async (id: string) => {
    setWorkoutLogs((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const removeLogsByTemplateName = useCallback(async (templateName: string) => {
    setWorkoutLogs((prev) => prev.filter((l) => l.templateName !== templateName))
  }, [])

  const addCustomTemplate = useCallback(
    async (template: Omit<WorkoutTemplate, 'id' | 'isCustom'>) => {
      setCustomTemplates((prev) => [
        ...prev,
        { ...template, id: String(Crypto.randomUUID()), isCustom: true },
      ])
    },
    [],
  )

  const updateCustomTemplate = useCallback(async (id: string, data: Partial<WorkoutTemplate>) => {
    setCustomTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)))
  }, [])

  const deleteCustomTemplate = useCallback(async (id: string) => {
    setCustomTemplates((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addCustomExercise = useCallback(async (exercise: Omit<Exercise, 'id' | 'isCustom'>) => {
    setCustomExercises((prev) => [
      ...prev,
      { ...exercise, id: String(Crypto.randomUUID()), isCustom: true },
    ])
  }, [])

  if (isLoading) return null

  return (
    <WorkoutContext.Provider
      value={{
        customTemplates,
        customExercises,
        allExercises,
        getDayLogs,
        getWeeklyStats,
        logWorkout,
        updateLog,
        updateAllLogsByTemplateName,
        removeLog,
        removeLogsByTemplateName,
        addCustomTemplate,
        updateCustomTemplate,
        deleteCustomTemplate,
        addCustomExercise,
      }}>
      {children}
    </WorkoutContext.Provider>
  )
}
