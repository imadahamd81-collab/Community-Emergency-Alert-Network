import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import emergencyReducer from './slices/emergencySlice'
import notificationReducer from './slices/notificationSlice'
import { setupApiInterceptors } from '@/services/api'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    emergency: emergencyReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

setupApiInterceptors(() => store)

export default store
