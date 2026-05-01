import { useContext } from 'react'

import { ShopContext } from './ShopProvider'

export const useShopContext = () => {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShopContext deve ser usado dentro do ShopProvider')
  }
  return context
}
