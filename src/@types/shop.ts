export type StockLevel = 'high' | 'low' | 'out'

export type OrderStatus =
  | 'received'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'delayed'
  | 'failed'
  | 'cancelled'
  | 'refund_requested'
  | 'refund_processing'
  | 'refunded'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Pedido recebido',
  processing: 'Em separação',
  shipped: 'A caminho',
  delivered: 'Entregue',
  delayed: 'Pedido atrasado',
  failed: 'Problema na entrega',
  cancelled: 'Cancelado',
  refund_requested: 'Reembolso solicitado',
  refund_processing: 'Reembolso em processamento',
  refunded: 'Reembolso concluído',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  received: '#facc15',
  processing: '#fb923c',
  shipped: '#60a5fa',
  delivered: '#4ade80',
  delayed: '#f97316',
  failed: '#f87171',
  cancelled: '#94a3b8',
  refund_requested: '#c084fc',
  refund_processing: '#a855f7',
  refunded: '#7c3aed',
}

export const ORDER_STATUS_TOOLTIPS: Record<OrderStatus, string> = {
  received: 'Seu pedido foi recebido e está aguardando confirmação do estoque.',
  processing: 'Estamos separando os itens do seu pedido para envio.',
  shipped: 'Seu pedido saiu para entrega e está a caminho.',
  delivered: 'Pedido entregue com sucesso. Aproveite!',
  delayed: 'Seu pedido está demorando mais do que o esperado. Estamos verificando.',
  failed: 'Ocorreu um problema durante a entrega. Você pode solicitar reembolso.',
  cancelled: 'Pedido cancelado. Se já foi cobrado, solicite o reembolso.',
  refund_requested: 'Reembolso solicitado. Aguardando aprovação.',
  refund_processing: 'Seu reembolso está sendo processado.',
  refunded: 'Reembolso concluído. O valor será estornado em até 5 dias úteis.',
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
  placedAtISO: string
  status: OrderStatus
  statusLabel: string
}
