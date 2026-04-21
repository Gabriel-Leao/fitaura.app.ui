import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ActivityIndicator, Alert, View } from 'react-native'

import { Link } from 'expo-router'

import type { SignInFormData } from '@/@types/forms'
import { useUserContext } from '@/components/context/user/useUserContext'
import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import FormWrapper from '@/components/FormWrapper'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import ScreenPageTitle from '@/components/ScreenPageTitle'
import { ROUTES } from '@/constants/routes'

const SignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignInFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const { login } = useUserContext()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const onSignInPressed = async (data: SignInFormData) => {
    setIsSubmitting(true)
    try {
      await login(data.email, data.password)
    } catch (error: unknown) {
      Alert.alert('Erro', (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ScreenPageContainer className='justify-center gap-8'>
      <ScreenPageTitle>Login</ScreenPageTitle>
      <FormWrapper>
        <View className='items-center gap-3'>
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
            }}
          />

          <CustomInput
            name='password'
            placeholder='Senha'
            control={control}
            secureTextEntry={true}
            rules={{
              required: 'Senha é obrigatória',
              minLength: {
                value: 8,
                message: 'A senha deve ter no mínimo 8 caracteres',
              },
            }}
          />

          {isSubmitting ? (
            <ActivityIndicator
              size='large'
              color='#B872FF'
            />
          ) : (
            <CustomButton
              onPress={handleSubmit(onSignInPressed)}
              label='Entrar'
              disabled={!isValid}
            />
          )}
        </View>
      </FormWrapper>
      <Link
        href={ROUTES.SIGN_UP.ROUTE}
        className='pt-12 text-center text-[#fff]'>
        Não tem conta? cadastra-se
      </Link>
    </ScreenPageContainer>
  )
}

export default SignIn
