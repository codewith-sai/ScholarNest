import { Router } from 'express';
import { getApplications, updateStatus } from '../controllers/applicationController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireRole('STUDENT'), getApplications);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateStatus);

export default router;

