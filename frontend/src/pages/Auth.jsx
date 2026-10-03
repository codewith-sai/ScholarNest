import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GraduationCap } from "lucide-react";

import api from "../services/api";

const Auth = ({ mode = "login" }) => {
  const isLogin = mode === "login";

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    location.state?.from?.pathname || "/dashboard";

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // =========================================================
  // INPUT CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // LOGIN / REGISTER
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (!form.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!form.password) {
      toast.error("Please enter your password.");
      return;
    }

    if (!isLogin && !form.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // =====================================================
      // LOGIN
      // =====================================================
      if (isLogin) {
        const { data } = await api.post("/auth/login", {
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });

        console.log("LOGIN RESPONSE:", data);

        // Backend login failed
        if (!data?.success) {
          throw new Error(
            data?.message || "Login failed."
          );
        }

        // ===================================================
        // GET USER FROM BACKEND RESPONSE
        // Supports:
        // data.data.user
        // data.user
        // ===================================================
        const loggedInUser =
          data?.data?.user ||
          data?.user ||
          null;

        if (!loggedInUser) {
          console.error(
            "User object missing from login response:",
            data
          );

          throw new Error(
            "Login successful, but user information was not returned."
          );
        }

        console.log("LOGGED IN USER:", loggedInUser);
        console.log("USER ROLE:", loggedInUser.role);

        // ===================================================
        // ADMIN LOGIN
        // ===================================================
        const userRole = String(
          loggedInUser.role || ""
        )
          .trim()
          .toLowerCase();

        if (userRole === "admin") {
          toast.success("Admin login successful!");

          navigate("/admin", {
            replace: true,
          });

          return;
        }

        // ===================================================
        // STUDENT LOGIN
        // ===================================================
        if (userRole === "student") {
          toast.success("Login successful!");

          navigate(redirectTo, {
            replace: true,
          });

          return;
        }

        // ===================================================
        // UNKNOWN ROLE
        // ===================================================
        console.error(
          "Unknown user role:",
          loggedInUser.role
        );

        toast.error(
          "Your account has an invalid user role."
        );

        return;
      }

      // =====================================================
      // STUDENT REGISTRATION
      // =====================================================
      const { data } = await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,

        // Public registration is always student
        role: "student",
      });

      console.log("REGISTER RESPONSE:", data);

      if (!data?.success) {
        throw new Error(
          data?.message || "Registration failed."
        );
      }

      toast.success(
        "Student account created successfully."
      );

      // Go to login page after registration
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("AUTH ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INPUT STYLE
  // =========================================================
  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500";

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8"
      >
        {/* HEADER */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <GraduationCap size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black">
              {isLogin
                ? "Welcome back"
                : "Create your account"}
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              {isLogin
                ? "Login as student or administrator"
                : "Create a student account"}
            </p>
          </div>
        </div>

        {/* NAME - REGISTER ONLY */}
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            className={inputClass}
          />
        )}

        {/* EMAIL + PASSWORD */}
        <div
          className={
            !isLogin
              ? "mt-4 space-y-4"
              : "space-y-4"
          }
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className={inputClass}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete={
              isLogin
                ? "current-password"
                : "new-password"
            }
            className={inputClass}
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : isLogin
            ? "Login"
            : "Sign up"}
        </button>

        {/* ADMIN INFORMATION */}
        {isLogin && (
          <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3">
            <p className="text-center text-xs leading-5 text-purple-300">
              Administrator accounts use this same login.
              If your backend account has{" "}
              <span className="font-bold">
                role: "admin"
              </span>
              , you will be redirected to the Admin
              Dashboard.
            </p>
          </div>
        )}

        {/* LOGIN / SIGNUP SWITCH */}
        <p className="mt-5 text-center text-sm text-slate-400">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}

          <Link
            to={isLogin ? "/register" : "/login"}
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            {isLogin ? "Sign up" : "Login"}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Auth;