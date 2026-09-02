import { useState, useEffect, useRef } from 'react'

export const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [error, setError] = useState(null)
  const [errorType, setErrorType] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const watchIdRef = useRef(null)

  const getFriendlyError = (err) => {
    switch (err.code) {
      case 1:
        return 'Location permission is required to show your current location. Please allow location access in your browser.'
      case 2:
        return 'Unable to determine your current location.'
      case 3:
        return 'Location request timed out. Please try again.'
      default:
        return err.message || 'Unable to retrieve your location.'
    }
  }

  const getLocation = (watch = false) => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser')
      setErrorType('UNSUPPORTED')
      setErrorMessage('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError(null)
    setErrorType(null)
    setErrorMessage(null)

    const onSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
      setAccuracy(position.coords.accuracy)
      setLoading(false)
    }

    const onError = (err) => {
      setError(err.message)
      setErrorType(
        err.code === 1 ? 'PERMISSION_DENIED' : err.code === 2 ? 'POSITION_UNAVAILABLE' : err.code === 3 ? 'TIMEOUT' : 'UNKNOWN'
      )
      setErrorMessage(getFriendlyError(err))
      setLoading(false)
    }

    const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }

    if (watch) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
      watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, options)
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
    }
  }

  const stopWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }

  useEffect(() => {
    getLocation(false)
    return () => stopWatch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { location, accuracy, error, errorType, errorMessage, loading, getLocation, stopWatch }
}
