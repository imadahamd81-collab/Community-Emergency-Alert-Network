import Notification from '../models/Notification.js'

const EMERGENCY_TYPE_LABELS = {
  ACCIDENT: 'Accident',
  FIRE: 'Fire',
  MEDICAL: 'Medical Emergency',
  ROAD_BLOCKAGE: 'Road Blockage',
  FLOOD: 'Flood',
  GAS_LEAK: 'Gas Leak',
  MISSING_PERSON: 'Missing Person',
  OTHER: 'Other',
}

const getTypeLabel = (type) => EMERGENCY_TYPE_LABELS[type] || type || 'Emergency'

export const createNotification = async (recipient, title, message, type, relatedEmergency = null, io = null) => {
  const notification = await Notification.create({
    recipient,
    title,
    message,
    type,
    relatedEmergency,
  })

  if (io) {
    io.to(`user:${recipient}`).emit('notification:new', notification)
  }

  return notification
}

export const notifyNearbyUsers = async (emergency, io) => {
  const typeLabel = getTypeLabel(emergency.type)
  await createNotification(
    emergency.reportedBy,
    `${typeLabel} Emergency Reported`,
    `Your ${typeLabel.toLowerCase()} emergency has been reported successfully.`,
    'EMERGENCY_CREATED',
    emergency._id,
    io
  )
}

export const notifyAssignment = async (emergency, responderId, io) => {
  const typeLabel = getTypeLabel(emergency.type)
  await createNotification(
    responderId,
    `${typeLabel} Emergency Assigned`,
    `You have been assigned to a ${typeLabel.toLowerCase()} emergency.`,
    'EMERGENCY_ASSIGNED',
    emergency._id,
    io
  )
}
