import Organization from '../models/Organization.js'
import User from '../models/User.js'

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().populate('owner', 'name email')
    res.status(200).json({
      success: true,
      data: organizations,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create({
      ...req.body,
      owner: req.user._id,
    })
    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: organization,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).populate('owner', 'name email')
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
        error: null,
      })
    }
    res.status(200).json({
      success: true,
      data: organization,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({
      success: true,
      message: 'Organization updated successfully',
      data: organization,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const deleteOrganization = async (req, res) => {
  try {
    await Organization.findByIdAndDelete(req.params.id)
    res.status(200).json({
      success: true,
      message: 'Organization deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}
