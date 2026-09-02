import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'
import { getOrganizations, createOrganization, getOrganizationById, updateOrganization, deleteOrganization } from '../controllers/organizationController.js'

const router = express.Router()

router.get('/', protect, getOrganizations)
router.post('/', protect, authorize('ADMIN', 'ORGANIZATION'), createOrganization)
router.get('/:id', protect, getOrganizationById)
router.patch('/:id', protect, authorize('ADMIN', 'ORGANIZATION'), updateOrganization)
router.delete('/:id', protect, authorize('ADMIN'), deleteOrganization)

export default router
