import { Redirect, Tabs } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { useUserContext } from '@/components/context/user/useUserContext'
import { ROUTES } from '@/constants/routes'

export default function TabsLayout() {
  const { currentUser } = useUserContext()

  if (!currentUser) {
    return <Redirect href={ROUTES.SIGN_IN.ROUTE} />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#021123',
          borderColor: 'transparent',
        },
        tabBarActiveTintColor: '#B872FF',
        tabBarInactiveTintColor: '#FFFFFF',
      }}>
      <Tabs.Screen
        name={ROUTES.HOME.NAME}
        options={{
          title: ROUTES.HOME.LABEL,
          tabBarIcon: () => (
            <FontAwesome5
              name={ROUTES.HOME.ICON}
              size={24}
              color='white'
            />
          ),
        }}
      />

      <Tabs.Screen
        name={ROUTES.WORKOUT.NAME}
        options={{
          title: ROUTES.WORKOUT.LABEL,
          tabBarIcon: () => (
            <FontAwesome5
              name={ROUTES.WORKOUT.ICON}
              size={24}
              color='white'
            />
          ),
        }}
      />

      <Tabs.Screen
        name={ROUTES.SHOP.NAME}
        options={{
          title: ROUTES.SHOP.LABEL,
          tabBarIcon: () => (
            <FontAwesome5
              name={ROUTES.SHOP.ICON}
              size={24}
              color='white'
            />
          ),
        }}
      />

      <Tabs.Screen
        name={ROUTES.PROFILE.NAME}
        options={{
          title: ROUTES.PROFILE.LABEL,
          tabBarIcon: () => (
            <FontAwesome5
              name={ROUTES.PROFILE.ICON}
              size={24}
              color='white'
            />
          ),
        }}
      />
    </Tabs>
  )
}
