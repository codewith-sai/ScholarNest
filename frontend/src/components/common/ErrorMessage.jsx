import { useEffect, useRef } from "react";
import gsap from "gsap";

const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
  title = "Error",
  onRetry,
  showRetry = true,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 15,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      }
    );
  }, []);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex w-full items-center justify-center px-4 py-8"
      role="alert"
    >
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
        {/* Error Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3h.008M10.29 3.86l-8.82 15a1.5 1.5 0 001.3 2.25h18.46a1.5 1.5 0 001.3-2.25l-8.82-15a1.5 1.5 0 00-2.6 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-lg font-semibold text-red-800">
          {title}
        </h3>

        {/* Message */}
        <p className="mt-2 text-sm leading-6 text-red-700">
          {message}
        </p>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <button
            type="button"
            onClick={handleRetry}
            className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 active:scale-95"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;