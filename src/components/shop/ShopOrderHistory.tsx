import { Text, TouchableOpacity, View } from 'react-native'

import { router } from 'expo-router'

import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/@types/shop'
import { useShopContext } from '@/components/context/shop/useShopContext'
import { ROUTES } from '@/constants/routes'

const PREVIEW_COUNT = 3

export const ShopOrderHistory = () => {
  const { orders } = useShopContext()

  if (orders.length === 0) return null

  const preview = orders.slice(0, PREVIEW_COUNT)

  return (
    <View className='mb-8'>
      <View className='mb-4 flex-row items-center justify-between'>
        <Text className='text-xl font-semibold text-white'>Pedidos realizados</Text>
        {orders.length > PREVIEW_COUNT && (
          <TouchableOpacity onPress={() => router.push(ROUTES.ORDERS.ROUTE)}>
            <Text className='text-xs text-purple-400'>Ver todos ({orders.length})</Text>
          </TouchableOpacity>
        )}
      </View>

      {preview.map((item) => {
        const color = ORDER_STATUS_COLORS[item.status]
        return (
          <View
            key={item.id}
            className='mb-3 rounded-xl bg-white/5 p-4'>
            <View className='mb-2 flex-row items-center justify-between'>
              <View className='flex-row items-center gap-2'>
                <View
                  className='h-2 w-2 rounded-full'
                  style={{ backgroundColor: color }}
                />
                <Text
                  className='text-xs font-semibold'
                  style={{ color }}>
                  {item.statusLabel ?? ORDER_STATUS_LABELS[item.status]}
                </Text>
              </View>
              <Text className='text-[10px] text-white/40'>{item.placedAt}</Text>
            </View>
            {item.items.map((cartItem) => (
              <Text
                key={cartItem.id}
                className='text-xs text-white/70'
                numberOfLines={1}>
                {cartItem.quantity}× {cartItem.name}
              </Text>
            ))}
            <View className='mt-2 flex-row justify-between border-t border-white/10 pt-2'>
              <Text className='text-xs text-white/50'>Total pago</Text>
              <Text className='text-xs font-bold text-purple-400'>
                R$ {item.total.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>
        )
      })}

      {orders.length > PREVIEW_COUNT && (
        <TouchableOpacity
          onPress={() => router.push(ROUTES.ORDERS.ROUTE)}
          className='items-center rounded-xl border border-purple-500/30 py-3'>
          <Text className='text-sm text-purple-400'>Ver todos os pedidos ({orders.length})</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
