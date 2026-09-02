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
import { AlertTriangle, MapPin, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatTimeAgo } from '@/utils/helpers'
import { PRIORITY_COLORS } from '@/utils/constants'

const OrganizationNearby = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { emergencies, loading, error } = useSelector((state) => state.emergency)

  useEffect(() => {
    dispatch(fetchEmergencies())
  }, [dispatch])

  const activeEmergencies = emergencies.filter((e) => !['Resolved', 'Closed', 'Rejected'].includes(e.status))

  if (loading && emergencies.length === 0) return <LoadingSpinner size="lg" />
  if (error && emergencies.length === 0) return <ErrorState message={error} onRetry={() => dispatch(fetchEmergencies())} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nearby Emergencies</h1>
        <p className="text-gray-600 mt-1">Emergencies relevant to your organization</p>
      </div>

      {activeEmergencies.length === 0 ? (
        <Card>
          <EmptyState title="No nearby emergencies" description="No active emergencies in your area." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeEmergencies.map((emergency) => (
            <Card key={emergency._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-5 w-5 ${PRIORITY_COLORS[emergency.priority]?.text || 'text-gray-600'}`} />
                  <h3 className="font-semibold text-gray-900">{emergency.type}</h3>
                </div>
                <PriorityBadge priority={emergency.priority} size="sm" />
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{emergency.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{emergency.location?.address || 'Unknown'}</span>
                <span>{formatTimeAgo(emergency.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={emergency.status} size="sm" />
                <Button size="sm" variant="outline" onClick={() => navigate(`/organization/emergency/${emergency._id}`)}>
                  <Eye className="h-4 w-4 mr-1" />View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrganizationNearby
