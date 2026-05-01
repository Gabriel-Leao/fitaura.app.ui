import { Text, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { useShopContext } from '@/components/context/shop/useShopContext'

type ShopHeaderProps = {
  onToggleCart: () => void
}

export const ShopHeader = ({ onToggleCart }: ShopHeaderProps) => {
  const { cartCount } = useShopContext()

  return (
    <View className='flex-row items-center justify-between px-4 pb-2 pt-2'>
      <Text className='text-2xl font-bold text-white'>Loja</Text>
      <TouchableOpacity
        onPress={onToggleCart}
        className='relative items-center justify-center rounded-full p-2'
        activeOpacity={0.7}>
        <FontAwesome5
          name='shopping-cart'
          size={22}
          color='white'
        />
        {cartCount > 0 && (
          <View className='absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-purple-500'>
            <Text className='text-[10px] font-bold text-white'>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}
