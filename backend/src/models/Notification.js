import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['EMERGENCY_CREATED', 'EMERGENCY_VERIFIED', 'EMERGENCY_ASSIGNED', 'EMERGENCY_ACCEPTED', 'STATUS_UPDATED', 'EMERGENCY_RESOLVED', 'NEARBY_EMERGENCY', 'NEW_MESSAGE', 'ADMIN_NOTIFICATION', 'NEW_EMERGENCY'],
      required: true,
    },
    relatedEmergency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Emergency',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Notification', notificationSchema)
