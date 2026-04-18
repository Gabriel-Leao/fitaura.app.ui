import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form'
import { type KeyboardTypeOptions, Text, TextInput, View } from 'react-native'

import { cn } from '@/lib/utils/cn'

type CustomInputProps<T extends FieldValues> = {
  placeholder: string
  secureTextEntry?: boolean
  control: Control<T>
  name: Path<T>
  keyboardType?: KeyboardTypeOptions
  rules?: object
  viewClassname?: string
  inputClassname?: string
}

const CustomInput = <T extends FieldValues>({
  placeholder,
  secureTextEntry,
  control,
  name,
  keyboardType = 'default',
  rules = {},
  viewClassname,
  inputClassname,
}: CustomInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View className={cn('w-4/5 gap-2 rounded-xl', viewClassname)}>
          <TextInput
            placeholder={placeholder}
            autoComplete='off'
            keyboardType={keyboardType}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry ?? false}
            className={cn(
              'rounded-xl border-2 bg-[#fff] px-6 py-3 text-[#144480]',
              error ? 'border-red-600' : 'border-transparent',
              inputClassname,
            )}
          />
          <Text
            className={cn('min-h-[16px] self-stretch px-2 text-red-600', !error && 'opacity-0')}>
            {error?.message || 'Erro'}
          </Text>
        </View>
      )}
    />
  )
}

export default CustomInput
