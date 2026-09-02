import api from './api'

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/users/me'),
  updateUser: (data) => api.patch('/users/me', data),
  uploadProfileImage: (formData) => api.post('/users/me/profile-image', formData),
  getResponders: () => api.get('/users/responders'),
  createResponder: (data) => api.post('/users/responders', data),
  getCitizens: () => api.get('/users/citizens'),
  createCitizen: (data) => api.post('/users/citizens', data),
  getMembers: () => api.get('/users/members'),
  createMember: (data) => api.post('/users/members', data),
  getOrganizations: () => api.get('/users/organizations'),
  createOrganization: (data) => api.post('/users/organizations', data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserStatus: (id, data) => api.patch(`/users/${id}/status`, data),
}

export default authApi
