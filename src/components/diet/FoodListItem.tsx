import { Text, TouchableOpacity } from 'react-native'

import { type Food, FOOD_UNIT_LABEL } from '@/@types/diet'

type FoodListItemProps = {
  food: Food
  selected: boolean
  onPress: () => void
}

export const FoodListItem = ({ food, selected, onPress }: FoodListItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mb-1 flex-row items-center justify-between rounded-xl px-4 py-3 ${
      selected ? 'border border-[#B872FF] bg-[#B872FF]/30' : 'bg-white/10'
    }`}>
    <Text className='text-white'>{food.name}</Text>
    <Text className='text-xs text-gray-400'>
      {(food.caloriesPer1Unit * 100).toFixed(0)} kcal/100{FOOD_UNIT_LABEL[food.type]}
      {food.isCustom ? ' ★' : ''}
    </Text>
  </TouchableOpacity>
)
