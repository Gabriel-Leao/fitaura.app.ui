import { useContext } from 'react'

import { DietContext } from './DietProvider'

export const useDietContext = () => {
  const context = useContext(DietContext)
  if (!context) {
    throw new Error('useDietContext deve ser usado dentro do DietProvider')
  }
  return context
}
