import mongoose from 'mongoose'

const responderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    specialization: {
      type: String,
      default: '',
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
      default: 'OFFLINE',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    responseCount: {
      type: Number,
      default: 0,
    },
    averageResponseTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

responderSchema.index({ currentLocation: '2dsphere' })

export default mongoose.model('Responder', responderSchema)
