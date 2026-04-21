import { useContext } from 'react'

import { UserContext } from './UserProvider'

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('tentando usar UserContext fora do provider')
  }
  return context
}
