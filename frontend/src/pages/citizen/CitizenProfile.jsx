import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, updateProfileImage } from '@/redux/slices/authSlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { toast } from 'sonner'
import { Loader2, Camera, X } from 'lucide-react'
import { authApi } from '@/services/authApi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const BACKEND_URL = API_BASE_URL.replace('/api', '')

const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${BACKEND_URL}${cleanPath}`
}

const CitizenProfile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  useEffect(() => {
    setImageError(false)
  }, [user?.profileImage])

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.')
      return
    }

    setImageError(false)
    setSelectedImage(file)
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
    setImageError(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required')
      return
    }

    setLoading(true)
    try {
      if (selectedImage) {
        setUploadingImage(true)
        const formDataObj = new FormData()
        formDataObj.append('profilePicture', selectedImage)
        
        const response = await authApi.uploadProfileImage(formDataObj)
        
        const updatedUser = response.data?.data
        if (updatedUser) {
          dispatch(updateProfileImage(updatedUser.profileImage))
        }
        setUploadingImage(false)
      }

      await dispatch(updateUser({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      })).unwrap()

      setSelectedImage(null)
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
      }
      setImageError(false)
      toast.success('Profile updated successfully')
      setEditing(false)
    } catch (err) {
      console.error('Profile update error:', err)
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    })
    setSelectedImage(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
    setImageError(false)
    setEditing(false)
  }

  const displayImageUrl = imagePreview || (user?.profileImage && !imageError ? `${getImageUrl(user.profileImage)}?t=${Date.now()}` : null)

  useEffect(() => {
    console.log('User profileImage:', user?.profileImage)
    console.log('displayImageUrl:', displayImageUrl)
    console.log('imageError:', imageError)
  }, [user?.profileImage, displayImageUrl, imageError])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      <Card>
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-white shadow-lg">
              {displayImageUrl ? (
                <img
                  src={displayImageUrl}
                  alt={user?.name || 'Profile'}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-gray-500">{getInitials(user?.name)}</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleCameraClick}
              disabled={uploadingImage}
              className="absolute bottom-0 right-0 p-2 bg-navy-600 text-white rounded-full shadow-md hover:bg-navy-700 transition-colors disabled:opacity-50"
              title="Upload profile picture"
            >
              {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </button>
            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                title="Remove selected image"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Click the camera icon to upload a photo</p>
        </div>

        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!editing}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!editing}
          />

          <div className="flex justify-end gap-3 pt-4">
            {editing ? (
              <>
                <Button variant="secondary" onClick={handleCancel} disabled={loading}>Cancel</Button>
                <Button onClick={handleSave} loading={loading} disabled={loading}>
                  {loading ? (uploadingImage ? 'Uploading...' : 'Saving...') : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CitizenProfile
