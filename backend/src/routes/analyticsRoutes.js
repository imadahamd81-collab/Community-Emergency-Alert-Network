import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'
import { getOverview, getEmergencyStats, getResponseTimes, getHeatmapData } from '../controllers/analyticsController.js'

const router = express.Router()

router.get('/overview', protect, authorize('ADMIN'), getOverview)
router.get('/emergencies', protect, authorize('ADMIN'), getEmergencyStats)
router.get('/response-times', protect, authorize('ADMIN'), getResponseTimes)
router.get('/heatmap', protect, authorize('ADMIN'), getHeatmapData)

export default router
