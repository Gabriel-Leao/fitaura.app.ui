import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: '*' },
})

const ORDER_STATUS_LABELS = {
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

const emit = (socket, orderId, status, delay) => {
  setTimeout(() => {
    socket.emit('order_status', {
      orderId,
      status,
      label: ORDER_STATUS_LABELS[status],
    })
    console.log(`[${orderId}] → ${status}`)
  }, delay)
}

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)

  socket.on('place_order', (order) => {
    console.log('Pedido recebido:', order.id)
    emit(socket, order.id, 'received', 500)
    emit(socket, order.id, 'processing', 3000)
    emit(socket, order.id, 'shipped', 6000)
    emit(socket, order.id, 'delivered', 10000)
  })

  socket.on('request_refund', (order) => {
    console.log('Reembolso solicitado:', order.id)
    emit(socket, order.id, 'refund_requested', 300)
    emit(socket, order.id, 'refund_processing', 3000)
    emit(socket, order.id, 'refunded', 8000)
  })

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})

const PORT = 3001
httpServer.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando em http://localhost:${PORT}`)
})
