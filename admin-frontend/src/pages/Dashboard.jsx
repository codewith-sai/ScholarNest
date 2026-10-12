import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  ClipboardList,
  Clock3,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH DASHBOARD DATA
  // =========================================================

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/dashboard");

      console.log("ADMIN DASHBOARD RESPONSE:", data);

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to load dashboard data."
        );
      }

      const dashboardData =
        data?.data || data;

      setStats(dashboardData);
    } catch (error) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // =========================================================
  // STAT CARD
  // =========================================================

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
  }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-purple-500/20 hover:bg-white/[0.05]">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {loading ? "—" : value ?? 0}
          </h2>

          {description && (
            <p className="mt-2 text-xs text-slate-600">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <Icon size={21} />
        </div>

      </div>
    </div>
  );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading && !stats) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="text-center">

          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-purple-400"
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard...
          </p>

        </div>
      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-sm text-purple-400">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage ScholarNet from one central place.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardStats}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Students"
          value={
            stats?.totalStudents ??
            stats?.students ??
            0
          }
          icon={Users}
          description="Registered student accounts"
        />

        <StatCard
          title="Scholarships"
          value={
            stats?.totalScholarships ??
            stats?.scholarships ??
            0
          }
          icon={GraduationCap}
          description="Scholarships in the system"
        />

        <StatCard
          title="Applications"
          value={
            stats?.totalApplications ??
            stats?.applications ??
            0
          }
          icon={ClipboardList}
          description="Submitted applications"
        />

        <StatCard
          title="Pending Applications"
          value={
            stats?.pendingApplications ??
            stats?.pending ??
            0
          }
          icon={Clock3}
          description="Applications awaiting review"
        />

      </div>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div className="mt-8">

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Frequently used administration tools.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <button
            type="button"
            onClick={() =>
              window.location.href =
                "/admin/scholarships"
            }
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-purple-500/30 hover:bg-purple-500/5"
          >
            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <GraduationCap size={21} />
              </div>

              <div>
                <p className="font-medium text-white">
                  Manage Scholarships
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Add and manage scholarships
                </p>
              </div>

            </div>

            <ArrowUpRight
              size={18}
              className="text-slate-600 transition group-hover:text-purple-400"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              window.location.href =
                "/admin/students"
            }
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-purple-500/30 hover:bg-purple-500/5"
          >
            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Users size={21} />
              </div>

              <div>
                <p className="font-medium text-white">
                  Manage Students
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  View registered students
                </p>
              </div>

            </div>

            <ArrowUpRight
              size={18}
              className="text-slate-600 transition group-hover:text-blue-400"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              window.location.href =
                "/admin/applications"
            }
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-purple-500/30 hover:bg-purple-500/5"
          >
            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ClipboardList size={21} />
              </div>

              <div>
                <p className="font-medium text-white">
                  Review Applications
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Review student applications
                </p>
              </div>

            </div>

            <ArrowUpRight
              size={18}
              className="text-slate-600 transition group-hover:text-emerald-400"
            />
          </button>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;