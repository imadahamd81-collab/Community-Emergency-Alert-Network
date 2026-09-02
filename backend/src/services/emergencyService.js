import Emergency from '../models/Emergency.js'
import { calculateSuggestedPriority } from '../utils/priority.js'
import { createNotification, notifyNearbyUsers } from './notificationService.js'

export const createEmergency = async (data, userId) => {
  const emergency = await Emergency.create({
    ...data,
    reportedBy: userId,
  })

  const io = global.io || null
  await notifyNearbyUsers(emergency, io)

  if (io) {
    io.emit('emergency:created', {
      _id: emergency._id,
      type: emergency.type,
      description: emergency.description,
      location: emergency.location,
      priority: emergency.priority,
      status: emergency.status,
      createdAt: emergency.createdAt,
    })
  }

  return emergency
}

export const getEmergencies = async (filters = {}) => {
  const { page = 1, limit = 10, type, priority, status, latitude, longitude, radius, search } = filters
  const query = {}

  if (type) query.type = type
  if (priority) query.priority = priority
  if (status) query.status = status
  if (search) {
    query.$or = [
      { description: { $regex: search, $options: 'i' } },
      { 'location.address': { $regex: search, $options: 'i' } },
    ]
  }

  if (latitude && longitude && radius) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: parseInt(radius),
      },
    }
  }

  const emergencies = await Emergency.find(query)
    .populate('reportedBy', 'name email phone')
    .populate('assignedResponders', 'name email phone')
    .populate('verifiedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const countQuery = { ...query }
  if (countQuery.location?.$near) {
    delete countQuery.location.$near
    countQuery.location = {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(longitude), parseFloat(latitude)],
          parseInt(radius) / 6378100,
        ],
      },
    }
  }

  const total = await Emergency.countDocuments(countQuery)

  return { emergencies, total, page, limit, pages: Math.ceil(total / limit) }
}

export const getEmergencyById = async (id) => {
  return await Emergency.findById(id)
    .populate('reportedBy', 'name email phone')
    .populate('assignedResponders', 'name email phone')
    .populate('assignedOrganization')
    .populate('verifiedBy', 'name')
    .populate('updates.updatedBy', 'name')
}

export const updateEmergency = async (id, updates) => {
  return await Emergency.findByIdAndUpdate(id, updates, { new: true })
}

export const verifyEmergency = async (id, adminId) => {
  return await Emergency.findByIdAndUpdate(
    id,
    {
      status: 'VERIFIED',
      verifiedBy: adminId,
      verifiedAt: new Date(),
    },
    { new: true }
  )
}

export const rejectEmergency = async (id) => {
  return await Emergency.findByIdAndUpdate(id, { status: 'REJECTED' }, { new: true })
}

export const assignEmergency = async (id, responderIds, organizationId = null) => {
  const emergency = await Emergency.findById(id)
  if (!emergency) throw new Error('Emergency not found')
  
  const idsToAdd = Array.isArray(responderIds) ? responderIds : [responderIds]
  
  for (const responderId of idsToAdd) {
    if (!emergency.assignedResponders.includes(responderId)) {
      emergency.assignedResponders.push(responderId)
    }
  }
  
  emergency.assignedOrganization = organizationId
  emergency.status = 'ASSIGNED'
  
  return await emergency.save()
}

export const acceptEmergency = async (id) => {
  return await Emergency.findByIdAndUpdate(id, { status: 'ACCEPTED' }, { new: true })
}

export const updateEmergencyStatus = async (id, status, updatedBy, note = '') => {
  const emergency = await Emergency.findById(id)
  emergency.status = status
  emergency.updates.push({ status, note, updatedBy })
  if (status === 'RESOLVED') {
    emergency.resolvedAt = new Date()
  }
  return await emergency.save()
}

export const resolveEmergency = async (id) => {
  return await Emergency.findByIdAndUpdate(
    id,
    {
      status: 'RESOLVED',
      resolvedAt: new Date(),
    },
    { new: true }
  )
}
