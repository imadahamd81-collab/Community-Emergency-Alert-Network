import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { connectSocket, disconnectSocket, getSocket, onSocket } from '@/services/socket'

export const useSocket = () => {
  const socketRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const socket = connectSocket()
    socketRef.current = socket

    return () => {
      disconnectSocket()
    }
  }, [dispatch])

  const subscribe = (event, callback) => {
    if (socketRef.current) {
      return onSocket(event, callback)
    }
  }

  return { socket: socketRef.current, subscribe }
}
