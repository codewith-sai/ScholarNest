import {
  ArrowRight,
  Bookmark,
  FileText,
  GraduationCap,
  Search,
  User,
} from "lucide-react";

import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* ==============================
          Header
      ============================== */}

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
          <GraduationCap size={17} />

          Personalized Scholarship Discovery
        </div>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          Welcome to ScholarNet 👋
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Discover scholarships based on your
          education, category, income, location,
          academic performance, and eligibility.
        </p>
      </div>

      {/* ==============================
          Quick Actions
      ============================== */}

      <div className="grid gap-5 md:grid-cols-3">
        {/* Find Scholarships */}

        <Link
          to="/scholarships"
          className="
            group
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-blue-500/50
          "
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Search size={24} />
          </div>

          <h2 className="text-lg font-bold">
            Find Scholarships
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Search and discover scholarship
            opportunities based on your profile.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-400">
            Explore Scholarships

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </Link>

        {/* Saved */}

        <Link
          to="/saved-scholarships"
          className="
            group
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-purple-500/50
          "
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Bookmark size={24} />
          </div>

          <h2 className="text-lg font-bold">
            Saved Scholarships
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Keep track of scholarships you are
            interested in applying for.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-purple-400">
            View Saved

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </Link>

        {/* Applications */}

        <Link
          to="/applications"
          className="
            group
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-emerald-500/50
          "
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <FileText size={24} />
          </div>

          <h2 className="text-lg font-bold">
            Applications
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Track your scholarship applications
            and their current status.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-400">
            View Applications

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </Link>
      </div>

      {/* ==============================
          Profile
      ============================== */}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <User size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                Complete your profile
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
                Add your academic, financial, and
                category information to get better
                scholarship matches.
              </p>
            </div>
          </div>

          <Link
            to="/profile"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            <User size={17} />

            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;