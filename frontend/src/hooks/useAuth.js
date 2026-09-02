import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from '@/redux/slices/authSlice'
import { connectSocket } from '@/services/socket'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !user) {
      dispatch(getMe())
      connectSocket(() => token, () => dispatch({ type: 'auth/logout' }))
    }
  }, [dispatch, user])

  return { user, isAuthenticated, loading }
}
