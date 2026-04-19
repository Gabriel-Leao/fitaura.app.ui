import type { ActivityLevel, UserGoal, UserSex } from './enums'

export type User = {
  id: string
  name: string
  email: string
  age: number
  height?: string
  weight?: number
  goal?: UserGoal
  sex: UserSex
  activityLevel?: ActivityLevel
  password: string
  avatar?: string
}
