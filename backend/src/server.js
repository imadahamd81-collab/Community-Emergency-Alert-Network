import app from './app.js'
import connectDB from './config/db.js'
import { createServer } from 'http'
import { initSocket } from './config/socket.js'

const PORT = process.env.PORT || 5000

let initialized = false

const start = async () => {
  await connectDB()
  if (initialized) return
  initialized = true

  const server = createServer(app)
  const io = initSocket(server)

  app.set('io', io)
  global.io = io

  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
  })
}

if (process.env.VERCEL !== '1') {
  start().catch((error) => {
    console.error('Failed to start server:', error)
    process.exit(1)
  })
}

export default app