import { Router } from 'express';
import {
  getAllScholarships,
  getEligibleScholarships,
  evaluateAnonymous,
  getScholarshipById,
  saveScholarship,
  unsaveScholarship,
  getSavedScholarships
} from '../controllers/scholarshipController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAllScholarships);
router.post('/evaluate-anonymous', evaluateAnonymous);

// Specific student routes (MUST be before /:id)
router.get('/eligible', requireAuth, requireRole('STUDENT'), getEligibleScholarships);
router.get('/details/:id', getScholarshipById);

// Parameterized routes
router.get('/:id', getScholarshipById);
router.post('/:id/save', requireAuth, requireRole('STUDENT'), saveScholarship);
router.delete('/:id/save', requireAuth, requireRole('STUDENT'), unsaveScholarship);

export default router;

