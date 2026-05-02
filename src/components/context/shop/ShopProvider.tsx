import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { io, type Socket } from 'socket.io-client'

import type { CartItem, IoTReading, Order, OrderStatus } from '@/@types/shop'
import { useUserContext } from '@/components/context/user/useUserContext'
import { STORE_DATA } from '@/constants/store'

const SOCKET_URL = 'http://localhost:3001'

const cartKey = (userId: string) => `@fitaura:cart:${userId}`
const ordersKey = (userId: string) => `@fitaura:orders:${userId}`

type ShopContextType = {
  stockMap: Record<string, number>
  iotReading: IoTReading | null
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  addingId: string | null
  orders: Order[]
  isConnected: boolean
  addToCart: (id: string, name: string, price: string) => Promise<void>
  removeFromCart: (id: string) => void
  clearCart: () => void
  placeOrder: (onSuccess?: () => void) => void
}

export const ShopContext = createContext<ShopContextType | undefined>(undefined)

export const ShopProvider = ({ children }: React.PropsWithChildren) => {
  const { currentUser } = useUserContext()
  const userId = currentUser!.id

  const [stockMap, setStockMap] = useState<Record<string, number>>({})
  const [iotReading, setIotReading] = useState<IoTReading | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [addingId, setAddingId] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const iotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [cartRaw, ordersRaw] = await Promise.all([
          AsyncStorage.getItem(cartKey(userId)),
          AsyncStorage.getItem(ordersKey(userId)),
        ])
        setCart(cartRaw ? (JSON.parse(cartRaw) as CartItem[]) : [])
        setOrders(ordersRaw ? (JSON.parse(ordersRaw) as Order[]) : [])
      } catch {}
    }
    load()
  }, [userId])

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: true })
    socketRef.current = socket

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    socket.on(
      'order_status',
      ({ orderId, status, label }: { orderId: string; status: OrderStatus; label: string }) => {
        setOrders((prev) => {
          const updated = prev.map((o) =>
            o.id === orderId ? { ...o, status, statusLabel: label } : o,
          )
          AsyncStorage.setItem(ordersKey(userId), JSON.stringify(updated))
          return updated
        })
      },
    )

    return () => {
      socket.disconnect()
    }
  }, [userId])

  useEffect(() => {
    const initial: Record<string, number> = {}
    STORE_DATA.forEach((section) =>
      section.items.forEach((item) => {
        initial[item.id] = Math.floor(Math.random() * 10) + 2
      }),
    )
    setStockMap(initial)

    const sendIoT = () => {
      setIotReading({
        temperature: parseFloat((18 + Math.random() * 6).toFixed(1)),
        humidity: parseFloat((55 + Math.random() * 20).toFixed(1)),
        timestamp: new Date().toLocaleTimeString('pt-BR'),
      })
    }

    const fluctuateStock = () => {
      setStockMap((prev) => {
        const ids = Object.keys(prev)
        if (ids.length === 0) return prev
        const randomId = ids[Math.floor(Math.random() * ids.length)]
        const delta = Math.random() < 0.4 ? -1 : 1
        const newStock = Math.max(0, Math.min(15, (prev[randomId] ?? 5) + delta))
        return { ...prev, [randomId]: newStock }
      })
    }

    sendIoT()
    iotIntervalRef.current = setInterval(sendIoT, 8000)
    stockIntervalRef.current = setInterval(fluctuateStock, 5000)

    return () => {
      if (iotIntervalRef.current) clearInterval(iotIntervalRef.current)
      if (stockIntervalRef.current) clearInterval(stockIntervalRef.current)
    }
  }, [])

  const persistCart = useCallback(
    async (items: CartItem[]) => {
      try {
        await AsyncStorage.setItem(cartKey(userId), JSON.stringify(items))
      } catch {}
    },
    [userId],
  )

  const persistOrders = useCallback(
    async (items: Order[]) => {
      try {
        await AsyncStorage.setItem(ordersKey(userId), JSON.stringify(items))
      } catch {}
    },
    [userId],
  )

  const addToCart = useCallback(
    async (id: string, name: string, price: string) => {
      const stock = stockMap[id] ?? 0
      const currentQty = cart.find((i) => i.id === id)?.quantity ?? 0

      if (stock <= 0) {
        Alert.alert('Produto esgotado', 'Este produto não está disponível no momento.')
        return
      }

      if (currentQty >= stock) {
        Alert.alert(
          'Limite de estoque',
          `Você já tem ${currentQty} unidade${currentQty > 1 ? 's' : ''} no carrinho e o estoque disponível é de ${stock}.`,
        )
        return
      }

      setAddingId(id)
      await new Promise((r) => setTimeout(r, 400))

      setCart((prev) => {
        const existing = prev.find((i) => i.id === id)
        const updated = existing
          ? prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...prev, { id, name, price, quantity: 1 }]
        persistCart(updated)
        return updated
      })

      setAddingId(null)
    },
    [stockMap, cart, persistCart],
  )

  const removeFromCart = useCallback(
    (id: string) => {
      setCart((prev) => {
        const updated = prev
          .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0)
        persistCart(updated)
        return updated
      })
    },
    [persistCart],
  )

  const clearCart = useCallback(() => {
    Alert.alert('Limpar carrinho', 'Remover todos os itens?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: () => {
          setCart([])
          persistCart([])
        },
      },
    ])
  }, [persistCart])

  const placeOrder = useCallback(
    (onSuccess?: () => void) => {
      const outOfStock = cart.filter((item) => (stockMap[item.id] ?? 0) < item.quantity)

      if (outOfStock.length > 0) {
        const names = outOfStock.map((i) => i.name).join(', ')
        Alert.alert(
          'Estoque insuficiente',
          `Os seguintes itens não têm estoque suficiente: ${names}. Ajuste as quantidades e tente novamente.`,
        )
        return
      }

      if (cart.length === 0) return

      const total = cart.reduce((sum, item) => {
        const num = parseFloat(item.price.replace('R$ ', '').replace(',', '.'))
        return sum + num * item.quantity
      }, 0)

      const order: Order = {
        id: `order_${Date.now()}`,
        items: cart,
        total,
        placedAt: new Date().toLocaleString('pt-BR'),
        status: 'received',
        statusLabel: 'Pedido recebido',
      }

      const updatedStock = { ...stockMap }
      cart.forEach((item) => {
        updatedStock[item.id] = Math.max(0, (updatedStock[item.id] ?? 0) - item.quantity)
      })

      setOrders((prev) => {
        const updated = [order, ...prev]
        persistOrders(updated)
        return updated
      })

      setStockMap(updatedStock)
      setCart([])
      persistCart([])

      socketRef.current?.emit('place_order', { id: order.id, items: order.items })
      onSuccess?.()
    },
    [cart, stockMap, persistCart, persistOrders],
  )

  const cartTotal = cart.reduce((sum, item) => {
    const num = parseFloat(item.price.replace('R$ ', '').replace(',', '.'))
    return sum + num * item.quantity
  }, 0)

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <ShopContext.Provider
      value={{
        stockMap,
        iotReading,
        cart,
        cartCount,
        cartTotal,
        addingId,
        orders,
        isConnected,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
      }}>
      {children}
    </ShopContext.Provider>
  )
}
