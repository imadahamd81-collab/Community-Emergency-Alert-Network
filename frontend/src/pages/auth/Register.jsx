import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearError } from '@/redux/slices/authSlice'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import { ShieldAlert, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: '', color: 'bg-gray-200' }
  
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { level: 1, label: 'Weak', color: 'bg-red-500' }
  if (score <= 4) return { level: 2, label: 'Medium', color: 'bg-yellow-500' }
  return { level: 3, label: 'Strong', color: 'bg-green-500' }
}

const strengthColors = {
  1: 'text-red-600',
  2: 'text-yellow-600',
  3: 'text-green-600',
}

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CITIZEN',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const roleOptions = [
    { value: 'CITIZEN', label: 'Citizen' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'ORGANIZATION', label: 'Organization' },
  ]

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    dispatch(clearError())
    const { confirmPassword, ...data } = formData
    dispatch(register(data))
      .unwrap()
      .then((result) => {
        toast.success('Registration successful! Please login.')
        navigate('/login')
      })
      .catch((err) => {
        toast.error(err || 'Registration failed')
      })
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
        <ShieldAlert className="h-8 w-8 text-red-500" />
        <h1 className="text-xl font-bold">CEAN</h1>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
      <p className="text-gray-600 mb-8">Join the emergency alert network</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="Phone number"
          placeholder="+1 234 567 8900"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <Select
          label="Role"
          options={roleOptions}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        />
        <div>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                <div className={`h-1 flex-1 rounded-full ${passwordStrength.level >= 1 ? passwordStrength.color : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${passwordStrength.level >= 2 ? passwordStrength.color : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${passwordStrength.level >= 3 ? passwordStrength.color : 'bg-gray-200'}`} />
              </div>
              <p className={`text-xs ${strengthColors[passwordStrength.level]}`}>
                {passwordStrength.label}
              </p>
            </div>
          )}
        </div>
        <div>
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
          )}
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-gray-300 text-navy-800 focus:ring-navy-500" required />
          <span className="text-sm text-gray-600">I agree to the Terms of Service and Privacy Policy</span>
        </label>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        <Button type="submit" className="w-full" loading={loading} disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-navy-800 hover:text-navy-900 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Register
