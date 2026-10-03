import {
  X,
  User,
  GraduationCap,
  CalendarDays,
  Clock3,
  FileText,
  CheckCircle,
} from "lucide-react";

import StatusBadge from "../common/StatusBadge";

const ApplicationDetailsModal = ({
  application,
  open = false,
  onClose,
  onStatusChange,
  loading = false,
}) => {
  if (!open || !application) {
    return null;
  }

  const student = application.student || {};
  const scholarship = application.scholarship || {};

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              <FileText size={21} />
            </div>

            <div className="min-w-0">

              <h2 className="text-lg font-semibold text-white">
                Application Details
              </h2>

              <p className="mt-1 truncate text-xs text-slate-600">
                ID: {application._id || "N/A"}
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

          {/* STATUS */}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">

            <div>
              <p className="text-xs text-slate-600">
                Current Status
              </p>

              <div className="mt-2">
                <StatusBadge
                  status={
                    application.status || "pending"
                  }
                />
              </div>
            </div>

            {onStatusChange && (
              <select
                value={application.status || "pending"}
                onChange={(event) =>
                  onStatusChange(event.target.value)
                }
                disabled={loading}
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none focus:border-purple-500 disabled:opacity-50"
              >
                <option value="saved">Saved</option>
                <option value="pending">Pending</option>
                <option value="under_review">
                  Under Review
                </option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            )}

          </div>

          {/* STUDENT */}

          <DetailSection
            title="Student Information"
            icon={User}
          >

            <DetailItem
              label="Name"
              value={
                student.name ||
                application.studentName ||
                "Unknown Student"
              }
            />

            <DetailItem
              label="Email"
              value={
                student.email ||
                application.studentEmail ||
                "Not available"
              }
            />

            <DetailItem
              label="Phone"
              value={
                student.phone ||
                application.studentPhone ||
                "Not available"
              }
            />

            <DetailItem
              label="Category"
              value={
                student.category ||
                "Not specified"
              }
            />

          </DetailSection>

          {/* SCHOLARSHIP */}

          <DetailSection
            title="Scholarship Information"
            icon={GraduationCap}
          >

            <DetailItem
              label="Scholarship"
              value={
                scholarship.title ||
                application.scholarshipTitle ||
                "Scholarship"
              }
            />

            <DetailItem
              label="Provider"
              value={
                scholarship.provider ||
                application.provider ||
                "Not available"
              }
            />

            <DetailItem
              label="Deadline"
              value={formatDate(
                scholarship.deadline
              )}
            />

            <DetailItem
              label="Amount"
              value={
                scholarship.amount
                  ? `₹${Number(
                      scholarship.amount
                    ).toLocaleString("en-IN")}`
                  : "Not specified"
              }
            />

          </DetailSection>

          {/* APPLICATION TIMELINE */}

          <DetailSection
            title="Application Timeline"
            icon={CalendarDays}
          >

            <DetailItem
              label="Applied On"
              value={formatDateTime(
                application.createdAt ||
                  application.appliedAt
              )}
            />

            <DetailItem
              label="Last Updated"
              value={formatDateTime(
                application.updatedAt
              )}
              icon={Clock3}
            />

          </DetailSection>

          {/* ADMIN REMARK */}

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">

            <div className="flex items-center gap-2">

              <CheckCircle
                size={17}
                className="text-purple-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Admin Remark
              </h3>

            </div>

            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-400">
              {application.adminRemark ||
                "No admin remark has been added."}
            </p>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="flex justify-end border-t border-white/10 p-5">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

/* =========================================================
   DETAIL SECTION
========================================================= */

const DetailSection = ({
  title,
  icon: Icon,
  children,
}) => {
  return (
    <section className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">

      <div className="mb-4 flex items-center gap-2">

        <Icon
          size={17}
          className="text-purple-400"
        />

        <h3 className="text-sm font-semibold text-white">
          {title}
        </h3>

      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {children}
      </div>

    </section>
  );
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div className="rounded-xl bg-white/[0.02] p-3">

      <p className="text-[11px] uppercase tracking-wide text-slate-600">
        {label}
      </p>

      <div className="mt-1.5 flex items-start gap-2">

        {Icon && (
          <Icon
            size={14}
            className="mt-0.5 shrink-0 text-slate-600"
          />
        )}

        <p className="break-words text-sm text-slate-300">
          {value || "Not available"}
        </p>

      </div>

    </div>
  );
};

export default ApplicationDetailsModal;