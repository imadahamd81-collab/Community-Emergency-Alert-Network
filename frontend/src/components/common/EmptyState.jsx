import { FileX } from 'lucide-react'

const EmptyState = ({ title = 'No data found', description = 'There are no items to display at this time.', icon: Icon = FileX }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Icon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md">{description}</p>
    </div>
  )
}

export default EmptyState
