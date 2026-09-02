import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'
import { uploadProfile } from '../middleware/uploadMiddleware.js'
import { getUsers, getUserById, getMe, updateUser, uploadProfileImage, updateUserStatus, getResponders, createResponder, deleteUser, getCitizens, createCitizen, getMembers, createMember, getOrganizations, createOrganization } from '../controllers/userController.js'

const router = express.Router()

router.get('/', protect, authorize('ADMIN'), getUsers)
router.get('/responders', protect, authorize('ADMIN', 'ORGANIZATION'), getResponders)
router.post('/responders', protect, authorize('ADMIN', 'ORGANIZATION'), createResponder)
router.get('/citizens', protect, authorize('ADMIN'), getCitizens)
router.post('/citizens', protect, authorize('ADMIN'), createCitizen)
router.get('/members', protect, authorize('ORGANIZATION'), getMembers)
router.post('/members', protect, authorize('ORGANIZATION'), createMember)
router.get('/organizations', protect, authorize('ADMIN'), getOrganizations)
router.post('/organizations', protect, authorize('ADMIN'), createOrganization)
router.get('/me', protect, getMe)
router.get('/:id', protect, getUserById)
router.patch('/me', protect, updateUser)

// Debug middleware for profile-image route
router.post('/me/profile-image', (req, res, next) => {
  console.log("=== ROUTE HIT: /me/profile-image ===")
  console.log("Method:", req.method)
  console.log("Content-Type:", req.headers['content-type'])
  console.log("Authorization:", req.headers?.authorization ? 'Present' : 'Missing')
  next()
}, protect, uploadProfile.single('profilePicture'), uploadProfileImage)

router.patch('/:id/status', protect, authorize('ADMIN'), updateUserStatus)
router.delete('/:id', protect, authorize('ADMIN'), deleteUser)

export default router
