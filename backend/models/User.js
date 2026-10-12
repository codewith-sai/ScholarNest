import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ============================================================
// USER SCHEMA
// ============================================================

const userSchema = new mongoose.Schema(
  {
    // ==========================================================
    // BASIC INFORMATION
    // ==========================================================

    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
    },

    dob: {
      type: Date,
    },

    // ==========================================================
    // ROLE
    // ==========================================================

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
      required: true,
    },

    // ==========================================================
    // ACADEMIC INFORMATION
    // ==========================================================

    educationLevel: {
      type: String,
      trim: true,
    },

    course: {
      type: String,
      trim: true,
    },

    branch: {
      type: String,
      trim: true,
    },

    institution: {
      type: String,
      trim: true,
    },

    currentYear: {
      type: String,
      trim: true,
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },

    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    // ==========================================================
    // CATEGORY INFORMATION
    // ==========================================================

    category: {
      type: String,
      trim: true,
    },

    subCategory: {
      type: String,
      trim: true,
    },

    domicileState: {
      type: String,
      trim: true,
    },

    domicileDistrict: {
      type: String,
      trim: true,
    },

    // ==========================================================
    // FINANCIAL INFORMATION
    // ==========================================================

    annualIncome: {
      type: Number,
      min: 0,
    },

    monthlyIncome: {
      type: Number,
      min: 0,
    },

    incomeSource: {
      type: String,
      trim: true,
    },

    financialStatus: {
      type: String,
      trim: true,
    },

    // ==========================================================
    // ADDRESS
    // ==========================================================

    state: {
      type: String,
      trim: true,
    },

    district: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    // ==========================================================
    // DISABILITY INFORMATION
    // ==========================================================

    disability: {
      type: Boolean,
      default: false,
    },

    disabilityType: {
      type: String,
      trim: true,
    },

    // ==========================================================
    // PROFILE
    // ==========================================================

    profileImage: {
      type: String,
      default: "",
    },

    // ==========================================================
    // DOCUMENTS
    // ==========================================================

    documents: [
      {
        name: {
          type: String,
          trim: true,
        },

        fileName: {
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

        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ==========================================================
    // SAVED SCHOLARSHIPS
    // ==========================================================

    savedScholarships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scholarship",
      },
    ],

    // ==========================================================
    // NOTIFICATION PREFERENCES
    // ==========================================================

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    applicationUpdates: {
      type: Boolean,
      default: true,
    },

    scholarshipAlerts: {
      type: Boolean,
      default: true,
    },

    deadlineReminders: {
      type: Boolean,
      default: true,
    },

    marketingEmails: {
      type: Boolean,
      default: false,
    },

    // ==========================================================
    // ACCOUNT STATUS
    // ==========================================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// HASH PASSWORD BEFORE SAVE
// ============================================================
//
// IMPORTANT:
// Do NOT use next() here because this middleware is async.
// Returning/throwing from an async middleware is enough for
// Mongoose to continue or handle the error.
//

userSchema.pre("save", async function () {
  // Password has not changed.
  // No need to hash it again.
  if (!this.isModified("password")) {
    return;
  }

  // Generate salt
  const salt = await bcrypt.genSalt(12);

  // Hash password
  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

// ============================================================
// COMPARE PASSWORD
// ============================================================

userSchema.methods.comparePassword = async function (
  password
) {
  return bcrypt.compare(
    password,
    this.password
  );
};

// ============================================================
// SAFE USER OBJECT
// ============================================================

userSchema.methods.toSafeObject = function () {
  const user = this.toObject();

  // Never send password to frontend
  delete user.password;

  // Remove mongoose internal field
  delete user.__v;

  return user;
};

// ============================================================
// CREATE MODEL
// ============================================================

const User = mongoose.model(
  "User",
  userSchema
);

export default User;