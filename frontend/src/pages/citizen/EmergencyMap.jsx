import { useState, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchEmergencies } from '@/redux/slices/emergencySlice'
import { useSocket } from '@/hooks/useSocket'
import Card from '@/components/common/Card'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { AlertTriangle, Navigation } from 'lucide-react'
import { GoogleMapView } from '@/components/maps/GoogleMapView'

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Accidents', value: 'ACCIDENT' },
  { label: 'Fire', value: 'FIRE' },
  { label: 'Medical', value: 'MEDICAL' },
  { label: 'Road Block', value: 'ROAD_BLOCKAGE' },
  { label: 'Flood', value: 'FLOOD' },
  { label: 'Gas Leak', value: 'GAS_LEAK' },
  { label: 'Missing Person', value: 'MISSING_PERSON' },
  { label: 'Other', value: 'OTHER' },
]

const EmergencyMap = () => {
  const dispatch = useDispatch()
  const emergenciesState = useSelector((state) => state.emergency)
  const emergencies = useMemo(() => {
    try {
      if (Array.isArray(emergenciesState?.data?.emergencies)) return emergenciesState.data.emergencies
      if (Array.isArray(emergenciesState?.emergencies)) return emergenciesState.emergencies
      if (Array.isArray(emergenciesState?.data)) return emergenciesState.data
      return []
    } catch {
      return []
    }
  }, [emergenciesState])
  const loading = emergenciesState?.loading ?? false
  const error = emergenciesState?.error ?? null
  const { subscribe } = useSocket()

  const [typeFilter, setTypeFilter] = useState('')
  const [nearbyOnly, setNearbyOnly] = useState(false)

  useEffect(() => {
    dispatch(fetchEmergencies())
  }, [dispatch])

  useEffect(() => {
    if (!subscribe) return
    const events = [
      'emergency:created',
      'emergency:verified',
      'emergency:resolved',
      'emergency:statusUpdated',
      'emergency:assigned',
      'emergency:accepted',
    ]
    const unsubscribers = []
    try {
      events.forEach((ev) => {
        const result = subscribe(ev, () => {
          try {
            dispatch(fetchEmergencies())
          } catch {
            // ignore
          }
        })
        if (typeof result === 'function') {
          unsubscribers.push(result)
        }
      })
    } catch (err) {
      console.error('Socket subscription error:', err)
    }
    return () => {
      unsubscribers.forEach((unsub) => {
        try {
          if (typeof unsub === 'function') unsub()
        } catch {
          // ignore cleanup errors
        }
      })
    }
  }, [subscribe, dispatch])

  const visibleEmergenciesCount = useMemo(() => {
    try {
      let list = emergencies
      if (typeFilter) {
        list = list.filter((e) => e && e.type === typeFilter)
      }
      return list.length
    } catch {
      return emergencies.length
    }
  }, [emergencies, typeFilter])

  if (loading && emergencies.length === 0 && !error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Map</h1>
          <p className="text-gray-600 mt-1">Live emergencies near you</p>
        </div>
        <div className="flex items-center justify-center" style={{ height: '600px' }}>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error && emergencies.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Map</h1>
          <p className="text-gray-600 mt-1">Live emergencies near you</p>
        </div>
        <ErrorState title="Map unavailable" description={error} onRetry={() => dispatch(fetchEmergencies())} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Map</h1>
          <p className="text-gray-600 mt-1">Live emergencies near you</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Could not load emergencies: {error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setTypeFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              typeFilter === f.value
                ? 'bg-navy-600 text-white border-navy-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setNearbyOnly((v) => !v)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
            nearbyOnly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Navigation className="h-3.5 w-3.5" />
          Nearby only (5 km)
        </button>
      </div>

      {!loading && !error && emergencies.length > 0 && visibleEmergenciesCount === 0 && (
        <EmptyState title="No emergencies" description="There are no emergencies matching the current filters." />
      )}

      <Card className="p-0 overflow-hidden relative">
        <GoogleMapView
          emergencies={emergencies}
          typeFilter={typeFilter}
          nearbyOnly={nearbyOnly}
          height={600}
        />
      </Card>
    </div>
  )
}

export default EmergencyMap
