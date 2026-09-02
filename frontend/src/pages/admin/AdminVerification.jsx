import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmergencies, verifyEmergency, assignEmergency, updateEmergencyStatus, resolveEmergency } from '@/redux/slices/emergencySlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import PriorityBadge from '@/components/common/PriorityBadge'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { AlertTriangle, CheckCircle, XCircle, UserCheck, CheckCheck } from 'lucide-react'
import { toast } from 'sonner'
import { PRIORITY_COLORS } from '@/utils/constants'
import { authApi } from '@/services/authApi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const BACKEND_URL = API_BASE_URL.replace('/api', '')

const AdminVerification = () => {
  const dispatch = useDispatch()
  const { emergencies, loading, error } = useSelector((state) => state.emergency)
  const [dialog, setDialog] = useState({ open: false, type: null, id: null })
  const [responders, setResponders] = useState([])
  const [selectedResponders, setSelectedResponders] = useState([])
  const [loadingResponders, setLoadingResponders] = useState(false)

  useEffect(() => {
    dispatch(fetchEmergencies())
    loadResponders()
  }, [dispatch])

  const loadResponders = async () => {
    setLoadingResponders(true)
    try {
      const response = await authApi.getResponders()
      const responderList = response.data?.data || []
      setResponders(Array.isArray(responderList) ? responderList : [])
    } catch (err) {
      console.error('Failed to load responders:', err)
      setResponders([])
    } finally {
      setLoadingResponders(false)
    }
  }

  const allEmergencies = emergencies

  const handleVerify = (id) => {
    setDialog({ open: true, type: 'verify', id })
  }

  const handleReject = (id) => {
    setDialog({ open: true, type: 'reject', id })
  }

  const handleAssign = (id) => {
    setSelectedResponders([])
    setDialog({ open: true, type: 'assign', id })
  }

  const handleResolve = (id) => {
    setDialog({ open: true, type: 'resolve', id })
  }

  const toggleResponder = (responderId) => {
    setSelectedResponders((prev) =>
      prev.includes(responderId)
        ? prev.filter((id) => id !== responderId)
        : [...prev, responderId]
    )
  }

  const confirmAction = () => {
    const { type, id } = dialog
    if (type === 'verify') {
      dispatch(verifyEmergency(id))
        .unwrap()
        .then(() => toast.success('Emergency verified'))
        .catch((err) => toast.error(err || 'Failed'))
    } else if (type === 'reject') {
      dispatch(updateEmergencyStatus({ id, status: 'REJECTED' }))
        .unwrap()
        .then(() => toast.success('Emergency rejected'))
        .catch((err) => toast.error(err || 'Failed'))
    } else if (type === 'assign') {
      if (selectedResponders.length === 0) {
        toast.error('Please select at least one responder')
        return
      }
      dispatch(assignEmergency({ id, responderIds: selectedResponders }))
        .unwrap()
        .then(() => toast.success(`${selectedResponders.length} responder(s) assigned`))
        .catch((err) => toast.error(err || 'Failed to assign responder'))
    } else if (type === 'resolve') {
      dispatch(resolveEmergency(id))
        .unwrap()
        .then(() => toast.success('Emergency resolved'))
        .catch((err) => toast.error(err || 'Failed to resolve'))
    }
    setDialog({ open: false, type: null, id: null })
  }

  if (loading && emergencies.length === 0) return <LoadingSpinner size="lg" />
  if (error && emergencies.length === 0) return <ErrorState message={error} onRetry={() => dispatch(fetchEmergencies())} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verification</h1>
        <p className="text-gray-600 mt-1">Verify, reject, assign, or resolve emergencies</p>
      </div>

      {emergencies.length === 0 ? (
        <Card>
          <EmptyState title="No emergencies" description="No emergencies to verify yet." />
        </Card>
      ) : (
         <Card>
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="border-b border-gray-200">
                   <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                   <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Description</th>
                   <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reported By</th>
                   <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Contact</th>
                   <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Media</th>
                   <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Priority</th>
                   <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                   <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Assigned</th>
                   <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                 </tr>
               </thead>
              <tbody>
                {allEmergencies.map((emergency) => (
                  <tr key={emergency._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 ${PRIORITY_COLORS[emergency.priority]?.text || 'text-gray-600'}`} />
                        <span className="font-medium">{emergency.type}</span>
                      </div>
                    </td>
                     <td className="py-3 px-4 text-sm text-gray-600">{emergency.description}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{emergency.reportedBy?.name || 'Unknown'}</span>
                    </td>
                     <td className="py-3 px-4 text-sm text-gray-600">
                       <div>{emergency.reportedBy?.email || '-'}</div>
                       <div className="text-xs text-gray-400">{emergency.reportedBy?.phone || '-'}</div>
                     </td>
                     <td className="py-3 px-4">
                       {emergency.media && emergency.media.length > 0 ? (
                         <div className="flex gap-1">
                           {emergency.media.slice(0, 2).map((media, idx) => (
                             <img
                               key={idx}
                               src={`${BACKEND_URL}${media.url}`}
                               alt="Emergency"
                               className="w-12 h-12 object-cover rounded cursor-pointer"
                               onClick={() => window.open(`${BACKEND_URL}${media.url}`, '_blank')}
                             />
                           ))}
                           {emergency.media.length > 2 && (
                             <span className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                               +{emergency.media.length - 2}
                             </span>
                           )}
                         </div>
                       ) : (
                         <span className="text-xs text-gray-400">No media</span>
                       )}
                     </td>
                     <td className="py-3 px-4"><PriorityBadge priority={emergency.priority} size="sm" /></td>
                    <td className="py-3 px-4"><StatusBadge status={emergency.status} size="sm" /></td>
                    <td className="py-3 px-4">
                      {emergency.assignedResponders && emergency.assignedResponders.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {emergency.assignedResponders.map((r) => (
                            <span key={r._id} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {r.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {emergency.status === 'PENDING_VERIFICATION' && (
                          <>
                            <Button size="sm" variant="success" onClick={() => handleVerify(emergency._id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />Verify
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleReject(emergency._id)}>
                              <XCircle className="h-4 w-4 mr-1" />Reject
                            </Button>
                          </>
                        )}
                        {emergency.status !== 'RESOLVED' && emergency.status !== 'REJECTED' && emergency.status !== 'CANCELLED' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleAssign(emergency._id)}>
                              <UserCheck className="h-4 w-4 mr-1" />Assign
                            </Button>
                            <Button size="sm" variant="primary" onClick={() => handleResolve(emergency._id)}>
                              <CheckCheck className="h-4 w-4 mr-1" />Resolve
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                 ))}
                </tbody>
             </table>
           </div>
         </Card>
       )}

      <ConfirmDialog
        isOpen={dialog.open}
        title={
          dialog.type === 'verify' ? 'Verify Emergency' :
          dialog.type === 'reject' ? 'Reject Emergency' :
          dialog.type === 'resolve' ? 'Resolve Emergency' :
          'Assign Responders'
        }
        message={
          dialog.type === 'verify' ? 'Are you sure you want to verify this emergency?' :
          dialog.type === 'reject' ? 'Are you sure you want to reject this as a false report?' :
          dialog.type === 'resolve' ? 'Are you sure you want to mark this emergency as resolved?' :
          null
        }
        onConfirm={confirmAction}
        onCancel={() => setDialog({ open: false, type: null, id: null })}
        confirmText={
          dialog.type === 'verify' ? 'Verify' :
          dialog.type === 'reject' ? 'Reject' :
          dialog.type === 'resolve' ? 'Resolve' :
          'Assign'
        }
        variant={dialog.type === 'reject' ? 'danger' : 'warning'}
      >
        {dialog.type === 'assign' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Responders (multiple)
            </label>
            {loadingResponders ? (
              <p className="text-sm text-gray-500">Loading responders...</p>
            ) : responders.length === 0 ? (
              <p className="text-sm text-amber-600">No responders found. Please add responders first.</p>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                {responders.map((responder) => (
                  <label
                    key={responder._id}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      selectedResponders.includes(responder._id)
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedResponders.includes(responder._id)}
                      onChange={() => toggleResponder(responder._id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{responder.name}</span>
                    {responder.email && (
                      <span className="text-xs text-gray-400">({responder.email})</span>
                    )}
                  </label>
                ))}
              </div>
            )}
            {selectedResponders.length > 0 && (
              <p className="text-xs text-blue-600 mt-2">
                {selectedResponders.length} responder(s) selected
              </p>
            )}
          </div>
        )}
      </ConfirmDialog>
    </div>
  )
}

export default AdminVerification
