import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireRole('STUDENT'), getProfile);
router.put('/', requireAuth, requireRole('STUDENT'), updateProfile);

export default router;

