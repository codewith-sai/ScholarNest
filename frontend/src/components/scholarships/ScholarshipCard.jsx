import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Bookmark,
  CalendarDays,
  GraduationCap,
  IndianRupee,
  MapPin,
  ExternalLink,
} from "lucide-react";

const ScholarshipCard = ({
  scholarship = {},
  onView,
  onSave,
  isSaved = false,
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const animation = gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 25,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      y: -6,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const formatAmount = (amount) => {
    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return "Amount varies";
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
      return amount;
    }

    return `₹${numericAmount.toLocaleString("en-IN")}`;
  };

  const formatDeadline = (date) => {
    if (!date) return "No deadline";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No deadline";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDeadlineStatus = (date) => {
    if (!date) {
      return {
        text: "No deadline",
        className: "text-gray-500",
      };
    }

    const deadline = new Date(date);
    const today = new Date();

    if (Number.isNaN(deadline.getTime())) {
      return {
        text: "No deadline",
        className: "text-gray-500",
      };
    }

    const difference =
      deadline.getTime() - today.getTime();

    const daysLeft = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 0) {
      return {
        text: "Deadline passed",
        className: "text-red-600",
      };
    }

    if (daysLeft <= 7) {
      return {
        text: `${daysLeft} day${
          daysLeft !== 1 ? "s" : ""
        } left`,
        className: "text-orange-600",
      };
    }

    return {
      text: `${daysLeft} days left`,
      className: "text-green-600",
    };
  };

  const deadlineStatus = getDeadlineStatus(
    scholarship?.deadline
  );

  const eligibility =
    scholarship?.eligibilityStatus ||
    scholarship?.eligibility ||
    "Check eligibility";

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      {/* Top Section */}
      <div className="border-b border-gray-100 p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Provider / Logo */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50 text-indigo-600">
              {scholarship?.logo || scholarship?.image ? (
                <img
                  src={
                    scholarship.logo ||
                    scholarship.image
                  }
                  alt={
                    scholarship?.provider ||
                    "Scholarship"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <GraduationCap size={22} />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-gray-500">
                {scholarship?.provider ||
                  scholarship?.organization ||
                  "Scholarship Provider"}
              </p>

              <h3 className="mt-0.5 line-clamp-2 text-base font-semibold leading-5 text-gray-900">
                {scholarship?.name ||
                  scholarship?.title ||
                  "Scholarship Name"}
              </h3>
            </div>
          </div>

          {/* Save Button */}
          {onSave && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSave(scholarship);
              }}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition ${
                isSaved
                  ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                  : "border-gray-200 text-gray-400 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
              aria-label={
                isSaved
                  ? "Remove from saved scholarships"
                  : "Save scholarship"
              }
            >
              <Bookmark
                size={17}
                fill={isSaved ? "currentColor" : "none"}
              />
            </button>
          )}
        </div>

        {/* Eligibility */}
        <div className="mt-4">
          <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {eligibility}
          </span>
        </div>
      </div>

      {/* Scholarship Information */}
      <div className="flex flex-1 flex-col p-5">
        {/* Description */}
        <p className="line-clamp-3 text-sm leading-6 text-gray-500">
          {scholarship?.description ||
            "This scholarship provides financial support to eligible students based on the specified criteria."}
        </p>

        {/* Details */}
        <div className="mt-5 grid grid-cols-1 gap-3">
          {/* Amount */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <IndianRupee size={16} />
            </div>

            <div>
              <p className="text-[11px] font-medium text-gray-400">
                Scholarship Amount
              </p>

              <p className="text-sm font-semibold text-gray-800">
                {formatAmount(
                  scholarship?.amount ||
                    scholarship?.scholarshipAmount
                )}
              </p>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <CalendarDays size={16} />
            </div>

            <div>
              <p className="text-[11px] font-medium text-gray-400">
                Application Deadline
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-gray-800">
                  {formatDeadline(
                    scholarship?.deadline
                  )}
                </p>

                <span
                  className={`text-xs font-medium ${deadlineStatus.className}`}
                >
                  {deadlineStatus.text}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          {scholarship?.state && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <MapPin size={16} />
              </div>

              <div>
                <p className="text-[11px] font-medium text-gray-400">
                  Location
                </p>

                <p className="text-sm font-medium text-gray-800">
                  {scholarship.state}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(scholarship?.tags) &&
          scholarship.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {scholarship.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

        {/* Actions */}
        <div className="mt-auto flex gap-3 pt-6">
          {onView && (
            <button
              type="button"
              onClick={() => onView(scholarship)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
            >
              View Details
              <ExternalLink size={15} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ScholarshipCard;