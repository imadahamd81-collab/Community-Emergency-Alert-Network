import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmergencies } from '@/redux/slices/emergencySlice'
import { fetchNotifications } from '@/redux/slices/notificationSlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import PriorityBadge from '@/components/common/PriorityBadge'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { AlertTriangle, MapPin, FileText, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatTimeAgo } from '@/utils/helpers'
import { PRIORITY_COLORS } from '@/utils/constants'

const OrganizationDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { emergencies, loading, error } = useSelector((state) => state.emergency)
  const { unreadCount } = useSelector((state) => state.notification)

  useEffect(() => {
    dispatch(fetchEmergencies())
    dispatch(fetchNotifications())
  }, [dispatch])

  const activeEmergencies = emergencies.filter((e) => !['Resolved', 'Closed', 'Rejected'].includes(e.status))
  const resolvedEmergencies = emergencies.filter((e) => e.status === 'Resolved')

  const stats = [
    { title: 'Active Incidents', value: activeEmergencies.length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Nearby Emergencies', value: activeEmergencies.length, icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Resolved', value: resolvedEmergencies.length, icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Notifications', value: unreadCount, icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]

  if (loading && emergencies.length === 0) return <LoadingSpinner size="lg" />
  if (error && emergencies.length === 0) return <ErrorState message={error} onRetry={() => dispatch(fetchEmergencies())} />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Recent Incidents" subtitle="Latest emergency incidents">
        {emergencies.length === 0 ? (
          <EmptyState title="No incidents" description="No incidents reported yet." />
        ) : (
          <div className="space-y-3">
            {emergencies.slice(0, 5).map((emergency) => (
              <div
                key={emergency._id}
                onClick={() => navigate(`/organization/emergency/${emergency._id}`)}
                className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className={`p-2 rounded-lg ${PRIORITY_COLORS[emergency.priority]?.bg || 'bg-gray-100'}`}>
                  <AlertTriangle className={`h-5 w-5 ${PRIORITY_COLORS[emergency.priority]?.text || 'text-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{emergency.type}</h4>
                    <PriorityBadge priority={emergency.priority} size="sm" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{emergency.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatTimeAgo(emergency.createdAt)}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{emergency.location?.address || 'Unknown'}</span>
                  </div>
                </div>
                <StatusBadge status={emergency.status} size="sm" />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default OrganizationDashboard
