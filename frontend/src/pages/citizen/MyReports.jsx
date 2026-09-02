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
import { AlertTriangle, Eye, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatTimeAgo } from '@/utils/helpers'
import { PRIORITY_COLORS } from '@/utils/constants'

const MyReports = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { emergencies, loading, error } = useSelector((state) => state.emergency)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchEmergencies())
  }, [dispatch])

  const myEmergencies = emergencies.filter((e) => {
    const reportedBy = e.reportedBy
    if (!reportedBy) return false
    if (typeof reportedBy === 'object') {
      return reportedBy._id === user?._id
    }
    return reportedBy === user?._id
  })

  if (loading && emergencies.length === 0) return <LoadingSpinner size="lg" />
  if (error && emergencies.length === 0) return <ErrorState message={error} onRetry={() => dispatch(fetchEmergencies())} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
        <p className="text-gray-600 mt-1">Track all your emergency reports</p>
      </div>

      {myEmergencies.length === 0 ? (
        <Card>
          <EmptyState title="No reports" description="You haven't reported any emergencies yet." />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reported</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myEmergencies.map((emergency) => (
                  <tr key={emergency._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 ${PRIORITY_COLORS[emergency.priority]?.text || 'text-gray-600'}`} />
                        <span className="font-medium">{emergency.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">{emergency.description}</td>
                    <td className="py-3 px-4"><PriorityBadge priority={emergency.priority} size="sm" /></td>
                    <td className="py-3 px-4"><StatusBadge status={emergency.status} size="sm" /></td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user?.phone || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatTimeAgo(emergency.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/citizen/emergency/${emergency._id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default MyReports
