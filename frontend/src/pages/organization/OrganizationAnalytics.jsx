import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmergencies } from '@/redux/slices/emergencySlice'
import Card from '@/components/common/Card'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#102a43', '#486581', '#d9e2ec', '#f97316', '#dc2626']

const OrganizationAnalytics = () => {
  const dispatch = useDispatch()
  const { emergencies, loading, error } = useSelector((state) => state.emergency)

  useEffect(() => {
    dispatch(fetchEmergencies())
  }, [dispatch])

  const typeData = [
    { name: 'Accident', value: emergencies.filter((e) => e.type === 'ACCIDENT').length },
    { name: 'Fire', value: emergencies.filter((e) => e.type === 'FIRE').length },
    { name: 'Medical', value: emergencies.filter((e) => e.type === 'MEDICAL').length },
    { name: 'Road Block', value: emergencies.filter((e) => e.type === 'ROAD_BLOCKAGE').length },
    { name: 'Flood', value: emergencies.filter((e) => e.type === 'FLOOD').length },
    { name: 'Gas Leak', value: emergencies.filter((e) => e.type === 'GAS_LEAK').length },
    { name: 'Other', value: emergencies.filter((e) => ['MISSING_PERSON', 'OTHER'].includes(e.type)).length },
  ]

  const statusData = [
    { name: 'Active', value: emergencies.filter((e) => !['RESOLVED', 'CANCELLED', 'REJECTED'].includes(e.status)).length },
    { name: 'Resolved', value: emergencies.filter((e) => e.status === 'RESOLVED').length },
    { name: 'Rejected', value: emergencies.filter((e) => e.status === 'REJECTED').length },
  ]

  if (loading && emergencies.length === 0) return <LoadingSpinner size="lg" />
  if (error && emergencies.length === 0) return <ErrorState message={error} onRetry={() => dispatch(fetchEmergencies())} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Incident statistics and insights</p>
      </div>

      {emergencies.length === 0 ? (
        <Card>
          <EmptyState title="No data" description="No emergency data available for analytics." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Incidents by Type">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#102a43" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Incidents by Status">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default OrganizationAnalytics
