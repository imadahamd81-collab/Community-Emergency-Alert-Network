import { EMERGENCY_TYPES, EMERGENCY_PRIORITIES, EMERGENCY_STATUS } from './constants'

export const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export const formatTimeAgo = (date) => {
  if (!date) return 'N/A'
  const now = new Date()
  const then = new Date(date)
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const deg2rad = (deg) => deg * (Math.PI / 180)

export const getEmergencyTypeLabel = (type) => {
  return EMERGENCY_TYPES[type] || type || 'Unknown'
}

export const getEmergencyPriorityColor = (priority) => {
  return EMERGENCY_PRIORITIES[priority] || EMERGENCY_PRIORITIES.MEDIUM
}

export const getStatusIndex = (status) => {
  const idx = EMERGENCY_STATUS[status]
  return idx !== undefined ? idx : -1
}

export const truncate = (str, len = 100) => {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

export const sanitizeHtml = (str) => {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
