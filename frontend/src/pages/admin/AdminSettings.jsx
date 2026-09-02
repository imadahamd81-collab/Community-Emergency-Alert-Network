import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { toast } from 'sonner'
import { useState } from 'react'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Community Emergency Alert Network',
    supportEmail: 'support@cean.org',
    enableNotifications: true,
    enableSocket: true,
  })
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
        <p className="text-gray-600 mt-1">Manage platform settings</p>
      </div>

      <Card title="General Settings">
        <div className="space-y-4 max-w-xl">
          <Input label="Site Name" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
          <Input label="Support Email" type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
              className="rounded border-gray-300 text-navy-800 focus:ring-navy-500"
            />
            <label className="text-sm text-gray-700">Enable push notifications</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enableSocket}
              onChange={(e) => setSettings({ ...settings, enableSocket: e.target.checked })}
              className="rounded border-gray-300 text-navy-800 focus:ring-navy-500"
            />
            <label className="text-sm text-gray-700">Enable real-time updates</label>
          </div>
          <Button onClick={handleSave} loading={saving} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AdminSettings
