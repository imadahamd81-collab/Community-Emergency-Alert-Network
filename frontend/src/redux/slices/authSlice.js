import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authApi from '@/services/authApi'

const token = localStorage.getItem('token')
let user = null
try {
  user = JSON.parse(localStorage.getItem('user') || 'null')
} catch (e) {
  console.error('Failed to parse user from localStorage', e)
  localStorage.removeItem('user')
}

export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Request failed')
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Reset failed')
    }
  }
)

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getMe()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user')
    }
  }
)

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.updateUser(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user,
    token: token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      state.success = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
    updateProfileImage: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, profileImage: action.payload }
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.token = action.payload.data?.token
        state.user = action.payload.data?.user
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.data?.token || '')
        localStorage.setItem('user', JSON.stringify(action.payload.data?.user || {}))
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.token = action.payload.data?.token
        state.user = action.payload.data?.user
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.data?.token || '')
        localStorage.setItem('user', JSON.stringify(action.payload.data?.user || {}))
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.success = true
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.success = true
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.data
        state.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(action.payload.data || {}))
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.data
        localStorage.setItem('user', JSON.stringify(action.payload.data || {}))
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { logout, clearError, updateProfileImage } = authSlice.actions
export default authSlice.reducer
