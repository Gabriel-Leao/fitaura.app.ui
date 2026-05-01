import { Alert, Text, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { useShopContext } from '@/components/context/shop/useShopContext'

type ShopCartProps = {
  onClose: () => void
}

export const ShopCart = ({ onClose }: ShopCartProps) => {
  const { cart, cartTotal, addToCart, removeFromCart, clearCart, placeOrder } = useShopContext()

  const handleCheckout = () => {
    Alert.alert('Confirmar pedido', `Total: R$ ${cartTotal.toFixed(2).replace('.', ',')}`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => placeOrder(onClose),
      },
    ])
  }

  return (
    <View className='mx-4 mb-4 rounded-2xl bg-white/10 p-4'>
      <View className='mb-3 flex-row items-center justify-between'>
        <Text className='text-base font-semibold text-white'>Seu carrinho</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text className='text-xs text-red-400'>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View className='items-center gap-2 py-6'>
          <FontAwesome5
            name='shopping-basket'
            size={28}
            color='rgba(255,255,255,0.25)'
          />
          <Text className='text-sm text-white/40'>Carrinho vazio</Text>
        </View>
      ) : (
        <>
          {cart.map((item) => (
            <View
              key={item.id}
              className='mb-2 flex-row items-center justify-between'>
              <Text
                className='flex-1 text-xs text-white'
                numberOfLines={1}>
                {item.name}
              </Text>
              <View className='flex-row items-center gap-3'>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <FontAwesome5
                    name='minus-circle'
                    size={16}
                    color='#f87171'
                  />
                </TouchableOpacity>
                <Text className='w-5 text-center text-xs font-bold text-white'>
                  {item.quantity}
                </Text>
                <TouchableOpacity onPress={() => addToCart(item.id, item.name, item.price)}>
                  <FontAwesome5
                    name='plus-circle'
                    size={16}
                    color='#a78bfa'
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View className='mt-3 flex-row justify-between border-t border-white/20 pt-3'>
            <Text className='text-sm text-white/70'>Total</Text>
            <Text className='text-sm font-bold text-purple-400'>
              R$ {cartTotal.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <TouchableOpacity
            className='mt-3 items-center rounded-xl bg-purple-600 py-3'
            activeOpacity={0.8}
            onPress={handleCheckout}>
            <Text className='text-sm font-bold text-white'>Finalizar compra</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
