import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'

import Constants from 'expo-constants'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { io, type Socket } from 'socket.io-client'

import type { CartItem, IoTReading, Order, OrderStatus } from '@/@types/shop'
import { useUserContext } from '@/components/context/user/useUserContext'
import { STORE_DATA } from '@/constants/store'

const localIp = Constants.expoConfig?.hostUri?.split(':')[0]
const SOCKET_URL = `http://${localIp}:3001`

const DELAYED_AFTER_MS = 30_000
const FAILED_AFTER_MS = 60_000
const TERMINAL_STATUSES = new Set<OrderStatus>(['delivered', 'delayed', 'failed'])
const IN_PROGRESS_STATUSES = new Set<OrderStatus>(['received', 'processing', 'shipped'])

const cartKey = (userId: string) => `@fitaura:cart:${userId}`
const ordersKey = (userId: string) => `@fitaura:orders:${userId}`
const stockKey = (userId: string) => `@fitaura:stock:${userId}`

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
  removeOrder: (orderId: string) => void
}

export const ShopContext = createContext<ShopContextType | undefined>(undefined)

const buildInitialStock = (): Record<string, number> => {
  const initial: Record<string, number> = {}
  STORE_DATA.forEach((section) =>
    section.items.forEach((item) => {
      initial[item.id] = Math.floor(Math.random() * 10) + 2
    }),
  )
  return initial
}

const applyStatusUpdate = (
  orderId: string,
  status: OrderStatus,
  label: string,
  userId: string,
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
) => {
  setOrders((prev) => {
    const updated = prev.map((o) => (o.id === orderId ? { ...o, status, statusLabel: label } : o))
    AsyncStorage.setItem(ordersKey(userId), JSON.stringify(updated))
    return updated
  })
}

const resolveStaleOrders = (orders: Order[]): Order[] => {
  const now = Date.now()
  return orders.map((order) => {
    if (TERMINAL_STATUSES.has(order.status)) return order
    if (!IN_PROGRESS_STATUSES.has(order.status)) return order

    let placedAt: number | null = null

    if (order.placedAtISO) {
      placedAt = new Date(order.placedAtISO).getTime()
    }

    if (!placedAt || isNaN(placedAt)) {
      return { ...order, status: 'failed', statusLabel: 'Falha na entrega' }
    }

    const elapsed = now - placedAt

    if (elapsed >= FAILED_AFTER_MS) {
      return { ...order, status: 'failed', statusLabel: 'Falha na entrega' }
    }
    if (elapsed >= DELAYED_AFTER_MS) {
      return { ...order, status: 'delayed', statusLabel: 'Pedido atrasado' }
    }
    return order
  })
}

export const ShopProvider = ({ children }: React.PropsWithChildren) => {
  const { currentUser } = useUserContext()
  const userId = currentUser?.id ?? null

  const [stockMap, setStockMap] = useState<Record<string, number>>({})
  const [stockReady, setStockReady] = useState<boolean>(false)
  const [iotReading, setIotReading] = useState<IoTReading | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [addingId, setAddingId] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const iotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const deliveryTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    if (!userId) return
    const load = async () => {
      try {
        const [cartRaw, ordersRaw, stockRaw] = await Promise.all([
          AsyncStorage.getItem(cartKey(userId)),
          AsyncStorage.getItem(ordersKey(userId)),
          AsyncStorage.getItem(stockKey(userId)),
        ])
        setCart(cartRaw ? (JSON.parse(cartRaw) as CartItem[]) : [])

        const rawOrders: Order[] = ordersRaw ? (JSON.parse(ordersRaw) as Order[]) : []
        const resolvedOrders = resolveStaleOrders(rawOrders)

        const hasChanges = resolvedOrders.some((o, i) => o.status !== rawOrders[i]?.status)
        if (hasChanges) {
          await AsyncStorage.setItem(ordersKey(userId), JSON.stringify(resolvedOrders))
        }

        setOrders(resolvedOrders)

        if (stockRaw) {
          setStockMap(JSON.parse(stockRaw) as Record<string, number>)
        } else {
          const fresh = buildInitialStock()
          setStockMap(fresh)
          await AsyncStorage.setItem(stockKey(userId), JSON.stringify(fresh))
        }
      } catch {
        setStockMap(buildInitialStock())
      } finally {
        setStockReady(true)
      }
    }
    load()
  }, [userId])

  useEffect(() => {
    if (!userId) return

    const socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: true })
    socketRef.current = socket

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    socket.on(
      'order_status',
      ({ orderId, status, label }: { orderId: string; status: OrderStatus; label: string }) => {
        const timer = deliveryTimersRef.current.get(orderId)
        if (timer) {
          clearTimeout(timer)
          deliveryTimersRef.current.delete(orderId)
        }
        applyStatusUpdate(orderId, status, label, userId, setOrders)
      },
    )

    return () => {
      socket.disconnect()
    }
  }, [userId])

  useEffect(() => {
    if (!stockReady || !userId) return

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
        const updated = { ...prev, [randomId]: newStock }
        AsyncStorage.setItem(stockKey(userId), JSON.stringify(updated))
        return updated
      })
    }

    sendIoT()
    iotIntervalRef.current = setInterval(sendIoT, 8000)
    stockIntervalRef.current = setInterval(fluctuateStock, 5000)

    return () => {
      if (iotIntervalRef.current) clearInterval(iotIntervalRef.current)
      if (stockIntervalRef.current) clearInterval(stockIntervalRef.current)
    }
  }, [stockReady, userId])

  const persistCart = useCallback(
    async (items: CartItem[]) => {
      if (!userId) return
      try {
        await AsyncStorage.setItem(cartKey(userId), JSON.stringify(items))
      } catch {}
    },
    [userId],
  )

  const persistOrders = useCallback(
    async (items: Order[]) => {
      if (!userId) return
      try {
        await AsyncStorage.setItem(ordersKey(userId), JSON.stringify(items))
      } catch {}
    },
    [userId],
  )

  const persistStock = useCallback(
    async (stock: Record<string, number>) => {
      if (!userId) return
      try {
        await AsyncStorage.setItem(stockKey(userId), JSON.stringify(stock))
      } catch {}
    },
    [userId],
  )

  const scheduleDeliveryTimeout = useCallback(
    (orderId: string, placedAtISO: string) => {
      if (!userId) return

      const now = Date.now()
      const elapsed = now - new Date(placedAtISO).getTime()

      const delayedIn = Math.max(0, DELAYED_AFTER_MS - elapsed)
      const failedIn = Math.max(0, FAILED_AFTER_MS - elapsed)

      const delayedTimer = setTimeout(() => {
        applyStatusUpdate(orderId, 'delayed', 'Pedido atrasado', userId, setOrders)
      }, delayedIn)

      const failedTimer = setTimeout(() => {
        applyStatusUpdate(orderId, 'failed', 'Falha na entrega', userId, setOrders)
        deliveryTimersRef.current.delete(orderId)
      }, failedIn)

      deliveryTimersRef.current.set(orderId, delayedTimer)
      setTimeout(() => {
        deliveryTimersRef.current.set(orderId, failedTimer)
      }, delayedIn)
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

      const now = new Date()
      const total = cart.reduce((sum, item) => {
        const num = parseFloat(item.price.replace('R$ ', '').replace(',', '.'))
        return sum + num * item.quantity
      }, 0)

      const order: Order = {
        id: `order_${Date.now()}`,
        items: cart,
        total,
        placedAt: now.toLocaleDateString('pt-BR'),
        placedAtISO: now.toISOString(),
        status: 'received',
        statusLabel: 'Pedido recebido',
      }

      const updatedStock = { ...stockMap }
      cart.forEach((item) => {
        updatedStock[item.id] = Math.max(0, (updatedStock[item.id] ?? 0) - item.quantity)
      })

      setStockMap(updatedStock)
      persistStock(updatedStock)

      setOrders((prev) => {
        const updated = [order, ...prev]
        persistOrders(updated)
        return updated
      })

      setCart([])
      persistCart([])

      if (socketRef.current?.connected) {
        socketRef.current.emit('place_order', { id: order.id, items: order.items })
        scheduleDeliveryTimeout(order.id, order.placedAtISO)
      } else {
        scheduleDeliveryTimeout(order.id, order.placedAtISO)
      }

      onSuccess?.()
    },
    [cart, stockMap, persistCart, persistOrders, persistStock, scheduleDeliveryTimeout],
  )

  const removeOrder = useCallback(
    (orderId: string) => {
      const timer = deliveryTimersRef.current.get(orderId)
      if (timer) {
        clearTimeout(timer)
        deliveryTimersRef.current.delete(orderId)
      }
      setOrders((prev) => {
        const updated = prev.filter((o) => o.id !== orderId)
        persistOrders(updated)
        return updated
      })
    },
    [persistOrders],
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
        removeOrder,
      }}>
      {children}
    </ShopContext.Provider>
  )
}
