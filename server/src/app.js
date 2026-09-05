import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "./prisma.js";
import { requireAuth, requireRole } from "./middleware/auth.js";
import { evaluateEligibility } from "./services/eligibilityService.js";
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
const token = (u) =>
  jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
const include = { eligibility: true, documents: true };
const profileSchema = z.object({
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().min(1),
  state: z.string().min(1),
  district: z.string().min(1),
  city: z.string().min(1),
  category: z.string().min(1),
  caste: z.string().optional().nullable(),
  minorityStatus: z.boolean(),
  disabilityStatus: z.boolean(),
  annualIncome: z.coerce.number().min(0),
  incomeCertificate: z.boolean(),
  occupation: z.string().optional().nullable(),
  educationLevel: z.string().min(1),
  college: z.string().min(1),
  course: z.string().min(1),
  branch: z.string().optional().nullable(),
  academicYear: z.coerce.number().int().min(1).max(10),
  percentage: z.coerce.number().min(0).max(100).optional().nullable(),
  cgpa: z.coerce.number().min(0).max(10).optional().nullable(),
  domicileState: z.string().optional().nullable(),
  rural: z.boolean().optional().nullable(),
});
app.get("/api/health", (q, s) =>
  s.json({
    ok: true,
  }),
);
app.post("/api/auth/register", async (req, res, next) => {
  try {
    const d = z
      .object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
      })
      .parse(req.body);
    const user = await prisma.user.create({
      data: {
        name: d.name,
        email: d.email.toLowerCase(),
        passwordHash: await bcrypt.hash(d.password, 12),
        profile: { create: {} },
      },
      include: { profile: true },
    });
    res.status(201).json({ token: token(user), user });
  } catch (e) {
    next(e);
  }
});
app.post("/api/auth/login", async (req, res, next) => {
  try {
    const d = z
      .object({ email: z.string().email(), password: z.string().min(1) })
      .parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: d.email.toLowerCase() },
      include: { profile: true },
    });
    if (
      !user ||
      !user.enabled ||
      !(await bcrypt.compare(d.password, user.passwordHash))
    )
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    res.json({ token: token(user), user });
  } catch (e) {
    next(e);
  }
});
app.get("/api/auth/me", requireAuth, (req, res) =>
  res.json({ user: req.user }),
);
app.get("/api/profile", requireAuth, requireRole("STUDENT"), (req, res) =>
  res.json(req.user.profile),
);
app.put(
  "/api/profile",
  requireAuth,
  requireRole("STUDENT"),
  async (req, res, next) => {
    try {
      const d = profileSchema.parse(req.body);
      const p = await prisma.studentProfile.update({
        where: { userId: req.user.id },
        data: {
          ...d,
          dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth) : null,
          profileCompleted: true,
        },
      });
      res.json(p);
    } catch (e) {
      next(e);
    }
  },
);
app.get("/api/scholarships", requireAuth, async (req, res, next) => {
  try {
    const { q, category, state, course, type } = req.query;
    const items = await prisma.scholarship.findMany({
      where: {
        active: true,
        AND: [
          q
            ? { OR: [{ name: { contains: q } }, { provider: { contains: q } }] }
            : {},
          type ? { scholarshipType: type } : {},
          category
            ? {
                eligibility: {
                  some: {
                    field: "category",
                    values: { array_contains: category },
                  },
                },
              }
            : {},
          state
            ? {
                eligibility: {
                  some: { field: "state", values: { array_contains: state } },
                },
              }
            : {},
          course
            ? {
                eligibility: {
                  some: { field: "course", values: { array_contains: course } },
                },
              }
            : {},
        ],
      },
      include,
      orderBy: { deadline: "asc" },
    });
    res.json(
      items.map((s) => ({
        ...s,
        evaluation: req.user.profile
          ? evaluateEligibility(req.user.profile, s)
          : null,
      })),
    );
  } catch (e) {
    next(e);
  }
});
app.get(
  "/api/scholarships/eligible",
  requireAuth,
  requireRole("STUDENT"),
  async (req, res, next) => {
    try {
      if (!req.user.profile?.profileCompleted)
        return res
          .status(409)
          .json({ message: "Complete your profile to see matches." });
      const all = await prisma.scholarship.findMany({
        where: {
          active: true,
          OR: [{ deadline: null }, { deadline: { gte: new Date() } }],
        },
        include,
        orderBy: { deadline: "asc" },
      });
      res.json(
        all
          .map((s) => ({
            ...s,
            evaluation: evaluateEligibility(req.user.profile, s),
          }))
          .filter((x) => x.evaluation.eligible),
      );
    } catch (e) {
      next(e);
    }
  },
);
app.get("/api/scholarships/:id", requireAuth, async (req, res, next) => {
  try {
    const s = await prisma.scholarship.findUnique({
      where: { id: +req.params.id },
      include,
    });
    if (!s) return res.status(404).json({ message: "Scholarship not found." });
    res.json({
      ...s,
      evaluation: req.user.profile
        ? evaluateEligibility(req.user.profile, s)
        : null,
    });
  } catch (e) {
    next(e);
  }
});
app.post(
  "/api/scholarships/:id/save",
  requireAuth,
  requireRole("STUDENT"),
  async (req, res, next) => {
    try {
      const scholarshipId = +req.params.id;
      await prisma.savedScholarship.upsert({
        where: {
          studentId_scholarshipId: {
            studentId: req.user.profile.id,
            scholarshipId,
          },
        },
        create: { studentId: req.user.profile.id, scholarshipId },
        update: {},
      });
      await prisma.applicationTracking.upsert({
        where: {
          studentId_scholarshipId: {
            studentId: req.user.profile.id,
            scholarshipId,
          },
        },
        create: { studentId: req.user.profile.id, scholarshipId },
        update: {},
      });
      res.status(201).json({ message: "Saved." });
    } catch (e) {
      next(e);
    }
  },
);
app.delete(
  "/api/scholarships/:id/save",
  requireAuth,
  requireRole("STUDENT"),
  async (req, res, next) => {
    try {
      await prisma.savedScholarship.delete({
        where: {
          studentId_scholarshipId: {
            studentId: req.user.profile.id,
            scholarshipId: +req.params.id,
          },
        },
      });
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
);
app.get("/api/saved", requireAuth, requireRole("STUDENT"), async (req, res) =>
  res.json(
    await prisma.savedScholarship.findMany({
      where: { studentId: req.user.profile.id },
      include: { scholarship: { include } },
      orderBy: { createdAt: "desc" },
    }),
  ),
);
app.get(
  "/api/applications",
  requireAuth,
  requireRole("STUDENT"),
  async (req, res) =>
    res.json(
      await prisma.applicationTracking.findMany({
        where: { studentId: req.user.profile.id },
        include: { scholarship: true },
      }),
    ),
);
app.put(
  "/api/applications/:id",
  requireAuth,
  requireRole("STUDENT"),
  async (req, res, next) => {
    try {
      const status = z
        .enum([
          "SAVED",
          "PLANNING",
          "APPLIED",
          "UNDER_REVIEW",
          "SELECTED",
          "REJECTED",
        ])
        .parse(req.body.status);
      const result = await prisma.applicationTracking.updateMany({
        where: { id: +req.params.id, studentId: req.user.profile.id },
        data: {
          status,
          appliedAt: status === "APPLIED" ? new Date() : undefined,
        },
      });
      if (!result.count)
        return res
          .status(404)
          .json({ message: "Application record not found." });
      res.json(
        await prisma.applicationTracking.findUnique({
          where: { id: +req.params.id },
        }),
      );
    } catch (e) {
      next(e);
    }
  },
);
app.get(
  "/api/notifications",
  requireAuth,
  requireRole("STUDENT"),
  async (req, res) =>
    res.json(
      await prisma.notification.findMany({
        where: { studentId: req.user.profile.id },
        orderBy: { createdAt: "desc" },
      }),
    ),
);
app.put(
  "/api/notifications/:id/read",
  requireAuth,
  requireRole("STUDENT"),
  async (req, res, next) => {
    try {
      const result = await prisma.notification.updateMany({
        where: { id: +req.params.id, studentId: req.user.profile.id },
        data: { read: true },
      });
      if (!result.count)
        return res.status(404).json({ message: "Notification not found." });
      res.json(
        await prisma.notification.findUnique({ where: { id: +req.params.id } }),
      );
    } catch (e) {
      next(e);
    }
  },
);
const scholarshipSchema = z.object({
  name: z.string().min(3),
  provider: z.string().min(2),
  description: z.string().min(10),
  scholarshipType: z.string().min(2),
  benefits: z.string().min(2),
  amount: z.coerce.number().min(0).nullable().optional(),
  openingDate: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  applicationUrl: z.string().url().nullable().optional(),
  applicationInstructions: z.string().nullable().optional(),
  active: z.boolean().default(true),
  isDemo: z.boolean().default(true),
  eligibility: z.array(
    z.object({
      field: z.string(),
      operator: z.string().default("IN"),
      values: z.array(z.any()).optional(),
      minValue: z.number().nullable().optional(),
      maxValue: z.number().nullable().optional(),
      required: z.boolean().default(true),
      label: z.string().nullable().optional(),
    }),
  ),
  documents: z.array(z.string()).default([]),
});
const toScholarship = (d) => ({
  ...d,
  openingDate: d.openingDate ? new Date(d.openingDate) : null,
  deadline: d.deadline ? new Date(d.deadline) : null,
  eligibility: {
    create: d.eligibility.map(({ values, ...r }) => ({
      ...r,
      values: values || [],
    })),
  },
  documents: { create: d.documents.map((documentName) => ({ documentName })) },
});
app.get(
  "/api/admin/stats",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) =>
    res.json({
      students: await prisma.user.count({ where: { role: "STUDENT" } }),
      scholarships: await prisma.scholarship.count(),
      active: await prisma.scholarship.count({ where: { active: true } }),
      applications: await prisma.applicationTracking.count(),
      upcoming: await prisma.scholarship.count({
        where: { deadline: { gte: new Date() } },
      }),
    }),
);
app.get(
  "/api/admin/scholarships",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) =>
    res.json(
      await prisma.scholarship.findMany({
        include,
        orderBy: { updatedAt: "desc" },
      }),
    ),
);
app.post(
  "/api/admin/scholarships",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res, next) => {
    try {
      res
        .status(201)
        .json(
          await prisma.scholarship.create({
            data: toScholarship(scholarshipSchema.parse(req.body)),
            include,
          }),
        );
    } catch (e) {
      next(e);
    }
  },
);
app.put(
  "/api/admin/scholarships/:id",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res, next) => {
    try {
      const d = scholarshipSchema.parse(req.body);
      const { eligibility, documents, ...base } = toScholarship(d);
      await prisma.scholarshipEligibility.deleteMany({
        where: { scholarshipId: +req.params.id },
      });
      await prisma.scholarshipDocument.deleteMany({
        where: { scholarshipId: +req.params.id },
      });
      res.json(
        await prisma.scholarship.update({
          where: { id: +req.params.id },
          data: { ...base, eligibility, documents },
          include,
        }),
      );
    } catch (e) {
      next(e);
    }
  },
);
app.delete(
  "/api/admin/scholarships/:id",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res, next) => {
    try {
      await prisma.scholarship.update({
        where: { id: +req.params.id },
        data: { active: false },
      });
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  },
);
app.get(
  "/api/admin/students",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) =>
    res.json(
      await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: {
          id: true,
          name: true,
          email: true,
          enabled: true,
          createdAt: true,
          profile: {
            select: {
              profileCompleted: true,
              state: true,
              educationLevel: true,
            },
          },
        },
      }),
    ),
);
app.put(
  "/api/admin/students/:id/enabled",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res, next) => {
    try {
      res.json(
        await prisma.user.update({
          where: { id: +req.params.id },
          data: { enabled: !!req.body.enabled },
          select: { id: true, enabled: true },
        }),
      );
    } catch (e) {
      next(e);
    }
  },
);
app.use((e, req, res, next) => {
  console.error(e);
  if (e instanceof z.ZodError)
    return res.status(400).json({ message: e.issues[0].message });
  if (e.code === "P2002")
    return res.status(409).json({ message: "That value is already in use." });
  res.status(500).json({ message: "Something went wrong. Please try again." });
});
if (process.env.NODE_ENV !== "test")
  app.listen(process.env.PORT || 4000, () =>
    console.log("ScholarNest API running"),
  );
export default app;
