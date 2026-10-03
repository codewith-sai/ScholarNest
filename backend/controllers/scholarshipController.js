import Scholarship from "../models/Scholarship.js";
import { successResponse } from "../utils/response.js";
import {
  getScholarshipsService,
  buildScholarshipFilter,
} from "../services/scholarshipService.js";
import { getRecommendedScholarships } from "../services/recommendationService.js";

export const getScholarships = async (
  req,
  res
) => {
  const result =
    await getScholarshipsService(req.query);

  return successResponse(
    res,
    result.scholarships,
    "Scholarships retrieved."
  );
};

export const getScholarshipById = async (
  req,
  res
) => {
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

  return successResponse(
    res,
    scholarship,
    "Scholarship retrieved."
  );
};

export const searchScholarships = async (
  req,
  res
) => {
  const filter = buildScholarshipFilter({
    ...req.query,
    search:
      req.query.query ||
      req.query.search ||
      "",
  });

  const scholarships =
    await Scholarship.find(filter)
      .sort({
        featured: -1,
        deadline: 1,
      })
      .limit(50);

  return successResponse(
    res,
    scholarships,
    "Search completed."
  );
};

export const saveScholarship = async (
  req,
  res
) => {
  const scholarship =
    await Scholarship.findById(req.params.id);

  if (!scholarship) {
    return res.status(404).json({
      success: false,
      message: "Scholarship not found.",
    });
  }

  const alreadySaved =
    req.user.savedScholarships.some(
      (id) =>
        id.toString() ===
        scholarship._id.toString()
    );

  if (!alreadySaved) {
    req.user.savedScholarships.push(
      scholarship._id
    );

    await req.user.save();
  }

  return successResponse(
    res,
    {
      saved: true,
      scholarshipId: scholarship._id,
    },
    "Scholarship saved."
  );
};

export const removeSavedScholarship =
  async (req, res) => {
    req.user.savedScholarships =
      req.user.savedScholarships.filter(
        (id) =>
          id.toString() !==
          req.params.id.toString()
      );

    await req.user.save();

    return successResponse(
      res,
      {
        saved: false,
        scholarshipId: req.params.id,
      },
      "Scholarship removed from saved list."
    );
  };

export const getSavedScholarships =
  async (req, res) => {
    const user = await req.user.populate(
      "savedScholarships"
    );

    const scholarships =
      user.savedScholarships.filter(
        (scholarship) =>
          scholarship && scholarship.isActive
      );

    return successResponse(
      res,
      scholarships,
      "Saved scholarships retrieved."
    );
  };

export const getRecommendations =
  async (req, res) => {
    const scholarships =
      await getRecommendedScholarships(
        req.user,
        Number(req.query.limit) || 6
      );

    return successResponse(
      res,
      scholarships,
      "Recommendations retrieved."
    );
  };