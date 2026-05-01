import { Text, View } from 'react-native'

import type { StockLevel } from '@/@types/shop'
import { useShopContext } from '@/components/context/shop/useShopContext'

import { ShopProductCard } from './ShopProductCard'

type ShopProductSectionProps = {
  category: string
  items: {
    id: string
    name: string
    price: string
    image: ReturnType<typeof require>
  }[]
}

function getStockLevel(stock: number): StockLevel {
  if (stock <= 0) return 'out'
  if (stock <= 3) return 'low'
  return 'high'
}

function getStockBadgeStyle(level: StockLevel): string {
  if (level === 'out') return 'bg-red-600'
  if (level === 'low') return 'bg-yellow-500'
  return 'bg-green-600'
}

function getStockLabel(stock: number): string {
  if (stock <= 0) return 'Esgotado'
  if (stock <= 3) return `Só ${stock} restante${stock > 1 ? 's' : ''}!`
  return 'Em estoque'
}

export const ShopProductSection = ({ category, items }: ShopProductSectionProps) => {
  const { stockMap, cart, addingId, addToCart, removeFromCart } = useShopContext()

  return (
    <View className='mb-8'>
      <Text className='mb-3 text-xl font-semibold text-white'>{category}</Text>
      <View className='flex-row flex-wrap gap-2'>
        {items.map((item) => {
          const stock = stockMap[item.id] ?? 99
          const level = getStockLevel(stock)

          return (
            <ShopProductCard
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              stockLevel={level}
              stockLabel={getStockLabel(stock)}
              stockBadgeStyle={getStockBadgeStyle(level)}
              isAdding={addingId === item.id}
              inCart={cart.find((c) => c.id === item.id)}
              onPress={() => addToCart(item.id, item.name, item.price)}
              onRemove={() => removeFromCart(item.id)}
            />
          )
        })}
      </View>
    </View>
  )
}
