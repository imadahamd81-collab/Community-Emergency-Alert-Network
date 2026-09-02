import { useState } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, markNotificationAsRead } from '@/redux/slices/notificationSlice'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Send, MessageSquare } from 'lucide-react'
import { formatTimeAgo } from '@/utils/helpers'

const CitizenMessages = () => {
  const { subscribe } = useSocket()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [conversationId] = useState('default')

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    const msg = {
      id: Date.now(),
      text: newMessage,
      sender: 'citizen',
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, msg])
    setNewMessage('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Chat with responders</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'citizen' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'citizen' ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'citizen' ? 'text-navy-200' : 'text-gray-500'}`}>{formatTimeAgo(msg.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit"><Send className="h-4 w-4" /></Button>
        </form>
      </Card>
    </div>
  )
}

export default CitizenMessages
