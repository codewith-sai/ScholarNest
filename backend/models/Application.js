import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // =======================================================
    // STUDENT
    // =======================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =======================================================
    // SCHOLARSHIP
    // =======================================================

    scholarship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scholarship",
      required: true,
      index: true,
    },

    // =======================================================
    // APPLICATION STATUS
    // =======================================================

    status: {
      type: String,
      enum: [
        "saved",
        "pending",
        "under_review",
        "approved",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    // =======================================================
    // SUBMITTED DOCUMENTS
    // =======================================================

    documents: [
      {
        name: {
          type: String,
          trim: true,
        },

        url: {
          type: String,
          trim: true,
        },

        type: {
          type: String,
          trim: true,
        },

        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // =======================================================
    // ADMIN REVIEW
    // =======================================================

    adminRemark: {
      type: String,
      trim: true,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from creating
// multiple applications for the same scholarship.
applicationSchema.index(
  {
    user: 1,
    scholarship: 1,
  },
  {
    unique: true,
  }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;