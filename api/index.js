import app from '../src/app.js'
import connectDB from '../src/config/db.js'

let dbConnected = false

const ensureDB = async () => {
  if (!dbConnected) {
    await connectDB()
    dbConnected = true
  }
}

export default async function handler(req, res) {
  await ensureDB()
  return app(req, res)
}