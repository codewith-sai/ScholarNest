import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getNotifications);
router.put('/read-all', requireAuth, markAllAsRead);
router.put('/:id/read', requireAuth, markAsRead);

export default router;

