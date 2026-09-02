import mongoose from 'mongoose'

const emergencyUpdateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const emergencySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please add emergency type'],
      enum: ['ACCIDENT', 'FIRE', 'MEDICAL', 'ROAD_BLOCKAGE', 'FLOOD', 'GAS_LEAK', 'MISSING_PERSON', 'OTHER'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (v) {
            return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90
          },
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
      address: {
        type: String,
        default: '',
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    priority: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'HANDLING', 'RESOLVED', 'CANCELLED'],
      default: 'PENDING_VERIFICATION',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedResponders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    }],
    assignedOrganization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    peopleAffected: {
      type: Number,
      default: 1,
      min: 1,
    },
    contactPhone: {
      type: String,
      default: '',
    },
    media: [
      {
        url: String,
        publicId: String,
        resourceType: String,
      },
    ],
    aiAnalysis: {
      suggestedCategory: String,
      suggestedSeverity: String,
      confidence: Number,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    updates: [emergencyUpdateSchema],
  },
  {
    timestamps: true,
  }
)

emergencySchema.index({ location: '2dsphere' })

export default mongoose.model('Emergency', emergencySchema)
