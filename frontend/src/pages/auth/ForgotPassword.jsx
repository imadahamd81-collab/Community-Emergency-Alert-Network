import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, clearError } from '@/redux/slices/authSlice'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const { loading, error, success } = useSelector((state) => state.auth)
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(clearError())
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        toast.success('Check your email for reset instructions')
      })
      .catch((err) => {
        toast.error(err || 'Request failed')
      })
  }

  if (success) {
    return (
      <div className="w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <ShieldAlert className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-600 mb-6">We sent a password reset link to {email}</p>
        <Link to="/login" className="text-navy-800 hover:text-navy-900 font-medium">
          Back to login
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h2>
      <p className="text-gray-600 mb-8">Enter your email and we'll send you reset instructions</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        <Button type="submit" className="w-full" loading={loading} disabled={loading}>
          {loading ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
    </div>
  )
}

export default ForgotPassword
