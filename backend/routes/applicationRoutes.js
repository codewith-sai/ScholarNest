import express from "express";

import {
  getApplications,
  getApplicationById,
  cancelApplication,
  updateApplication,
} from "../controllers/applicationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  getApplications
);

router.get(
  "/:id",
  getApplicationById
);

router.put(
  "/:id",
  updateApplication
);

router.patch(
  "/:id/cancel",
  cancelApplication
);

export default router;