import User from "../models/User.js";
import { successResponse } from "../utils/response.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("savedScholarships");

  return successResponse(
    res,
    user.toSafeObject(),
    "Profile retrieved."
  );
};

export const updateProfile = async (
  req,
  res
) => {
  const allowedFields = [
    "name",
    "phone",
    "dob",
    "educationLevel",
    "course",
    "branch",
    "institution",
    "currentYear",
    "cgpa",
    "percentage",
    "category",
    "subCategory",
    "domicileState",
    "domicileDistrict",
    "annualIncome",
    "monthlyIncome",
    "incomeSource",
    "financialStatus",
    "state",
    "district",
    "address",
    "disability",
    "disabilityType",
    "emailNotifications",
    "applicationUpdates",
    "scholarshipAlerts",
    "deadlineReminders",
    "marketingEmails",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (updates.email) {
    delete updates.email;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  return successResponse(
    res,
    user.toSafeObject(),
    "Profile updated successfully."
  );
};

export const updateProfileImage = async (
  req,
  res
) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Profile image is required.",
    });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profileImage: imageUrl,
    },
    {
      new: true,
    }
  );

  return successResponse(
    res,
    user.toSafeObject(),
    "Profile image updated."
  );
};