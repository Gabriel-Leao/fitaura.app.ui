import { cn } from '@/lib/utils/cn'
import { Picker } from '@react-native-picker/picker'
import { useState } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import {
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native'

type Option = { label: string; value: string }

type CustomPickerProps<T extends FieldValues> = {
  placeholder?: string
  control: Control<T>
  name: Path<T>
  rules?: object
  options: Option[]
  viewClassname?: string
  pickerClassname?: string
}

const CustomPicker = <T extends FieldValues>({
  placeholder = 'Selecione...',
  control,
  name,
  rules = {},
  options,
  viewClassname,
  pickerClassname,
}: CustomPickerProps<T>) => {
  const [iosModalVisible, setIosModalVisible] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const selectedLabel =
          options.find((o) => o.value === value)?.label ?? placeholder

        return (
          <View className={cn('w-4/5 rounded-xl gap-2', viewClassname)}>
            {Platform.OS === 'ios' ? (
              <>
                <Pressable
                  onPress={() => setIosModalVisible(true)}
                  className={cn(
                    'bg-white rounded-xl border-2 px-4 py-4',
                    error ? 'border-red-600' : 'border-transparent'
                  )}>
                  <Text
                    className={cn(
                      'text-base',
                      value ? 'text-black' : 'text-gray-400'
                    )}>
                    {selectedLabel}
                  </Text>
                </Pressable>

                <Modal
                  visible={iosModalVisible}
                  transparent
                  animationType="slide">
                  <Pressable
                    className="flex-1 bg-black/40"
                    onPress={() => setIosModalVisible(false)}
                  />
                  <View className="bg-white">
                    <View className="flex-row justify-end px-4 py-2 border-b border-gray-200">
                      <Pressable onPress={() => setIosModalVisible(false)}>
                        <Text className="text-blue-500 text-base font-semibold">
                          Concluído
                        </Text>
                      </Pressable>
                    </View>

                    <Picker selectedValue={value} onValueChange={onChange}>
                      <Picker.Item label={placeholder} value="" />
                      {options.map((opt) => (
                        <Picker.Item
                          key={opt.value}
                          label={opt.label}
                          value={opt.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </Modal>
              </>
            ) : (
              <View
                className={cn(
                  'bg-white rounded-xl border-2',
                  error ? 'border-red-600' : 'border-transparent'
                )}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  className={cn('w-full h-full', pickerClassname)}>
                  <Picker.Item label={placeholder} value="" />
                  {options.map((opt) => (
                    <Picker.Item
                      key={opt.value}
                      label={opt.label}
                      value={opt.value}
                    />
                  ))}
                </Picker>
              </View>
            )}

            <Text
              className={cn(
                'text-red-600 self-stretch px-2 min-h-[16px]',
                !error && 'opacity-0'
              )}>
              {error?.message || 'Erro'}
            </Text>
          </View>
        )
      }}
    />
  )
}

export default CustomPicker