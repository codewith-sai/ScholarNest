import User from "../models/User.js";
import Scholarship from "../models/Scholarship.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

// =========================================================
// HELPER FUNCTIONS
// =========================================================

const toBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
};

const cleanNumber = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const number = Number(value);

  return Number.isNaN(number)
    ? undefined
    : number;
};

// =========================================================
// DASHBOARD
// =========================================================

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalScholarships,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
    ] = await Promise.all([
      User.countDocuments({
        role: "student",
      }),

      Scholarship.countDocuments(),

      Application.countDocuments(),

      Application.countDocuments({
        status: "pending",
      }),

      Application.countDocuments({
        status: "approved",
      }),

      Application.countDocuments({
        status: "rejected",
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalScholarships,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load admin dashboard.",
    });
  }
};

// =========================================================
// CREATE SCHOLARSHIP
// =========================================================

export const createScholarship = async (req, res) => {
  try {
    const {
      title,
      provider,
      description,
      amount,
      deadline,
      educationLevel,
      category,
      state,
      course,
      branch,
      maxIncome,
      minPercentage,
      minCGPA,
      disability,
      active,
    } = req.body;

    // -------------------------------------------------------
    // Validation
    // -------------------------------------------------------

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Scholarship title is required.",
      });
    }

    if (!provider?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Scholarship provider is required.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Scholarship description is required.",
      });
    }

    if (!deadline) {
      return res.status(400).json({
        success: false,
        message:
          "Scholarship deadline is required.",
      });
    }

    // -------------------------------------------------------
    // Create Scholarship
    // -------------------------------------------------------

    const scholarship =
      await Scholarship.create({
        title: title.trim(),

        provider: provider.trim(),

        description:
          description.trim(),

        amount:
          cleanNumber(amount),

        deadline,

        educationLevel:
          educationLevel?.trim() ||
          undefined,

        category:
          category?.trim() ||
          undefined,

        state:
          state?.trim() ||
          undefined,

        course:
          course?.trim() ||
          undefined,

        branch:
          branch?.trim() ||
          undefined,

        maxIncome:
          cleanNumber(maxIncome),

        minPercentage:
          cleanNumber(minPercentage),

        minCGPA:
          cleanNumber(minCGPA),

        disability:
          toBoolean(disability),

        active:
          toBoolean(active, true),

        createdBy:
          req.user._id,
      });

    // =======================================================
    // FIND ACTIVE STUDENTS
    // =======================================================

    const students =
      await User.find({
        role: "student",
        isActive: true,
      }).lean();

    // =======================================================
    // SCHOLARSHIP MATCHING
    // =======================================================

    const eligibleStudents =
      students.filter((student) => {
        const profile =
          student.profile ||
          student;

        // Education level
        if (
          educationLevel &&
          profile.educationLevel &&
          profile.educationLevel
            .toLowerCase() !==
            educationLevel.toLowerCase()
        ) {
          return false;
        }

        // Category
        if (
          category &&
          profile.category &&
          profile.category
            .toLowerCase() !==
            category.toLowerCase()
        ) {
          return false;
        }

        // State
        if (
          state &&
          profile.state &&
          profile.state
            .toLowerCase() !==
            state.toLowerCase()
        ) {
          return false;
        }

        // Course
        if (
          course &&
          profile.course &&
          profile.course
            .toLowerCase() !==
            course.toLowerCase()
        ) {
          return false;
        }

        // Branch
        if (
          branch &&
          profile.branch &&
          profile.branch
            .toLowerCase() !==
            branch.toLowerCase()
        ) {
          return false;
        }

        // Annual income
        if (
          maxIncome !== undefined &&
          maxIncome !== "" &&
          profile.annualIncome !==
            undefined &&
          Number(
            profile.annualIncome
          ) > Number(maxIncome)
        ) {
          return false;
        }

        // Percentage
        if (
          minPercentage !== undefined &&
          minPercentage !== "" &&
          profile.percentage !==
            undefined &&
          Number(
            profile.percentage
          ) < Number(minPercentage)
        ) {
          return false;
        }

        // CGPA
        if (
          minCGPA !== undefined &&
          minCGPA !== "" &&
          profile.cgpa !== undefined &&
          Number(profile.cgpa) <
            Number(minCGPA)
        ) {
          return false;
        }

        // Disability
        if (
          toBoolean(disability) &&
          profile.disability !== true
        ) {
          return false;
        }

        return true;
      });

    // =======================================================
    // CREATE NOTIFICATIONS
    // =======================================================

    if (eligibleStudents.length > 0) {
      const notifications =
        eligibleStudents.map(
          (student) => ({
            user: student._id,

            title:
              "New scholarship match",

            message:
              `${scholarship.title} has been added and matches your profile.`,

            type:
              "NEW_SCHOLARSHIP",

            scholarship:
              scholarship._id,

            read: false,
          })
        );

      await Notification.insertMany(
        notifications
      );
    }

    // =======================================================
    // RESPONSE
    // =======================================================

    return res.status(201).json({
      success: true,
      message:
        "Scholarship created successfully.",
      data: {
        scholarship,
        notifiedStudents:
          eligibleStudents.length,
      },
    });
  } catch (error) {
    console.error(
      "CREATE SCHOLARSHIP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create scholarship.",
    });
  }
};

// =========================================================
// UPDATE SCHOLARSHIP
// =========================================================

export const updateScholarship = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      title,
      provider,
      description,
      amount,
      deadline,
      educationLevel,
      category,
      state,
      course,
      branch,
      maxIncome,
      minPercentage,
      minCGPA,
      disability,
      active,
    } = req.body;

    // -------------------------------------------------------
    // Find scholarship
    // -------------------------------------------------------

    const scholarship =
      await Scholarship.findById(id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message:
          "Scholarship not found.",
      });
    }

    // -------------------------------------------------------
    // Validation
    // -------------------------------------------------------

    if (
      title !== undefined &&
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Scholarship title is required.",
      });
    }

    if (
      provider !== undefined &&
      !provider.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Scholarship provider is required.",
      });
    }

    if (
      description !== undefined &&
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Scholarship description is required.",
      });
    }

    if (
      deadline !== undefined &&
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Scholarship deadline is required.",
      });
    }

    // -------------------------------------------------------
    // Text fields
    // -------------------------------------------------------

    if (title !== undefined) {
      scholarship.title =
        title.trim();
    }

    if (provider !== undefined) {
      scholarship.provider =
        provider.trim();
    }

    if (description !== undefined) {
      scholarship.description =
        description.trim();
    }

    if (deadline !== undefined) {
      scholarship.deadline =
        deadline;
    }

    if (
      educationLevel !== undefined
    ) {
      scholarship.educationLevel =
        educationLevel?.trim() ||
        undefined;
    }

    if (category !== undefined) {
      scholarship.category =
        category?.trim() ||
        undefined;
    }

    if (state !== undefined) {
      scholarship.state =
        state?.trim() ||
        undefined;
    }

    if (course !== undefined) {
      scholarship.course =
        course?.trim() ||
        undefined;
    }

    if (branch !== undefined) {
      scholarship.branch =
        branch?.trim() ||
        undefined;
    }

    // -------------------------------------------------------
    // Numeric fields
    // -------------------------------------------------------

    if (amount !== undefined) {
      scholarship.amount =
        cleanNumber(amount);
    }

    if (maxIncome !== undefined) {
      scholarship.maxIncome =
        cleanNumber(maxIncome);
    }

    if (
      minPercentage !== undefined
    ) {
      scholarship.minPercentage =
        cleanNumber(minPercentage);
    }

    if (minCGPA !== undefined) {
      scholarship.minCGPA =
        cleanNumber(minCGPA);
    }

    // -------------------------------------------------------
    // Boolean fields
    // -------------------------------------------------------

    if (disability !== undefined) {
      scholarship.disability =
        toBoolean(disability);
    }

    if (active !== undefined) {
      scholarship.active =
        toBoolean(active);
    }

    // -------------------------------------------------------
    // Save
    // -------------------------------------------------------

    await scholarship.save();

    return res.status(200).json({
      success: true,
      message:
        "Scholarship updated successfully.",
      data: {
        scholarship,
      },
    });
  } catch (error) {
    console.error(
      "UPDATE SCHOLARSHIP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update scholarship.",
    });
  }
};

// =========================================================
// DELETE SCHOLARSHIP
// =========================================================

export const deleteScholarship = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const scholarship =
      await Scholarship.findById(id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message:
          "Scholarship not found.",
      });
    }

    // Delete scholarship
    await Scholarship.findByIdAndDelete(id);

    // Delete related notifications
    await Notification.deleteMany({
      scholarship: id,
    });

    return res.status(200).json({
      success: true,
      message:
        "Scholarship deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE SCHOLARSHIP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete scholarship.",
    });
  }
};

// =========================================================
// GET ALL STUDENTS
// =========================================================

export const getStudents = async (
  req,
  res
) => {
  try {
    const students =
      await User.find({
        role: "student",
      })
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json({
      success: true,
      data: {
        students,
      },
    });
  } catch (error) {
    console.error(
      "GET STUDENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load students.",
    });
  }
};

// =========================================================
// GET SINGLE STUDENT
// =========================================================

export const getStudentById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const student =
      await User.findOne({
        _id: id,
        role: "student",
      })
        .select("-password")
        .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found.",
      });
    }

    let applications = [];

    try {
      applications =
        await Application.find({
          user: student._id,
        })
          .populate(
            "scholarship",
            "title provider amount deadline"
          )
          .sort({
            createdAt: -1,
          })
          .lean();
    } catch (applicationError) {
      console.error(
        "STUDENT APPLICATION LOAD ERROR:",
        applicationError
      );
    }

    return res.status(200).json({
      success: true,
      data: {
        student: {
          ...student,
          applications,
          documents:
            student.documents || [],
        },
      },
    });
  } catch (error) {
    console.error(
      "GET STUDENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load student.",
    });
  }
};

// =========================================================
// GET ALL DOCUMENTS
// =========================================================

export const getDocuments = async (
  req,
  res
) => {
  try {
    const students =
      await User.find({
        role: "student",
      })
        .select(
          "name email documents"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    const documents = [];

    students.forEach((student) => {
      if (
        !Array.isArray(
          student.documents
        )
      ) {
        return;
      }

      student.documents.forEach(
        (document) => {
          documents.push({
            _id: document._id,

            name:
              document.name ||
              document.fileName ||
              "Document",

            fileName:
              document.fileName || "",

            url:
              document.url || "",

            type:
              document.type ||
              "Unknown",

            verified:
              document.verified ||
              false,

            uploadedAt:
              document.uploadedAt ||
              null,

            studentId:
              student._id,

            studentName:
              student.name ||
              "Unknown",

            studentEmail:
              student.email || "",
          });
        }
      );
    });

    // Latest documents first
    documents.sort((a, b) => {
      const dateA = a.uploadedAt
        ? new Date(
            a.uploadedAt
          ).getTime()
        : 0;

      const dateB = b.uploadedAt
        ? new Date(
            b.uploadedAt
          ).getTime()
        : 0;

      return dateB - dateA;
    });

    return res.status(200).json({
      success: true,
      data: {
        documents,
        totalDocuments:
          documents.length,
      },
    });
  } catch (error) {
    console.error(
      "GET DOCUMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load student documents.",
    });
  }
};

// =========================================================
// UPDATE DOCUMENT VERIFICATION
// =========================================================

export const updateDocumentVerification =
  async (req, res) => {
    try {
      const {
        studentId,
        documentId,
      } = req.params;

      const { verified } =
        req.body;

      const student =
        await User.findOne({
          _id: studentId,
          role: "student",
        });

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found.",
        });
      }

      const document =
        student.documents.id(
          documentId
        );

      if (!document) {
        return res.status(404).json({
          success: false,
          message:
            "Document not found.",
        });
      }

      document.verified =
        toBoolean(verified);

      await student.save();

      return res.status(200).json({
        success: true,
        message:
          document.verified
            ? "Document verified successfully."
            : "Document verification removed.",
        data: {
          document,
        },
      });
    } catch (error) {
      console.error(
        "UPDATE DOCUMENT VERIFICATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update document verification.",
      });
    }
  };

// =========================================================
// GET APPLICATIONS
// =========================================================

export const getApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find()
        .populate(
          "user",
          "name email role"
        )
        .populate(
          "scholarship",
          "title provider amount deadline"
        )
        .populate(
          "reviewedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      data: {
        applications,
      },
    });
  } catch (error) {
    console.error(
      "GET APPLICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load applications.",
    });
  }
};

// =========================================================
// UPDATE APPLICATION STATUS
// =========================================================

export const updateApplicationStatus =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        status,
        adminRemark,
      } = req.body;

      const allowedStatuses = [
        "saved",
        "pending",
        "under_review",
        "approved",
        "rejected",
      ];

      if (!status) {
        return res.status(400).json({
          success: false,
          message:
            "Application status is required.",
        });
      }

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid status. Allowed values: ${allowedStatuses.join(
              ", "
            )}`,
        });
      }

      const application =
        await Application.findById(
          id
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found.",
        });
      }

      // Update status
      application.status =
        status;

      // Update admin remark
      if (
        adminRemark !== undefined
      ) {
        application.adminRemark =
          String(
            adminRemark
          ).trim();
      }

      // Store admin reviewer
      application.reviewedBy =
        req.user._id;

      application.reviewedAt =
        new Date();

      await application.save();

      // Get updated application
      const updatedApplication =
        await Application.findById(
          application._id
        )
          .populate(
            "user",
            "name email"
          )
          .populate(
            "scholarship",
            "title provider amount deadline"
          )
          .populate(
            "reviewedBy",
            "name email"
          )
          .lean();

      // Notify student
      if (application.user) {
        let message =
          `Your application status has been updated to ${status}.`;

        if (
          updatedApplication
            ?.scholarship?.title
        ) {
          message =
            `Your application for "${updatedApplication.scholarship.title}" has been ${status}.`;
        }

        await Notification.create({
          user:
            application.user,

          title:
            "Application status updated",

          message,

          type:
            "APPLICATION_STATUS",

          scholarship:
            application.scholarship ||
            null,

          read: false,
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Application status updated successfully.",
        data: {
          application:
            updatedApplication,
        },
      });
    } catch (error) {
      console.error(
        "UPDATE APPLICATION STATUS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to update application status.",
      });
    }
  };

// =========================================================
// GET ADMIN NOTIFICATIONS
// =========================================================

export const getAdminNotifications =
  async (req, res) => {
    try {
      const notifications =
        await Notification.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "scholarship",
            "title"
          )
          .sort({
            createdAt: -1,
          })
          .limit(100)
          .lean();

      return res.status(200).json({
        success: true,
        data: {
          notifications,
        },
      });
    } catch (error) {
      console.error(
        "GET ADMIN NOTIFICATIONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load notifications.",
      });
    }
  };