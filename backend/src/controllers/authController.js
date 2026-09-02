import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'
import { sendEmail } from '../services/emailService.js'

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
        error: null,
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'CITIZEN',
    })

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
      error: null,
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: null,
      })
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended',
        error: null,
      })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
      error: null,
    })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email',
        error: null,
      })
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    user.resetPasswordToken = resetToken
    user.resetPasswordExpire = Date.now() + 3600000
    await user.save()

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
    await sendEmail(user.email, 'Password Reset', `Reset your password: ${resetUrl}`)

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      data: { resetToken },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Request failed',
      error: null,
    })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password')

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
        error: null,
      })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Reset failed',
      error: null,
    })
  }
}

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user',
      error: null,
    })
  }
}
