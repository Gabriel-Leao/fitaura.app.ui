import { useContext } from 'react'

import { WorkoutContext } from './WorkoutProvider'

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext)
  if (!context) {
    throw new Error('useWorkoutContext deve ser usado dentro do WorkoutProvider')
  }
  return context
}
