import { Slot } from 'expo-router'

import { DietProvider } from '@/components/context/diet/DietProvider'
import { UserProvider } from '@/components/context/user/UserProvider'
import { useUserContext } from '@/components/context/user/useUserContext'
import { WorkoutProvider } from '@/components/context/workout/WorkoutProvider'

import '../../global.css'

const ProvidersWithUser = () => {
  const { currentUser } = useUserContext()
  const userId = currentUser?.id ?? null

  return (
    <DietProvider userId={userId}>
      <WorkoutProvider userId={userId}>
        <Slot />
      </WorkoutProvider>
    </DietProvider>
  )
}

export default function RootLayout() {
  return (
    <UserProvider>
      <ProvidersWithUser />
    </UserProvider>
  )
}
