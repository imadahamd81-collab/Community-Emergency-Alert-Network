import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmergencies } from '@/redux/slices/emergencySlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import PriorityBadge from '@/components/common/PriorityBadge'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { AlertTriangle, MapPin, Eye, Navigation, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatTimeAgo, getDistanceFromLatLonInKm } from '@/utils/helpers'
import { PRIORITY_COLORS, EMERGENCY_TYPES } from '@/utils/constants'
import { useGeolocation } from '@/hooks/useGeolocation'

const DEFAULT_RADIUS_KM = 5

const getTypeLabel = (type) => {
  const entry = Object.entries(EMERGENCY_TYPES).find(([key, value]) => key === type || value === type)
  return entry ? entry[1] : type
}

const NearbyEmergencies = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { emergencies, loading, error } = useSelector((state) => state.emergency)
  const { location, loading: geoLoading, errorMessage: geoError, getLocation } = useGeolocation()
  const [radius, setRadius] = useState(DEFAULT_RADIUS_KM)
  const [locationDenied, setLocationDenied] = useState(false)

  useEffect(() => {
    if (location) {
      dispatch(fetchEmergencies({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: radius * 1000,
      }))
    }
  }, [dispatch, location, radius])

  useEffect(() => {
    if (geoError && geoError.includes('permission')) {
      setLocationDenied(true)
    }
  }, [geoError])

  const getEmergencyCoords = (emergency) => {
    if (!emergency?.location) return null
    const loc = emergency.location
    if (Array.isArray(loc.coordinates) && loc.coordinates.length >= 2) {
      return { lat: Number(loc.coordinates[1]), lng: Number(loc.coordinates[0]) }
    }
    if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
      return { lat: loc.latitude, lng: loc.longitude }
    }
    if (typeof loc.lat === 'number' && typeof loc.lng === 'number') {
      return { lat: loc.lat, lng: loc.lng }
    }
    return null
  }

  const emergenciesWithDistance = useMemo(() => {
    if (!location) return emergencies.map(e => ({ ...e, distance: null }))
    return emergencies.map((e) => {
      const coords = getEmergencyCoords(e)
      if (!coords) return { ...e, distance: null }
      const dist = getDistanceFromLatLonInKm(location.latitude, location.longitude, coords.lat, coords.lng)
      return { ...e, distance: dist }
    }).filter((e) => e.distance === null || e.distance <= radius)
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
  }, [emergencies, location, radius])

  const handleRetryLocation = () => {
    setLocationDenied(false)
    getLocation(true)
  }

  const handleViewOnMap = (emergency) => {
    const coords = getEmergencyCoords(emergency)
    if (coords) {
      navigate(`/citizen/map?lat=${coords.lat}&lng=${coords.lng}&id=${emergency._id}`)
    } else {
      navigate('/citizen/map')
    }
  }

  const formatDistance = (km) => {
    if (km == null) return 'Unknown distance'
    if (km < 1) return `${Math.round(km * 1000)} m away`
    return `${km.toFixed(1)} km away`
  }

  if (locationDenied) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nearby Emergencies</h1>
          <p className="text-gray-600 mt-1">Real-time emergency incidents in your area</p>
        </div>
        <Card>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Location Access Required</h3>
            <p className="text-gray-600 mb-4">Please allow location access to see emergencies near you.</p>
            <Button onClick={handleRetryLocation}>
              <Navigation className="h-4 w-4 mr-2" />Grant Location Access
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (loading && emergencies.length === 0) return <LoadingSpinner size="lg" />
  if (error && emergencies.length === 0) return <ErrorState message={error} onRetry={() => location && dispatch(fetchEmergencies({ latitude: location.latitude, longitude: location.longitude, radius: radius * 1000 }))} />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nearby Emergencies</h1>
          <p className="text-gray-600 mt-1">Real-time emergency incidents in your area</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Radius:</label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              <option value={1}>1 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
            </select>
          </div>
          <Button variant="secondary" size="sm" onClick={() => location && dispatch(fetchEmergencies({ latitude: location.latitude, longitude: location.longitude, radius: radius * 1000 }))}>
            <RefreshCw className="h-4 w-4 mr-1" />Refresh
          </Button>
        </div>
      </div>

      {!location && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          <span>Detecting your location... Emergencies will be shown near you once location is available.</span>
        </div>
      )}

      {emergenciesWithDistance.length === 0 ? (
        <Card>
          <EmptyState title="No nearby emergencies" description={`There are no active emergencies within ${radius} km of your location. Stay safe!`} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergenciesWithDistance.map((emergency) => (
            <Card key={emergency._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-5 w-5 ${PRIORITY_COLORS[emergency.priority]?.text || 'text-gray-600'}`} />
                  <h3 className="font-semibold text-gray-900">{getTypeLabel(emergency.type)}</h3>
                </div>
                <PriorityBadge priority={emergency.priority} size="sm" />
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{emergency.description}</p>
              {emergency.media && emergency.media.length > 0 && (
                <div className="mb-3">
                  <img
                    src={emergency.media[0].url}
                    alt="Emergency"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{emergency.location?.address || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Navigation className="h-3 w-3" />{formatDistance(emergency.distance)}</span>
                <span>{formatTimeAgo(emergency.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={emergency.status} size="sm" />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewOnMap(emergency)}>
                    <MapPin className="h-4 w-4 mr-1" />Map
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/citizen/emergency/${emergency._id}`)}>
                    <Eye className="h-4 w-4 mr-1" />View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default NearbyEmergencies
