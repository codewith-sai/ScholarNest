import {
  FileText,
  ExternalLink,
  CheckCircle,
  Clock3,
  XCircle,
} from "lucide-react";

import EmptyState from "../common/EmptyState";

const StudentDocuments = ({
  documents = [],
  onVerify,
  verifyingId = null,
}) => {
  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents"
        description="This student has not uploaded any documents yet."
      />
    );
  }

  const getStatus = (document) => {
    if (document.verified === true) {
      return {
        label: "Verified",
        className:
          "bg-emerald-500/10 text-emerald-400",
        icon: CheckCircle,
      };
    }

    if (document.verified === false) {
      return {
        label: "Pending Verification",
        className:
          "bg-yellow-500/10 text-yellow-400",
        icon: Clock3,
      };
    }

    return {
      label: "Not Verified",
      className:
        "bg-slate-500/10 text-slate-400",
      icon: XCircle,
    };
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-white/10 p-5 sm:p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <FileText size={19} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              Student Documents
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Uploaded documents and verification status
            </p>
          </div>

        </div>

      </div>

      {/* =====================================================
          DOCUMENT LIST
      ===================================================== */}

      <div className="divide-y divide-white/5">

        {documents.map((document) => {

          const status = getStatus(document);
          const StatusIcon = status.icon;

          const documentId =
            document._id || document.id;

          const isVerifying =
            verifyingId === documentId;

          return (
            <div
              key={documentId}
              className="p-5 transition hover:bg-white/[0.02]"
            >

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                {/* DOCUMENT INFO */}

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-slate-400">
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-slate-200">
                      {document.name ||
                        "Unnamed Document"}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-600">
                      {document.fileName ||
                        "File name unavailable"}
                    </p>

                    {document.type && (
                      <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-700">
                        {document.type}
                      </p>
                    )}

                  </div>

                </div>

                {/* STATUS + ACTIONS */}

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">

                  {/* STATUS */}

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${status.className}`}
                  >
                    <StatusIcon size={13} />
                    {status.label}
                  </span>

                  {/* VIEW */}

                  {document.url && (
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                      <ExternalLink size={14} />
                      View
                    </a>
                  )}

                  {/* VERIFY */}

                  {onVerify && (
                    <button
                      type="button"
                      disabled={isVerifying}
                      onClick={() =>
                        onVerify(
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
                      {isVerifying ? (
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
                  )}

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default StudentDocuments;