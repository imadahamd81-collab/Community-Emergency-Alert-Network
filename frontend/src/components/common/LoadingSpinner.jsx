import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <Loader2 className={`animate-spin text-navy-600 ${sizeClasses[size]} ${className}`} />
  )
}

export default LoadingSpinner
