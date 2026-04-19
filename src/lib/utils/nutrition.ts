import { ACTIVITY_LEVEL_MULTIPLIER, type ActivityLevel, UserGoal, UserSex } from '@/@types/enums'

type NutritionGoal = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

type NutritionInput = {
  sex: UserSex
  age: number
  height?: string
  weight?: number
  goal?: UserGoal
  activityLevel?: ActivityLevel
}

export const calculateNutritionGoal = (user: NutritionInput): NutritionGoal | null => {
  if (!user.weight || !user.height || !user.activityLevel || !user.goal) return null

  const weight = user.weight
  const height = parseFloat(user.height)
  const age = user.age

  // Mifflin-St Jeor
  const bmr =
    user.sex === UserSex.Male
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161

  const multiplier = ACTIVITY_LEVEL_MULTIPLIER[user.activityLevel]
  const tdee = Math.round(bmr * multiplier)

  const goalCalories =
    user.goal === UserGoal.LoseWeight
      ? tdee - 300
      : user.goal === UserGoal.GainWeight
        ? tdee + 300
        : tdee

  // Distribuição de macros por objetivo
  const macroRatios: Record<UserGoal, { protein: number; carbs: number; fat: number }> = {
    [UserGoal.LoseWeight]: { protein: 0.35, carbs: 0.4, fat: 0.25 },
    [UserGoal.MaintainWeight]: { protein: 0.25, carbs: 0.5, fat: 0.25 },
    [UserGoal.GainWeight]: { protein: 0.3, carbs: 0.45, fat: 0.25 },
  }

  const ratios = macroRatios[user.goal]

  return {
    calories: goalCalories,
    protein: Math.round((goalCalories * ratios.protein) / 4),
    carbs: Math.round((goalCalories * ratios.carbs) / 4),
    fat: Math.round((goalCalories * ratios.fat) / 9),
  }
}

type ProgressStatus = 'on_track' | 'below' | 'above'

export const getCalorieStatus = (consumed: number, goal: number): ProgressStatus => {
  const ratio = consumed / goal
  if (ratio > 1.1) return 'above'
  if (ratio < 0.9) return 'below'
  return 'on_track'
}
