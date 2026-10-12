import {
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";

const ScholarshipTable = ({
  scholarships = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="hidden border-b border-white/10 px-5 py-4 md:grid md:grid-cols-6 md:gap-4">
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

  if (scholarships.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No scholarships found"
        description="Create a scholarship or change your search criteria."
      />
    );
  }

  const formatAmount = (amount) => {
    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return "N/A";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "No deadline";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-x-auto lg:block">

        <table className="w-full min-w-[900px]">

          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Scholarship
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Amount
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Deadline
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Category
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                Actions
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">

            {scholarships.map((scholarship) => (
              <tr
                key={scholarship._id}
                className="transition hover:bg-white/[0.02]"
              >

                {/* SCHOLARSHIP */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                      <GraduationCap size={19} />
                    </div>

                    <div className="min-w-0">

                      <p className="max-w-[260px] truncate text-sm font-medium text-slate-200">
                        {scholarship.title ||
                          "Untitled Scholarship"}
                      </p>

                      <p className="mt-1 max-w-[260px] truncate text-xs text-slate-600">
                        {scholarship.provider ||
                          "Unknown Provider"}
                      </p>

                    </div>

                  </div>

                </td>

                {/* AMOUNT */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-1.5 text-sm text-slate-300">
                    <IndianRupee size={14} className="text-slate-600" />
                    {formatAmount(
                      scholarship.amount
                    ).replace("₹", "")}
                  </div>

                </td>

                {/* DEADLINE */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-1.5 text-sm text-slate-400">
                    <CalendarDays
                      size={14}
                      className="text-slate-600"
                    />

                    {formatDate(
                      scholarship.deadline
                    )}
                  </div>

                </td>

                {/* CATEGORY */}
                <td className="px-5 py-4">

                  <span className="text-sm text-slate-400">
                    {scholarship.category || "All"}
                  </span>

                </td>

                {/* STATUS */}
                <td className="px-5 py-4">

                  <StatusBadge
                    status={
                      scholarship.active
                        ? "active"
                        : "inactive"
                    }
                  />

                </td>

                {/* ACTIONS */}
                <td className="px-5 py-4">

                  <div className="flex justify-end gap-1">

                    <button
                      type="button"
                      onClick={() =>
                        onView?.(scholarship)
                      }
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                      title="View scholarship"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onEdit?.(scholarship)
                      }
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-purple-500/10 hover:text-purple-400"
                      title="Edit scholarship"
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete?.(scholarship)
                      }
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                      title="Delete scholarship"
                    >
                      <Trash2 size={17} />
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

        {scholarships.map((scholarship) => (
          <div
            key={scholarship._id}
            className="p-4 transition hover:bg-white/[0.02] sm:p-5"
          >

            {/* TOP */}
            <div className="flex items-start justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <GraduationCap size={19} />
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold text-slate-200">
                    {scholarship.title ||
                      "Untitled Scholarship"}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-600">
                    {scholarship.provider ||
                      "Unknown Provider"}
                  </p>

                </div>

              </div>

              <StatusBadge
                status={
                  scholarship.active
                    ? "active"
                    : "inactive"
                }
              />

            </div>

            {/* DETAILS */}
            <div className="mt-4 grid grid-cols-2 gap-3">

              <div className="rounded-xl bg-white/[0.02] p-3">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Amount
                </p>

                <div className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-300">
                  <IndianRupee size={13} />
                  {formatAmount(
                    scholarship.amount
                  ).replace("₹", "")}
                </div>

              </div>

              <div className="rounded-xl bg-white/[0.02] p-3">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Deadline
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <CalendarDays size={13} />
                  {formatDate(
                    scholarship.deadline
                  )}
                </div>

              </div>

              <div className="rounded-xl bg-white/[0.02] p-3">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Category
                </p>

                <p className="mt-1 truncate text-sm text-slate-300">
                  {scholarship.category || "All"}
                </p>

              </div>

              <div className="rounded-xl bg-white/[0.02] p-3">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  State
                </p>

                <p className="mt-1 truncate text-sm text-slate-300">
                  {scholarship.state || "All States"}
                </p>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex justify-end gap-2 border-t border-white/5 pt-4">

              <button
                type="button"
                onClick={() =>
                  onView?.(scholarship)
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Eye size={14} />
                View
              </button>

              <button
                type="button"
                onClick={() =>
                  onEdit?.(scholarship)
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-purple-500/10 hover:text-purple-400"
              >
                <Edit size={14} />
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete?.(scholarship)
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 size={14} />
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default ScholarshipTable;