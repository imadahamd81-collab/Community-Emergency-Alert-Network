import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications } from '@/redux/slices/notificationSlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorState from '@/components/common/ErrorState'
import EmptyState from '@/components/common/EmptyState'
import { Bell, CheckCheck } from 'lucide-react'
import { formatTimeAgo } from '@/utils/helpers'

const OrganizationNotifications = () => {
  const dispatch = useDispatch()
  const { notifications, loading, error } = useSelector((state) => state.notification)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  if (loading) return <LoadingSpinner size="lg" />
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchNotifications())} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Organization notifications</p>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <EmptyState title="No notifications" description="You're all caught up!" icon={Bell} />
        </Card>
      ) : (
        <Card>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification._id} className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                <h4 className="font-medium text-gray-900">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default OrganizationNotifications
