import { Text, TouchableOpacity, View } from 'react-native'

import { router } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { useUserContext } from '@/components/context/useUserContext'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import { ROUTES } from '@/constants/routes'

const Profile = () => {
  const { currentUser: user, logout, deleteUser } = useUserContext()

  if (!user) return null

  const onLogoutPressed = async () => {
    await logout()
    router.push(ROUTES.SIGN_IN.ROUTE)
  }

  const onDeletePressed = async () => {
    try {
      await deleteUser(user.id)
      router.push(ROUTES.SIGN_IN.ROUTE)
    } catch (error: unknown) {
      alert((error as Error).message)
    }
  }

  return (
    <ScreenPageContainer className='flex justify-center'>
      <View>
        <View className='mt-10 items-center'>
          <FontAwesome5
            name='user-alt'
            size={128}
            color='white'
          />

          <Text className='mt-2 text-xl font-semibold text-white'>{user.name}</Text>
        </View>

        <View className='gap-5 px-6 pt-10'>
          <Text className='text-xl font-bold text-white'>Email: {user.email}</Text>

          <Text className='text-xl font-bold text-white'>Idade: {user.age} anos</Text>
          <Text className='text-xl font-bold text-white'>
            Altura: {user.height ? user.height + ' cm' : 'Não informado'}
          </Text>
          <Text className='text-xl font-bold text-white'>Sexo: {user.sex}</Text>
          <Text className='text-xl font-bold text-white'>
            Objetivo: {user.goal ?? 'Não informado'}
          </Text>
        </View>

        <View className='gap-4 px-4 py-8'>
          <TouchableOpacity
            onPress={onLogoutPressed}
            className='flex-row items-center justify-center gap-2 rounded-xl bg-[#98A0A8] py-3'>
            <FontAwesome5
              name='sign-out-alt'
              size={24}
              color='white'
            />
            <Text className='text-lg font-semibold text-white'>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDeletePressed}
            className='flex-row items-center justify-center gap-2 rounded-xl bg-red-600 py-3'>
            <FontAwesome5
              name='trash-alt'
              size={24}
              color='white'
            />
            <Text className='text-lg font-semibold text-white'>Apagar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenPageContainer>
  )
}

export default Profile
