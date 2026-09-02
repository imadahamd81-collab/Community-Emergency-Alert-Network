import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.user = decoded
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user?.id}`)

    socket.join(`user:${socket.user.id}`)

    socket.on('joinEmergency', (emergencyId) => {
      socket.join(`emergency:${emergencyId}`)
    })

    socket.on('leaveEmergency', (emergencyId) => {
      socket.leave(`emergency:${emergencyId}`)
    })

    socket.on('message:send', (data) => {
      socket.to(`emergency:${data.emergencyId}`).emit('message:new', data)
    })

    socket.on('typing:start', (data) => {
      socket.to(`emergency:${data.emergencyId}`).emit('typing:start', data)
    })

    socket.on('typing:stop', (data) => {
      socket.to(`emergency:${data.emergencyId}`).emit('typing:stop', data)
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.id}`)
    })
  })

  return io
}
