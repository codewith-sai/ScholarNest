import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = ({ showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {showSidebar ? (
        <div className="flex min-h-screen">
          {/* Student Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="min-w-0 flex-1 lg:ml-[260px]">
            <Navbar />

            <div className="p-4 sm:p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <>
          <Navbar />

          <main className="min-h-[calc(100vh-64px)]">
            <Outlet />
          </main>
        </>
      )}
    </div>
  );
};

export default Layout;