import { useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

import { router } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { type Order, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/@types/shop'
import ConfirmModal from '@/components/ConfirmModal'
import { useShopContext } from '@/components/context/shop/useShopContext'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import { COLORS } from '@/constants/colors'
import { ROUTES } from '@/constants/routes'

const REFUNDABLE_STATUSES = new Set(['received', 'processing', 'delayed', 'failed'])

const OrderCard = ({ item, onRefund }: { item: Order; onRefund: (order: Order) => void }) => {
  const color = ORDER_STATUS_COLORS[item.status]
  const canRefund = REFUNDABLE_STATUSES.has(item.status)

  return (
    <View className='mb-4 rounded-xl bg-white/5 p-4'>
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
        <Text className='text-[11px] text-white/40'>
          {new Date(item.placedAtISO).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
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

      <View className='mt-3 flex-row items-center justify-between border-t border-white/10 pt-3'>
        <View className='flex-row items-center gap-3'>
          <Text className='text-sm text-white/50'>Total pago</Text>
          <Text className='text-sm font-bold text-purple-400'>
            R$ {item.total.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        {canRefund && (
          <TouchableOpacity
            onPress={() => onRefund(item)}
            className='flex-row items-center gap-1.5 rounded-lg bg-red-500/15 px-3 py-1.5'>
            <FontAwesome5
              name='undo'
              size={10}
              color={COLORS.dangerLight}
            />
            <Text className='text-xs font-semibold text-red-400'>Reembolso</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default function Orders() {
  const { orders, removeOrder } = useShopContext()
  const [refundTarget, setRefundTarget] = useState<Order | null>(null)

  const handleConfirmRefund = () => {
    if (refundTarget) {
      removeOrder(refundTarget.id)
      setRefundTarget(null)
    }
  }

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

      <FlatList<Order>
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard
            item={item}
            onRefund={setRefundTarget}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className='items-center py-20'>
            <FontAwesome5
              name='box-open'
              size={36}
              color={COLORS.grayDark}
            />
            <Text className='mt-4 text-center text-gray-500'>Nenhum pedido realizado ainda.</Text>
          </View>
        }
      />

      <ConfirmModal
        visible={!!refundTarget}
        variant='danger'
        title='Solicitar reembolso'
        description={
          refundTarget
            ? `Confirmar reembolso de R$ ${refundTarget.total.toFixed(2).replace('.', ',')}? O pedido será removido do histórico.`
            : ''
        }
        confirmLabel='Confirmar reembolso'
        cancelLabel='Cancelar'
        onConfirm={handleConfirmRefund}
        onCancel={() => setRefundTarget(null)}
      />
    </ScreenPageContainer>
  )
}
