import type { UserGoal, UserSex } from './enums'

export type User = {
  id: string
  name: string
  email: string
  age: number
  height?: string
  goal?: UserGoal
  sex: UserSex
  password: string
  avatar?: string
}
