import type { UserGoal, UserSex } from './enums'

export type SignInFormData = {
  email: string
  password: string
}

export type SignUpFormData = {
  name: string
  email: string
  age: number
  height: string
  goal: UserGoal
  sex: UserSex
  password: string
}
