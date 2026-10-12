import Scholarship from "../models/Scholarship.js";

export const buildScholarshipFilter = (
  params = {}
) => {
  const filter = {
    isActive: true,
  };

  const {
    category,
    educationLevel,
    state,
    minAmount,
    maxAmount,
    deadline,
    search,
  } = params;

  if (category) {
    filter.category = {
      $in: [category],
    };
  }

  if (educationLevel) {
    filter.educationLevel = {
      $in: [educationLevel],
    };
  }

  if (state) {
    filter.$or = [
      {
        state: {
          $in: [state],
        },
      },
      {
        state: {
          $size: 0,
        },
      },
    ];
  }

  if (minAmount !== undefined && minAmount !== "") {
    filter.amount = {
      ...(filter.amount || {}),
      $gte: Number(minAmount),
    };
  }

  if (maxAmount !== undefined && maxAmount !== "") {
    filter.amount = {
      ...(filter.amount || {}),
      $lte: Number(maxAmount),
    };
  }

  if (deadline && deadline !== "all") {
    const days = Number(deadline);

    if (!Number.isNaN(days)) {
      const date = new Date();

      date.setDate(date.getDate() + days);

      filter.deadline = {
        $gte: new Date(),
        $lte: date,
      };
    }
  }

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  return filter;
};

export const getScholarshipsService = async (
  params = {}
) => {
  const page = Math.max(
    Number(params.page) || 1,
    1
  );

  const limit = Math.min(
    Number(params.limit) || 12,
    50
  );

  const skip = (page - 1) * limit;

  const filter = buildScholarshipFilter(params);

  const [scholarships, total] =
    await Promise.all([
      Scholarship.find(filter)
        .sort({
          featured: -1,
          deadline: 1,
        })
        .skip(skip)
        .limit(limit),

      Scholarship.countDocuments(filter),
    ]);

  return {
    scholarships,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};