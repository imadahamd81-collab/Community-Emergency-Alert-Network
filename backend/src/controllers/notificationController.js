import Notification from '../models/Notification.js'

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('relatedEmergency', 'type status description location')
      .sort({ createdAt: -1 })
      .limit(100)

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false })

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
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
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
        error: null,
      })
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id }, { isRead: true })

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false })

    res.status(200).json({
      success: true,
      data: { unreadCount },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}
