import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ErrorBoundary from "../components/ErrorBoundary";

const Layout = ({ showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {showSidebar ? (
        <div className="flex min-h-screen">
          {/* Student Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="min-w-0 flex-1 lg:ml-[260px]">
            <div className="p-4 sm:p-6 lg:p-8">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>
      ) : (
        <>
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
            <a href="/" className="flex items-center gap-2 font-black text-indigo-600 text-lg">
              ScholarNest
            </a>
          </header>

          <main className="min-h-[calc(100vh-64px)]">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </>
      )}
    </div>
  );
};

export default Layout;