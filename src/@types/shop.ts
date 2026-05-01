export type StockLevel = 'high' | 'low' | 'out'

export type OrderStatus = 'received' | 'processing' | 'shipped' | 'delivered'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Pedido recebido',
  processing: 'Em separação',
  shipped: 'A caminho',
  delivered: 'Entregue',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  received: '#facc15',
  processing: '#fb923c',
  shipped: '#60a5fa',
  delivered: '#4ade80',
}

export interface IoTReading {
  temperature: number
  humidity: number
  timestamp: string
}

export interface CartItem {
  id: string
  name: string
  price: string
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  placedAt: string
  status: OrderStatus
  statusLabel: string
}
