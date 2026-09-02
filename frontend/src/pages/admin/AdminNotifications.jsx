import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/redux/slices/notificationSlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { Bell, CheckCheck, AlertTriangle, User, Clock } from 'lucide-react'
import { formatTimeAgo } from '@/utils/helpers'

const AdminNotifications = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notifications, unreadCount, loading, error } = useSelector((state) => state.notification)

  useEffect(() => {
    dispatch(fetchNotifications())
    const interval = setInterval(() => {
      dispatch(fetchNotifications())
    }, 10000)
    return () => clearInterval(interval)
  }, [dispatch])

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id))
    }
    if (notification.relatedEmergency) {
      navigate(`/admin/verification`)
    }
  }

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead())
  }

  if (loading && notifications.length === 0) return <LoadingSpinner size="lg" />
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchNotifications())} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification(s)` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            <CheckCheck className="h-4 w-4 mr-1" />Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <EmptyState title="No notifications" description="No system notifications." icon={Bell} />
        </Card>
      ) : (
        <Card>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  notification.isRead
                    ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${notification.isRead ? 'bg-gray-200' : 'bg-blue-200'}`}>
                      {notification.type === 'NEW_EMERGENCY' ? (
                        <AlertTriangle className={`h-4 w-4 ${notification.isRead ? 'text-gray-500' : 'text-blue-600'}`} />
                      ) : (
                        <Bell className={`h-4 w-4 ${notification.isRead ? 'text-gray-500' : 'text-blue-600'}`} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {notification.relatedEmergency && (
                          <span className="text-blue-600">View Emergency →</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default AdminNotifications
