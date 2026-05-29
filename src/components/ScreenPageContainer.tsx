import type { ReactNode } from 'react'
import { View } from 'react-native'

import { cn } from '@/lib/utils/cn'

export type ScreenPageContainerProps = {
  children: ReactNode
  className?: string
}

const ScreenPageContainer = ({ children, className }: ScreenPageContainerProps) => {
  return (
    <View className={cn('min-h-screen flex-1 bg-background px-4 py-10', className)}>
      {children}
    </View>
  )
}

export default ScreenPageContainer
