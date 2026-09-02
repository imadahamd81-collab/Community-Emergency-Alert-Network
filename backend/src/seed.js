import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Responder from './models/Responder.js'
import Organization from './models/Organization.js'
import Emergency from './models/Emergency.js'

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')

    await User.deleteMany({})
    await Responder.deleteMany({})
    await Organization.deleteMany({})
    await Emergency.deleteMany({})

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@cean.com',
      password: 'admin123',
      phone: '+1234567890',
      role: 'ADMIN',
    })

    const citizen = await User.create({
      name: 'John Citizen',
      email: 'citizen@cean.com',
      password: 'citizen123',
      phone: '+1234567891',
      role: 'CITIZEN',
    })

    const org = await Organization.create({
      name: 'City Fire Department',
      type: 'FIRE_STATION',
      description: 'Main fire station',
      phone: '+1234567892',
      email: 'fire@cean.com',
      address: '123 Fire St',
      location: { type: 'Point', coordinates: [-74.006, 40.7128] },
      owner: admin._id,
    })

    const responder = await User.create({
      name: 'Jane Responder',
      email: 'responder@cean.com',
      password: 'responder123',
      phone: '+1234567893',
      role: 'RESPONDER',
    })

    await Responder.create({
      user: responder._id,
      organization: org._id,
      specialization: 'Fire Fighting',
      currentLocation: { type: 'Point', coordinates: [-74.006, 40.7128] },
      availabilityStatus: 'AVAILABLE',
      isOnline: true,
    })

    await Emergency.create({
      type: 'FIRE',
      description: 'Building fire reported',
      location: { type: 'Point', coordinates: [-74.006, 40.7128], address: '123 Main St' },
      priority: 'HIGH',
      status: 'PENDING_VERIFICATION',
      reportedBy: citizen._id,
      peopleAffected: 2,
    })

    console.log('Seed data created successfully')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seedData()
