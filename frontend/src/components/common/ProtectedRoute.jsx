import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROLES } from '@/utils/constants'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)
  const location = useLocation()

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-navy-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role?.toLowerCase()}/dashboard`} replace />
  }

  return children
}

export default ProtectedRoute
