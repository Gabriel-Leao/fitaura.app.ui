import { useState } from 'react'
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native'

import { router } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import {
  type Order,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TOOLTIPS,
  type OrderStatus,
} from '@/@types/shop'
import ConfirmModal from '@/components/ConfirmModal'
import { CANCELLABLE_STATUSES, REFUNDABLE_STATUSES } from '@/components/context/shop/ShopProvider'
import { useShopContext } from '@/components/context/shop/useShopContext'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import { COLORS } from '@/constants/colors'
import { ROUTES } from '@/constants/routes'

const formatDate = (isoString: string): string => {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const StatusTooltip = ({
  status,
  visible,
  onClose,
}: {
  status: OrderStatus
  visible: boolean
  onClose: () => void
}) => {
  const color = ORDER_STATUS_COLORS[status]
  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      onRequestClose={onClose}>
      <TouchableOpacity
        className='flex-1 items-center justify-center bg-black/60'
        activeOpacity={1}
        onPress={onClose}>
        <View className='mx-8 rounded-2xl bg-[#1a1a2e] p-5 shadow-lg'>
          <View className='mb-3 flex-row items-center gap-2'>
            <View
              className='h-3 w-3 rounded-full'
              style={{ backgroundColor: color }}
            />
            <Text
              className='text-base font-bold'
              style={{ color }}>
              {ORDER_STATUS_LABELS[status]}
            </Text>
          </View>
          <Text className='text-sm leading-5 text-white/70'>{ORDER_STATUS_TOOLTIPS[status]}</Text>
          <TouchableOpacity
            onPress={onClose}
            className='mt-4 items-center rounded-xl bg-white/10 py-2'>
            <Text className='text-sm text-white'>Fechar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const OrderCard = ({
  item,
  onCancel,
  onRefund,
}: {
  item: Order
  onCancel: (order: Order) => void
  onRefund: (order: Order) => void
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const color = ORDER_STATUS_COLORS[item.status]
  const canCancel = CANCELLABLE_STATUSES.has(item.status)
  const canRefund = REFUNDABLE_STATUSES.has(item.status)
  const hasActions = canCancel || canRefund

  return (
    <View className='mb-4 rounded-xl bg-white/5 p-4'>
      <View className='mb-3 flex-row items-center justify-between'>
        <TouchableOpacity
          onPress={() => setTooltipVisible(true)}
          className='flex-row items-center gap-2'>
          <View
            className='h-2.5 w-2.5 rounded-full'
            style={{ backgroundColor: color }}
          />
          <Text
            className='text-sm font-semibold'
            style={{ color }}>
            {item.statusLabel ?? ORDER_STATUS_LABELS[item.status]}
          </Text>
          <FontAwesome5
            name='info-circle'
            size={11}
            color={color}
            style={{ opacity: 0.7 }}
          />
        </TouchableOpacity>
        <Text className='text-[11px] text-white/40'>{formatDate(item.placedAtISO)}</Text>
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

      <View className='mt-3 border-t border-white/10 pt-3'>
        <View className='mb-3 flex-row items-center gap-2'>
          <Text className='text-sm text-white/50'>Total pago</Text>
          <Text className='text-sm font-bold text-purple-400'>
            R$ {item.total.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        {hasActions && (
          <View className='gap-2'>
            {canCancel && (
              <TouchableOpacity
                onPress={() => onCancel(item)}
                className='w-full flex-row items-center justify-center gap-2 rounded-lg bg-slate-500/20 py-2.5'>
                <FontAwesome5
                  name='times'
                  size={11}
                  color='#94a3b8'
                />
                <Text className='text-xs font-semibold text-slate-400'>Cancelar pedido</Text>
              </TouchableOpacity>
            )}
            {canRefund && (
              <TouchableOpacity
                onPress={() => onRefund(item)}
                className='w-full flex-row items-center justify-center gap-2 rounded-lg bg-red-500/15 py-2.5'>
                <FontAwesome5
                  name='undo'
                  size={11}
                  color='#f87171'
                />
                <Text className='text-xs font-semibold text-red-400'>Solicitar reembolso</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <StatusTooltip
        status={item.status}
        visible={tooltipVisible}
        onClose={() => setTooltipVisible(false)}
      />
    </View>
  )
}

export default function Orders() {
  const { orders, cancelOrder, requestRefund } = useShopContext()
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)
  const [refundTarget, setRefundTarget] = useState<Order | null>(null)

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
            onCancel={setCancelTarget}
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
        visible={!!cancelTarget}
        variant='danger'
        title='Cancelar pedido'
        description={
          cancelTarget
            ? `Deseja cancelar o pedido de R$ ${cancelTarget.total.toFixed(2).replace('.', ',')}? Se já foi cobrado, você poderá solicitar reembolso.`
            : ''
        }
        confirmLabel='Cancelar pedido'
        cancelLabel='Voltar'
        onConfirm={() => {
          if (cancelTarget) cancelOrder(cancelTarget.id)
          setCancelTarget(null)
        }}
        onCancel={() => setCancelTarget(null)}
      />

      <ConfirmModal
        visible={!!refundTarget}
        variant='danger'
        title='Solicitar reembolso'
        description={
          refundTarget
            ? `Confirmar reembolso de R$ ${refundTarget.total.toFixed(2).replace('.', ',')}? O valor será estornado em até 5 dias úteis.`
            : ''
        }
        confirmLabel='Confirmar reembolso'
        cancelLabel='Voltar'
        onConfirm={() => {
          if (refundTarget) requestRefund(refundTarget.id)
          setRefundTarget(null)
        }}
        onCancel={() => setRefundTarget(null)}
      />
    </ScreenPageContainer>
  )
}
