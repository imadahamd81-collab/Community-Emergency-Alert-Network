import api from './api'

export const emergencyApi = {
  getAll: (params) => api.get('/emergencies', { params }),
  getById: (id) => api.get(`/emergencies/${id}`),
  create: (data) => api.post('/emergencies', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.patch(`/emergencies/${id}`, data),
  delete: (id) => api.delete(`/emergencies/${id}`),
  verify: (id) => api.post(`/emergencies/${id}/verify`),
  assign: (id, data) => api.post(`/emergencies/${id}/assign`, data),
  accept: (id) => api.post(`/emergencies/${id}/accept`),
  updateStatus: (id, data) => api.post(`/emergencies/${id}/status`, data),
  resolve: (id) => api.post(`/emergencies/${id}/resolve`),
  nearby: (params) => api.get('/emergencies', { params }),
}

export default emergencyApi
