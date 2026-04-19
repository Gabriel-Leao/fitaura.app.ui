import { useState } from 'react'
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native'

import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { useUserContext } from '@/components/context/user/useUserContext'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import { ROUTES } from '@/constants/routes'

const Profile = () => {
  const { currentUser: user, logout, deleteUser, updateAvatar } = useUserContext()
  const [isUploading, setIsUploading] = useState<boolean>(false)

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
      Alert.alert('Erro', (error as Error).message)
    }
  }

  const onAvatarPressed = () => {
    Alert.alert('Foto de perfil', 'Escolha uma opção', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Câmera', onPress: openCamera },
      { text: 'Galeria', onPress: openGallery },
    ])
  }

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert(
        'Permissão negada',
        'Precisamos de acesso à câmera para tirar sua foto de perfil. Habilite nas configurações do dispositivo.',
      )
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled) {
      await saveAvatar(result.assets[0].uri)
    }
  }

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert(
        'Permissão negada',
        'Precisamos de acesso à galeria para escolher sua foto de perfil. Habilite nas configurações do dispositivo.',
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled) {
      await saveAvatar(result.assets[0].uri)
    }
  }

  const saveAvatar = async (uri: string) => {
    setIsUploading(true)
    try {
      await updateAvatar(user.id, uri)
    } catch (error: unknown) {
      Alert.alert('Erro', (error as Error).message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <ScreenPageContainer className='flex justify-center'>
      <View>
        <View className='mt-10 items-center'>
          <TouchableOpacity
            onPress={onAvatarPressed}
            disabled={isUploading}
            className='relative'>
            {user.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                className='h-32 w-32 rounded-full'
              />
            ) : (
              <View className='h-32 w-32 items-center justify-center rounded-full bg-white/10'>
                <FontAwesome5
                  name='user-alt'
                  size={64}
                  color='white'
                />
              </View>
            )}

            <View className='absolute bottom-0 right-0 rounded-full bg-[#B872FF] p-2'>
              {isUploading ? (
                <ActivityIndicator
                  size={16}
                  color='white'
                />
              ) : (
                <FontAwesome5
                  name='camera'
                  size={14}
                  color='white'
                />
              )}
            </View>
          </TouchableOpacity>

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
