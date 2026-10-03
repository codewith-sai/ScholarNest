import {
  Eye,
  GraduationCap,
  User,
  CalendarDays,
  Clock3,
} from "lucide-react";

import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";

const ApplicationTable = ({
  applications = [],
  loading = false,
  onView,
}) => {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="hidden border-b border-white/10 px-5 py-4 lg:grid lg:grid-cols-6 lg:gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-3 animate-pulse rounded bg-white/10"
            />
          ))}
        </div>

        <div className="space-y-3 p-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-xl bg-white/[0.03]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No applications found"
        description="There are no scholarship applications matching your current filters."
      />
    );
  }

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStudent = (application) =>
    application.student || {};

  const getScholarship = (application) =>
    application.scholarship || {};

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-x-auto lg:block">

        <table className="w-full min-w-[1050px]">

          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Student
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Scholarship
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Applied On
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Updated
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">

            {applications.map((application) => {
              const student = getStudent(application);
              const scholarship =
                getScholarship(application);

              return (
                <tr
                  key={application._id}
                  className="transition hover:bg-white/[0.02]"
                >

                  {/* STUDENT */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                        <User size={17} />
                      </div>

                      <div className="min-w-0">

                        <p className="max-w-[190px] truncate text-sm font-medium text-slate-200">
                          {student.name ||
                            application.studentName ||
                            "Unknown Student"}
                        </p>

                        <p className="mt-1 max-w-[210px] truncate text-xs text-slate-600">
                          {student.email ||
                            application.studentEmail ||
                            "No email"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* SCHOLARSHIP */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <GraduationCap size={17} />
                      </div>

                      <div className="min-w-0">

                        <p className="max-w-[230px] truncate text-sm text-slate-300">
                          {scholarship.title ||
                            application.scholarshipTitle ||
                            "Scholarship"}
                        </p>

                        <p className="mt-1 max-w-[230px] truncate text-xs text-slate-600">
                          {scholarship.provider ||
                            application.provider ||
                            "Unknown Provider"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* APPLIED DATE */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2 text-sm text-slate-400">

                      <CalendarDays
                        size={14}
                        className="text-slate-600"
                      />

                      {formatDate(
                        application.createdAt ||
                          application.appliedAt
                      )}

                    </div>

                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">

                    <StatusBadge
                      status={
                        application.status ||
                        "pending"
                      }
                    />

                  </td>

                  {/* UPDATED */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2 text-xs text-slate-500">

                      <Clock3
                        size={13}
                        className="text-slate-600"
                      />

                      {formatDate(
                        application.updatedAt
                      )}

                    </div>

                  </td>

                  {/* ACTION */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end">

                      <button
                        type="button"
                        onClick={() =>
                          onView?.(application)
                        }
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-purple-500/10 hover:text-purple-400"
                        title="View application"
                      >
                        <Eye size={17} />
                      </button>

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          MOBILE / TABLET CARDS
      ===================================================== */}

      <div className="divide-y divide-white/5 lg:hidden">

        {applications.map((application) => {
          const student = getStudent(application);
          const scholarship =
            getScholarship(application);

          return (
            <div
              key={application._id}
              className="p-4 transition hover:bg-white/[0.02] sm:p-5"
            >

              {/* TOP */}

              <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                    <User size={17} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-200">
                      {student.name ||
                        application.studentName ||
                        "Unknown Student"}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-600">
                      {student.email ||
                        application.studentEmail ||
                        "No email"}
                    </p>

                  </div>

                </div>

                <StatusBadge
                  status={
                    application.status ||
                    "pending"
                  }
                />

              </div>

              {/* SCHOLARSHIP */}

              <div className="mt-4 rounded-xl bg-white/[0.02] p-3">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Scholarship
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <GraduationCap
                    size={14}
                    className="shrink-0 text-slate-600"
                  />

                  <p className="truncate text-sm text-slate-300">
                    {scholarship.title ||
                      application.scholarshipTitle ||
                      "Scholarship"}
                  </p>

                </div>

                <p className="mt-1 truncate pl-5 text-xs text-slate-600">
                  {scholarship.provider ||
                    application.provider ||
                    "Unknown Provider"}
                </p>

              </div>

              {/* DETAILS */}

              <div className="mt-3 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-white/[0.02] p-3">

                  <p className="text-[11px] uppercase tracking-wide text-slate-600">
                    Applied On
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-300">

                    <CalendarDays
                      size={13}
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
                    Updated
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-300">

                    <Clock3
                      size={13}
                      className="text-slate-600"
                    />

                    {formatDate(
                      application.updatedAt
                    )}

                  </div>

                </div>

              </div>

              {/* REMARK */}

              {application.adminRemark && (
                <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">

                  <p className="text-[11px] uppercase tracking-wide text-slate-600">
                    Admin Remark
                  </p>

                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-400">
                    {application.adminRemark}
                  </p>

                </div>
              )}

              {/* ACTION */}

              <div className="mt-4 flex justify-end border-t border-white/5 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    onView?.(application)
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-purple-500/10 hover:text-purple-400"
                >
                  <Eye size={14} />
                  View Application
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default ApplicationTable;