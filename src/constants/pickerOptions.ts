import { ACTIVITY_LEVEL_LABELS, ActivityLevel, UserGoal, UserSex } from '@/@types/enums'

export const SEX_OPTIONS = [
  { label: 'Masculino', value: UserSex.Male },
  { label: 'Feminino', value: UserSex.Female },
]

export const GOAL_OPTIONS = [
  { label: 'Perder peso', value: UserGoal.LoseWeight },
  { label: 'Ganhar peso', value: UserGoal.GainWeight },
  { label: 'Manter peso', value: UserGoal.MaintainWeight },
]

export const ACTIVITY_LEVEL_OPTIONS = Object.values(ActivityLevel).map((level) => ({
  label: ACTIVITY_LEVEL_LABELS[level],
  value: level,
}))
