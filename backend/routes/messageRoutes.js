import express from "express";

import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  deleteMessage,
} from "../controllers/messageController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/conversations",
  getConversations
);

router.post(
  "/conversations",
  createConversation
);

router.get(
  "/conversations/:id",
  getMessages
);

router.post(
  "/conversations/:id",
  upload.single("attachment"),
  sendMessage
);

router.patch(
  "/conversations/:id/read",
  markMessagesAsRead
);

router.delete(
  "/:id",
  deleteMessage
);

export default router;