export const ROLES = {
  CITIZEN: 'CITIZEN',
  RESPONDER: 'RESPONDER',
  ADMIN: 'ADMIN',
  ORGANIZATION: 'ORGANIZATION',
}

export const EMERGENCY_TYPES = {
  ACCIDENT: 'Accident',
  FIRE: 'Fire',
  MEDICAL: 'Medical Emergency',
  ROAD_BLOCKAGE: 'Road Blockage',
  FLOOD: 'Flood',
  GAS_LEAK: 'Gas Leak',
  MISSING_PERSON: 'Missing Person',
  OTHER: 'Other',
}

export const EMERGENCY_PRIORITIES = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

export const EMERGENCY_STATUS = {
  REPORTED: 'Reported',
  VERIFIED: 'Verified',
  ASSIGNED: 'Responder Assigned',
  ACCEPTED: 'Accepted',
  ON_THE_WAY: 'On The Way',
  ARRIVED: 'Arrived',
  HANDLING: 'Handling',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
}

export const PRIORITY_COLORS = {
  [EMERGENCY_PRIORITIES.CRITICAL]: { bg: 'bg-critical-light', text: 'text-critical', border: 'border-critical', dot: 'bg-critical' },
  [EMERGENCY_PRIORITIES.HIGH]: { bg: 'bg-high-light', text: 'text-high', border: 'border-high', dot: 'bg-high' },
  [EMERGENCY_PRIORITIES.MEDIUM]: { bg: 'bg-medium-light', text: 'text-medium', border: 'border-medium', dot: 'bg-medium' },
  [EMERGENCY_PRIORITIES.LOW]: { bg: 'bg-low-light', text: 'text-low', border: 'border-low', dot: 'bg-low' },
}

export const TYPE_ICONS = {
  [EMERGENCY_TYPES.ACCIDENT]: 'Car',
  [EMERGENCY_TYPES.FIRE]: 'Flame',
  [EMERGENCY_TYPES.MEDICAL]: 'HeartPulse',
  [EMERGENCY_TYPES.ROAD_BLOCKAGE]: 'Construction',
  [EMERGENCY_TYPES.FLOOD]: 'Waves',
  [EMERGENCY_TYPES.GAS_LEAK]: 'AlertTriangle',
  [EMERGENCY_TYPES.MISSING_PERSON]: 'UserSearch',
  [EMERGENCY_TYPES.OTHER]: 'AlertCircle',
}

export const STATUS_STEPS = [
  { key: 'Reported', label: 'Reported', icon: 'FileText' },
  { key: 'Verified', label: 'Verified', icon: 'CheckCircle' },
  { key: 'Responder Assigned', label: 'Responder Assigned', icon: 'UserCheck' },
  { key: 'Accepted', label: 'Accepted', icon: 'ThumbsUp' },
  { key: 'On The Way', label: 'On The Way', icon: 'Navigation' },
  { key: 'Arrived', label: 'Arrived', icon: 'MapPin' },
  { key: 'Handling', label: 'Handling', icon: 'Settings' },
  { key: 'Resolved', label: 'Resolved', icon: 'Check' },
]
