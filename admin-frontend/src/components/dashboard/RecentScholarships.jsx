import { Link } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";

const RecentScholarships = ({
  scholarships = [],
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-3 w-52 animate-pulse rounded bg-white/5" />
          </div>

          <div className="h-9 w-24 animate-pulse rounded-lg bg-white/5" />
        </div>

        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-xl bg-white/[0.03]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <div>
          <h2 className="text-base font-semibold text-white">
            Recent Scholarships
          </h2>

          <p className="mt-1 text-xs text-slate-600">
            Recently added scholarship opportunities
          </p>
        </div>

        <Link
          to="/admin/scholarships"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-purple-400 transition hover:bg-purple-500/10"
        >
          View All
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* CONTENT */}
      {scholarships.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={GraduationCap}
            title="No scholarships yet"
            description="Create a scholarship to display it here."
          />
        </div>
      ) : (
        <div className="divide-y divide-white/5">

          {scholarships.slice(0, 5).map((scholarship) => {

            const deadline = scholarship.deadline
              ? new Date(scholarship.deadline).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "No deadline";

            return (
              <div
                key={scholarship._id}
                className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
              >

                {/* SCHOLARSHIP INFO */}
                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <GraduationCap size={20} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-slate-200">
                      {scholarship.title || "Untitled Scholarship"}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-600">
                      {scholarship.provider || "Unknown Provider"}
                    </p>

                  </div>

                </div>

                {/* DETAILS */}
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <IndianRupee size={14} />
                    <span>
                      {scholarship.amount
                        ? Number(scholarship.amount).toLocaleString("en-IN")
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    <span>{deadline}</span>
                  </div>

                  <StatusBadge
                    status={
                      scholarship.active
                        ? "active"
                        : "inactive"
                    }
                  />

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default RecentScholarships;