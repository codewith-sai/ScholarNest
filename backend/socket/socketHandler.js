import jwt from "jsonwebtoken";
import User from "../models/User.js";

const connectedUsers = new Map();

export const initializeSocket = (
  io
) => {
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.cookie
          ?.split(";")
          .find((cookie) =>
            cookie.trim().startsWith("token=")
          )
          ?.split("=")[1];

      if (!token) {
        return next(
          new Error("Authentication required.")
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(
        decoded.userId
      );

      if (!user) {
        return next(
          new Error("User not found.")
        );
      }

      socket.user = user;

      next();
    } catch (error) {
      next(
        new Error(
          "Socket authentication failed."
        )
      );
    }
  });

  io.on("connection", (socket) => {
    const userId =
      socket.user._id.toString();

    connectedUsers.set(
      userId,
      socket.id
    );

    socket.join(`user:${userId}`);

    console.log(
      `Socket connected: ${socket.user.email}`
    );

    socket.on(
      "joinConversation",
      (conversationId) => {
        if (conversationId) {
          socket.join(
            `conversation:${conversationId}`
          );
        }
      }
    );

    socket.on(
      "leaveConversation",
      (conversationId) => {
        if (conversationId) {
          socket.leave(
            `conversation:${conversationId}`
          );
        }
      }
    );

    socket.on("disconnect", () => {
      connectedUsers.delete(userId);

      console.log(
        `Socket disconnected: ${socket.user.email}`
      );
    });
  });
};

export const getConnectedUserSocket = (
  userId
) => {
  return connectedUsers.get(
    userId.toString()
  );
};