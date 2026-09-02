import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '@/redux/slices/authSlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { toast } from 'sonner'

const OrganizationProfile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleSave = async () => {
    setLoading(true)
    dispatch(updateUser(formData))
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully')
        setEditing(false)
      })
      .catch((err) => toast.error(err || 'Failed to update profile'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organization Profile</h1>
        <p className="text-gray-600 mt-1">Manage your organization settings</p>
      </div>

      <Card>
        <div className="space-y-4">
          <Input
            label="Organization Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!editing}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!editing}
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!editing}
          />

          <div className="flex justify-end gap-3 pt-4">
            {editing ? (
              <>
                <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} loading={loading} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
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

export default OrganizationProfile
