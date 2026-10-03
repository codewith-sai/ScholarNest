import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import gsap from "gsap";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({
  user = null,
  onLogout,
}) => {
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mainRef.current,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* =========================
          Navbar
      ========================= */}
      <Navbar
        user={user}
        onLogout={onLogout}
      />

      {/* =========================
          Sidebar
      ========================= */}
      <Sidebar />

      {/* =========================
          Main Content
          ========================= */}

      <main
        ref={mainRef}
        className="
          min-h-screen
          ml-0
          bg-[#020617]
          transition-all
          duration-300

          lg:ml-72
        "
      >
        <div
          className="
            min-h-screen
            px-4
            py-6

            sm:px-6
            lg:px-8
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;