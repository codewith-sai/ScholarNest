import { AlertCircle, X } from "lucide-react";

const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
  onClose,
  className = "",
}) => {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 ${className}`}
    >
      {/* Icon */}
      <div className="mt-0.5 shrink-0 text-red-400">
        <AlertCircle size={19} />
      </div>

      {/* Message */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-red-400">
          Error
        </p>

        <p className="mt-1 text-sm leading-5 text-red-300/80">
          {message}
        </p>
      </div>

      {/* Close */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          aria-label="Close error message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;