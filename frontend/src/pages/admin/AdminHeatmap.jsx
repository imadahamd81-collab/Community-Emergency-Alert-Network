import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmergencies } from '@/redux/slices/emergencySlice'
import Card from '@/components/common/Card'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { GoogleMapView } from '@/components/maps/GoogleMapView'

const AdminHeatmap = () => {
  const dispatch = useDispatch()
  const { emergencies, loading, error } = useSelector((state) => state.emergency)

  useEffect(() => {
    dispatch(fetchEmergencies())
  }, [dispatch])

  if (loading && emergencies.length === 0) return <LoadingSpinner size="lg" />
  if (error && emergencies.length === 0) return <ErrorState message={error} onRetry={() => dispatch(fetchEmergencies())} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Emergency Heatmap</h1>
        <p className="text-gray-600 mt-1">Historical high-risk areas visualization</p>
      </div>

      <Card>
        {emergencies.length === 0 ? (
          <EmptyState title="No data" description="No emergency data available for heatmap." />
        ) : (
          <GoogleMapView
            emergencies={emergencies}
            height={600}
            showControls={false}
            showGetDirections={false}
          />
        )}
      </Card>
    </div>
  )
}

export default AdminHeatmap
