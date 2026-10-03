import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  LogOut,
  Menu,
  MessageSquare,
  User,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";

const Navbar = ({
  user = null,
  onLogout,
  onMenuClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  // =====================================================
  // Close dropdown when clicking outside
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // User Information
  // =====================================================

  const displayName = user?.name || "User";

  const initial = displayName
    .charAt(0)
    .toUpperCase();

  // =====================================================
  // Logout
  // =====================================================

  const handleLogout = async () => {
    // Close menu immediately
    setMenuOpen(false);

    try {
      /*
       * Call backend logout endpoint.
       *
       * If your backend uses an httpOnly cookie,
       * the backend will clear the authentication cookie.
       */
      await api.post("/auth/logout");

      // Remove old frontend session data if it exists.
      // This is only cleanup and is not used for authentication.
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Update parent state if provided
      if (typeof onLogout === "function") {
        onLogout();
      }

      toast.success("Logout successful.");

      // Redirect to login page
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );

      /*
       * Even if backend logout fails, remove
       * stale frontend session data.
       */
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      if (typeof onLogout === "function") {
        onLogout();
      }

      toast.error(
        error?.response?.data?.message ||
          "Logout failed. Please try again."
      );

      // Keep user out of protected UI
      navigate("/login", {
        replace: true,
      });
    }
  };

  // =====================================================
  // Common Icon Button
  // =====================================================

  const iconButton =
    "flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white";

  // =====================================================
  // Render
  // =====================================================

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#020617]/90 backdrop-blur lg:ml-72">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =================================================
            Mobile Menu
        ================================================= */}

        <button
          type="button"
          onClick={onMenuClick}
          className={`${iconButton} lg:hidden`}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* =================================================
            Welcome Text
        ================================================= */}

        <div className="hidden text-sm text-slate-400 lg:block">
          Welcome back,{" "}
          <span className="font-semibold text-white">
            {displayName}
          </span>
        </div>

        {/* =================================================
            Right Actions
        ================================================= */}

        <div className="flex items-center gap-1">

          {/* Notifications */}

          <Link
            to="/notifications"
            className={iconButton}
            aria-label="Notifications"
          >
            <Bell size={20} />
          </Link>

          {/* Messages */}

          <Link
            to="/messages"
            className={iconButton}
            aria-label="Messages"
          >
            <MessageSquare size={20} />
          </Link>

          {/* =================================================
              Profile Dropdown
          ================================================= */}

          <div
            className="relative ml-2"
            ref={menuRef}
          >
            {/* Avatar Button */}

            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  (open) => !open
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-500"
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              {initial}
            </button>

            {/* Dropdown */}

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-xl">

                {/* User Information */}

                <div className="border-b border-slate-800 px-3 py-2">
                  <p className="truncate text-sm font-semibold text-white">
                    {displayName}
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    {user?.email || ""}
                  </p>
                </div>

                {/* Profile */}

                <Link
                  to="/profile"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <User size={16} />
                  Profile
                </Link>

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-slate-800 hover:text-red-300"
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;