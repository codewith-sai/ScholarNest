import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { successResponse } from "../utils/response.js";

const userIsParticipant = (
  conversation,
  userId
) => {
  return conversation.participants.some(
    (participant) =>
      participant._id?.toString() ===
        userId.toString() ||
      participant.toString() ===
        userId.toString()
  );
};

export const getConversations = async (
  req,
  res
) => {
  const conversations =
    await Conversation.find({
      participants: req.user._id,
    })
      .populate(
        "participants",
        "name email profileImage role"
      )
      .sort({
        lastMessageAt: -1,
        updatedAt: -1,
      });

  const result = await Promise.all(
    conversations.map(async (conversation) => {
      const unreadCount =
        await Message.countDocuments({
          conversation: conversation._id,
          sender: {
            $ne: req.user._id,
          },
          readBy: {
            $ne: req.user._id,
          },
        });

      const otherParticipant =
        conversation.participants.find(
          (participant) =>
            participant._id.toString() !==
            req.user._id.toString()
        );

      return {
        ...conversation.toObject(),

        name:
          otherParticipant?.name ||
          "Conversation",

        participant: otherParticipant,

        unreadCount,
      };
    })
  );

  return successResponse(
    res,
    result,
    "Conversations retrieved."
  );
};

export const createConversation =
  async (req, res) => {
    const {
      participantId,
      initialMessage,
    } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: "Participant ID is required.",
      });
    }

    if (
      participantId.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot create a conversation with yourself.",
      });
    }

    const participant =
      await User.findById(participantId);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found.",
      });
    }

    let conversation =
      await Conversation.findOne({
        participants: {
          $all: [
            req.user._id,
            participantId,
          ],
        },
      });

    if (!conversation) {
      conversation =
        await Conversation.create({
          participants: [
            req.user._id,
            participantId,
          ],
        });
    }

    if (initialMessage?.trim()) {
      const message = await Message.create({
        conversation:
          conversation._id,
        sender: req.user._id,
        content:
          initialMessage.trim(),
        readBy: [req.user._id],
      });

      conversation.lastMessage =
        message.content;

      conversation.lastMessageAt =
        message.createdAt;

      await conversation.save();
    }

    await conversation.populate(
      "participants",
      "name email profileImage role"
    );

    return successResponse(
      res,
      conversation,
      "Conversation created.",
      201
    );
  };

export const getMessages = async (
  req,
  res
) => {
  const conversation =
    await Conversation.findById(
      req.params.id
    );

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found.",
    });
  }

  if (
    !userIsParticipant(
      conversation,
      req.user._id
    )
  ) {
    return res.status(403).json({
      success: false,
      message:
        "You are not a participant in this conversation.",
    });
  }

  const messages =
    await Message.find({
      conversation: conversation._id,
    })
      .populate(
        "sender",
        "name email profileImage role"
      )
      .sort({
        createdAt: 1,
      });

  return successResponse(
    res,
    messages,
    "Messages retrieved."
  );
};

export const sendMessage = async (
  req,
  res
) => {
  const conversation =
    await Conversation.findById(
      req.params.id
    );

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found.",
    });
  }

  if (
    !userIsParticipant(
      conversation,
      req.user._id
    )
  ) {
    return res.status(403).json({
      success: false,
      message:
        "You are not a participant in this conversation.",
    });
  }

  const content =
    req.body?.content?.trim() || "";

  if (!content && !req.file) {
    return res.status(400).json({
      success: false,
      message:
        "Message content or attachment is required.",
    });
  }

  const attachment = req.file
    ? {
        name: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        type: req.file.mimetype,
      }
    : undefined;

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    content,
    attachment,
    readBy: [req.user._id],
  });

  conversation.lastMessage =
    content ||
    attachment?.name ||
    "Attachment";

  conversation.lastMessageAt =
    message.createdAt;

  await conversation.save();

  await message.populate(
    "sender",
    "name email profileImage role"
  );

  return successResponse(
    res,
    message,
    "Message sent.",
    201
  );
};

export const markMessagesAsRead =
  async (req, res) => {
    const conversation =
      await Conversation.findById(
        req.params.id
      );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    if (
      !userIsParticipant(
        conversation,
        req.user._id
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a participant in this conversation.",
      });
    }

    await Message.updateMany(
      {
        conversation: conversation._id,
        readBy: {
          $ne: req.user._id,
        },
      },
      {
        $addToSet: {
          readBy: req.user._id,
        },
      }
    );

    return successResponse(
      res,
      null,
      "Messages marked as read."
    );
  };

export const deleteMessage = async (
  req,
  res
) => {
  const message =
    await Message.findOne({
      _id: req.params.id,
      sender: req.user._id,
    });

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Message not found.",
    });
  }

  await message.deleteOne();

  return successResponse(
    res,
    null,
    "Message deleted."
  );
};