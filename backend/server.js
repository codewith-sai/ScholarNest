import "dotenv/config";

import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

// ============================================================
// ROUTES
// ============================================================
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// ============================================================
// ERROR MIDDLEWARE
// ============================================================
import {
  notFoundMiddleware,
  errorMiddleware,
} from "./middleware/errorMiddleware.js";

// ============================================================
// SOCKET
// ============================================================
import { initializeSocket } from "./socket/socketHandler.js";

// ============================================================
// PATH CONFIGURATION
// ============================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// EXPRESS APP
// ============================================================
const app = express();

// ============================================================
// HTTP SERVER
// ============================================================
const server = http.createServer(app);

// ============================================================
// FRONTEND URLS
// ============================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

// ============================================================
// CORS
// ============================================================

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests such as Postman/server-to-server
    // where Origin header may not exist.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("CORS blocked origin:", origin);

    return callback(
      new Error(`CORS blocked for origin: ${origin}`)
    );
  },

  credentials: true,
};

// ============================================================
// SOCKET.IO
// ============================================================
const io = new Server(server, {
  cors: corsOptions,
});

initializeSocket(io);

// ============================================================
// DATABASE
// ============================================================
await connectDB();

// ============================================================
// CORS MIDDLEWARE
// ============================================================
app.use(cors(corsOptions));

// ============================================================
// BODY PARSERS
// ============================================================
app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ============================================================
// COOKIE PARSER
// ============================================================
app.use(cookieParser());

// ============================================================
// STATIC UPLOADS
// ============================================================
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ============================================================
// HEALTH CHECK
// ============================================================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ScholarNet backend is running.",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// API ROUTES
// ============================================================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Student profile
app.use(
  "/api/profile",
  profileRoutes
);

// Scholarships
app.use(
  "/api/scholarships",
  scholarshipRoutes
);

// Applications
app.use(
  "/api/applications",
  applicationRoutes
);

// Notifications
app.use(
  "/api/notifications",
  notificationRoutes
);

// Messages
app.use(
  "/api/messages",
  messageRoutes
);

// ============================================================
// ADMIN ROUTES
// ============================================================

// GET    /api/admin/dashboard
// POST   /api/admin/scholarships
// PUT    /api/admin/scholarships/:id
// DELETE /api/admin/scholarships/:id
// GET    /api/admin/students
// GET    /api/admin/students/:id
// GET    /api/admin/documents
// PATCH  /api/admin/documents/:studentId/:documentId/verification
// GET    /api/admin/applications
// PATCH  /api/admin/applications/:id/status
// GET    /api/admin/notifications

app.use(
  "/api/admin",
  adminRoutes
);

// ============================================================
// 404 HANDLER
// ============================================================
app.use(notFoundMiddleware);

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================
app.use(errorMiddleware);

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(
    `ScholarNet backend running on http://localhost:${PORT}`
  );

  console.log(
    `API: http://localhost:${PORT}/api`
  );

  console.log(
    `Health: http://localhost:${PORT}/api/health`
  );

  console.log(
    `Admin API: http://localhost:${PORT}/api/admin`
  );

  console.log(
    `Allowed frontend origins: ${allowedOrigins.join(", ")}`
  );
});