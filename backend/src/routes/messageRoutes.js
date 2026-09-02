import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getMessages, sendMessage, markAsRead } from '../controllers/messageController.js'

const router = express.Router()

router.get('/:conversationId', protect, getMessages)
router.post('/', protect, sendMessage)
router.post('/:conversationId/read', protect, markAsRead)

export default router
