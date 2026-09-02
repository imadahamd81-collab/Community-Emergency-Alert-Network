import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '@/redux/slices/authSlice'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { ShieldAlert, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(clearError())
    dispatch(login(formData))
      .unwrap()
      .then((result) => {
        toast.success('Welcome back!')
        const role = result?.data?.user?.role?.toLowerCase() || 'citizen'
        navigate(`/${role}/dashboard`)
      })
      .catch((err) => {
        toast.error(err || 'Login failed')
      })
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
        <ShieldAlert className="h-8 w-8 text-red-500" />
        <h1 className="text-xl font-bold">CEAN</h1>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
      <p className="text-gray-600 mb-8">Access the emergency alert network dashboard</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 text-sm"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300 text-navy-800 focus:ring-navy-500" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-navy-800 hover:text-navy-900 font-medium">
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        <Button type="submit" className="w-full" loading={loading} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-navy-800 hover:text-navy-900 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default Login
