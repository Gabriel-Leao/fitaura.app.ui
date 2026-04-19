import { Redirect, Stack } from 'expo-router'

import { useUserContext } from '@/components/context/user/useUserContext'
import { ROUTES } from '@/constants/routes'

export default function AuthLayout() {
  const { currentUser } = useUserContext()

  if (currentUser) {
    return <Redirect href={ROUTES.HOME.ROUTE} />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
