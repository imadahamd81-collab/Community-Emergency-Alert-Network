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
import { AlertTriangle, ShieldAlert, UserCheck, Users, FileText, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatTimeAgo } from '@/utils/helpers'
import { PRIORITY_COLORS } from '@/utils/constants'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { emergencies, loading, error } = useSelector((state) => state.emergency)
  const { unreadCount } = useSelector((state) => state.notification)

  useEffect(() => {
    dispatch(fetchEmergencies())
    dispatch(fetchNotifications())
  }, [dispatch])

  const activeEmergencies = emergencies.filter((e) => !['RESOLVED', 'CANCELLED', 'REJECTED'].includes(e.status))
  const resolvedEmergencies = emergencies.filter((e) => e.status === 'RESOLVED')
  const pendingVerification = emergencies.filter((e) => e.status === 'PENDING_VERIFICATION')
  const falseReports = emergencies.filter((e) => e.status === 'REJECTED')

  const stats = [
    { title: 'Total Emergencies', value: emergencies.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Active Emergencies', value: activeEmergencies.length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Pending Verification', value: pendingVerification.length, icon: ShieldAlert, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Resolved', value: resolvedEmergencies.length, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'False Reports', value: falseReports.length, icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-50' },
    { title: 'Notifications', value: unreadCount, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  if (loading && emergencies.length === 0) return <LoadingSpinner size="lg" />
  if (error && emergencies.length === 0) return <ErrorState message={error} onRetry={() => dispatch(fetchEmergencies())} />

  const chartData = [
    { name: 'Accident', value: emergencies.filter((e) => e.type === 'ACCIDENT').length },
    { name: 'Fire', value: emergencies.filter((e) => e.type === 'FIRE').length },
    { name: 'Medical', value: emergencies.filter((e) => e.type === 'MEDICAL').length },
    { name: 'Road Block', value: emergencies.filter((e) => e.type === 'ROAD_BLOCKAGE').length },
    { name: 'Flood', value: emergencies.filter((e) => e.type === 'FLOOD').length },
    { name: 'Gas Leak', value: emergencies.filter((e) => e.type === 'GAS_LEAK').length },
    { name: 'Other', value: emergencies.filter((e) => ['MISSING_PERSON', 'OTHER'].includes(e.type)).length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Emergency management control room</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Emergencies by Type" subtitle="Distribution of emergency types">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#102a43" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Emergencies" subtitle="Latest reported emergencies" actions={<Button onClick={() => navigate('/admin/verification')} size="sm">View All</Button>}>
          {emergencies.length === 0 ? (
            <EmptyState title="No emergencies" description="No emergencies reported yet." />
          ) : (
            <div className="space-y-3">
              {emergencies.slice(0, 5).map((emergency) => (
                <div key={emergency._id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                  <div className={`p-2 rounded-lg ${PRIORITY_COLORS[emergency.priority]?.bg || 'bg-gray-100'}`}>
                    <AlertTriangle className={`h-4 w-4 ${PRIORITY_COLORS[emergency.priority]?.text || 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{emergency.type}</h4>
                    <p className="text-sm text-gray-600">{emergency.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(emergency.createdAt)}</p>
                  </div>
                  <PriorityBadge priority={emergency.priority} size="sm" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
