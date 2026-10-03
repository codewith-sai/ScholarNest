import { useEffect, useRef } from "react";
import gsap from "gsap";

const LoadingSpinner = ({
  size = "medium",
  message = "Loading...",
  fullScreen = false,
}) => {
  const spinnerRef = useRef(null);

  useEffect(() => {
    if (!spinnerRef.current) return;

    const animation = gsap.to(spinnerRef.current, {
      rotation: 360,
      duration: 1,
      repeat: -1,
      ease: "none",
    });

    return () => {
      animation.kill();
    };
  }, []);

  const sizeClasses = {
    small: "h-5 w-5 border-2",
    medium: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4",
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        ref={spinnerRef}
        className={`${sizeClasses[size] || sizeClasses.medium} rounded-full border-gray-200 border-t-indigo-600`}
      />

      {message && (
        <p className="text-sm font-medium text-gray-500">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;