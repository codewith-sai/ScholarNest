import { useState } from "react";
import {
  Menu,
  X,
  GraduationCap,
  Search,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Home",
      href: "#home",
    },
    {
      name: "Scholarships",
      href: "#scholarships",
    },
    {
      name: "How It Works",
      href: "#how-it-works",
    },
    {
      name: "About",
      href: "#about",
    },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= LOGO ================= */}
        <a
          href="#home"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
            <GraduationCap size={23} />
          </div>

          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900">
              Scholar
              <span className="text-indigo-600">
                Net
              </span>
            </h1>

            <p className="hidden text-[10px] font-medium text-slate-500 sm:block">
              Discover. Understand. Apply.
            </p>
          </div>
        </a>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Search */}
          <button
            type="button"
            aria-label="Search scholarships"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Search size={19} />
          </button>

          {/* Explore */}
          <a
            href="#scholarships"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Explore Scholarships
          </a>
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          type="button"
          onClick={() =>
            setIsMenuOpen((current) => !current)
          }
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 md:hidden"
        >
          {isMenuOpen ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <a
                href="#scholarships"
                onClick={closeMenu}
                className="block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-center text-sm font-bold text-white"
              >
                Explore Scholarships
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;