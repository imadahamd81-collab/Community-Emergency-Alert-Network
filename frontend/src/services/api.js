import axios from 'axios'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
})

export const setupApiInterceptors = (getStore) => {
  api.interceptors.request.use(
    (config) => {
      try {
        const token = getStore()?.getState?.()?.auth?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        if (config.data instanceof FormData) {
          config.headers['Content-Type'] = 'multipart/form-data'
        } else {
          config.headers['Content-Type'] = 'application/json'
        }
      } catch (e) {
        console.error('Failed to get auth token', e)
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  api.interceptors.response.use(
    (response) => {
      // Debug logging for file upload responses
      if (response.config.url?.includes('profile-image')) {
        console.log("=== API RESPONSE (profile-image) ===")
        console.log("Status:", response.status)
        console.log("Data:", response.data)
      }
      return response
    },
    (error) => {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message || 'An error occurred'

      // Debug logging for file upload errors
      if (error.config?.url?.includes('profile-image')) {
        console.log("=== API ERROR (profile-image) ===")
        console.log("Status:", status)
        console.log("Error data:", error.response?.data)
        console.log("Error message:", message)
        console.log("Error config:", error.config)
      }

      if (status === 401) {
        try {
          getStore()?.dispatch?.({ type: 'auth/logout' })
        } catch (e) {
          console.error('Logout dispatch failed', e)
        }
        toast.error('Session expired. Please log in again.')
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.')
      } else if (status === 404) {
        toast.error('Resource not found.')
      } else if (status === 422) {
        toast.error(message || 'Invalid data provided.')
      } else if (status === 429) {
        toast.error('Too many requests. Please try again later.')
      } else if (status && status >= 500) {
        toast.error('Server error. Please try again later.')
      } else if (error.code === 'ECONNABORTED' || !error.response) {
        toast.error('Network error. Please check your connection.')
      }

      return Promise.reject(error)
    }
  )
}

export default api
