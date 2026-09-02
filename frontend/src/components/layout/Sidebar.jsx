import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '@/redux/slices/authSlice'
import { Home, PlusCircle, MapPin, FileText, Map, Bell, MessageSquare, User, LogOut, Menu, X, ChevronDown, ShieldAlert } from 'lucide-react'
import { useState } from 'react'

const Sidebar = ({ isOpen, onClose, role }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  const citizenLinks = [
    { to: '/citizen/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/citizen/report', icon: PlusCircle, label: 'Report Emergency' },
    { to: '/citizen/nearby', icon: MapPin, label: 'Nearby Emergencies' },
    { to: '/citizen/my-reports', icon: FileText, label: 'My Reports' },
    { to: '/citizen/map', icon: Map, label: 'Emergency Map' },
    { to: '/citizen/notifications', icon: Bell, label: 'Notifications' },
    { to: '/citizen/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/citizen/profile', icon: User, label: 'Profile' },
  ]

  const responderLinks = [
    { to: '/responder/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/responder/nearby', icon: MapPin, label: 'Nearby Emergencies' },
    { to: '/responder/assigned', icon: ShieldAlert, label: 'Assigned' },
    { to: '/responder/map', icon: Map, label: 'Emergency Map' },
    { to: '/responder/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/responder/notifications', icon: Bell, label: 'Notifications' },
    { to: '/responder/profile', icon: User, label: 'Profile' },
  ]

  const adminLinks = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/live-emergencies', icon: ShieldAlert, label: 'Live Emergencies' },
    { to: '/admin/organizations', icon: ShieldAlert, label: 'Organizations' },
    { to: '/admin/responders', icon: User, label: 'Responders' },
    { to: '/admin/citizens', icon: User, label: 'Citizens' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
    { to: '/admin/verification', icon: ShieldAlert, label: 'Verification' },
    { to: '/admin/analytics', icon: ShieldAlert, label: 'Analytics' },
    { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { to: '/admin/settings', icon: ShieldAlert, label: 'Settings' },
    { to: '/admin/profile', icon: User, label: 'Profile' },
  ]

  const orgLinks = [
    { to: '/organization/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/organization/incidents', icon: FileText, label: 'Incidents' },
    { to: '/organization/responders', icon: User, label: 'Responders' },
    { to: '/organization/members', icon: User, label: 'Members' },
    { to: '/organization/analytics', icon: ShieldAlert, label: 'Analytics' },
    { to: '/organization/notifications', icon: Bell, label: 'Notifications' },
    { to: '/organization/profile', icon: User, label: 'Profile' },
    { to: '/organization/settings', icon: ShieldAlert, label: 'Settings' },
  ]

  const links = role === 'CITIZEN' ? citizenLinks : role === 'RESPONDER' ? responderLinks : role === 'ADMIN' ? adminLinks : orgLinks

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-white/10 text-white'
            : 'text-navy-200 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-navy-900 text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-navy-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">CEAN</h1>
              <p className="text-xs text-navy-300 -mt-0.5">Emergency Alert Network</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-navy-300 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
          <div className="pt-4 mt-4 border-t border-navy-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
