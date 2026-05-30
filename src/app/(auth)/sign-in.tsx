import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ActivityIndicator, Alert, View } from 'react-native'

import type { SignInFormData } from '@/@types/forms'
import AuthPageContainer from '@/components/AuthPageContainer'
import { useUserContext } from '@/components/context/user/useUserContext'
import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import FormWrapper from '@/components/FormWrapper'
import ScreenPageTitle from '@/components/ScreenPageTitle'
import { COLORS } from '@/constants/colors'
import { ROUTES } from '@/constants/routes'
import { VALIDATIONS } from '@/constants/validations'

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
    <AuthPageContainer
      destination={ROUTES.SIGN_UP.ROUTE}
      destinationLabel='Não tem conta? Cadastre-se'>
      <ScreenPageTitle>Login</ScreenPageTitle>

      <FormWrapper>
        <View className='items-center gap-3'>
          <CustomInput
            name='email'
            placeholder='E-mail'
            control={control}
            keyboardType='email-address'
            rules={VALIDATIONS.email}
          />

          <CustomInput
            name='password'
            placeholder='Senha'
            control={control}
            secureTextEntry
            rules={VALIDATIONS.password}
          />

          {isSubmitting ? (
            <ActivityIndicator
              size='large'
              color={COLORS.primary}
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
    </AuthPageContainer>
  )
}

export default SignIn
