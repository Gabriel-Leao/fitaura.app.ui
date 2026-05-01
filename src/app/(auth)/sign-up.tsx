import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native'

import { Link, router } from 'expo-router'

import { ACTIVITY_LEVEL_LABELS, ActivityLevel, UserGoal, UserSex } from '@/@types/enums'
import type { SignUpFormData } from '@/@types/forms'
import { useUserContext } from '@/components/context/user/useUserContext'
import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import CustomPicker from '@/components/CustomPicker'
import FormWrapper from '@/components/FormWrapper'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import ScreenPageTitle from '@/components/ScreenPageTitle'
import { ROUTES } from '@/constants/routes'
import { VALIDATIONS } from '@/constants/validations'

const SignUp = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const { register, users } = useUserContext()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const onCreatePressed = async (data: SignUpFormData) => {
    setIsSubmitting(true)

    try {
      await register(data)
      router.push(ROUTES.HOME.ROUTE)
    } catch (error: unknown) {
      Alert.alert('Erro', (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ScreenPageContainer className='gap-8 pt-24'>
      <ScreenPageTitle>Criar conta</ScreenPageTitle>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FormWrapper>
          <View className='items-center gap-3'>
            <CustomInput
              name='name'
              placeholder='Nome completo'
              control={control}
              rules={VALIDATIONS.name}
            />

            <CustomInput
              name='email'
              placeholder='E-mail'
              control={control}
              keyboardType='email-address'
              rules={{
                ...VALIDATIONS.email,
                validate: (value: string) => {
                  const exists = users.some((u) => u.email.toLowerCase() === value.toLowerCase())

                  return !exists || 'E-mail já está em uso'
                },
              }}
            />

            <CustomInput
              name='password'
              placeholder='Senha'
              control={control}
              secureTextEntry
              rules={VALIDATIONS.password}
            />

            <View className='flex-row justify-center gap-8'>
              <CustomInput
                name='age'
                placeholder='Idade'
                control={control}
                keyboardType='numeric'
                viewClassname='w-1/3'
                rules={VALIDATIONS.age}
              />

              <CustomInput
                name='height'
                placeholder='Altura em cm'
                control={control}
                keyboardType='numeric'
                viewClassname='w-2/5'
                rules={VALIDATIONS.height}
              />
            </View>

            <CustomInput
              name='weight'
              placeholder='Peso em kg'
              control={control}
              keyboardType='numeric'
              rules={VALIDATIONS.weight}
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
              <CustomButton
                onPress={handleSubmit(onCreatePressed)}
                disabled={!isValid}
                label='Criar conta'
              />
            )}
          </View>
        </FormWrapper>

        <Link
          href={ROUTES.SIGN_IN.ROUTE}
          className='pt-12 text-center text-[#fff]'>
          Já tem conta? Faça login
        </Link>
      </ScrollView>
    </ScreenPageContainer>
  )
}

export default SignUp
