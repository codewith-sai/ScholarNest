import express from "express";

import {
  getProfile,
  updateProfile,
  updateProfileImage,
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  getProfile
);

router.put(
  "/",
  updateProfile
);

router.put(
  "/image",
  upload.single("profileImage"),
  updateProfileImage
);

export default router;