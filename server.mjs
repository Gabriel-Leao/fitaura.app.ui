import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: '*' },
})

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)

  socket.on('place_order', (order) => {
    console.log('Pedido recebido:', order.id)

    const statuses = [
      { status: 'received', label: 'Pedido recebido', delay: 500 },
      { status: 'processing', label: 'Em separação', delay: 3000 },
      { status: 'shipped', label: 'A caminho', delay: 6000 },
      { status: 'delivered', label: 'Entregue', delay: 10000 },
    ]

    statuses.forEach(({ status, label, delay }) => {
      setTimeout(() => {
        socket.emit('order_status', { orderId: order.id, status, label })
      }, delay)
    })
  })

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})

const PORT = 3001
httpServer.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando em http://localhost:${PORT}`)
})
