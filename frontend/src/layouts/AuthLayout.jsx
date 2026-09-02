import { ShieldAlert } from 'lucide-react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 text-white flex-col justify-center px-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <ShieldAlert className="h-10 w-10 text-red-500" />
            <h1 className="text-2xl font-bold">CEAN</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">Community Emergency Alert Network</h2>
          <p className="text-navy-300 text-lg">
            Real-time emergency response coordination for safer communities.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
