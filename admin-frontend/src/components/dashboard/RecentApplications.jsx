import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";

const RecentApplications = ({
  applications = [],
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-3 w-56 animate-pulse rounded bg-white/5" />
          </div>

          <div className="h-9 w-24 animate-pulse rounded-lg bg-white/5" />
        </div>

        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-xl bg-white/[0.03]"
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
            Recent Applications
          </h2>

          <p className="mt-1 text-xs text-slate-600">
            Latest scholarship applications
          </p>
        </div>

        <Link
          to="/admin/applications"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-purple-400 transition hover:bg-purple-500/10"
        >
          View All
          <ArrowRight size={14} />
        </Link>

      </div>

      {/* CONTENT */}
      {applications.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={ClipboardList}
            title="No applications yet"
            description="Scholarship applications will appear here."
          />
        </div>
      ) : (
        <div className="divide-y divide-white/5">

          {applications.slice(0, 5).map((application) => {

            const studentName =
              application.student?.name ||
              application.studentName ||
              "Unknown Student";

            const scholarshipTitle =
              application.scholarship?.title ||
              application.scholarshipTitle ||
              "Scholarship";

            const status =
              application.status || "pending";

            return (
              <div
                key={application._id}
                className="flex flex-col gap-3 p-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
              >

                {/* STUDENT */}
                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-sm font-semibold text-purple-400">
                    {studentName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-slate-200">
                      {studentName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-600">
                      {scholarshipTitle}
                    </p>

                  </div>

                </div>

                {/* STATUS */}
                <div className="flex items-center gap-3">
                  <StatusBadge status={status} />
                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default RecentApplications;