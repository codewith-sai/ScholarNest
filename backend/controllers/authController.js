import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { successResponse } from "../utils/response.js";

// =========================================================
// GENERATE JWT
// =========================================================
const generateToken = (userId) => {
  return jwt.sign(
    {
      userId: userId.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =========================================================
// COOKIE OPTIONS
// =========================================================
const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

// =========================================================
// REGISTER
// =========================================================
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    // -----------------------------
    // NORMALIZE EMAIL
    // -----------------------------
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // -----------------------------
    // CHECK EXISTING USER
    // -----------------------------
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // -----------------------------
    // CREATE STUDENT
    // -----------------------------
    // IMPORTANT:
    // Public registration can only
    // create student accounts.
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone || "",
      role: "student",
    });

    // -----------------------------
    // GENERATE TOKEN
    // -----------------------------
    const token = generateToken(user._id);

    // -----------------------------
    // SET HTTP-ONLY COOKIE
    // -----------------------------
    res.cookie(
      "token",
      token,
      cookieOptions
    );

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return successResponse(
      res,
      {
        user: user.toSafeObject(),
      },
      "Registration successful.",
      201
    );
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Registration failed. Please try again.",
    });
  }
};

// =========================================================
// LOGIN
// =========================================================
export const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // -----------------------------
    // NORMALIZE EMAIL
    // -----------------------------
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // -----------------------------
    // FIND USER
    // -----------------------------
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // -----------------------------
    // CHECK ACTIVE STATUS
    // -----------------------------
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been disabled.",
      });
    }

    // -----------------------------
    // CHECK PASSWORD
    // -----------------------------
    const isPasswordCorrect =
      await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // -----------------------------
    // GENERATE JWT
    // -----------------------------
    const token = generateToken(user._id);

    // -----------------------------
    // SET COOKIE
    // -----------------------------
    res.cookie(
      "token",
      token,
      cookieOptions
    );

    // -----------------------------
    // SAFE USER OBJECT
    // -----------------------------
    const safeUser = user.toSafeObject();

    console.log(
      "LOGIN USER:",
      safeUser
    );

    console.log(
      "LOGIN USER ROLE:",
      safeUser.role
    );

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return successResponse(
      res,
      {
        user: safeUser,
      },
      "Login successful."
    );
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Login failed. Please try again.",
    });
  }
};

// =========================================================
// LOGOUT
// =========================================================
export const logout = async (req, res) => {
  try {
    res.clearCookie(
      "token",
      {
        httpOnly: true,
        secure:
          process.env.COOKIE_SECURE === "true",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        path: "/",
      }
    );

    return successResponse(
      res,
      null,
      "Logout successful."
    );
  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Logout failed.",
    });
  }
};

// =========================================================
// GET CURRENT USER
// =========================================================
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    return successResponse(
      res,
      {
        user: req.user.toSafeObject(),
      },
      "Current user retrieved."
    );
  } catch (error) {
    console.error(
      "GET ME ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve current user.",
    });
  }
};