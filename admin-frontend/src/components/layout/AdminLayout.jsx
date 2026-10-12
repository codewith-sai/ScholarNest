import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await api.post("/auth/logout");

      toast.success("Logged out successfully");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Logout failed"
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        >
          <X className="absolute right-4 top-5 text-slate-400" />
        </button>
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="min-h-screen lg:pl-64">

        {/* HEADER */}

        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* PAGE CONTENT */}

        <main className="p-4 sm:p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

      {/* =====================================================
          LOGOUT LOADING OVERLAY
      ===================================================== */}

      {loggingOut && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">

          <div className="rounded-2xl border border-white/10 bg-slate-950 px-6 py-5 shadow-2xl">

            <div className="flex items-center gap-3">

              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-purple-500" />

              <p className="text-sm text-slate-300">
                Logging out...
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminLayout;