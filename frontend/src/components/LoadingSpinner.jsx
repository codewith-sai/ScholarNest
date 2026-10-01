import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  size = "medium",
  text = "Loading...",
  fullScreen = false,
}) => {
  const sizes = {
    small: {
      spinner: 18,
      text: "text-xs",
    },
    medium: {
      spinner: 28,
      text: "text-sm",
    },
    large: {
      spinner: 42,
      text: "text-base",
    },
  };

  const currentSize = sizes[size] || sizes.medium;

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
        <Loader2
          size={currentSize.spinner}
          className="animate-spin text-indigo-600"
        />
      </div>

      {text && (
        <p
          className={`font-semibold text-slate-500 ${currentSize.text}`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-white/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] w-full items-center justify-center">
      {content}
    </div>
  );
};

export default LoadingSpinner;