import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================
const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    // ========================================================
    // 1. GET TOKEN FROM HTTP-ONLY COOKIE
    // ========================================================
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // ========================================================
    // 2. FALLBACK: AUTHORIZATION HEADER
    // ========================================================
    if (!token) {
      const authHeader = req.headers.authorization;

      if (
        authHeader &&
        authHeader.startsWith("Bearer ")
      ) {
        token = authHeader
          .substring(7)
          .trim();
      }
    }

    // ========================================================
    // 3. TOKEN NOT FOUND
    // ========================================================
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // ========================================================
    // 4. VERIFY JWT
    // ========================================================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ========================================================
    // 5. GET USER ID FROM JWT
    // ========================================================
    const userId =
      decoded.userId ||
      decoded.id ||
      decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // ========================================================
    // 6. FIND USER
    // ========================================================
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    // ========================================================
    // 7. CHECK ACTIVE STATUS
    // ========================================================
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is disabled.",
      });
    }

    // ========================================================
    // 8. ATTACH USER TO REQUEST
    // ========================================================
    req.user = user;

    next();
  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error.message
    );

    // ========================================================
    // JWT EXPIRED
    // ========================================================
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired.",
      });
    }

    // ========================================================
    // JWT INVALID
    // ========================================================
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // ========================================================
    // OTHER AUTHENTICATION ERROR
    // ========================================================
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

// ============================================================
// ADMIN AUTHORIZATION MIDDLEWARE
// ============================================================
const requireAdmin = (req, res, next) => {
  // ----------------------------------------------------------
  // USER NOT AUTHENTICATED
  // ----------------------------------------------------------
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  // ----------------------------------------------------------
  // USER IS NOT ADMIN
  // ----------------------------------------------------------
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  // ----------------------------------------------------------
  // USER IS ADMIN
  // ----------------------------------------------------------
  next();
};

// ============================================================
// NAMED EXPORTS
// ============================================================
export const requireAuth = authMiddleware;

export { requireAdmin };

// ============================================================
// DEFAULT EXPORT
// ============================================================
export default authMiddleware;