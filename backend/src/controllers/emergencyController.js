import Emergency from '../models/Emergency.js'
import User from '../models/User.js'
import { createEmergency, getEmergencies, getEmergencyById, updateEmergency, verifyEmergency, rejectEmergency, assignEmergency, acceptEmergency, updateEmergencyStatus, resolveEmergency } from '../services/emergencyService.js'
import { createNotification } from '../services/notificationService.js'
import { getFileUrl } from '../middleware/uploadMiddleware.js'

export const createEmergencyHandler = async (req, res) => {
  try {
    const { type, description, peopleAffected, latitude, longitude, address, phone } = req.body

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
        error: null,
      })
    }

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude values',
        error: null,
      })
    }

    const location = {
      type: 'Point',
      coordinates: [lng, lat],
      address: address || '',
      latitude: lat,
      longitude: lng,
    }

    const media = []
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const isVideo = file.mimetype.startsWith('video/')
        media.push({
          url: `/uploads/emergencies/${file.filename}`,
          publicId: file.filename,
          resourceType: isVideo ? 'video' : 'image',
        })
      }
    }

    const emergency = await createEmergency(
      {
        type,
        description,
        peopleAffected: parseInt(peopleAffected) || 1,
        location,
        media,
        contactPhone: phone || '',
      },
      req.user._id
    )

    const populated = await Emergency.findById(emergency._id)
      .populate('reportedBy', 'name email phone')

    const admins = await User.find({ role: 'ADMIN' })
    for (const admin of admins) {
      await createNotification(
        admin._id,
        'New Emergency Reported',
        `A new ${type} emergency has been reported by ${populated.reportedBy?.name || 'a citizen'}.`,
        'NEW_EMERGENCY',
        emergency._id
      )
    }

    res.status(201).json({
      success: true,
      message: 'Emergency reported successfully',
      data: populated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getEmergenciesHandler = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      type: req.query.type,
      priority: req.query.priority,
      status: req.query.status,
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      radius: req.query.radius,
      search: req.query.search,
    }

    const result = await getEmergencies(filters)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getEmergencyByIdHandler = async (req, res) => {
  try {
    const emergency = await getEmergencyById(req.params.id)
    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found',
        error: null,
      })
    }
    res.status(200).json({
      success: true,
      data: emergency,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const updateEmergencyHandler = async (req, res) => {
  try {
    const emergency = await updateEmergency(req.params.id, req.body)
    res.status(200).json({
      success: true,
      message: 'Emergency updated successfully',
      data: emergency,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const verifyEmergencyHandler = async (req, res) => {
  try {
    const emergency = await verifyEmergency(req.params.id, req.user._id)
    await createNotification(emergency.reportedBy, 'Emergency Verified', 'Your emergency has been verified.', 'EMERGENCY_VERIFIED', emergency._id)

    res.status(200).json({
      success: true,
      message: 'Emergency verified successfully',
      data: emergency,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const rejectEmergencyHandler = async (req, res) => {
  try {
    const emergency = await rejectEmergency(req.params.id)
    res.status(200).json({
      success: true,
      message: 'Emergency rejected',
      data: emergency,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const assignEmergencyHandler = async (req, res) => {
  try {
    const { responderIds } = req.body
    const ids = Array.isArray(responderIds) ? responderIds : [responderIds].filter(Boolean)
    
    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one responder ID is required',
        error: null,
      })
    }
    
    const emergency = await assignEmergency(req.params.id, ids, req.body.organizationId)
    
    for (const responderId of ids) {
      await createNotification(responderId, 'Emergency Assigned', 'You have been assigned to an emergency.', 'EMERGENCY_ASSIGNED', emergency._id)
    }

    res.status(200).json({
      success: true,
      message: `${ids.length} responder(s) assigned successfully`,
      data: emergency,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const acceptEmergencyHandler = async (req, res) => {
  try {
    const emergency = await acceptEmergency(req.params.id)
    await createNotification(emergency.reportedBy, 'Emergency Accepted', 'A responder has accepted your emergency.', 'EMERGENCY_ACCEPTED', emergency._id)

    res.status(200).json({
      success: true,
      message: 'Emergency accepted',
      data: emergency,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const updateEmergencyStatusHandler = async (req, res) => {
  try {
    const { status, note } = req.body
    const emergency = await updateEmergencyStatus(req.params.id, status, req.user._id, note)

    res.status(200).json({
      success: true,
      message: 'Emergency status updated',
      data: emergency,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const resolveEmergencyHandler = async (req, res) => {
  try {
    const emergency = await resolveEmergency(req.params.id)
    await createNotification(emergency.reportedBy, 'Emergency Resolved', 'Your emergency has been resolved.', 'EMERGENCY_RESOLVED', emergency._id)

    res.status(200).json({
      success: true,
      message: 'Emergency resolved successfully',
      data: emergency,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}
