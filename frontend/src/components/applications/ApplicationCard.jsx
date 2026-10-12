import { useEffect, useRef } from "react";
import gsap from "gsap";

const ApplicationCard = ({ application, onView, onCancel }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.97,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }, []);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -5,
      scale: 1.01,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "under review":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {application?.scholarshipName || "Scholarship Name"}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {application?.organization ||
              application?.provider ||
              "Scholarship Provider"}
          </p>
        </div>

        {/* Status */}
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
            application?.status
          )}`}
        >
          {application?.status || "Pending"}
        </span>
      </div>

      {/* Application information */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-medium text-gray-400">
            Application ID
          </p>

          <p className="mt-1 text-sm font-medium text-gray-800">
            {application?.applicationId ||
              application?._id ||
              "Not Available"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400">
            Applied Date
          </p>

          <p className="mt-1 text-sm font-medium text-gray-800">
            {formatDate(application?.appliedAt || application?.createdAt)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400">
            Last Updated
          </p>

          <p className="mt-1 text-sm font-medium text-gray-800">
            {formatDate(application?.updatedAt)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400">
            Amount
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            {application?.amount
              ? `₹${Number(application.amount).toLocaleString("en-IN")}`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            Application Progress
          </span>

          <span className="text-xs font-semibold text-gray-700">
            {application?.progress ?? 0}%
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{
              width: `${Math.min(
                Math.max(application?.progress ?? 0, 0),
                100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
        {onView && (
          <button
            type="button"
            onClick={() => onView(application)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
          >
            View Details
          </button>
        )}

        {onCancel &&
          !["approved", "rejected", "cancelled"].includes(
            application?.status?.toLowerCase()
          ) && (
            <button
              type="button"
              onClick={() => onCancel(application)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-95"
            >
              Cancel Application
            </button>
          )}
      </div>
    </div>
  );
};

export default ApplicationCard;