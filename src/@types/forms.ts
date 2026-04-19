import type { ActivityLevel, UserGoal, UserSex } from './enums'

export type SignInFormData = {
  email: string
  password: string
}

export type SignUpFormData = {
  name: string
  email: string
  age: number
  height: string
  weight: number
  goal: UserGoal
  sex: UserSex
  activityLevel: ActivityLevel
  password: string
}
