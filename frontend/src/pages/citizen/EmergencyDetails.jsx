import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmergencyById } from '@/redux/slices/emergencySlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import PriorityBadge from '@/components/common/PriorityBadge'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { AlertTriangle, MapPin, Clock, User, ArrowLeft, Loader2 } from 'lucide-react'
import { formatDate, getEmergencyTypeLabel } from '@/utils/helpers'
import { PRIORITY_COLORS, STATUS_STEPS } from '@/utils/constants'

const EmergencyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentEmergency, loading, error } = useSelector((state) => state.emergency)

  useEffect(() => {
    dispatch(fetchEmergencyById(id))
  }, [dispatch, id])

  if (loading) return <LoadingSpinner size="lg" />
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchEmergencyById(id))} />
  if (!currentEmergency) return <EmptyState title="Emergency not found" description="The emergency you're looking for does not exist." />

  const emergency = currentEmergency
  const statusIndex = STATUS_STEPS.findIndex((s) => s.key === emergency.status)
  const timelineSteps = STATUS_STEPS.slice(0, Math.max(statusIndex + 1, 1))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getEmergencyTypeLabel(emergency.type)}</h1>
          <p className="text-gray-600">Emergency #{emergency._id?.slice(-6)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Emergency Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Type</p>
                <p className="text-gray-900 mt-1">{getEmergencyTypeLabel(emergency.type)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Priority</p>
                <div className="mt-1"><PriorityBadge priority={emergency.priority} /></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <div className="mt-1"><StatusBadge status={emergency.status} /></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">People Affected</p>
                <p className="text-gray-900 mt-1">{emergency.peopleAffected}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-gray-600">Description</p>
                <p className="text-gray-900 mt-1">{emergency.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-gray-900 mt-1 flex items-center gap-1"><MapPin className="h-4 w-4" />{emergency.location?.address || `${emergency.location?.latitude}, ${emergency.location?.longitude}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Reported Time</p>
                <p className="text-gray-900 mt-1 flex items-center gap-1"><Clock className="h-4 w-4" />{formatDate(emergency.createdAt)}</p>
              </div>
              {emergency.reporter && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Reporter</p>
                  <p className="text-gray-900 mt-1 flex items-center gap-1"><User className="h-4 w-4" />{emergency.reporter.name}</p>
                </div>
              )}
              {emergency.assignedResponders && emergency.assignedResponders.length > 0 && (
                <div>
                  <p className="text-gray-500 text-sm">Assigned Responders</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {emergency.assignedResponders.map((r) => (
                      <span key={r._id} className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <User className="h-3 w-3" />{r.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {emergency.photos && emergency.photos.length > 0 && (
            <Card title="Photos">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {emergency.photos.map((photo, idx) => (
                  <img key={idx} src={photo} alt="" className="w-full h-40 object-cover rounded-lg" />
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Timeline">
            <div className="space-y-4">
              {timelineSteps.map((step, idx) => (
                <div key={step.key} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= statusIndex ? 'bg-navy-800 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${idx <= statusIndex ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {emergency.aiAnalysis && (
            <Card title="AI Analysis" subtitle="Computer-assisted suggestion">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800"><strong>Detected:</strong> {emergency.aiAnalysis.category}</p>
                <p className="text-sm text-blue-800 mt-1"><strong>Potential Severity:</strong> {emergency.aiAnalysis.severity}</p>
                <p className="text-sm text-blue-800 mt-1"><strong>Confidence:</strong> {emergency.aiAnalysis.confidence}%</p>
                <p className="text-xs text-blue-600 mt-2 italic">This is only a suggestion, not a final determination.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmergencyDetails
