import { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Bookmark,
  ClipboardList,
  Bell,
  UserRound,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({
  activeItem = "Dashboard",
  onNavigate,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Scholarships",
      icon: GraduationCap,
      path: "/scholarships",
    },
    {
      name: "Saved Scholarships",
      icon: Bookmark,
      path: "/saved",
    },
    {
      name: "Applications",
      icon: ClipboardList,
      path: "/applications",
    },
    {
      name: "Notifications",
      icon: Bell,
      path: "/notifications",
      badge: 3,
    },
  ];

  const accountItems = [
    {
      name: "My Profile",
      icon: UserRound,
      path: "/profile",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const handleNavigate = (item) => {
    if (onNavigate) {
      onNavigate(item);
    } else {
      window.location.href = item.path;
    }

    setIsOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = activeItem === item.name;

    return (
      <button
        key={item.name}
        type="button"
        onClick={() => handleNavigate(item)}
        title={isCollapsed ? item.name : undefined}
        className={`group flex w-full items-center rounded-xl px-3 py-3 text-left transition-all ${
          isActive
            ? "bg-indigo-50 text-indigo-700 shadow-sm"
            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
        } ${isCollapsed ? "justify-center" : "gap-3"}`}
      >
        <Icon
          size={20}
          strokeWidth={isActive ? 2.5 : 2}
          className="shrink-0"
        />

        {!isCollapsed && (
          <>
            <span className="flex-1 text-sm font-semibold">
              {item.name}
            </span>

            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </>
        )}

        {isCollapsed && item.badge && (
          <span className="absolute ml-7 mt-[-18px] flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* ================= MOBILE MENU BUTTON ================= */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
      >
        <Menu size={21} />
      </button>

      {/* ================= MOBILE OVERLAY ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
          isCollapsed ? "w-[78px]" : "w-[260px]"
        } ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* ================= LOGO ================= */}
        <div
          className={`flex h-20 items-center border-b border-slate-100 ${
            isCollapsed
              ? "justify-center px-3"
              : "justify-between px-5"
          }`}
        >
          <a
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
              <GraduationCap size={23} />
            </div>

            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900">
                  Scholar
                  <span className="text-indigo-600">
                    Net
                  </span>
                </h1>

                <p className="text-[10px] font-medium text-slate-500">
                  Student Portal
                </p>
              </div>
            )}
          </a>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= NAVIGATION ================= */}
        <div className="flex-1 overflow-y-auto px-3 py-6">

          {!isCollapsed && (
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>
          )}

          <nav className="space-y-1">
            {mainItems.map(renderItem)}
          </nav>

          <div className="my-6 border-t border-slate-100" />

          {!isCollapsed && (
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Account
            </p>
          )}

          <nav className="space-y-1">
            {accountItems.map(renderItem)}
          </nav>

          {/* ================= HELP CARD ================= */}
          {!isCollapsed && (
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <HelpCircle size={19} />
              </div>

              <h3 className="text-sm font-bold text-slate-800">
                Need Help?
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Get help finding and understanding scholarships.
              </p>

              <button
                type="button"
                className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Get Support →
              </button>
            </div>
          )}
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="border-t border-slate-100 p-3">

          {/* Collapse button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mb-2 hidden w-full items-center justify-center rounded-xl p-2 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600 lg:flex"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={19} />
            ) : (
              <ChevronLeft size={19} />
            )}
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={`flex w-full items-center rounded-xl px-3 py-3 text-red-500 transition hover:bg-red-50 ${
              isCollapsed
                ? "justify-center"
                : "gap-3"
            }`}
          >
            <LogOut size={19} />

            {!isCollapsed && (
              <span className="text-sm font-semibold">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;