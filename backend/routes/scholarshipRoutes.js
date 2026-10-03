import express from "express";

import {
  getScholarships,
  getScholarshipById,
  searchScholarships,
  saveScholarship,
  removeSavedScholarship,
  getSavedScholarships,
  getRecommendations,
} from "../controllers/scholarshipController.js";

import {
  applyForScholarship,
} from "../controllers/applicationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
 * Public scholarship discovery.
 */
router.get(
  "/",
  getScholarships
);

router.get(
  "/search",
  searchScholarships
);

/*
 * The frontend uses saved scholarships and
 * application functionality after authentication.
 */
router.get(
  "/saved",
  authMiddleware,
  getSavedScholarships
);

router.get(
  "/recommendations",
  authMiddleware,
  getRecommendations
);

router.get(
  "/:id",
  getScholarshipById
);

router.post(
  "/:id/save",
  authMiddleware,
  saveScholarship
);

router.delete(
  "/:id/save",
  authMiddleware,
  removeSavedScholarship
);

router.post(
  "/:id/apply",
  authMiddleware,
  applyForScholarship
);

export default router;