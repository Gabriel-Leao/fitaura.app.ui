import { Text, View } from 'react-native'

type MacroPreviewProps = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export const MacroPreview = ({ calories, protein, carbs, fat }: MacroPreviewProps) => (
  <View className='rounded-xl bg-white/5 p-3'>
    <Text className='mb-2 text-center text-lg font-bold text-white'>{calories} kcal</Text>
    <View className='flex-row justify-around border-t border-white/10 pt-2'>
      <View className='items-center'>
        <Text className='text-xs text-gray-400'>Proteína</Text>
        <Text className='text-sm font-semibold text-white'>{protein}g</Text>
      </View>
      <View className='items-center'>
        <Text className='text-xs text-gray-400'>Carb</Text>
        <Text className='text-sm font-semibold text-white'>{carbs}g</Text>
      </View>
      <View className='items-center'>
        <Text className='text-xs text-gray-400'>Gordura</Text>
        <Text className='text-sm font-semibold text-white'>{fat}g</Text>
      </View>
    </View>
  </View>
)
