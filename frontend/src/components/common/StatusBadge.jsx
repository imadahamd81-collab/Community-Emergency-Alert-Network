import { STATUS_STEPS } from '@/utils/constants'

const STATUS_LABELS = {
  PENDING_VERIFICATION: 'Pending',
  VERIFIED: 'Verified',
  ASSIGNED: 'Responder Assigned',
  ACCEPTED: 'Accepted',
  ON_THE_WAY: 'On The Way',
  ARRIVED: 'Arrived',
  HANDLING: 'Handling',
  RESOLVED: 'Resolved',
  CANCELLED: 'Closed',
  REJECTED: 'Rejected',
}

const StatusBadge = ({ status, size = 'md' }) => {
  const label = STATUS_LABELS[status] || status

  const statusColors = {
    PENDING_VERIFICATION: 'bg-gray-100 text-gray-700',
    VERIFIED: 'bg-blue-100 text-blue-700',
    ASSIGNED: 'bg-purple-100 text-purple-700',
    ACCEPTED: 'bg-indigo-100 text-indigo-700',
    ON_THE_WAY: 'bg-yellow-100 text-yellow-700',
    ARRIVED: 'bg-orange-100 text-orange-700',
    HANDLING: 'bg-pink-100 text-pink-700',
    RESOLVED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-gray-100 text-gray-500',
    REJECTED: 'bg-red-100 text-red-700',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-700'

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClasses[size]}`}>
      {label}
    </span>
  )
}

export default StatusBadge
