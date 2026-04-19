import { createContext, useCallback, useEffect, useState } from 'react'

import * as Crypto from 'expo-crypto'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { type DayDiet, type Food, type MealEntry, MealId } from '@/@types/diet'
import { CUSTOM_FOODS_STORAGE_KEY, DEFAULT_FOODS, DIET_STORAGE_KEY } from '@/constants/diet'

type DietContextType = {
  customFoods: Food[]
  allFoods: Food[]
  getDayDiet: (date: string) => DayDiet
  addEntry: (date: string, mealId: MealId, food: Food, quantity: number) => Promise<void>
  removeEntry: (date: string, mealId: MealId, entryId: string) => Promise<void>
  addCustomFood: (food: Omit<Food, 'id' | 'isCustom'>) => Promise<void>
  getDayTotalCalories: (date: string) => number
  getDayTotalMacros: (date: string) => { protein: number; carbs: number; fat: number }
}

export const DietContext = createContext<DietContextType | undefined>(undefined)

const buildEmptyDay = (date: string): DayDiet => ({
  date,
  meals: Object.values(MealId).map((id) => ({ id, entries: [] })),
})

export const DietProvider = ({ children }: React.PropsWithChildren) => {
  const [dietData, setDietData] = useState<DayDiet[]>([])
  const [customFoods, setCustomFoods] = useState<Food[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const allFoods = [...DEFAULT_FOODS, ...customFoods]

  useEffect(() => {
    const load = async () => {
      try {
        const [dietJson, customJson] = await Promise.all([
          AsyncStorage.getItem(DIET_STORAGE_KEY),
          AsyncStorage.getItem(CUSTOM_FOODS_STORAGE_KEY),
        ])
        if (dietJson) setDietData(JSON.parse(dietJson))
        if (customJson) setCustomFoods(JSON.parse(customJson))
      } catch (e) {
        console.error('Erro ao carregar dieta:', e)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!isLoading) AsyncStorage.setItem(DIET_STORAGE_KEY, JSON.stringify(dietData))
  }, [dietData, isLoading])

  useEffect(() => {
    if (!isLoading) AsyncStorage.setItem(CUSTOM_FOODS_STORAGE_KEY, JSON.stringify(customFoods))
  }, [customFoods, isLoading])

  const getDayDiet = useCallback(
    (date: string): DayDiet => dietData.find((d) => d.date === date) ?? buildEmptyDay(date),
    [dietData],
  )

  const addEntry = useCallback(
    async (date: string, mealId: MealId, food: Food, quantity: number) => {
      const entry: MealEntry = {
        id: String(Crypto.randomUUID()),
        foodId: food.id,
        foodName: food.name,
        quantity,
        unit: food.type === 'solid' ? 'g' : food.type === 'liquid' ? 'ml' : 'un',
        calories: Math.round(food.caloriesPer1Unit * quantity),
        protein: Math.round(food.proteinPer1Unit * quantity * 10) / 10,
        carbs: Math.round(food.carbsPer1Unit * quantity * 10) / 10,
        fat: Math.round(food.fatPer1Unit * quantity * 10) / 10,
      }

      setDietData((prev) => {
        const existing = prev.find((d) => d.date === date)
        if (!existing) {
          const newDay = buildEmptyDay(date)
          const meal = newDay.meals.find((m) => m.id === mealId)!
          meal.entries.push(entry)
          return [...prev, newDay]
        }
        return prev.map((d) => {
          if (d.date !== date) return d
          return {
            ...d,
            meals: d.meals.map((m) =>
              m.id === mealId ? { ...m, entries: [...m.entries, entry] } : m,
            ),
          }
        })
      })
    },
    [],
  )

  const removeEntry = useCallback(async (date: string, mealId: MealId, entryId: string) => {
    setDietData((prev) =>
      prev.map((d) => {
        if (d.date !== date) return d
        return {
          ...d,
          meals: d.meals.map((m) =>
            m.id === mealId ? { ...m, entries: m.entries.filter((e) => e.id !== entryId) } : m,
          ),
        }
      }),
    )
  }, [])

  const addCustomFood = useCallback(async (food: Omit<Food, 'id' | 'isCustom'>) => {
    const newFood: Food = {
      ...food,
      id: String(Crypto.randomUUID()),
      isCustom: true,
    }
    setCustomFoods((prev) => [...prev, newFood])
  }, [])

  const getDayTotalCalories = useCallback(
    (date: string): number => {
      const day = getDayDiet(date)
      return day.meals.reduce(
        (total, meal) => total + meal.entries.reduce((s, e) => s + e.calories, 0),
        0,
      )
    },
    [getDayDiet],
  )

  const getDayTotalMacros = useCallback(
    (date: string) => {
      const day = getDayDiet(date)
      return day.meals.reduce(
        (totals, meal) =>
          meal.entries.reduce(
            (t, e) => ({
              protein: Math.round((t.protein + e.protein) * 10) / 10,
              carbs: Math.round((t.carbs + e.carbs) * 10) / 10,
              fat: Math.round((t.fat + e.fat) * 10) / 10,
            }),
            totals,
          ),
        { protein: 0, carbs: 0, fat: 0 },
      )
    },
    [getDayDiet],
  )

  if (isLoading) return null

  return (
    <DietContext.Provider
      value={{
        customFoods,
        allFoods,
        getDayDiet,
        addEntry,
        removeEntry,
        addCustomFood,
        getDayTotalCalories,
        getDayTotalMacros,
      }}>
      {children}
    </DietContext.Provider>
  )
}
