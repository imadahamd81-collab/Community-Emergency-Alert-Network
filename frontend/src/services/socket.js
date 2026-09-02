import { io } from 'socket.io-client'
import { toast } from 'sonner'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket = null

export const initSocket = (getToken, onUnauthorized) => {
  if (socket?.connected) {
    return socket
  }

  const token = getToken?.()

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: false,
  })

  socket.on('connect', () => {
    console.log('Socket connected')
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message)
  })

  socket.on('emergency:created', (data) => {
    toast.info(`New emergency: ${data.type || 'Unknown'}`, {
      description: data.location || 'Location unknown',
    })
  })

  socket.on('emergency:verified', () => {
    toast.success('Emergency verified by admin')
  })

  socket.on('emergency:assigned', () => {
    toast.info('You have been assigned to an emergency')
  })

  socket.on('emergency:accepted', () => {
    toast.success('Responder accepted the emergency')
  })

  socket.on('emergency:statusUpdated', (data) => {
    toast.info(`Emergency status: ${data.status}`)
  })

  socket.on('emergency:resolved', () => {
    toast.success('Emergency has been resolved')
  })

  socket.on('notification:new', (data) => {
    toast.info(data.title || 'New notification')
  })

  socket.on('message:new', (data) => {
    toast.info(`New message from ${data.senderName || 'Unknown'}`)
  })

  socket.on('unauthorized', () => {
    onUnauthorized?.()
    toast.error('Session expired')
  })

  return socket
}

export const connectSocket = (getToken, onUnauthorized) => {
  if (!socket) {
    initSocket(getToken, onUnauthorized)
  }
  return socket.connect()
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

export const onSocket = (event, callback) => {
  const s = socket
  if (!s) return () => {}
  s.on(event, callback)
  return () => s.off(event, callback)
}

export const emitSocket = (event, data) => {
  if (socket?.connected) {
    socket.emit(event, data)
  }
}
