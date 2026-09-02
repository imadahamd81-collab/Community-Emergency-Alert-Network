import mongoose from 'mongoose'
import app from '../backend/src/app.js'
import connectDB from '../backend/src/config/db.js'

let dbConnected = false

const ensureDB = async () => {
  if (mongoose.connection.readyState >= 1) return
  if (dbConnected) return
  await connectDB()
  dbConnected = true
}

export default async function handler(req, res) {
  try {
    await ensureDB()
    return app(req, res)
  } catch (error) {
    console.error('API handler error:', error)
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    })
  }
}