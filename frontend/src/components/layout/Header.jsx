import { useEffect, useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUnreadCount } from '@/redux/slices/notificationSlice'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const BACKEND_URL = API_BASE_URL.replace('/api', '')

const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${BACKEND_URL}${cleanPath}`
}

const Header = ({ onToggleSidebar, title }) => {
  const { user } = useSelector((state) => state.auth)
  const { unreadCount } = useSelector((state) => state.notification)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)
  const [imageKey, setImageKey] = useState(0)

  useEffect(() => {
    dispatch(fetchUnreadCount())
  }, [dispatch])

  useEffect(() => {
    setImageError(false)
    setImageKey((prev) => prev + 1)
  }, [user?.profileImage])

  const handleNotificationClick = () => {
    const role = user?.role?.toLowerCase()
    if (role) {
      navigate(`/${role}/notifications`)
    }
  }

  const profileImageUrl = user?.profileImage && !imageError ? getImageUrl(user.profileImage) : null

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900">
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleNotificationClick}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium overflow-hidden">
            {profileImageUrl ? (
              <img
                key={imageKey}
                src={profileImageUrl}
                alt={user?.name || 'Profile'}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-gray-500">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
