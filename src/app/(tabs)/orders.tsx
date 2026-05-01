import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { router } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/@types/shop'
import { ShopProvider } from '@/components/context/shop/ShopProvider'
import { useShopContext } from '@/components/context/shop/useShopContext'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import { ROUTES } from '@/constants/routes'

const OrdersContent = () => {
  const { orders } = useShopContext()

  return (
    <ScreenPageContainer className='py-16'>
      <View className='mb-6 flex-row items-center gap-3 px-4'>
        <TouchableOpacity onPress={() => router.navigate(ROUTES.SHOP.ROUTE)}>
          <FontAwesome5
            name='arrow-left'
            size={18}
            color='white'
          />
        </TouchableOpacity>
        <Text className='text-2xl font-bold text-white'>Meus pedidos</Text>
      </View>

      <ScrollView
        className='px-4'
        showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View className='items-center py-20'>
            <FontAwesome5
              name='box-open'
              size={36}
              color='#444'
            />
            <Text className='mt-4 text-center text-gray-500'>Nenhum pedido realizado ainda.</Text>
          </View>
        ) : (
          orders.map((item) => {
            const color = ORDER_STATUS_COLORS[item.status]
            return (
              <View
                key={item.id}
                className='mb-4 rounded-xl bg-white/5 p-4'>
                <View className='mb-3 flex-row items-center justify-between'>
                  <View className='flex-row items-center gap-2'>
                    <View
                      className='h-2.5 w-2.5 rounded-full'
                      style={{ backgroundColor: color }}
                    />
                    <Text
                      className='text-sm font-semibold'
                      style={{ color }}>
                      {item.statusLabel ?? ORDER_STATUS_LABELS[item.status]}
                    </Text>
                  </View>
                  <Text className='text-[11px] text-white/40'>{item.placedAt}</Text>
                </View>

                {item.items.map((cartItem) => (
                  <View
                    key={cartItem.id}
                    className='flex-row justify-between py-1'>
                    <Text
                      className='flex-1 text-sm text-white/80'
                      numberOfLines={1}>
                      {cartItem.quantity}× {cartItem.name}
                    </Text>
                    <Text className='text-sm text-white/50'>{cartItem.price}</Text>
                  </View>
                ))}

                <View className='mt-3 flex-row justify-between border-t border-white/10 pt-3'>
                  <Text className='text-sm text-white/50'>Total pago</Text>
                  <Text className='text-sm font-bold text-purple-400'>
                    R$ {item.total.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              </View>
            )
          })
        )}
        <View className='h-6' />
      </ScrollView>
    </ScreenPageContainer>
  )
}

export default function Orders() {
  return (
    <ShopProvider>
      <OrdersContent />
    </ShopProvider>
  )
}
