import { Slot } from 'expo-router'

import { DietProvider } from '@/components/context/diet/DietProvider'
import { UserProvider } from '@/components/context/user/UserProvider'
import { WorkoutProvider } from '@/components/context/workout/WorkoutProvider'

import '../../global.css'

export default function RootLayout() {
  return (
    <UserProvider>
      <DietProvider>
        <WorkoutProvider>
          <Slot />
        </WorkoutProvider>
      </DietProvider>
    </UserProvider>
  )
}
