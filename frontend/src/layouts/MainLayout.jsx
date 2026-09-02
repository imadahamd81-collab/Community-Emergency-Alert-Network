import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getUserRole = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return user?.role || 'CITIZEN'
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e)
    }
    return 'CITIZEN'
  }

  const role = getUserRole()

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role={role} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(true)} title="Dashboard" />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
