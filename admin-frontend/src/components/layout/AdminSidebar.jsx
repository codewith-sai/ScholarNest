import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  ClipboardList,
  Bell,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({
  open = false,
  onClose = () => {},
}) => {
  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Scholarships",
      path: "/admin/scholarships",
      icon: GraduationCap,
    },
    {
      label: "Students",
      path: "/admin/students",
      icon: Users,
    },
    {
      label: "Documents",
      path: "/admin/documents",
      icon: FileText,
    },
    {
      label: "Applications",
      path: "/admin/applications",
      icon: ClipboardList,
    },
    {
      label: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside
        className="
          fixed
          left-0
          top-0
          z-50
          hidden
          h-screen
          w-64
          flex-col
          border-r
          border-white/10
          bg-slate-950
          lg:flex
        "
      >
        {/* Logo */}

        <div className="flex h-[84px] shrink-0 items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                ScholarNet
              </h1>

              <p className="text-[11px] text-slate-500">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Administration
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-purple-500/10 text-purple-400"
                        : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                    }`
                  }
                >
                  <Icon
                    size={19}
                    className="shrink-0"
                  />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer */}

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <ShieldCheck size={17} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-300">
                  Administrator
                </p>

                <p className="text-[10px] text-slate-600">
                  Full Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-[60]
          flex
          h-screen
          w-72
          flex-col
          border-r
          border-white/10
          bg-slate-950
          shadow-2xl
          transition-transform
          duration-300
          lg:hidden
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Mobile Header */}

        <div className="flex h-[84px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                ScholarNet
              </h1>

              <p className="text-[11px] text-slate-500">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* Mobile Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Administration
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-purple-500/10 text-purple-400"
                        : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                    }`
                  }
                >
                  <Icon
                    size={19}
                    className="shrink-0"
                  />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Mobile Footer */}

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-300">
                  Administrator
                </p>

                <p className="text-[10px] text-slate-600">
                  Full Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;