import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Scholarships', path: '/admin/scholarships', icon: BookOpen },
    { label: 'Add Scholarship', path: '/admin/scholarships/new', icon: PlusCircle },
    { label: 'Students Registry', path: '/admin/students', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Logo */}
          <div className="h-16 px-6 border-b border-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight">Scholar<span className="text-blue-400">Nest</span></span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition rounded-lg"
          >
            <ExternalLink size={14} />
            <span>Student Dashboard</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            MahaDBT 2.0 & National Scholarship Administration
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {user?.name || 'Administrator'}
            </span>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

