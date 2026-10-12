import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  GraduationCap,
  FileText,
  Bell,
  MessageCircle,
  Settings,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import gsap from "gsap";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import api from "../services/api";

const Admin = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [stats, setStats] = useState({
    students: 0,
    scholarships: 0,
    applications: 0,
    pendingApplications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ADMIN DASHBOARD DATA
  // =========================================================
  const fetchAdminStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Authentication and authorization are handled
       * by the backend.
       *
       * The frontend only requests admin dashboard data.
       */
      const response = await api.get("/admin/dashboard");

      const data = response?.data?.data || response?.data || {};

      setStats({
        students:
          data.students ??
          data.totalStudents ??
          0,

        scholarships:
          data.scholarships ??
          data.totalScholarships ??
          0,

        applications:
          data.applications ??
          data.totalApplications ??
          0,

        pendingApplications:
          data.pendingApplications ??
          data.pending ??
          0,
      });
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // INITIAL LOAD + GSAP ANIMATION
  // =========================================================
  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  useEffect(() => {
    if (loading || !pageRef.current) return;

    const sections =
      pageRef.current.querySelectorAll(".admin-section");

    if (!sections.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sections,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform",
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [loading]);

  // =========================================================
  // STAT CARDS
  // =========================================================
  const statCards = [
    {
      title: "Total Students",
      value: stats.students,
      icon: Users,
      description: "Registered students",
      iconClass: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Scholarships",
      value: stats.scholarships,
      icon: GraduationCap,
      description: "Available scholarships",
      iconClass: "bg-purple-500/10 text-purple-400",
    },
    {
      title: "Applications",
      value: stats.applications,
      icon: FileText,
      description: "Total applications",
      iconClass: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: Bell,
      description: "Awaiting review",
      iconClass: "bg-amber-500/10 text-amber-400",
    },
  ];

  // =========================================================
  // ADMIN ACTIONS
  // =========================================================
  const adminActions = [
    {
      title: "Manage Scholarships",
      description:
        "Create, update, review, and manage scholarship opportunities.",
      icon: GraduationCap,
      path: "/admin/scholarships",
    },
    {
      title: "Manage Applications",
      description:
        "Review student applications and update application status.",
      icon: FileText,
      path: "/admin/applications",
    },
    {
      title: "Manage Students",
      description:
        "View student profiles and scholarship participation.",
      icon: Users,
      path: "/admin/students",
    },
    {
      title: "Notifications",
      description:
        "Send and manage important platform notifications.",
      icon: Bell,
      path: "/notifications",
    },
    {
      title: "Messages",
      description:
        "Communicate with students and scholarship applicants.",
      icon: MessageCircle,
      path: "/messages",
    },
    {
      title: "Settings",
      description:
        "Configure platform and administrative preferences.",
      icon: Settings,
      path: "/settings",
    },
  ];

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <LoadingSpinner
          fullScreen
          message="Loading admin dashboard..."
        />
      </div>
    );
  }

  // =========================================================
  // ADMIN DASHBOARD
  // =========================================================
  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="admin-section mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-400">
              <ShieldCheck size={14} />
              Administration
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Manage scholarships, students, applications,
              and ScholarNet platform activity.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAdminStats}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}
        {error && (
          <div className="admin-section mb-6">
            <ErrorMessage
              message={error}
              onRetry={fetchAdminStats}
              showRetry
            />
          </div>
        )}

        {/* =====================================================
            STATISTICS
        ===================================================== */}
        <div className="admin-section mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {stat.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-600">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            ADMINISTRATION TITLE
        ===================================================== */}
        <div className="admin-section mb-5">
          <h2 className="text-xl font-semibold">
            Administration
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select an area to manage.
          </p>
        </div>

        {/* =====================================================
            ADMIN ACTIONS
        ===================================================== */}
        <div className="admin-section grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {adminActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                type="button"
                onClick={() => navigate(action.path)}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500/15">
                    <Icon size={21} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-slate-300"
                  />
                </div>

                <h3 className="mt-5 font-semibold text-slate-200">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* =====================================================
            SECURITY NOTICE
        ===================================================== */}
        <div className="admin-section mt-8 rounded-2xl border border-purple-500/10 bg-purple-500/5 p-5">
          <div className="flex gap-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-purple-400"
            />

            <div>
              <h3 className="text-sm font-semibold text-purple-300">
                Administrator Access
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Administrator permissions are verified by the
                backend. The frontend does not decide whether a
                user is an administrator.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;