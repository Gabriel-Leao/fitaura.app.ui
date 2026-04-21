export enum FoodType {
  Solid = 'solid',
  Countable = 'countable',
  Liquid = 'liquid',
}

export enum MealId {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Snack = 'snack',
  Dinner = 'dinner',
  Extras = 'extras',
}

export const MEAL_LABELS: Record<MealId, string> = {
  [MealId.Breakfast]: 'Café da manhã',
  [MealId.Lunch]: 'Almoço',
  [MealId.Snack]: 'Lanche',
  [MealId.Dinner]: 'Janta',
  [MealId.Extras]: 'Extras',
}

export const FOOD_UNIT_LABEL: Record<FoodType, string> = {
  [FoodType.Solid]: 'g',
  [FoodType.Countable]: 'un',
  [FoodType.Liquid]: 'ml',
}

export const FOOD_QUICK_AMOUNTS: Record<FoodType, number[]> = {
  [FoodType.Solid]: [1, 10, 100],
  [FoodType.Countable]: [1, 6, 12],
  [FoodType.Liquid]: [1, 100, 250, 500, 1000],
}

export type Food = {
  id: string
  name: string
  type: FoodType
  caloriesPer1Unit: number
  proteinPer1Unit: number
  carbsPer1Unit: number
  fatPer1Unit: number
  isCustom?: boolean
}

export type MealEntry = {
  id: string
  foodId: string
  foodName: string
  quantity: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type Meal = {
  id: MealId
  entries: MealEntry[]
}

export type DayDiet = {
  date: string
  meals: Meal[]
}
