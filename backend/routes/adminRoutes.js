import express from "express";

import {
  getDashboardStats,

  // Scholarships
  createScholarship,
  updateScholarship,
  deleteScholarship,

  // Students
  getStudents,
  getStudentById,

  // Documents
  getDocuments,
  updateDocumentVerification,

  // Applications
  getApplications,
  updateApplicationStatus,

  // Notifications
  getAdminNotifications,
} from "../controllers/adminController.js";

import {
  requireAuth,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================================================
// DASHBOARD
// =========================================================

router.get(
  "/dashboard",
  requireAuth,
  requireAdmin,
  getDashboardStats
);

// =========================================================
// SCHOLARSHIPS
// =========================================================

// Create scholarship
router.post(
  "/scholarships",
  requireAuth,
  requireAdmin,
  createScholarship
);

// Update scholarship
router.put(
  "/scholarships/:id",
  requireAuth,
  requireAdmin,
  updateScholarship
);

// Delete scholarship
router.delete(
  "/scholarships/:id",
  requireAuth,
  requireAdmin,
  deleteScholarship
);

// =========================================================
// STUDENTS
// =========================================================

// Get all students
router.get(
  "/students",
  requireAuth,
  requireAdmin,
  getStudents
);

// Get single student
router.get(
  "/students/:id",
  requireAuth,
  requireAdmin,
  getStudentById
);

// =========================================================
// DOCUMENTS
// =========================================================

// Get all student documents
router.get(
  "/documents",
  requireAuth,
  requireAdmin,
  getDocuments
);

// Verify / unverify document
router.patch(
  "/documents/:studentId/:documentId/verification",
  requireAuth,
  requireAdmin,
  updateDocumentVerification
);

// =========================================================
// APPLICATIONS
// =========================================================

// Get all applications
router.get(
  "/applications",
  requireAuth,
  requireAdmin,
  getApplications
);

// Update application status
router.patch(
  "/applications/:id/status",
  requireAuth,
  requireAdmin,
  updateApplicationStatus
);

// =========================================================
// NOTIFICATIONS
// =========================================================

// Get admin notifications
router.get(
  "/notifications",
  requireAuth,
  requireAdmin,
  getAdminNotifications
);

export default router;