import { Text } from 'react-native'

import { cn } from '@/lib/utils/cn'

import type { ScreenPageContainerProps } from './ScreenPageContainer'

const ScreenPageTitle = ({ children, className }: ScreenPageContainerProps) => {
  return (
    <Text className={cn('text-center text-xl font-bold text-white', className)}>{children}</Text>
  )
}

export default ScreenPageTitle
