import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import notificationApi from '@/services/notificationApi'

export const fetchNotifications = createAsyncThunk(
  'notification/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications')
    }
  }
)

export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await notificationApi.markAsRead(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read')
    }
  }
)

export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.markAllAsRead()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read')
    }
  }
)

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadCount()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count')
    }
  }
)

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload.data || action.payload.notifications || []
        state.unreadCount = action.payload.unreadCount ?? state.notifications.filter((n) => !n.isRead).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notif = action.payload.data || action.payload.notification || action.payload
        const idx = state.notifications.findIndex((n) => n._id === notif._id)
        if (idx !== -1) {
          state.notifications[idx].isRead = true
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.isRead = true))
        state.unreadCount = 0
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.data?.unreadCount ?? action.payload.unreadCount ?? 0
      })
  },
})

export const { clearNotifications, incrementUnreadCount } = notificationSlice.actions
export default notificationSlice.reducer
