import Notification from "../models/Notification.js";

export const createNotification = async ({
  userId,
  type = "info",
  title,
  message,
  link = "",
}) => {
  const notification =
    await Notification.create({
      user: userId,
      type,
      title,
      message,
      link,
    });

  return notification;
};