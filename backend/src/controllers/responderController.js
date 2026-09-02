import Responder from '../models/Responder.js'
import User from '../models/User.js'
import { getDistanceFromLatLonInKm } from '../utils/distance.js'

export const getResponders = async (req, res) => {
  try {
    const responders = await Responder.find().populate('user', 'name email phone')
    res.status(200).json({
      success: true,
      data: responders,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getNearbyResponders = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query

    const responders = await Responder.find({
      isOnline: true,
      availabilityStatus: 'AVAILABLE',
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    }).populate('user', 'name email phone')

    res.status(200).json({
      success: true,
      data: responders,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getResponderById = async (req, res) => {
  try {
    const responder = await Responder.findById(req.params.id).populate('user', 'name email phone')
    if (!responder) {
      return res.status(404).json({
        success: false,
        message: 'Responder not found',
        error: null,
      })
    }
    res.status(200).json({
      success: true,
      data: responder,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const updateResponderStatus = async (req, res) => {
  try {
    const { status, latitude, longitude } = req.body
    const responder = await Responder.findOneAndUpdate(
      { user: req.user._id },
      {
        availabilityStatus: status,
        isOnline: status !== 'OFFLINE',
        currentLocation: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      },
      { new: true }
    ).populate('user', 'name email phone')

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: responder,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}
