import { useUserContext } from '@/components/context/useUserContext'
import { ROUTES } from '@/constants/routes'
import { Redirect, Stack } from 'expo-router'

export default function AuthLayout() {
  const { currentUser } = useUserContext()

  if (currentUser) {
    return <Redirect href={ROUTES.HOME.ROUTE} />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
