import app from './app.js'
import connectDB from './config/db.js'
import { initSocket } from './config/socket.js'
import { createServer } from 'http'

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  const server = createServer(app)
  const io = initSocket(server)

  app.set('io', io)
  global.io = io

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other process using it or change PORT in .env.`)
    } else {
      console.error('Server error:', error)
    }
    process.exit(1)
  })

  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  })
}).catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
