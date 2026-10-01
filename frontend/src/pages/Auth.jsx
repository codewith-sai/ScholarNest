import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { toast } from "react-toastify";

const Auth = ({ mode = "login" }) => {
  const isLogin = mode === "login";

  const navigate = useNavigate();
  const location = useLocation();

  const { login, register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const from = location.state?.from || "/dashboard";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!form.email.trim()) {
      toast.error("Please enter your email address.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!form.password) {
      toast.error("Please enter your password.");
      return false;
    }

    if (form.password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return false;
    }

    if (!isLogin) {
      if (!form.name.trim()) {
        toast.error("Please enter your full name.");
        return false;
      }

      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const response = await login({
          email: form.email.trim(),
          password: form.password,
        });

        toast.success("Welcome back to ScholarNet!");

        const loggedInUser = response?.user;

        if (loggedInUser?.role === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        if (loggedInUser?.profileCompleted) {
          navigate(from, { replace: true });
        } else {
          navigate("/complete-profile", { replace: true });
        }
      } else {
        await register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        toast.success("Account created successfully!");

        navigate("/complete-profile", { replace: true });
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (isLogin
          ? "Unable to log in. Please check your credentials."
          : "Unable to create your account.");

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left visual panel */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 lg:flex">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-pink-300/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur">
                <GraduationCap size={27} />
              </div>

              <div>
                <div className="text-2xl font-extrabold text-white">
                  Scholar<span className="text-pink-200">Net</span>
                </div>
                <p className="text-xs text-indigo-100">
                  Discover. Understand. Apply.
                </p>
              </div>
            </Link>

            <div className="max-w-xl">
              <span className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/15">
                Scholarship Discovery Platform
              </span>

              <h1 className="text-4xl font-black leading-tight text-white xl:text-6xl">
                Find scholarships that match{" "}
                <span className="text-pink-200">you.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-indigo-100 xl:text-lg">
                Build your student profile once and discover scholarship
                opportunities based on your eligibility, academic details,
                location, and financial criteria.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Personalized scholarship matching",
                  "Eligibility explained in simple language",
                  "Documents and deadlines in one place",
                  "Direct links to official application portals",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-white"
                  >
                    <CheckCircle2
                      size={19}
                      className="shrink-0 text-pink-200"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-indigo-200">
              ScholarNet is a scholarship discovery and guidance platform.
              Always verify current requirements on the official scholarship
              portal.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200">
                  <GraduationCap size={24} />
                </div>

                <div>
                  <div className="text-xl font-extrabold text-slate-900">
                    Scholar<span className="text-indigo-600">Net</span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Discover. Understand. Apply.
                  </p>
                </div>
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-bold text-indigo-600">
                {isLogin ? "Welcome back" : "Get started"}
              </p>

              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {isLogin
                  ? "Sign in to ScholarNet"
                  : "Create your ScholarNet account"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isLogin
                  ? "Continue discovering scholarship opportunities matched to your profile."
                  : "Create your account and complete your student profile to find relevant scholarships."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  {isLogin && (
                    <button
                      type="button"
                      onClick={() =>
                        toast.info(
                          "Password reset can be connected to your email service later."
                        )
                      }
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete={
                      isLogin ? "current-password" : "new-password"
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs leading-5 text-indigo-700">
                  Your profile information will be used to identify
                  scholarships whose listed criteria appear to match your
                  details.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign in" : "Create account"}
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 text-center text-sm text-slate-500">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Create one
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <p className="mt-7 text-center text-[11px] leading-5 text-slate-400">
              By continuing, you understand that ScholarNet provides
              scholarship discovery and guidance. Eligibility should be
              verified against the latest official scholarship requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;