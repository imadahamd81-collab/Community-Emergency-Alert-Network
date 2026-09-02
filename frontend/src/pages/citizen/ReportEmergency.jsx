import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createEmergency } from '@/redux/slices/emergencySlice'
import { useSocket } from '@/hooks/useSocket'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Camera, MapPin, X, Upload, Film, CheckCircle, AlertCircle, ExternalLink, Loader2, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { EMERGENCY_TYPES } from '@/utils/constants'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  type: z.string().min(1, 'Emergency type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  peopleAffected: z.coerce.number().min(1, 'At least 1 person must be affected'),
  phone: z.string().min(10, 'Valid phone number is required').regex(/^[+]?[\d\s-()]+$/, 'Invalid phone number format'),
})

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mpeg', 'video/quicktime']

const ReportEmergency = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { subscribe } = useSocket()
  const { loading } = useSelector((state) => state.emergency)
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const [locationState, setLocationState] = useState({
    detected: false,
    loading: false,
    error: null,
    latitude: null,
    longitude: null,
    address: null,
    accuracy: null,
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: '',
      description: '',
      peopleAffected: 1,
      phone: '',
    },
  })

  const typeOptions = Object.entries(EMERGENCY_TYPES).map(([key, value]) => ({ value: key, label: value }))

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`Invalid file type: ${file.name}. Only images and videos are allowed.`)
      return false
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File too large: ${file.name}. Maximum size is 10MB.`)
      return false
    }
    return true
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).filter(validateFile)
    setFiles((prev) => [...prev, ...selected])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const dropped = Array.from(e.dataTransfer.files).filter(validateFile)
    setFiles((prev) => [...prev, ...dropped])
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        { headers: { Accept: 'application/json' } }
      )
      const data = await response.json()
      if (data && data.display_name) {
        const addressParts = data.display_name.split(', ')
        const shortAddress = addressParts.slice(0, 3).join(', ')
        return shortAddress
      }
      return null
    } catch {
      return null
    }
  }

  const handleDetectLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationState({
        detected: false,
        loading: false,
        error: 'Your browser does not support location detection.',
        latitude: null,
        longitude: null,
        address: null,
        accuracy: null,
      })
      return
    }

    setLocationState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const accuracy = position.coords.accuracy

        const address = await reverseGeocode(lat, lng)

        setLocationState({
          detected: true,
          loading: false,
          error: null,
          latitude: lat,
          longitude: lng,
          address,
          accuracy,
        })
      },
      (err) => {
        let errorMessage
        switch (err.code) {
          case 1:
            errorMessage = 'Location permission was denied. Please allow location access in your browser and try again.'
            break
          case 2:
            errorMessage = 'Unable to detect your current location. Please try again.'
            break
          case 3:
            errorMessage = 'Location detection timed out. Please try again.'
            break
          default:
            errorMessage = 'Unable to detect your current location. Please try again.'
        }
        setLocationState({
          detected: false,
          loading: false,
          error: errorMessage,
          latitude: null,
          longitude: null,
          address: null,
          accuracy: null,
        })
      },
      { enableHighAccuracy: true, timeout: 60000, maximumAge: 30000 }
    )
  }, [])

  useEffect(() => {
    handleDetectLocation()
  }, [handleDetectLocation])

  const onSubmit = (data) => {
    if (!locationState.detected || !locationState.latitude || !locationState.longitude) {
      toast.error('Please detect your location first by clicking "Use My Current Location".')
      return
    }

    const formData = new FormData()
    formData.append('type', data.type)
    formData.append('description', data.description)
    formData.append('peopleAffected', data.peopleAffected)
    formData.append('phone', data.phone)
    formData.append('latitude', locationState.latitude)
    formData.append('longitude', locationState.longitude)
    formData.append('address', locationState.address || '')
    files.forEach((file) => formData.append('photos', file))

    dispatch(createEmergency(formData))
      .unwrap()
      .then((res) => {
        toast.success('Emergency reported successfully!')
        navigate(`/citizen/emergency/${res.data?._id || res._id}`)
      })
      .catch((err) => {
        toast.error(err || 'Failed to report emergency')
      })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report Emergency</h1>
        <p className="text-gray-600 mt-1">Provide details about the emergency situation</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Emergency Details" subtitle="Describe the emergency situation">
          <div className="space-y-5">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  label="Emergency Type"
                  options={typeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.type?.message}
                  placeholder="Select emergency type"
                />
              )}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Describe the emergency in detail..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>
            <Input
              label="People Affected"
              type="number"
              min="1"
              {...register('peopleAffected')}
              error={errors.peopleAffected?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...register('phone')}
                  type="tel"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="+1 234 567 8900"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              <p className="mt-1 text-xs text-gray-500">Your contact number for this emergency</p>
            </div>
          </div>
        </Card>

        <Card title="Location" subtitle="Your exact location is automatically detected">
          <div className="space-y-4">
            {locationState.loading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <LoadingSpinner size="sm" />
                <span>Detecting your exact location...</span>
              </div>
            )}

            {locationState.loading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <LoadingSpinner size="sm" />
                <span>Detecting location...</span>
              </div>
            )}

            {locationState.detected && !locationState.loading && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>✓ Location detected</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    🔄 Refresh
                  </button>
                </div>

                {locationState.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>📍 Current Location: {locationState.address}</span>
                  </div>
                )}

                <div className="text-xs text-gray-400">
                  Accuracy: ±{Math.round(locationState.accuracy || 0)} meters
                </div>

                {locationState.latitude && locationState.longitude && (
                  <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50" style={{ height: '250px' }}>
                    <iframe
                      title="Location preview"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${locationState.longitude - 0.01}%2C${locationState.latitude - 0.01}%2C${locationState.longitude + 0.01}%2C${locationState.latitude + 0.01}&layer=mapnik&marker=${locationState.latitude}%2C${locationState.longitude}`}
                    />
                  </div>
                )}
              </div>
            )}

            {locationState.error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{locationState.error}</span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Photos / Video" subtitle="Upload media evidence (optional, max 10MB each)">
          <div className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-navy-500 bg-navy-50' : 'border-gray-300 hover:border-navy-400'}`}
            >
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-3">Drag and drop files here, or click to browse</p>
              <p className="text-xs text-gray-500 mb-3">Accepts: JPG, PNG, GIF, WEBP, MP4, MPEG, MOV</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Button type="button" variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
                <Upload className="h-4 w-4 mr-2" />Upload Files
              </Button>
            </div>
            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {files.map((file, idx) => (
                  <div key={idx} className="relative group">
                    {file.type.startsWith('video/') ? (
                      <div className="w-full h-24 rounded-lg bg-gray-900 flex items-center justify-center">
                        <Film className="h-8 w-8 text-white" />
                      </div>
                    ) : (
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-24 object-cover rounded-lg" />
                    )}
                    <button type="button" onClick={() => removeFile(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={loading || !locationState.detected}>
            {loading ? 'Submitting...' : 'Submit Emergency'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReportEmergency