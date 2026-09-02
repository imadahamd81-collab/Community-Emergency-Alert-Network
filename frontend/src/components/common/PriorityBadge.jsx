import { EMERGENCY_PRIORITIES, PRIORITY_COLORS } from '@/utils/constants'

const PriorityBadge = ({ priority, size = 'md' }) => {
  const label = EMERGENCY_PRIORITIES[priority] || priority || 'Medium'
  const config = PRIORITY_COLORS[label] || PRIORITY_COLORS[EMERGENCY_PRIORITIES.MEDIUM]

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      <span className={`w-2 h-2 rounded-full mr-1.5 ${config.dot}`} />
      {label}
    </span>
  )
}

export default PriorityBadge
