import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/redux/slices/notificationSlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { Bell, CheckCheck, MapPin, AlertTriangle } from 'lucide-react'
import { formatTimeAgo } from '@/utils/helpers'
import { toast } from 'sonner'

const CitizenNotifications = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notifications, loading, error } = useSelector((state) => state.notification)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead())
      .unwrap()
      .then(() => toast.success('All notifications marked as read'))
      .catch((err) => toast.error(err || 'Failed'))
  }

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id))
    }
    if (notification.relatedEmergency?._id) {
      navigate(`/citizen/emergency/${notification.relatedEmergency._id}`)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchNotifications())} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with emergency alerts</p>
        </div>
        <Button variant="secondary" onClick={handleMarkAllRead} disabled={notifications.every((n) => n.isRead)}>
          <CheckCheck className="h-4 w-4 mr-2" />Mark all as read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <EmptyState title="No notifications" description="You're all caught up!" icon={Bell} />
        </Card>
      ) : (
        <Card>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${notification.isRead ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {notification.relatedEmergency && (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      )}
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    {notification.relatedEmergency && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span className="bg-gray-200 px-2 py-0.5 rounded">{notification.relatedEmergency.type}</span>
                        <span className="bg-gray-200 px-2 py-0.5 rounded">{notification.relatedEmergency.status}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.createdAt)}</p>
                  </div>
                  {!notification.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default CitizenNotifications
