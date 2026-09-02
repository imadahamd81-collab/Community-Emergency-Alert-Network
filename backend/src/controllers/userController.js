import User from '../models/User.js'

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: null,
      })
    }
    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: null,
      })
    }
    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { name, phone, email } = req.body
    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (email !== undefined) updateData.email = email

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password')
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const uploadProfileImage = async (req, res) => {
  try {
    console.log("=== BACKEND: uploadProfileImage ===")
    console.log("REQ BODY:", req.body)
    console.log("REQ FILE:", req.file)
    console.log("REQ FILES:", req.files)
    console.log("AUTH USER:", req.user)
    console.log("REQ HEADERS:", req.headers['content-type'])
    
    if (!req.file) {
      console.log("ERROR: No file uploaded - req.file is undefined")
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        error: null,
      })
    }

    console.log("File received:", req.file)
    console.log("File destination:", req.file.destination)
    console.log("File filename:", req.file.filename)
    console.log("File path:", req.file.path)

    const imageUrl = `/uploads/profiles/${req.file.filename}`
    console.log("Saving image URL to DB:", imageUrl)
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true }
    ).select('-password')

    console.log("UPDATED USER:", user)
    console.log("User profileImage:", user?.profileImage)

    res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      data: user,
    })
  } catch (error) {
    console.error("=== BACKEND ERROR ===")
    console.error("Error:", error)
    console.error("Error message:", error.message)
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getCitizens = async (req, res) => {
  try {
    const users = await User.find({ role: 'CITIZEN' }).select('-password')
    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const createCitizen = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and phone are required',
        error: null,
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        error: null,
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'CITIZEN',
    })

    res.status(201).json({
      success: true,
      message: 'Citizen created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}
export const getOrganizations = async (req, res) => {
  try {
    const users = await User.find({ role: 'ORGANIZATION' }).select('-password')
    res.status(200).json({
      success: true,
      data: users,
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
    const { name, email, password, phone } = req.body

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and phone are required',
        error: null,
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        error: null,
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'ORGANIZATION',
    })

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const getMembers = async (req, res) => {
  try {
    const users = await User.find({ role: 'MEMBER' }).select('-password')
    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const createMember = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and phone are required',
        error: null,
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        error: null,
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'MEMBER',
    })

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}
export const getResponders = async (req, res) => {
  try {
    const users = await User.find({ role: 'RESPONDER' }).select('-password')
    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const createResponder = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and phone are required',
        error: null,
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        error: null,
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'RESPONDER',
    })

    res.status(201).json({
      success: true,
      message: 'Responder created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: null,
      })
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}
export const updateUserStatus = async (req, res) => {
  try {
    const { isSuspended } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { isSuspended }, { new: true }).select('-password')
    res.status(200).json({
      success: true,
      message: 'User status updated',
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: null,
    })
  }
}
