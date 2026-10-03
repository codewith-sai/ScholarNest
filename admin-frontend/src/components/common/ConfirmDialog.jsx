import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
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

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-white/10 p-5">

          <div className="flex items-center gap-3">

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                danger
                  ? "bg-red-500/10 text-red-400"
                  : "bg-purple-500/10 text-purple-400"
              }`}
            >
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                {title}
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Please confirm this action.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            title="Close"
          >
            <X size={18} />
          </button>

        </div>

        {/* MESSAGE */}

        <div className="p-5">

          <p className="text-sm leading-6 text-slate-400">
            {message}
          </p>

        </div>

        {/* ACTIONS */}

        <div className="flex justify-end gap-3 border-t border-white/10 p-5">

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              danger
                ? "bg-red-600 hover:bg-red-500"
                : "bg-purple-600 hover:bg-purple-500"
            }`}
          >
            {loading
              ? "Processing..."
              : confirmText}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmDialog;