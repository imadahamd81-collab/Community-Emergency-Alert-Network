import mongoose from 'mongoose'
import app from '../backend/src/app.js'
import connectDB from '../backend/src/config/db.js'

let dbConnected = false
let dbConnecting = null

const ensureDB = async () => {
  if (mongoose.connection.readyState >= 1) return
  if (dbConnected) return
  if (dbConnecting) return dbConnecting

  dbConnecting = (async () => {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set. Add it in Vercel Project Settings → Environment Variables.')
      }
      await connectDB()
      dbConnected = true
    } catch (err) {
      dbConnecting = null
      throw err
    }
  })()

  return dbConnecting
}

export default async function handler(req, res) {
  try {
    await ensureDB()
    return app(req, res)
  } catch (error) {
    console.error('API handler error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server initialization failed',
      error: error.message,
    })
  }
}