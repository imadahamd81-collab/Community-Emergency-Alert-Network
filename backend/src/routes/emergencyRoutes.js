import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'
import { upload } from '../middleware/uploadMiddleware.js'
import {
  createEmergencyHandler,
  getEmergenciesHandler,
  getEmergencyByIdHandler,
  updateEmergencyHandler,
  verifyEmergencyHandler,
  rejectEmergencyHandler,
  assignEmergencyHandler,
  acceptEmergencyHandler,
  updateEmergencyStatusHandler,
  resolveEmergencyHandler,
} from '../controllers/emergencyController.js'

const router = express.Router()

router.post('/', protect, authorize('CITIZEN', 'ADMIN'), upload.array('photos', 5), createEmergencyHandler)
router.get('/', protect, getEmergenciesHandler)
router.get('/:id', protect, getEmergencyByIdHandler)
router.patch('/:id', protect, updateEmergencyHandler)
router.post('/:id/verify', protect, authorize('ADMIN'), verifyEmergencyHandler)
router.post('/:id/assign', protect, authorize('ADMIN'), assignEmergencyHandler)
router.post('/:id/accept', protect, authorize('RESPONDER'), acceptEmergencyHandler)
router.post('/:id/status', protect, authorize('RESPONDER', 'ADMIN'), updateEmergencyStatusHandler)
router.post('/:id/resolve', protect, authorize('RESPONDER', 'ADMIN'), resolveEmergencyHandler)
router.post('/:id/reject', protect, authorize('ADMIN'), rejectEmergencyHandler)

export default router
