import {
  ClipboardList,
  CalendarDays,
  GraduationCap,
} from "lucide-react";

import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";

const StudentApplicationList = ({
  applications = [],
  onView,
}) => {
  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No applications"
        description="This student has not submitted any scholarship applications yet."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">

      {/* HEADER */}

      <div className="border-b border-white/10 p-5 sm:p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <ClipboardList size={19} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              Scholarship Applications
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Applications submitted by this student
            </p>
          </div>

        </div>

      </div>

      {/* APPLICATIONS */}

      <div className="divide-y divide-white/5">

        {applications.map((application) => {

          const scholarship =
            application.scholarship || {};

          const scholarshipTitle =
            scholarship.title ||
            application.scholarshipTitle ||
            "Scholarship";

          const provider =
            scholarship.provider ||
            application.provider ||
            "Unknown Provider";

          const status =
            application.status || "pending";

          return (
            <div
              key={application._id}
              className="p-5 transition hover:bg-white/[0.02]"
            >

              {/* TOP */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex min-w-0 items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <GraduationCap size={19} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate text-sm font-semibold text-slate-200">
                      {scholarshipTitle}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-600">
                      {provider}
                    </p>

                  </div>

                </div>

                <StatusBadge status={status} />

              </div>

              {/* DETAILS */}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                <div className="rounded-xl bg-white/[0.02] p-3">

                  <p className="text-[11px] uppercase tracking-wide text-slate-600">
                    Applied On
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-300">

                    <CalendarDays
                      size={14}
                      className="text-slate-600"
                    />

                    {formatDate(
                      application.createdAt ||
                        application.appliedAt
                    )}

                  </div>

                </div>

                <div className="rounded-xl bg-white/[0.02] p-3">

                  <p className="text-[11px] uppercase tracking-wide text-slate-600">
                    Application ID
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-300">
                    {application._id || "N/A"}
                  </p>

                </div>

              </div>

              {/* ADMIN REMARK */}

              {application.adminRemark && (
                <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">

                  <p className="text-[11px] uppercase tracking-wide text-slate-600">
                    Admin Remark
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-400">
                    {application.adminRemark}
                  </p>

                </div>
              )}

              {/* ACTION */}

              {onView && (
                <div className="mt-4 flex justify-end">

                  <button
                    type="button"
                    onClick={() => onView(application)}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-purple-500/10 hover:text-purple-400"
                  >
                    View Application
                  </button>

                </div>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default StudentApplicationList;