import mongoose from 'mongoose'

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add organization name'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['HOSPITAL', 'FIRE_STATION', 'NGO', 'SECURITY', 'RESCUE_TEAM', 'OTHER'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
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
    website: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

organizationSchema.index({ location: '2dsphere' })

export default mongoose.model('Organization', organizationSchema)
