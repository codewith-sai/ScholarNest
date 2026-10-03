import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!form.password) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      console.log("ADMIN LOGIN RESPONSE:", data);

      if (!data?.success) {
        throw new Error(
          data?.message || "Login failed."
        );
      }

      // =====================================================
      // GET USER
      // =====================================================

      const user =
        data?.data?.user ||
        data?.user ||
        null;

      if (!user) {
        throw new Error(
          "Login successful, but user information was not returned."
        );
      }

      console.log("ADMIN LOGIN USER:", user);
      console.log("ADMIN LOGIN ROLE:", user.role);

      // =====================================================
      // CHECK ADMIN ROLE
      // =====================================================

      if (user.role !== "admin") {
        toast.error(
          "Access denied. This account is not an administrator."
        );

        // Logout the authenticated session
        try {
          await api.post("/auth/logout");
        } catch (logoutError) {
          console.error(
            "LOGOUT AFTER ADMIN CHECK ERROR:",
            logoutError
          );
        }

        return;
      }

      // =====================================================
      // ADMIN LOGIN SUCCESS
      // =====================================================

      toast.success("Admin login successful!");

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "ADMIN LOGIN ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // STYLES
  // =========================================================

  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">

      <div className="w-full max-w-md">

        {/* =================================================
            LOGO / HEADER
        ================================================= */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-3xl font-bold">
            ScholarNet Admin
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Administrator control panel
          </p>

        </div>

        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-8"
        >

          {/* EMAIL */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Administrator Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@scholarnet.com"
                autoComplete="email"
                required
                className={inputClass}
              />

            </div>
          </div>

          {/* PASSWORD */}

          <div className="mt-5">

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                minLength={6}
                className={inputClass}
              />

            </div>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Signing in...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />

                Admin Login
              </>
            )}
          </button>

          {/* SECURITY MESSAGE */}

          <div className="mt-5 rounded-xl border border-purple-500/10 bg-purple-500/5 p-3">

            <p className="text-center text-xs leading-5 text-slate-500">
              Only accounts with administrator privileges
              can access this panel. Authorization is
              verified by the backend.
            </p>

          </div>

        </form>

      </div>
    </div>
  );
};

export default Login;