import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, clearError } from '@/redux/slices/authSlice'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const ResetPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loading, error, success } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const token = searchParams.get('token')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    dispatch(clearError())
    dispatch(resetPassword({ token, password: formData.password }))
      .unwrap()
      .then(() => {
        toast.success('Password reset successfully!')
        navigate('/login')
      })
      .catch((err) => {
        toast.error(err || 'Reset failed')
      })
  }

  if (!token) {
    return (
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
        <p className="text-gray-600 mb-6">The reset link is invalid or has expired.</p>
        <Link to="/forgot-password" className="text-navy-800 hover:text-navy-900 font-medium">
          Request new link
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <ShieldAlert className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password reset</h2>
        <p className="text-gray-600 mb-6">Your password has been reset successfully.</p>
        <Link to="/login" className="text-navy-800 hover:text-navy-900 font-medium">
          Go to login
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h2>
      <p className="text-gray-600 mb-8">Enter your new password below</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={6}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        <Button type="submit" className="w-full" loading={loading} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>
    </div>
  )
}

export default ResetPassword
