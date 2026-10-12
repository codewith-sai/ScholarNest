import { Bell, Menu, LogOut, UserCircle } from "lucide-react";

const AdminHeader = ({
  onMenuClick,
  onLogout,
  notificationCount = 0,
  adminName = "Administrator",
}) => {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2.5 text-slate-500 transition hover:bg-white/5 hover:text-white lg:hidden"
          title="Open menu"
        >
          <Menu size={21} />
        </button>

        <div>
          <p className="text-xs text-slate-600">
            Welcome back
          </p>

          <h2 className="text-sm font-semibold text-white sm:text-base">
            {adminName}
          </h2>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* NOTIFICATIONS */}
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
          title="Notifications"
        >
          <Bell size={20} />

          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[9px] font-bold text-white">
              {notificationCount > 99
                ? "99+"
                : notificationCount}
            </span>
          )}
        </button>

        {/* ADMIN PROFILE */}
        <div className="hidden items-center gap-3 border-l border-white/10 pl-3 sm:flex">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
            <UserCircle size={22} />
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-300">
              {adminName}
            </p>

            <p className="text-[11px] text-slate-600">
              Administrator
            </p>
          </div>

        </div>

        {/* LOGOUT */}
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl p-2.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
          title="Logout"
        >
          <LogOut size={19} />
        </button>

      </div>

    </header>
  );
};

export default AdminHeader;