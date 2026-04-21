import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { ACTIVITY_LEVEL_LABELS, ActivityLevel, UserGoal, UserSex } from '@/@types/enums'
import { useUserContext } from '@/components/context/user/useUserContext'
import CustomInput from '@/components/CustomInput'
import CustomPicker from '@/components/CustomPicker'
import FormWrapper from '@/components/FormWrapper'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import { ROUTES } from '@/constants/routes'

type EditFormData = {
  email: string
  height: string
  weight: string
  sex: UserSex
  goal: UserGoal
  activityLevel: ActivityLevel
}

const Profile = () => {
  const {
    currentUser: user,
    users,
    logout,
    deleteUser,
    updateAvatar,
    updateUser,
  } = useUserContext()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<EditFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: user?.email ?? '',
      height: user?.height ?? '',
      weight: user?.weight ? String(user.weight) : '',
      sex: user?.sex,
      goal: user?.goal,
      activityLevel: user?.activityLevel,
    },
  })

  if (!user) return null

  const onEditPressed = () => {
    reset({
      email: user.email,
      height: user.height ?? '',
      weight: user.weight ? String(user.weight) : '',
      sex: user.sex,
      goal: user.goal,
      activityLevel: user.activityLevel,
    })
    setIsEditing(true)
  }

  const onCancelPressed = () => setIsEditing(false)

  const onSavePressed = async (data: EditFormData) => {
    setIsSubmitting(true)
    try {
      await updateUser(user.id, {
        email: data.email.toLowerCase(),
        height: data.height,
        weight: Number(data.weight),
        sex: data.sex,
        goal: data.goal,
        activityLevel: data.activityLevel,
      })
      setIsEditing(false)
    } catch (error: unknown) {
      Alert.alert('Erro', (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onLogoutPressed = async () => {
    await logout()
    router.push(ROUTES.SIGN_IN.ROUTE)
  }

  const onDeletePressed = async () => {
    Alert.alert('Apagar conta', 'Tem certeza? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(user.id)
            router.push(ROUTES.SIGN_IN.ROUTE)
          } catch (error: unknown) {
            Alert.alert('Erro', (error as Error).message)
          }
        },
      },
    ])
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
      Alert.alert('Permissão negada', 'Habilite o acesso à câmera nas configurações.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled) await saveAvatar(result.assets[0].uri)
  }

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Habilite o acesso à galeria nas configurações.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled) await saveAvatar(result.assets[0].uri)
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

  const viewFields = [
    { label: 'E-mail', value: user.email },
    { label: 'Altura', value: user.height ? `${user.height} cm` : 'Não informado' },
    { label: 'Peso', value: user.weight ? `${user.weight} kg` : 'Não informado' },
    { label: 'Sexo', value: user.sex },
    { label: 'Objetivo', value: user.goal ?? 'Não informado' },
    {
      label: 'Nível de atividade',
      value: user.activityLevel ? ACTIVITY_LEVEL_LABELS[user.activityLevel] : 'Não informado',
    },
  ]

  return (
    <ScreenPageContainer className='pb-20'>
      <ScrollView showsVerticalScrollIndicator={false}>
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
          <Text className='mt-0.5 text-sm text-gray-400'>{user.age} anos</Text>

          {!isEditing && (
            <TouchableOpacity
              onPress={onEditPressed}
              className='mt-3 flex-row items-center gap-2 rounded-xl bg-white/10 px-5 py-2'>
              <FontAwesome5
                name='edit'
                size={14}
                color='#B872FF'
              />
              <Text className='text-sm text-[#B872FF]'>Editar perfil</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <FormWrapper>
            <View className='mt-6 items-center gap-3 pb-6'>
              <CustomInput
                name='email'
                placeholder='E-mail'
                control={control}
                keyboardType='email-address'
                rules={{
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: 'E-mail inválido',
                  },
                  validate: (value: string) => {
                    const exists = users.some(
                      (u) => u.email.toLowerCase() === value.toLowerCase() && u.id !== user.id,
                    )
                    return !exists || 'E-mail já está em uso'
                  },
                }}
              />

              <CustomInput
                name='height'
                placeholder='Altura em cm'
                control={control}
                keyboardType='numeric'
                rules={{
                  required: 'Altura é obrigatória',
                  pattern: { value: /^[0-9]+$/, message: 'Use apenas números (ex: 175)' },
                  min: { value: 120, message: 'Altura mínima permitida é 120 cm' },
                  max: { value: 250, message: 'Altura máxima permitida é 250 cm' },
                }}
              />

              <CustomInput
                name='weight'
                placeholder='Peso em kg'
                control={control}
                keyboardType='numeric'
                rules={{
                  required: 'Peso é obrigatório',
                  pattern: { value: /^[0-9]+$/, message: 'Use apenas números (ex: 75)' },
                  min: { value: 30, message: 'Peso mínimo é 30 kg' },
                  max: { value: 300, message: 'Peso máximo é 300 kg' },
                }}
              />

              <CustomPicker
                control={control}
                name='sex'
                placeholder='Sexo'
                rules={{ required: 'Selecione seu sexo' }}
                options={[
                  { label: 'Masculino', value: UserSex.Male },
                  { label: 'Feminino', value: UserSex.Female },
                ]}
              />

              <CustomPicker
                control={control}
                name='goal'
                placeholder='Objetivo'
                rules={{ required: 'Selecione seu objetivo' }}
                options={[
                  { label: 'Perder peso', value: UserGoal.LoseWeight },
                  { label: 'Ganhar peso', value: UserGoal.GainWeight },
                  { label: 'Manter peso', value: UserGoal.MaintainWeight },
                ]}
              />

              <CustomPicker
                control={control}
                name='activityLevel'
                placeholder='Nível de atividade'
                rules={{ required: 'Selecione seu nível de atividade' }}
                options={Object.values(ActivityLevel).map((level) => ({
                  label: ACTIVITY_LEVEL_LABELS[level],
                  value: level,
                }))}
              />

              {isSubmitting ? (
                <ActivityIndicator
                  size='large'
                  color='#B872FF'
                />
              ) : (
                <View className='w-4/5 gap-3'>
                  <TouchableOpacity
                    onPress={handleSubmit(onSavePressed)}
                    disabled={!isValid}
                    className='items-center rounded-xl bg-[#B872FF] py-3 disabled:opacity-50'>
                    <Text className='font-bold text-white'>Salvar alterações</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onCancelPressed}
                    className='items-center rounded-xl bg-white/10 py-3'>
                    <Text className='text-white'>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </FormWrapper>
        ) : (
          <View className='mt-8 gap-3 px-6'>
            {viewFields.map(({ label, value }) => (
              <View
                key={label}
                className='border-b border-white/10 pb-3'>
                <Text className='text-xs text-gray-400'>{label}</Text>
                <Text className='mt-0.5 text-base font-semibold text-white'>{value}</Text>
              </View>
            ))}
          </View>
        )}

        {!isEditing && (
          <View className='gap-4 px-4 py-8'>
            <TouchableOpacity
              onPress={onLogoutPressed}
              className='flex-row items-center justify-center gap-2 rounded-xl bg-[#98A0A8] py-3'>
              <FontAwesome5
                name='sign-out-alt'
                size={20}
                color='white'
              />
              <Text className='text-lg font-semibold text-white'>Sair</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onDeletePressed}
              className='flex-row items-center justify-center gap-2 rounded-xl bg-red-600 py-3'>
              <FontAwesome5
                name='trash-alt'
                size={20}
                color='white'
              />
              <Text className='text-lg font-semibold text-white'>Apagar conta</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenPageContainer>
  )
}

export default Profile
