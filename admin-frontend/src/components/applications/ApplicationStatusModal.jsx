import { useEffect, useState } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Clock3,
  Eye,
  FileText,
} from "lucide-react";

import StatusBadge from "../common/StatusBadge";

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    description: "Application is waiting for processing.",
    icon: Clock3,
    className:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  },
  {
    value: "under_review",
    label: "Under Review",
    description: "Application is currently being reviewed.",
    icon: Eye,
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-400",
  },
  {
    value: "approved",
    label: "Approved",
    description: "Application has been approved.",
    icon: CheckCircle,
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  {
    value: "rejected",
    label: "Rejected",
    description: "Application has been rejected.",
    icon: XCircle,
    className:
      "border-red-500/30 bg-red-500/10 text-red-400",
  },
];

const ApplicationStatusModal = ({
  application,
  open = false,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [status, setStatus] = useState("pending");
  const [adminRemark, setAdminRemark] = useState("");

  useEffect(() => {
    if (!application) return;

    setStatus(application.status || "pending");
    setAdminRemark(application.adminRemark || "");
  }, [application]);

  if (!open || !application) {
    return null;
  }

  const student = application.student || {};
  const scholarship = application.scholarship || {};

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit?.({
      status,
      adminRemark: adminRemark.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose?.();
        }
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <FileText size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                Update Application
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Change status and add an admin remark.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            title="Close"
          >
            <X size={18} />
          </button>

        </div>

        {/* =====================================================
            APPLICATION INFO
        ===================================================== */}

        <div className="border-b border-white/10 bg-white/[0.02] p-5">

          <p className="text-xs text-slate-600">
            Student
          </p>

          <p className="mt-1 text-sm font-medium text-slate-200">
            {student.name ||
              application.studentName ||
              "Unknown Student"}
          </p>

          <p className="mt-3 text-xs text-slate-600">
            Scholarship
          </p>

          <p className="mt-1 text-sm font-medium text-slate-300">
            {scholarship.title ||
              application.scholarshipTitle ||
              "Scholarship"}
          </p>

          <div className="mt-3">
            <StatusBadge
              status={application.status || "pending"}
            />
          </div>

        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form onSubmit={handleSubmit}>

          <div className="space-y-5 p-5">

            {/* STATUS */}

            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Application Status
              </label>

              <div className="grid gap-2">

                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  const selected =
                    status === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setStatus(option.value)
                      }
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                        selected
                          ? option.className
                          : "border-white/10 bg-white/[0.02] text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          selected
                            ? "bg-black/10"
                            : "bg-white/5"
                        }`}
                      >
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-medium">
                          {option.label}
                        </p>

                        <p className="mt-0.5 text-xs opacity-70">
                          {option.description}
                        </p>

                      </div>

                      {selected && (
                        <CheckCircle
                          size={17}
                          className="ml-auto shrink-0"
                        />
                      )}

                    </button>
                  );
                })}

              </div>
            </div>

            {/* REMARK */}

            <div>

              <label
                htmlFor="adminRemark"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Admin Remark
              </label>

              <textarea
                id="adminRemark"
                value={adminRemark}
                onChange={(event) =>
                  setAdminRemark(event.target.value)
                }
                rows={5}
                maxLength={1000}
                disabled={loading}
                placeholder="Add a remark for the student..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 transition focus:border-purple-500 disabled:opacity-50"
              />

              <div className="mt-1 flex justify-end">
                <span className="text-[11px] text-slate-700">
                  {adminRemark.length}/1000
                </span>
              </div>

            </div>

          </div>

          {/* ===================================================
              FOOTER
          =================================================== */}

          <div className="flex justify-end gap-3 border-t border-white/10 p-5">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {loading
                ? "Updating..."
                : "Update Application"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default ApplicationStatusModal;