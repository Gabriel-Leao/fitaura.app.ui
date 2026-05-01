import { ActivityIndicator, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import type { CartItem, StockLevel } from '@/@types/shop'

const SCREEN_WIDTH = Dimensions.get('window').width
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - 48) / 3)
const IMAGE_HEIGHT = Math.floor(CARD_WIDTH * 1.25)
const CARD_HEIGHT = IMAGE_HEIGHT + 112

type ShopProductCardProps = {
  name: string
  price: string
  image: ReturnType<typeof require>
  stockLevel: StockLevel
  stockLabel: string
  stockBadgeStyle: string
  isAdding: boolean
  inCart: CartItem | undefined
  onPress: () => void
  onRemove: () => void
}

export const ShopProductCard = ({
  name,
  price,
  image,
  stockLevel,
  stockLabel,
  stockBadgeStyle,
  isAdding,
  inCart,
  onPress,
  onRemove,
}: ShopProductCardProps) => (
  <View
    style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    className='mb-3 rounded-xl bg-white/5 p-2'>
    <TouchableOpacity
      activeOpacity={stockLevel === 'out' ? 1 : 0.7}
      disabled={stockLevel === 'out'}
      onPress={onPress}>
      <Image
        source={image!}
        style={{
          width: CARD_WIDTH - 16,
          height: IMAGE_HEIGHT,
          opacity: stockLevel === 'out' ? 0.4 : 1,
        }}
        className='rounded-lg'
        resizeMode='cover'
      />
    </TouchableOpacity>

    <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: 6 }}>
      <View>
        <Text
          className='text-center text-[11px] leading-tight text-white'
          numberOfLines={2}>
          {name}
        </Text>
        <Text className='mt-0.5 text-center text-[10px] text-white/60'>{price}</Text>
      </View>

      <View className='items-center gap-1'>
        <View className={`rounded-full px-2 py-0.5 ${stockBadgeStyle}`}>
          <Text className='text-[9px] font-semibold text-white'>{stockLabel}</Text>
        </View>

        <View className='h-5 items-center justify-center'>
          {stockLevel !== 'out' &&
            (isAdding ? (
              <ActivityIndicator
                size='small'
                color='#B872FF'
              />
            ) : inCart ? (
              <View className='flex-row items-center gap-2'>
                <TouchableOpacity
                  onPress={onRemove}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <FontAwesome5
                    name='minus-circle'
                    size={13}
                    color='#f87171'
                  />
                </TouchableOpacity>
                <Text className='text-[10px] font-bold text-purple-400'>{inCart.quantity}</Text>
                <TouchableOpacity
                  onPress={onPress}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <FontAwesome5
                    name='plus-circle'
                    size={13}
                    color='#a78bfa'
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={onPress}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <FontAwesome5
                  name='cart-plus'
                  size={13}
                  color='rgba(255,255,255,0.4)'
                />
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </View>
  </View>
)
