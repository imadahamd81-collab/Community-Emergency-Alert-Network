import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params

    const conversation = await Conversation.findById(conversationId)
    if (!conversation || !conversation.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation',
        error: null,
      })
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })

    res.status(200).json({
      success: true,
      data: messages,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, emergencyId } = req.body

    let conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id],
        emergency: emergencyId || null,
      })
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text,
    })

    conversation.lastMessage = message._id
    await conversation.save()

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name email')

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params
    await Message.updateMany(
      { conversation: conversationId, 'readBy.user': { $ne: req.user._id } },
      { $push: { readBy: { user: req.user._id, readAt: new Date() } } }
    )

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}
