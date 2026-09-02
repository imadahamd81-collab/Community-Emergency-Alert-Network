import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { lazy, Suspense } from 'react'
import Layout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { connectSocket } from '@/services/socket'

const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))

const CitizenDashboard = lazy(() => import('@/pages/citizen/CitizenDashboard'))
const ReportEmergency = lazy(() => import('@/pages/citizen/ReportEmergency'))
const NearbyEmergencies = lazy(() => import('@/pages/citizen/NearbyEmergencies'))
const MyReports = lazy(() => import('@/pages/citizen/MyReports'))
const EmergencyMap = lazy(() => import('@/pages/citizen/EmergencyMap'))
const CitizenNotifications = lazy(() => import('@/pages/citizen/CitizenNotifications'))
const CitizenMessages = lazy(() => import('@/pages/citizen/CitizenMessages'))
const CitizenProfile = lazy(() => import('@/pages/citizen/CitizenProfile'))
const EmergencyDetails = lazy(() => import('@/pages/citizen/EmergencyDetails'))

const ResponderDashboard = lazy(() => import('@/pages/responder/ResponderDashboard'))
const ResponderEmergencies = lazy(() => import('@/pages/responder/ResponderEmergencies'))
const ResponderAssigned = lazy(() => import('@/pages/responder/ResponderAssigned'))
const ResponderMap = lazy(() => import('@/pages/responder/ResponderMap'))
const ResponderMessages = lazy(() => import('@/pages/responder/ResponderMessages'))
const ResponderNotifications = lazy(() => import('@/pages/responder/ResponderNotifications'))
const ResponderProfile = lazy(() => import('@/pages/responder/ResponderProfile'))

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const LiveEmergencies = lazy(() => import('@/pages/admin/LiveEmergencies'))
const AdminOrganizations = lazy(() => import('@/pages/admin/AdminOrganizations'))
const AdminResponders = lazy(() => import('@/pages/admin/AdminResponders'))
const AdminCitizens = lazy(() => import('@/pages/admin/AdminCitizens'))
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'))
const AdminVerification = lazy(() => import('@/pages/admin/AdminVerification'))
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'))
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications'))
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'))
const AdminHeatmap = lazy(() => import('@/pages/admin/AdminHeatmap'))
const AdminProfile = lazy(() => import('@/pages/admin/AdminProfile'))

const OrganizationDashboard = lazy(() => import('@/pages/organization/OrganizationDashboard'))
const OrganizationIncidents = lazy(() => import('@/pages/organization/OrganizationIncidents'))
const OrganizationNearby = lazy(() => import('@/pages/organization/OrganizationNearby'))
const OrganizationResponders = lazy(() => import('@/pages/organization/OrganizationResponders'))
const OrganizationMembers = lazy(() => import('@/pages/organization/OrganizationMembers'))
const OrganizationAnalytics = lazy(() => import('@/pages/organization/OrganizationAnalytics'))
const OrganizationNotifications = lazy(() => import('@/pages/organization/OrganizationNotifications'))
const OrganizationProfile = lazy(() => import('@/pages/organization/OrganizationProfile'))
const OrganizationSettings = lazy(() => import('@/pages/organization/OrganizationSettings'))

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && isAuthenticated) {
      connectSocket(() => token, () => dispatch({ type: 'auth/logout' }))
    }
  }, [dispatch, isAuthenticated])

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-navy-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role?.toLowerCase()}/dashboard`} replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to={`/${user?.role?.toLowerCase()}/dashboard`} replace /> : <Register />} />
            <Route path="/forgot-password" element={isAuthenticated ? <Navigate to={`/${user?.role?.toLowerCase()}/dashboard`} replace /> : <ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to={`/${user?.role?.toLowerCase()}/dashboard`} replace />} />
            
            <Route path="citizen">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CitizenDashboard />} />
              <Route path="report" element={<ReportEmergency />} />
              <Route path="nearby" element={<NearbyEmergencies />} />
              <Route path="my-reports" element={<MyReports />} />
              <Route path="map" element={<EmergencyMap />} />
              <Route path="notifications" element={<CitizenNotifications />} />
              <Route path="messages" element={<CitizenMessages />} />
              <Route path="profile" element={<CitizenProfile />} />
              <Route path="emergency/:id" element={<EmergencyDetails />} />
            </Route>

            <Route path="responder">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ResponderDashboard />} />
              <Route path="nearby" element={<ResponderEmergencies />} />
              <Route path="assigned" element={<ResponderAssigned />} />
              <Route path="map" element={<ResponderMap />} />
              <Route path="messages" element={<ResponderMessages />} />
              <Route path="notifications" element={<ResponderNotifications />} />
              <Route path="profile" element={<ResponderProfile />} />
              <Route path="emergency/:id" element={<EmergencyDetails />} />
            </Route>

            <Route path="admin">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="live-emergencies" element={<LiveEmergencies />} />
              <Route path="organizations" element={<AdminOrganizations />} />
              <Route path="responders" element={<AdminResponders />} />
              <Route path="citizens" element={<AdminCitizens />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="verification" element={<AdminVerification />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="heatmap" element={<AdminHeatmap />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="emergency/:id" element={<EmergencyDetails />} />
            </Route>

            <Route path="organization">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<OrganizationDashboard />} />
              <Route path="incidents" element={<OrganizationIncidents />} />
              <Route path="nearby" element={<OrganizationNearby />} />
              <Route path="responders" element={<OrganizationResponders />} />
              <Route path="members" element={<OrganizationMembers />} />
              <Route path="analytics" element={<OrganizationAnalytics />} />
              <Route path="notifications" element={<OrganizationNotifications />} />
              <Route path="profile" element={<OrganizationProfile />} />
              <Route path="settings" element={<OrganizationSettings />} />
              <Route path="emergency/:id" element={<EmergencyDetails />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
