import {
  Eye,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  UserX,
} from "lucide-react";

import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";

const StudentTable = ({
  students = [],
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

  if (students.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No students found"
        description="There are no students matching your current search."
      />
    );
  }

  const getInitials = (name = "") => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) return "S";

    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-x-auto lg:block">

        <table className="w-full min-w-[1000px]">

          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Student
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Contact
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Academic
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Category
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">

            {students.map((student) => (
              <tr
                key={student._id}
                className="transition hover:bg-white/[0.02]"
              >

                {/* STUDENT */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-xs font-semibold text-purple-400">
                      {getInitials(student.name)}
                    </div>

                    <div className="min-w-0">

                      <p className="max-w-[200px] truncate text-sm font-medium text-slate-200">
                        {student.name || "Unnamed Student"}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {student.role || "student"}
                      </p>

                    </div>

                  </div>

                </td>

                {/* CONTACT */}
                <td className="px-5 py-4">

                  <div className="space-y-1.5">

                    <div className="flex max-w-[220px] items-center gap-2">
                      <Mail
                        size={13}
                        className="shrink-0 text-slate-600"
                      />

                      <span className="truncate text-xs text-slate-400">
                        {student.email || "No email"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone
                        size={13}
                        className="text-slate-600"
                      />

                      <span className="text-xs text-slate-500">
                        {student.phone || "No phone"}
                      </span>
                    </div>

                  </div>

                </td>

                {/* ACADEMIC */}
                <td className="px-5 py-4">

                  <div className="space-y-1">

                    <p className="max-w-[200px] truncate text-sm text-slate-300">
                      {student.course || "Course not specified"}
                    </p>

                    <p className="max-w-[200px] truncate text-xs text-slate-600">
                      {student.branch || "Branch not specified"}
                    </p>

                    {student.institution && (
                      <p className="max-w-[200px] truncate text-xs text-slate-600">
                        {student.institution}
                      </p>
                    )}

                  </div>

                </td>

                {/* CATEGORY */}
                <td className="px-5 py-4">

                  <div className="space-y-1">

                    <p className="text-sm text-slate-400">
                      {student.category || "Not specified"}
                    </p>

                    {student.domicileState && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin size={12} />
                        <span className="max-w-[130px] truncate">
                          {student.domicileState}
                        </span>
                      </div>
                    )}

                  </div>

                </td>

                {/* STATUS */}
                <td className="px-5 py-4">

                  <StatusBadge
                    status={
                      student.isActive
                        ? "active"
                        : "inactive"
                    }
                  />

                </td>

                {/* ACTION */}
                <td className="px-5 py-4">

                  <div className="flex justify-end">

                    <button
                      type="button"
                      onClick={() => onView?.(student)}
                      className="inline-flex items-center gap-1.5 rounded-lg p-2 text-slate-500 transition hover:bg-purple-500/10 hover:text-purple-400"
                      title="View student"
                    >
                      <Eye size={17} />
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          MOBILE / TABLET CARDS
      ===================================================== */}

      <div className="divide-y divide-white/5 lg:hidden">

        {students.map((student) => (
          <div
            key={student._id}
            className="p-4 transition hover:bg-white/[0.02] sm:p-5"
          >

            {/* TOP */}
            <div className="flex items-start justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-sm font-semibold text-purple-400">
                  {getInitials(student.name)}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-slate-200">
                    {student.name || "Unnamed Student"}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-600">
                    {student.email || "No email"}
                  </p>

                </div>

              </div>

              <StatusBadge
                status={
                  student.isActive
                    ? "active"
                    : "inactive"
                }
              />

            </div>

            {/* DETAILS */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* PHONE */}
              <div className="rounded-xl bg-white/[0.02] p-3">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Phone
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                  <Phone size={13} className="text-slate-600" />
                  {student.phone || "Not provided"}
                </div>

              </div>

              {/* COURSE */}
              <div className="rounded-xl bg-white/[0.02] p-3">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Course
                </p>

                <p className="mt-1 truncate text-sm text-slate-300">
                  {student.course || "Not specified"}
                </p>

              </div>

              {/* BRANCH */}
              <div className="rounded-xl bg-white/[0.02] p-3">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Branch
                </p>

                <p className="mt-1 truncate text-sm text-slate-300">
                  {student.branch || "Not specified"}
                </p>

              </div>

              {/* CATEGORY */}
              <div className="rounded-xl bg-white/[0.02] p-3">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Category
                </p>

                <p className="mt-1 truncate text-sm text-slate-300">
                  {student.category || "Not specified"}
                </p>

              </div>

              {/* INSTITUTION */}
              <div className="rounded-xl bg-white/[0.02] p-3 sm:col-span-2">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Institution
                </p>

                <p className="mt-1 truncate text-sm text-slate-300">
                  {student.institution || "Not specified"}
                </p>

              </div>

            </div>

            {/* ACTION */}
            <div className="mt-4 flex justify-end border-t border-white/5 pt-4">

              <button
                type="button"
                onClick={() => onView?.(student)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-purple-500/10 hover:text-purple-400"
              >
                <Eye size={14} />
                View Student
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default StudentTable;