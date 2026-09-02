import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { toast } from 'sonner'
import { useState } from 'react'

const OrganizationSettings = () => {
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Settings saved successfully')
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage organization settings</p>
      </div>

      <Card title="Organization Settings">
        <div className="space-y-4 max-w-xl">
          <Input label="Organization Name" placeholder="Organization name" />
          <Input label="Contact Email" type="email" placeholder="contact@org.com" />
          <Input label="Contact Phone" placeholder="+1 234 567 8900" />
          <Input label="Address" placeholder="Organization address" />
          <Button onClick={handleSave} loading={saving} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default OrganizationSettings
