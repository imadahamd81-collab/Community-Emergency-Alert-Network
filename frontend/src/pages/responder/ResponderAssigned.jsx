import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmergencies } from '@/redux/slices/emergencySlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import PriorityBadge from '@/components/common/PriorityBadge'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { AlertTriangle, MapPin, Eye, Navigation } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatTimeAgo } from '@/utils/helpers'
import { PRIORITY_COLORS } from '@/utils/constants'

const ResponderAssigned = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { emergencies, loading, error } = useSelector((state) => state.emergency)

  const { user } = useSelector((state) => state.auth)
  const userId = user?._id

  useEffect(() => {
    dispatch(fetchEmergencies())
  }, [dispatch])

  const assignedEmergencies = emergencies.filter((e) =>
    e.assignedResponders && e.assignedResponders.some((r) => r._id === userId)
  )

  if (loading && emergencies.length === 0) return <LoadingSpinner size="lg" />
  if (error && emergencies.length === 0) return <ErrorState message={error} onRetry={() => dispatch(fetchEmergencies())} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assigned Emergencies</h1>
        <p className="text-gray-600 mt-1">Emergencies assigned to you</p>
      </div>

      {assignedEmergencies.length === 0 ? (
        <Card>
          <EmptyState title="No assignments" description="You have no emergencies assigned to you." />
        </Card>
      ) : (
        <div className="space-y-4">
          {assignedEmergencies.map((emergency) => (
            <Card key={emergency._id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${PRIORITY_COLORS[emergency.priority]?.bg || 'bg-gray-100'}`}>
                    <AlertTriangle className={`h-6 w-6 ${PRIORITY_COLORS[emergency.priority]?.text || 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{emergency.type}</h3>
                      <PriorityBadge priority={emergency.priority} size="sm" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{emergency.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{emergency.location?.address || 'Unknown'}</span>
                      <span>{formatTimeAgo(emergency.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={emergency.status} size="sm" />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(`https://www.google.com/maps?q=${emergency.location?.latitude},${emergency.location?.longitude}`, '_blank')}>
                      <Navigation className="h-4 w-4 mr-1" />Navigate
                    </Button>
                    <Button size="sm" onClick={() => navigate(`/responder/emergency/${emergency._id}`)}>
                      <Eye className="h-4 w-4 mr-1" />View
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResponderAssigned
