import { Text, TextInput, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { FOOD_QUICK_AMOUNTS, FOOD_UNIT_LABEL, type FoodType } from '@/@types/diet'

type QuantitySelectorProps = {
  foodType: FoodType
  quantity: string
  onChange: (value: string) => void
}

export const QuantitySelector = ({ foodType, quantity, onChange }: QuantitySelectorProps) => {
  const parsed = Math.min(1000, Math.max(1, parseInt(quantity) || 1))
  const quickAmounts = FOOD_QUICK_AMOUNTS[foodType]
  const unitLabel = FOOD_UNIT_LABEL[foodType]

  const selectedStep = quickAmounts.reduce((nearest, amt) =>
    Math.abs(amt - parsed) < Math.abs(nearest - parsed) ? amt : nearest,
  )

  const handleDecrement = () => onChange(String(Math.max(1, parsed - selectedStep)))
  const handleIncrement = () => onChange(String(Math.min(1000, parsed + selectedStep)))

  return (
    <View>
      <Text className='mb-2 text-sm text-gray-400'>Quantidade ({unitLabel})</Text>

      <View className='mb-3 flex-row flex-wrap gap-2'>
        {quickAmounts.map((amt) => (
          <TouchableOpacity
            key={amt}
            onPress={() => onChange(String(amt))}
            className={`flex-1 items-center rounded-xl py-2 ${quantity === String(amt) ? 'bg-[#B872FF]' : 'bg-white/10'}`}>
            <Text className='text-sm text-white'>{amt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className='flex-row items-center gap-3'>
        <TouchableOpacity
          onPress={handleDecrement}
          className='h-14 w-14 items-center justify-center rounded-xl bg-white/10'>
          <FontAwesome5
            name='minus'
            size={16}
            color='white'
          />
        </TouchableOpacity>

        <TextInput
          value={quantity}
          onChangeText={(v) => onChange(v.replace(/[^0-9]/g, ''))}
          keyboardType='numeric'
          className='flex-1 rounded-xl bg-white/10 py-4 text-center text-xl font-bold text-white'
        />

        <TouchableOpacity
          onPress={handleIncrement}
          className='h-14 w-14 items-center justify-center rounded-xl bg-white/10'>
          <FontAwesome5
            name='plus'
            size={16}
            color='white'
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}
