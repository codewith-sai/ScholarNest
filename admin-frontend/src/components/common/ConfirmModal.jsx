import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = true,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-base font-semibold text-white">
            {title}
          </h2>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6">
          <div className="flex items-start gap-4">

            {/* Icon */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                danger
                  ? "bg-red-500/10 text-red-400"
                  : "bg-purple-500/10 text-purple-400"
              }`}
            >
              <AlertTriangle size={21} />
            </div>

            {/* Message */}
            <div>
              <p className="text-sm leading-6 text-slate-400">
                {message}
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;