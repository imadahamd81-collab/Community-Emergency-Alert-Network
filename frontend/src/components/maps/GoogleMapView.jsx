import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useGeolocation } from '@/hooks/useGeolocation'
import { getDistanceFromLatLonInKm, formatTimeAgo } from '@/utils/helpers'
import { Crosshair, Search, Satellite, Map as MapIcon, Route, Compass, Loader2 } from 'lucide-react'

const DEFAULT_CENTER = [34.0151, 71.5249]
const DEFAULT_ZOOM = 13

const TYPE_COLORS = {
  ACCIDENT: '#ef4444',
  FIRE: '#f97316',
  MEDICAL: '#3b82f6',
  ROAD_BLOCKAGE: '#eab308',
  FLOOD: '#06b6d4',
  GAS_LEAK: '#a855f7',
  MISSING_PERSON: '#ec4899',
  OTHER: '#6b7280',
}

const TYPE_LABELS = {
  ACCIDENT: 'Accident',
  FIRE: 'Fire',
  MEDICAL: 'Medical',
  ROAD_BLOCKAGE: 'Road Block',
  FLOOD: 'Flood',
  GAS_LEAK: 'Gas Leak',
  MISSING_PERSON: 'Missing Person',
  OTHER: 'Other',
}

const TYPE_EMOJIS = {
  ACCIDENT: '🚗',
  FIRE: '🔥',
  MEDICAL: '🏥',
  ROAD_BLOCKAGE: '🚧',
  FLOOD: '🌊',
  GAS_LEAK: '⚠️',
  MISSING_PERSON: '🔍',
  OTHER: '📌',
}

const getCoords = (e) => {
  if (!e || !e.location) return null
  const loc = e.location
  let lat, lng
  if (Array.isArray(loc.coordinates) && loc.coordinates.length >= 2) {
    lng = Number(loc.coordinates[0])
    lat = Number(loc.coordinates[1])
  } else if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
    lat = loc.latitude
    lng = loc.longitude
  } else if (typeof loc.lat === 'number' && typeof loc.lng === 'number') {
    lat = loc.lat
    lng = loc.lng
  } else {
    return null
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null
  return { lat, lng }
}

const formatDistance = (km) => {
  if (km == null || !Number.isFinite(km)) return null
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="transform: rotate(45deg); font-size: 16px;">${emoji}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })
}

const createUserIcon = () => {
  return L.divIcon({
    className: 'user-marker-icon',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: #2563eb;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 0 0 2px #2563eb, 0 2px 8px rgba(37, 99, 235, 0.5);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

const MapController = ({ center, zoom, onMapReady }) => {
  const map = useMap()
  
  useEffect(() => {
    if (onMapReady) {
      onMapReady(map)
    }
  }, [map, onMapReady])

  useEffect(() => {
    if (center) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])

  return null
}

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: () => {
      if (onClick) onClick()
    },
  })
  return null
}

export const GoogleMapView = ({
  emergencies = [],
  typeFilter = '',
  nearbyOnly = false,
  showControls = true,
  height = 600,
}) => {
  const [satellite, setSatellite] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [searchError, setSearchError] = useState(null)

  const { location, accuracy, loading: geoLoading, getLocation, errorMessage } = useGeolocation()
  const mapRef = useRef(null)

  const safeEmergencies = useMemo(() => {
    try {
      return Array.isArray(emergencies) ? emergencies : []
    } catch {
      return []
    }
  }, [emergencies])

  const visibleEmergencies = useMemo(() => {
    try {
      let list = safeEmergencies
      if (typeFilter) {
        list = list.filter((e) => e && e.type === typeFilter)
      }
      if (nearbyOnly && location) {
        list = list.filter((e) => {
          const c = getCoords(e)
          if (!c) return false
          try {
            const dist = getDistanceFromLatLonInKm(location.latitude, location.longitude, c.lat, c.lng)
            return dist <= 5
          } catch {
            return false
          }
        })
      }
      return list
    } catch {
      return safeEmergencies
    }
  }, [safeEmergencies, typeFilter, nearbyOnly, location])

  const center = useMemo(() => {
    if (location) {
      return [location.latitude, location.longitude]
    }
    return DEFAULT_CENTER
  }, [location])

  const zoom = useMemo(() => {
    return location ? 14 : DEFAULT_ZOOM
  }, [location])

  const handleMapReady = useCallback((map) => {
    mapRef.current = map
  }, [])

  const handleLocate = useCallback(() => {
    getLocation(true)
  }, [getLocation])

  const handleRecenter = useCallback(() => {
    if (mapRef.current && location) {
      mapRef.current.setView([location.latitude, location.longitude], 16)
    }
  }, [location])

  const toggleSatellite = useCallback(() => {
    setSatellite((prev) => !prev)
  }, [])

  const handleMarkerClick = useCallback((emergency) => {
    setSelectedEmergency((prev) => (prev && prev._id === emergency._id ? null : emergency))
  }, [])

  const handleClosePopup = useCallback(() => {
    setSelectedEmergency(null)
  }, [])

  const handleMapClick = useCallback(() => {
    setSelectedEmergency(null)
  }, [])

  const handleSearch = useCallback(async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearchLoading(true)
    setSearchError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        const result = data[0]
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 15)
        }
      } else {
        setSearchError('Location not found')
      }
    } catch {
      setSearchError('Search failed. Please try again.')
    } finally {
      setSearchLoading(false)
    }
  }, [searchQuery])

  const getDirectionsUrl = useCallback((emergency) => {
    const coords = getCoords(emergency)
    if (!coords) return '#'
    if (location) {
      return `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${coords.lat},${coords.lng}&travelmode=driving`
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&travelmode=driving`
  }, [location])

  const wrapperStyle = useMemo(() => {
    if (height && height > 0) {
      return { height: `${height}px` }
    }
    return {}
  }, [height])

  return (
    <div className="google-map-responsive relative" style={wrapperStyle}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <MapController center={center} zoom={zoom} onMapReady={handleMapReady} />
        <MapClickHandler onClick={handleMapClick} />
        
        {satellite ? (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
          />
        )}

        {location && (
          <>
            <Circle
              center={[location.latitude, location.longitude]}
              radius={accuracy || 50}
              pathOptions={{
                fillColor: '#3b82f6',
                fillOpacity: 0.15,
                color: '#2563eb',
                weight: 1,
              }}
            />
            <Marker
              position={[location.latitude, location.longitude]}
              icon={createUserIcon()}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold text-blue-600">You are here</p>
                  <p className="text-xs text-gray-500">
                    {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {visibleEmergencies.map((emergency) => {
          const coords = getCoords(emergency)
          if (!coords) return null

          const color = TYPE_COLORS[emergency.type] || TYPE_COLORS.OTHER
          const emoji = TYPE_EMOJIS[emergency.type] || TYPE_EMOJIS.OTHER

          return (
            <Marker
              key={emergency._id}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(color, emoji)}
              eventHandlers={{
                click: () => handleMarkerClick(emergency),
              }}
            >
              <Popup maxWidth={300}>
                <div className="font-sans" style={{ minWidth: 240 }}>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">
                    {TYPE_LABELS[emergency.type] || emergency.type || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {emergency.description || 'No description'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      emergency.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      emergency.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      emergency.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {emergency.priority || 'N/A'}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {emergency.status || 'N/A'}
                    </span>
                  </div>
                  {location && coords && (
                    <p className="text-xs text-gray-500">
                      Distance: {formatDistance(getDistanceFromLatLonInKm(
                        location.latitude, location.longitude, coords.lat, coords.lng
                      ))}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Reported {formatTimeAgo(emergency.createdAt)}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    Location: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <a
                      href={`/citizen/emergency/${emergency._id}`}
                      className="inline-block text-sm font-medium text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-600 rounded"
                    >
                      View Details
                    </a>
                    <a
                      href={getDirectionsUrl(emergency)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {showControls && (
        <>
          <form
            onSubmit={handleSearch}
            className="absolute top-3 left-3 z-[1000] flex items-center gap-2 bg-white rounded-lg shadow-md px-2 py-1.5 w-64 max-w-[80%]"
          >
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search this area"
              className="flex-1 text-sm outline-none bg-transparent min-w-0"
            />
            <button
              type="submit"
              className="text-navy-600 text-sm font-medium shrink-0"
              disabled={searchLoading}
            >
              {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Go'}
            </button>
          </form>

          <div className="absolute bottom-6 right-3 z-[1000] flex flex-col gap-2">
            <button
              type="button"
              onClick={handleLocate}
              disabled={geoLoading}
              className="bg-white rounded-lg shadow-md p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              title="Locate Me"
            >
              {geoLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Crosshair className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleRecenter}
              disabled={!location}
              className="bg-white rounded-lg shadow-md p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              title="Recenter"
            >
              <Compass className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={toggleSatellite}
              className="bg-white rounded-lg shadow-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              {satellite ? <MapIcon className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
              {satellite ? 'Street' : 'Satellite'}
            </button>
          </div>

          <div className="absolute bottom-6 left-3 z-[1000] bg-white rounded-lg shadow-md p-2">
            <h4 className="text-xs font-semibold text-gray-700 mb-1 px-1">Legend</h4>
            <div className="flex flex-col gap-1">
              {Object.entries(TYPE_COLORS).map(([key, color]) => (
                <div key={key} className="flex items-center gap-1.5 px-1">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-600">{TYPE_LABELS[key] || key}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 px-1">
                <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shrink-0" />
                <span className="text-xs text-gray-600">Your Location</span>
              </div>
            </div>
          </div>

          {(errorMessage || (location && geoLoading)) && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-[1000] bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2 text-sm max-w-md">
              {errorMessage || 'Getting your location...'}
            </div>
          )}

          {searchError && (
            <div className="absolute top-16 left-3 z-[1000] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
              {searchError}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GoogleMapView
