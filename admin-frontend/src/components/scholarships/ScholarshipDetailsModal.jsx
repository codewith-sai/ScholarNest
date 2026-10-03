import {
  X,
  GraduationCap,
  IndianRupee,
  CalendarDays,
  MapPin,
  BookOpen,
  Users,
  Percent,
  BadgeCheck,
} from "lucide-react";

import StatusBadge from "../common/StatusBadge";

const ScholarshipDetailsModal = ({
  scholarship,
  open = false,
  onClose,
  onEdit,
}) => {
  if (!open || !scholarship) {
    return null;
  }

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return "Not specified";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <GraduationCap size={22} />
            </div>

            <div className="min-w-0">

              <h2 className="truncate text-lg font-semibold text-white">
                {scholarship.title ||
                  "Untitled Scholarship"}
              </h2>

              <p className="mt-1 truncate text-sm text-slate-500">
                {scholarship.provider ||
                  "Unknown Provider"}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
            title="Close"
          >
            <X size={19} />
          </button>

        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">

          {/* DESCRIPTION */}

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

            <div className="flex items-center gap-2">
              <BookOpen
                size={17}
                className="text-purple-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Description
              </h3>
            </div>

            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-400">
              {scholarship.description ||
                "No description available."}
            </p>

          </div>

          {/* BASIC DETAILS */}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            <DetailCard
              icon={IndianRupee}
              label="Amount"
              value={formatAmount(
                scholarship.amount
              )}
            />

            <DetailCard
              icon={CalendarDays}
              label="Deadline"
              value={formatDate(
                scholarship.deadline
              )}
            />

            <DetailCard
              icon={BadgeCheck}
              label="Status"
              value={
                <StatusBadge
                  status={
                    scholarship.active
                      ? "active"
                      : "inactive"
                  }
                />
              }
            />

            <DetailCard
              icon={MapPin}
              label="State"
              value={
                scholarship.state ||
                "All States"
              }
            />

            <DetailCard
              icon={Users}
              label="Category"
              value={
                scholarship.category ||
                "All Categories"
              }
            />

            <DetailCard
              icon={BookOpen}
              label="Education Level"
              value={
                scholarship.educationLevel ||
                "All Levels"
              }
            />

          </div>

          {/* ELIGIBILITY */}

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">

            <h3 className="text-sm font-semibold text-white">
              Eligibility Criteria
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              <EligibilityItem
                label="Course"
                value={
                  scholarship.course ||
                  "All Courses"
                }
              />

              <EligibilityItem
                label="Branch"
                value={
                  scholarship.branch ||
                  "All Branches"
                }
              />

              <EligibilityItem
                label="Maximum Annual Income"
                value={
                  scholarship.maxIncome
                    ? formatAmount(
                        scholarship.maxIncome
                      )
                    : "No limit"
                }
              />

              <EligibilityItem
                label="Minimum Percentage"
                value={
                  scholarship.minPercentage !==
                  undefined &&
                  scholarship.minPercentage !==
                    null &&
                  scholarship.minPercentage !== ""
                    ? `${scholarship.minPercentage}%`
                    : "No minimum"
                }
                icon={Percent}
              />

              <EligibilityItem
                label="Minimum CGPA"
                value={
                  scholarship.minCGPA !==
                    undefined &&
                  scholarship.minCGPA !== null &&
                  scholarship.minCGPA !== ""
                    ? scholarship.minCGPA
                    : "No minimum"
                }
              />

              <EligibilityItem
                label="Disability Requirement"
                value={
                  scholarship.disability ||
                  "Any"
                }
              />

            </div>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="flex justify-end gap-3 border-t border-white/10 p-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            Close
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(scholarship)}
              className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
            >
              Edit Scholarship
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

/* =========================================================
   DETAIL CARD
========================================================= */

const DetailCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

      <div className="flex items-center gap-2 text-slate-600">
        <Icon size={15} />

        <span className="text-[11px] uppercase tracking-wide">
          {label}
        </span>
      </div>

      <div className="mt-2 text-sm font-medium text-slate-300">
        {value}
      </div>

    </div>
  );
};

/* =========================================================
   ELIGIBILITY ITEM
========================================================= */

const EligibilityItem = ({
  label,
  value,
  icon: Icon = BadgeCheck,
}) => {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-3">

      <Icon
        size={16}
        className="mt-0.5 shrink-0 text-slate-600"
      />

      <div className="min-w-0">

        <p className="text-[11px] uppercase tracking-wide text-slate-600">
          {label}
        </p>

        <p className="mt-1 truncate text-sm text-slate-300">
          {value}
        </p>

      </div>

    </div>
  );
};

export default ScholarshipDetailsModal;