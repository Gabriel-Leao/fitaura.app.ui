import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

import { type Href, Link } from 'expo-router'

import ScreenPageContainer from '@/components/ScreenPageContainer'

type AuthPageContainerProps = {
  children: ReactNode
  destination: Href
  destinationLabel: string
}

const AuthPageContainer = ({ children, destination, destinationLabel }: AuthPageContainerProps) => {
  return (
    <ScreenPageContainer className='justify-center gap-8 pt-24'>
      {children}
      <View className='pb-10 pt-6'>
        <Link href={destination}>
          <Text className='text-center text-white'>{destinationLabel}</Text>
        </Link>
      </View>
    </ScreenPageContainer>
  )
}

export default AuthPageContainer
