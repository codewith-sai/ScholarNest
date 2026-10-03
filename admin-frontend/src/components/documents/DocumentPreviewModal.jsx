import {
  X,
  FileText,
  ExternalLink,
  CheckCircle,
  Clock3,
  Download,
} from "lucide-react";

const DocumentPreviewModal = ({
  document,
  open = false,
  onClose,
}) => {
  if (!open || !document) {
    return null;
  }

  const isImage =
    document.type?.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|webp)$/i.test(
      document.fileName || ""
    );

  const isPdf =
    document.type === "application/pdf" ||
    /\.pdf$/i.test(document.fileName || "");

  const getStatus = () => {
    if (document.verified) {
      return {
        label: "Verified",
        className:
          "bg-emerald-500/10 text-emerald-400",
        icon: CheckCircle,
      };
    }

    return {
      label: "Pending Verification",
      className:
        "bg-yellow-500/10 text-yellow-400",
      icon: Clock3,
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

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

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <FileText size={19} />
            </div>

            <div className="min-w-0">

              <h2 className="truncate text-sm font-semibold text-white sm:text-base">
                {document.name ||
                  document.fileName ||
                  "Document Preview"}
              </h2>

              <p className="mt-1 truncate text-xs text-slate-600">
                {document.fileName ||
                  "File name unavailable"}
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
            PREVIEW
        ===================================================== */}

        <div className="flex min-h-[350px] flex-1 items-center justify-center overflow-auto bg-black/20 p-4 sm:p-6">

          {isImage && document.url ? (
            <img
              src={document.url}
              alt={document.name || "Document"}
              className="max-h-[65vh] max-w-full rounded-lg object-contain shadow-xl"
            />
          ) : isPdf && document.url ? (
            <iframe
              src={document.url}
              title={document.name || "PDF Preview"}
              className="h-[65vh] w-full rounded-lg border border-white/10 bg-white"
            />
          ) : document.url ? (
            <div className="flex flex-col items-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                <FileText size={38} />
              </div>

              <h3 className="mt-5 text-base font-semibold text-white">
                Preview not available
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-600">
                This file type cannot be previewed inside
                the browser. Open the document to view it.
              </p>

              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
              >
                <ExternalLink size={16} />
                Open Document
              </a>

            </div>
          ) : (
            <div className="flex flex-col items-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <FileText size={38} />
              </div>

              <h3 className="mt-5 text-base font-semibold text-white">
                Document unavailable
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                No document URL is available.
              </p>

            </div>
          )}

        </div>

        {/* =====================================================
            DOCUMENT INFORMATION
        ===================================================== */}

        <div className="border-t border-white/10 px-5 py-4">

          <div className="grid gap-3 sm:grid-cols-3">

            <div className="rounded-xl bg-white/[0.03] p-3">

              <p className="text-[11px] uppercase tracking-wide text-slate-600">
                Student
              </p>

              <p className="mt-1 truncate text-sm text-slate-300">
                {document.student?.name ||
                  document.studentName ||
                  "Unknown Student"}
              </p>

            </div>

            <div className="rounded-xl bg-white/[0.03] p-3">

              <p className="text-[11px] uppercase tracking-wide text-slate-600">
                Uploaded
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {formatDate(document.uploadedAt)}
              </p>

            </div>

            <div className="rounded-xl bg-white/[0.03] p-3">

              <p className="text-[11px] uppercase tracking-wide text-slate-600">
                Verification
              </p>

              <span
                className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
              >
                <StatusIcon size={13} />
                {status.label}
              </span>

            </div>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 p-4">

          {document.url && (
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <ExternalLink size={16} />
              Open
            </a>
          )}

          {document.url && (
            <a
              href={document.url}
              download={document.fileName || true}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Download size={16} />
              Download
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default DocumentPreviewModal;