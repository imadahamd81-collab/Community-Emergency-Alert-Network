import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'
import { getResponders, getNearbyResponders, getResponderById, updateResponderStatus } from '../controllers/responderController.js'

const router = express.Router()

router.get('/', protect, authorize('ADMIN'), getResponders)
router.get('/nearby', protect, getNearbyResponders)
router.get('/:id', protect, getResponderById)
router.patch('/:id/status', protect, authorize('RESPONDER'), updateResponderStatus)

export default router
