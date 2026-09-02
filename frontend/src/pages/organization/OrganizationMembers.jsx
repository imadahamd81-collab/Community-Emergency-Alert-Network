import { useEffect, useState } from 'react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Users, Plus, Trash2, UserX, UserCog } from 'lucide-react'
import { toast } from 'sonner'
import { authApi } from '@/services/authApi'

const OrganizationMembers = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dialog, setDialog] = useState({ open: false, type: null, id: null })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    setLoading(true)
    try {
      const response = await authApi.getMembers()
      const list = response.data?.data || []
      setMembers(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Failed to load members:', err)
      toast.error('Failed to load members')
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.phone.trim()) {
      toast.error('All fields are required')
      return
    }

    setSubmitting(true)
    try {
      await authApi.createMember({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
      })
      toast.success('Member added successfully')
      setFormData({ name: '', email: '', password: '', phone: '' })
      setShowAddForm(false)
      loadMembers()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add member')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await authApi.updateUserStatus(id, { isSuspended: !currentStatus })
      toast.success(currentStatus ? 'Member deactivated' : 'Member activated')
      loadMembers()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    try {
      await authApi.deleteUser(dialog.id)
      toast.success('Member deleted')
      loadMembers()
    } catch (err) {
      toast.error('Failed to delete member')
    }
    setDialog({ open: false, type: null, id: null })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">Manage organization members</p>
        </div>
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600"></div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">Manage organization members</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-1" />
          {showAddForm ? 'Cancel' : 'Add Member'}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Member</h3>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Add Member
              </Button>
            </div>
          </form>
        </Card>
      )}

      {members.length === 0 ? (
        <Card>
          <EmptyState
            title="No members"
            description="No members in your organization yet. Click 'Add Member' to create one."
            icon={Users}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <UserCog className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{member.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{member.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.isActive !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(member._id, member.isActive !== false)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            member.isActive !== false
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={member.isActive !== false ? 'Deactivate' : 'Activate'}
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDialog({ open: true, type: 'delete', id: member._id })}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ConfirmDialog
        isOpen={dialog.open}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDialog({ open: false, type: null, id: null })}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

export default OrganizationMembers
