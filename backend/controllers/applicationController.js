import Application from "../models/Application.js";
import Scholarship from "../models/Scholarship.js";
import { successResponse } from "../utils/response.js";
import { generateApplicationId } from "../utils/generateId.js";
import { createNotification } from "../services/notificationService.js";

export const getApplications = async (
  req,
  res
) => {
  const page = Math.max(
    Number(req.query.page) || 1,
    1
  );

  const limit = Math.min(
    Number(req.query.limit) || 20,
    50
  );

  const skip = (page - 1) * limit;

  const [applications, total] =
    await Promise.all([
      Application.find({
        user: req.user._id,
      })
        .populate("scholarship")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Application.countDocuments({
        user: req.user._id,
      }),
    ]);

  return successResponse(
    res,
    applications,
    "Applications retrieved."
  );
};

export const getApplicationById =
  async (req, res) => {
    const application =
      await Application.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).populate("scholarship");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return successResponse(
      res,
      application,
      "Application retrieved."
    );
  };

export const applyForScholarship =
  async (req, res) => {
    const scholarship =
      await Scholarship.findOne({
        _id: req.params.id,
        isActive: true,
      });

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found.",
      });
    }

    if (
      new Date(scholarship.deadline) <
      new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The application deadline has passed.",
      });
    }

    const existing =
      await Application.findOne({
        user: req.user._id,
        scholarship: scholarship._id,
        status: {
          $nin: ["cancelled", "rejected"],
        },
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "You have already applied for this scholarship.",
        data: existing,
      });
    }

    const application =
      await Application.create({
        applicationId:
          generateApplicationId(),

        user: req.user._id,

        scholarship: scholarship._id,

        amount: scholarship.amount,

        status: "pending",

        progress: 10,

        notes: req.body?.notes || "",
      });

    await createNotification({
      userId: req.user._id,
      type: "application",
      title: "Application submitted",
      message: `Your application for ${scholarship.title} has been submitted.`,
      link: `/applications/${application._id}`,
    });

    const populated =
      await application.populate(
        "scholarship"
      );

    return successResponse(
      res,
      populated,
      "Application submitted successfully.",
      201
    );
  };

export const cancelApplication =
  async (req, res) => {
    const application =
      await Application.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).populate("scholarship");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (
      ["approved", "rejected"].includes(
        application.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This application cannot be cancelled.",
      });
    }

    application.status = "cancelled";
    application.progress = 0;

    await application.save();

    await createNotification({
      userId: req.user._id,
      type: "warning",
      title: "Application cancelled",
      message: `Your application for ${application.scholarship.title} has been cancelled.`,
      link: `/applications/${application._id}`,
    });

    return successResponse(
      res,
      application,
      "Application cancelled."
    );
  };

export const updateApplication =
  async (req, res) => {
    const application =
      await Application.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (req.body.notes !== undefined) {
      application.notes = req.body.notes;
    }

    if (req.body.documents !== undefined) {
      application.documents =
        req.body.documents;
    }

    await application.save();

    return successResponse(
      res,
      application,
      "Application updated."
    );
  };