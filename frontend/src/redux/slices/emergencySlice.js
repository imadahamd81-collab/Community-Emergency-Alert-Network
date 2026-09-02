import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import emergencyApi from '@/services/emergencyApi'

const toEmergencyList = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data?.emergencies)) return payload.data.emergencies
  if (Array.isArray(payload?.emergencies)) return payload.emergencies
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const toEmergencyItem = (payload) =>
  payload?.data ?? payload?.emergency ?? payload ?? null

export const fetchEmergencies = createAsyncThunk(
  'emergency/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await emergencyApi.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch emergencies')
    }
  }
)

export const fetchEmergencyById = createAsyncThunk(
  'emergency/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await emergencyApi.getById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch emergency')
    }
  }
)

export const createEmergency = createAsyncThunk(
  'emergency/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await emergencyApi.create(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create emergency')
    }
  }
)

export const updateEmergency = createAsyncThunk(
  'emergency/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await emergencyApi.update(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update emergency')
    }
  }
)

export const verifyEmergency = createAsyncThunk(
  'emergency/verify',
  async (id, { rejectWithValue }) => {
    try {
      const response = await emergencyApi.verify(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify emergency')
    }
  }
)

export const assignEmergency = createAsyncThunk(
  'emergency/assign',
  async ({ id, responderIds }, { rejectWithValue }) => {
    try {
      const response = await emergencyApi.assign(id, { responderIds })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign emergency')
    }
  }
)

export const acceptEmergency = createAsyncThunk(
  'emergency/accept',
  async (id, { rejectWithValue }) => {
    try {
      const response = await emergencyApi.accept(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept emergency')
    }
  }
)

export const updateEmergencyStatus = createAsyncThunk(
  'emergency/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await emergencyApi.updateStatus(id, { status })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status')
    }
  }
)

export const resolveEmergency = createAsyncThunk(
  'emergency/resolve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await emergencyApi.resolve(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resolve emergency')
    }
  }
)

export const fetchNearbyEmergencies = createAsyncThunk(
  'emergency/fetchNearby',
  async (params, { rejectWithValue }) => {
    try {
      const response = await emergencyApi.nearby(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nearby emergencies')
    }
  }
)

const emergencySlice = createSlice({
  name: 'emergency',
  initialState: {
    emergencies: [],
    currentEmergency: null,
    nearbyEmergencies: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCurrentEmergency: (state) => {
      state.currentEmergency = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmergencies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmergencies.fulfilled, (state, action) => {
        state.loading = false
        state.emergencies = toEmergencyList(action.payload)
      })
      .addCase(fetchEmergencies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchEmergencyById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmergencyById.fulfilled, (state, action) => {
        state.loading = false
        state.currentEmergency = toEmergencyItem(action.payload)
      })
      .addCase(fetchEmergencyById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createEmergency.fulfilled, (state, action) => {
        state.success = true
        state.emergencies.unshift(toEmergencyItem(action.payload))
      })
      .addCase(createEmergency.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateEmergency.fulfilled, (state, action) => {
        const updated = toEmergencyItem(action.payload)
        const idx = state.emergencies.findIndex((e) => e._id === updated._id)
        if (idx !== -1) {
          state.emergencies[idx] = updated
        }
        if (state.currentEmergency?._id === updated._id) {
          state.currentEmergency = updated
        }
      })
      .addCase(verifyEmergency.fulfilled, (state, action) => {
        const updated = toEmergencyItem(action.payload)
        const idx = state.emergencies.findIndex((e) => e._id === updated._id)
        if (idx !== -1) {
          state.emergencies[idx] = updated
        }
        if (state.currentEmergency?._id === updated._id) {
          state.currentEmergency = updated
        }
      })
      .addCase(assignEmergency.fulfilled, (state, action) => {
        const updated = toEmergencyItem(action.payload)
        const idx = state.emergencies.findIndex((e) => e._id === updated._id)
        if (idx !== -1) {
          state.emergencies[idx] = updated
        }
        if (state.currentEmergency?._id === updated._id) {
          state.currentEmergency = updated
        }
      })
      .addCase(acceptEmergency.fulfilled, (state, action) => {
        const updated = toEmergencyItem(action.payload)
        const idx = state.emergencies.findIndex((e) => e._id === updated._id)
        if (idx !== -1) {
          state.emergencies[idx] = updated
        }
        if (state.currentEmergency?._id === updated._id) {
          state.currentEmergency = updated
        }
      })
      .addCase(updateEmergencyStatus.fulfilled, (state, action) => {
        const updated = toEmergencyItem(action.payload)
        const idx = state.emergencies.findIndex((e) => e._id === updated._id)
        if (idx !== -1) {
          state.emergencies[idx] = updated
        }
        if (state.currentEmergency?._id === updated._id) {
          state.currentEmergency = updated
        }
      })
      .addCase(resolveEmergency.fulfilled, (state, action) => {
        const updated = toEmergencyItem(action.payload)
        const idx = state.emergencies.findIndex((e) => e._id === updated._id)
        if (idx !== -1) {
          state.emergencies[idx] = updated
        }
        if (state.currentEmergency?._id === updated._id) {
          state.currentEmergency = updated
        }
      })
      .addCase(fetchNearbyEmergencies.fulfilled, (state, action) => {
        state.nearbyEmergencies = toEmergencyList(action.payload)
      })
  },
})

export const { clearCurrentEmergency, clearError } = emergencySlice.actions
export default emergencySlice.reducer
