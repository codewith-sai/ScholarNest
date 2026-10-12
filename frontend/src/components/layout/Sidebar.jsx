import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";

import {
  LayoutDashboard,
  GraduationCap,
  Bookmark,
  FileText,
  Bell,
  MessageSquare,
  User,
  Settings,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Scholarships", path: "/scholarships", icon: GraduationCap },
  { name: "Saved Scholarships", path: "/saved-scholarships", icon: Bookmark },
  { name: "Applications", path: "/applications", icon: FileText },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Messages", path: "/messages", icon: MessageSquare },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = ({ isOpen = false, onClose }) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sidebar-item",
        { opacity: 0, x: -15 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-72
          border-r border-slate-800 bg-slate-950
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-lg font-bold text-white">
              S
            </div>

            <div className="text-xl font-bold text-white">
              Scholar<span className="text-blue-400">Net</span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <div className="px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-item group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-2 flex items-center gap-2">
              <GraduationCap size={18} className="text-blue-400" />
              <span className="text-sm font-semibold text-white">
                ScholarNet
              </span>
            </div>

            <p className="text-xs leading-5 text-slate-400">
              Find scholarships that match your profile and educational goals.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;