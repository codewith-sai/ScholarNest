import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      // Student receiving notification
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        enum: [
          "NEW_SCHOLARSHIP",
          "SCHOLARSHIP_MATCH",
          "DEADLINE",
          "DEADLINE_APPROACHING",
          "APPLICATION",
          "APPLICATION_STATUS",
          "PROFILE",
          "GENERAL",
        ],
        default: "GENERAL",
      },

      scholarship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scholarship",
        default: null,
      },

      read: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

const Notification =
  mongoose.model(
    "Notification",
    notificationSchema
  );

export default Notification;