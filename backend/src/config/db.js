import mongoose from 'mongoose'

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    console.log(`MongoDB connected successfully: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`)
    throw error
  }
}

export default connectDB