import { Slot } from 'expo-router'

import { UserProvider } from '@/components/context/UserProvider'

import '../../global.css'

export default function RootLayout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  )
}
