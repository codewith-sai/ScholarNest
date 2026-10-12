import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  text = "Loading...",
  size = 28,
}) => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center">

        <Loader2
          size={size}
          className="animate-spin text-purple-400"
        />

        {text && (
          <p className="mt-3 text-sm text-slate-500">
            {text}
          </p>
        )}

      </div>
    </div>
  );
};

export default LoadingSpinner;