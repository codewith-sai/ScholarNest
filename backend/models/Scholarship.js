import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    provider: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    minAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    deadline: {
      type: Date,
      required: true,
    },

    /* Eligibility */

    educationLevel: [
      {
        type: String,
        trim: true,
      },
    ],

    course: [
      {
        type: String,
        trim: true,
      },
    ],

    branch: [
      {
        type: String,
        trim: true,
      },
    ],

    category: [
      {
        type: String,
        trim: true,
      },
    ],

    state: [
      {
        type: String,
        trim: true,
      },
    ],

    minPercentage: {
      type: Number,
      default: 0,
    },

    minCGPA: {
      type: Number,
      default: 0,
    },

    maxFamilyIncome: {
      type: Number,
      default: null,
    },

    disabilityEligible: {
      type: Boolean,
      default: false,
    },

    eligibility: [
      {
        type: String,
        trim: true,
      },
    ],

    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    documents: [
      {
        type: String,
        trim: true,
      },
    ],

    /* Application */

    applicationUrl: {
      type: String,
      trim: true,
    },

    officialUrl: {
      type: String,
      trim: true,
    },

    applicationInstructions: {
      type: String,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

scholarshipSchema.index({
  title: "text",
  provider: "text",
  description: "text",
  tags: "text",
});

const Scholarship = mongoose.model(
  "Scholarship",
  scholarshipSchema
);

export default Scholarship;