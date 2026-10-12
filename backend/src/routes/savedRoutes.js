import { Router } from 'express';
import {
  getSavedScholarships,
  saveScholarship,
  unsaveScholarship
} from '../controllers/scholarshipController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('STUDENT'));

router.get('/', getSavedScholarships);
router.post('/:id', saveScholarship);
router.delete('/:id', unsaveScholarship);
router.post('/', saveScholarship);
router.delete('/', unsaveScholarship);

export default router;

