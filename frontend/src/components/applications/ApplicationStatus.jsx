import { useEffect, useRef } from "react";
import gsap from "gsap";

const ApplicationStatus = ({ status = "Pending", progress = 0 }) => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const progressBar = progressRef.current;

    if (!container || !progressBar) return;

    gsap.fromTo(
      container,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      progressBar,
      {
        width: "0%",
      },
      {
        width: `${Math.min(Math.max(progress, 0), 100)}%`,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
      }
    );
  }, [progress]);

  const normalizedStatus = status.toLowerCase();

  const statusConfig = {
    pending: {
      label: "Pending",
      dot: "bg-yellow-500",
      text: "text-yellow-700",
      background: "bg-yellow-50",
      border: "border-yellow-200",
    },

    "under review": {
      label: "Under Review",
      dot: "bg-blue-500",
      text: "text-blue-700",
      background: "bg-blue-50",
      border: "border-blue-200",
    },

    approved: {
      label: "Approved",
      dot: "bg-green-500",
      text: "text-green-700",
      background: "bg-green-50",
      border: "border-green-200",
    },

    rejected: {
      label: "Rejected",
      dot: "bg-red-500",
      text: "text-red-700",
      background: "bg-red-50",
      border: "border-red-200",
    },

    cancelled: {
      label: "Cancelled",
      dot: "bg-gray-500",
      text: "text-gray-700",
      background: "bg-gray-50",
      border: "border-gray-200",
    },
  };

  const currentStatus =
    statusConfig[normalizedStatus] || statusConfig.pending;

  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-xl border p-4 ${currentStatus.background} ${currentStatus.border}`}
    >
      {/* Status Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${currentStatus.dot}`}
          />

          <span
            className={`text-sm font-semibold ${currentStatus.text}`}
          >
            {currentStatus.label}
          </span>
        </div>

        <span className="text-sm font-semibold text-gray-700">
          {safeProgress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/80">
        <div
          ref={progressRef}
          className={`h-full rounded-full ${currentStatus.dot}`}
          style={{ width: "0%" }}
        />
      </div>

      {/* Status Message */}
      <p className="mt-3 text-xs text-gray-600">
        {normalizedStatus === "approved" &&
          "Your scholarship application has been approved."}

        {normalizedStatus === "rejected" &&
          "Your scholarship application was not approved."}

        {normalizedStatus === "under review" &&
          "Your application is currently being reviewed."}

        {normalizedStatus === "pending" &&
          "Your application is waiting for review."}

        {normalizedStatus === "cancelled" &&
          "This scholarship application has been cancelled."}
      </p>
    </div>
  );
};

export default ApplicationStatus;