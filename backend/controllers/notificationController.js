import Notification from "../models/Notification.js";
import { successResponse } from "../utils/response.js";

export const getNotifications = async (
  req,
  res
) => {
  const notifications =
    await Notification.find({
      user: req.user._id,
    })
      .sort({
        createdAt: -1,
      })
      .limit(100);

  return successResponse(
    res,
    notifications,
    "Notifications retrieved."
  );
};

export const markAsRead = async (
  req,
  res
) => {
  const notification =
    await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        read: true,
      },
      {
        new: true,
      }
    );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found.",
    });
  }

  return successResponse(
    res,
    notification,
    "Notification marked as read."
  );
};

export const markAllAsRead = async (
  req,
  res
) => {
  await Notification.updateMany(
    {
      user: req.user._id,
      read: false,
    },
    {
      read: true,
    }
  );

  return successResponse(
    res,
    null,
    "All notifications marked as read."
  );
};

export const deleteNotification =
  async (req, res) => {
    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return successResponse(
      res,
      null,
      "Notification deleted."
    );
  };

export const clearAllNotifications =
  async (req, res) => {
    await Notification.deleteMany({
      user: req.user._id,
    });

    return successResponse(
      res,
      null,
      "All notifications deleted."
    );
  };

export const getUnreadCount = async (
  req,
  res
) => {
  const count =
    await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

  return successResponse(
    res,
    {
      count,
      unreadCount: count,
    },
    "Unread notification count retrieved."
  );
};