import { Router } from 'express';
import {
  getStats,
  getAllScholarships,
  createScholarship,
  broadcastScholarshipNotification,
  updateScholarship,
  deleteScholarship,
  getAllStudents,
  toggleStudentEnabled
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/stats', getStats);
router.get('/scholarships', getAllScholarships);
router.post('/scholarships', createScholarship);
router.post('/scholarships/:id/notify', broadcastScholarshipNotification);
router.put('/scholarships/:id', updateScholarship);
router.delete('/scholarships/:id', deleteScholarship);

router.get('/students', getAllStudents);
router.put('/students/:id/enabled', toggleStudentEnabled);

router.put('/students/:id/status', toggleStudentEnabled);

export default router;

