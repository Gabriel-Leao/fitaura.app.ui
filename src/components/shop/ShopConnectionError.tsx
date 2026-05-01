import { Text, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

type ShopConnectionErrorProps = {
  message: string
  onRetry: () => void
}

export const ShopConnectionError = ({ message, onRetry }: ShopConnectionErrorProps) => (
  <View className='mx-4 mb-3 flex-row items-center gap-2 rounded-xl bg-red-900/60 px-4 py-3'>
    <FontAwesome5
      name='exclamation-circle'
      size={14}
      color='#f87171'
    />
    <Text className='flex-1 text-xs text-red-300'>{message}</Text>
    <TouchableOpacity onPress={onRetry}>
      <Text className='text-xs font-semibold text-purple-400'>Tentar novamente</Text>
    </TouchableOpacity>
  </View>
)
