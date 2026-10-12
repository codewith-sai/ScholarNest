import express from "express";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
} from "../controllers/notificationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  getNotifications
);

router.get(
  "/unread-count",
  getUnreadCount
);

router.patch(
  "/:id/read",
  markAsRead
);

router.patch(
  "/read-all",
  markAllAsRead
);

router.delete(
  "/:id",
  deleteNotification
);

router.delete(
  "/",
  clearAllNotifications
);

export default router;