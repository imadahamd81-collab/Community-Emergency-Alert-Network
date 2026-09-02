import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import connectDB from './config/db.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'
import { apiLimiter, authLimiter } from './middleware/rateLimitMiddleware.js'

import authRoutes from './routes/authRoutes.js'
import emergencyRoutes from './routes/emergencyRoutes.js'
import responderRoutes from './routes/responderRoutes.js'
import organizationRoutes from './routes/organizationRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(helmet({
  crossOriginResourcePolicy: false,
}))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(compression())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/emergencies', apiLimiter, emergencyRoutes)
app.use('/api/responders', apiLimiter, responderRoutes)
app.use('/api/organizations', apiLimiter, organizationRoutes)
app.use('/api/notifications', apiLimiter, notificationRoutes)
app.use('/api/messages', apiLimiter, messageRoutes)
app.use('/api/analytics', apiLimiter, analyticsRoutes)
app.use('/api/users', apiLimiter, userRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Community Emergency Alert Network API is running',
  })
})

app.get('/uploads/profiles/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', 'profiles', req.params.filename)
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath)
  } else {
    res.status(404).json({ success: false, message: 'File not found' })
  }
})

app.use(errorMiddleware)

export default app
