import {
  FileText,
  ExternalLink,
  CheckCircle,
  Clock3,
  XCircle,
  User,
} from "lucide-react";

import EmptyState from "../common/EmptyState";

const DocumentTable = ({
  documents = [],
  loading = false,
  onVerify,
  verifyingId = null,
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

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents found"
        description="Student documents will appear here after they are uploaded."
      />
    );
  }

  const getVerificationStatus = (verified) => {
    if (verified === true) {
      return {
        label: "Verified",
        className: "bg-emerald-500/10 text-emerald-400",
        icon: CheckCircle,
      };
    }

    return {
      label: "Pending",
      className: "bg-yellow-500/10 text-yellow-400",
      icon: Clock3,
    };
  };

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
                Document
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Type
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Uploaded
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

            {documents.map((document) => {
              const status = getVerificationStatus(
                document.verified
              );

              const StatusIcon = status.icon;

              const documentId =
                document._id || document.id;

              const isUpdating =
                verifyingId === documentId;

              const student =
                document.student || {};

              return (
                <tr
                  key={documentId}
                  className="transition hover:bg-white/[0.02]"
                >

                  {/* STUDENT */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                        <User size={16} />
                      </div>

                      <div className="min-w-0">

                        <p className="max-w-[180px] truncate text-sm font-medium text-slate-200">
                          {student.name ||
                            document.studentName ||
                            "Unknown Student"}
                        </p>

                        <p className="mt-1 max-w-[200px] truncate text-xs text-slate-600">
                          {student.email ||
                            document.studentEmail ||
                            "No email"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* DOCUMENT */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400">
                        <FileText size={17} />
                      </div>

                      <div className="min-w-0">

                        <p className="max-w-[220px] truncate text-sm text-slate-300">
                          {document.name ||
                            "Unnamed Document"}
                        </p>

                        <p className="mt-1 max-w-[220px] truncate text-xs text-slate-600">
                          {document.fileName ||
                            "File unavailable"}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* TYPE */}

                  <td className="px-5 py-4">

                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      {document.type || "Document"}
                    </span>

                  </td>

                  {/* DATE */}

                  <td className="px-5 py-4">

                    <span className="text-sm text-slate-400">
                      {formatDate(document.uploadedAt)}
                    </span>

                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${status.className}`}
                    >
                      <StatusIcon size={13} />
                      {status.label}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      {document.url && (
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                          title="View document"
                        >
                          <ExternalLink size={17} />
                        </a>
                      )}

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          onVerify?.(
                            document,
                            !document.verified
                          )
                        }
                        className={`rounded-lg p-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          document.verified
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                        title={
                          document.verified
                            ? "Unverify document"
                            : "Verify document"
                        }
                      >
                        {isUpdating ? (
                          <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : document.verified ? (
                          <XCircle size={17} />
                        ) : (
                          <CheckCircle size={17} />
                        )}
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

        {documents.map((document) => {
          const status = getVerificationStatus(
            document.verified
          );

          const StatusIcon = status.icon;

          const documentId =
            document._id || document.id;

          const isUpdating =
            verifyingId === documentId;

          const student =
            document.student || {};

          return (
            <div
              key={documentId}
              className="p-4 transition hover:bg-white/[0.02] sm:p-5"
            >

              {/* TOP */}

              <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-slate-400">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-200">
                      {document.name ||
                        "Unnamed Document"}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-600">
                      {document.fileName ||
                        "File unavailable"}
                    </p>

                  </div>

                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                >
                  <StatusIcon size={12} />
                  {status.label}
                </span>

              </div>

              {/* STUDENT */}

              <div className="mt-4 rounded-xl bg-white/[0.02] p-3">

                <p className="text-[11px] uppercase tracking-wide text-slate-600">
                  Student
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <User
                    size={14}
                    className="text-slate-600"
                  />

                  <span className="truncate text-sm text-slate-300">
                    {student.name ||
                      document.studentName ||
                      "Unknown Student"}
                  </span>

                </div>

                <p className="mt-1 truncate pl-5 text-xs text-slate-600">
                  {student.email ||
                    document.studentEmail ||
                    "No email"}
                </p>

              </div>

              {/* DETAILS */}

              <div className="mt-3 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-white/[0.02] p-3">

                  <p className="text-[11px] uppercase tracking-wide text-slate-600">
                    Type
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-300">
                    {document.type || "Document"}
                  </p>

                </div>

                <div className="rounded-xl bg-white/[0.02] p-3">

                  <p className="text-[11px] uppercase tracking-wide text-slate-600">
                    Uploaded
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    {formatDate(document.uploadedAt)}
                  </p>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="mt-4 flex justify-end gap-2 border-t border-white/5 pt-4">

                {document.url && (
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-blue-500/10 hover:text-blue-400"
                  >
                    <ExternalLink size={14} />
                    View
                  </a>
                )}

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() =>
                    onVerify?.(
                      document,
                      !document.verified
                    )
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    document.verified
                      ? "border border-red-500/20 text-red-400 hover:bg-red-500/10"
                      : "bg-emerald-600 text-white hover:bg-emerald-500"
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Updating...
                    </>
                  ) : document.verified ? (
                    <>
                      <XCircle size={14} />
                      Unverify
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      Verify
                    </>
                  )}
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default DocumentTable;