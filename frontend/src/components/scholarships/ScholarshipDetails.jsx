import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  CheckCircle,
  ExternalLink,
  FileText,
  GraduationCap,
  IndianRupee,
  MapPin,
  Users,
} from "lucide-react";

const ScholarshipDetails = ({
  scholarship = {},
  isSaved = false,
  onSave,
  onApply,
  onBack,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 25,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

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

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getDeadlineStatus = () => {
    if (!scholarship?.deadline) {
      return {
        text: "Deadline not specified",
        className: "text-gray-500",
      };
    }

    const deadline = new Date(scholarship.deadline);
    const today = new Date();

    if (Number.isNaN(deadline.getTime())) {
      return {
        text: "Deadline not specified",
        className: "text-gray-500",
      };
    }

    const daysLeft = Math.ceil(
      (deadline.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
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

  const deadlineStatus = getDeadlineStatus();

  const eligibilityCriteria =
    scholarship?.eligibilityCriteria ||
    scholarship?.eligibility ||
    [];

  const requiredDocuments =
    scholarship?.requiredDocuments ||
    scholarship?.documents ||
    [];

  const benefits = scholarship?.benefits || [];

  const normalizeList = (value) => {
    if (Array.isArray(value)) return value;

    if (typeof value === "string" && value.trim()) {
      return [value];
    }

    return [];
  };

  const eligibilityList = normalizeList(eligibilityCriteria);
  const documentsList = normalizeList(requiredDocuments);
  const benefitsList = normalizeList(benefits);

  return (
    <section
      ref={containerRef}
      className="w-full"
    >
      {/* Back Button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Scholarships
        </button>
      )}

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-indigo-600 shadow-md">
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
                  <GraduationCap size={30} />
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-indigo-100">
                  {scholarship?.provider ||
                    scholarship?.organization ||
                    "Scholarship Provider"}
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  {scholarship?.name ||
                    scholarship?.title ||
                    "Scholarship"}
                </h1>

                {scholarship?.description && (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
                    {scholarship.description}
                  </p>
                )}
              </div>
            </div>

            {/* Save */}
            {onSave && (
              <button
                type="button"
                onClick={() => onSave(scholarship)}
                className="flex w-fit items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
              >
                <Bookmark
                  size={17}
                  fill={isSaved ? "currentColor" : "none"}
                />

                {isSaved ? "Saved" : "Save"}
              </button>
            )}
          </div>
        </div>

        {/* Quick Information */}
        <div className="grid grid-cols-1 border-b border-gray-100 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:border-r lg:border-b-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <IndianRupee size={19} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Amount
              </p>

              <p className="text-sm font-semibold text-gray-800">
                {formatAmount(
                  scholarship?.amount ||
                    scholarship?.scholarshipAmount
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-gray-100 p-5 lg:border-b-0 lg:border-r">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <CalendarDays size={19} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Deadline
              </p>

              <p className="text-sm font-semibold text-gray-800">
                {formatDate(scholarship?.deadline)}
              </p>

              <p
                className={`text-xs font-medium ${deadlineStatus.className}`}
              >
                {deadlineStatus.text}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:border-r lg:border-b-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MapPin size={19} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Location
              </p>

              <p className="text-sm font-semibold text-gray-800">
                {scholarship?.state ||
                  scholarship?.location ||
                  "All India"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Users size={19} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Category
              </p>

              <p className="text-sm font-semibold text-gray-800">
                {scholarship?.category ||
                  "Multiple Categories"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-3 lg:p-8">
          {/* Main Details */}
          <div className="space-y-8 lg:col-span-2">
            {/* About */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                About the Scholarship
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                {scholarship?.fullDescription ||
                  scholarship?.description ||
                  "Detailed scholarship information is not available."}
              </p>
            </div>

            {/* Eligibility */}
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle
                  size={19}
                  className="text-green-600"
                />

                <h2 className="text-lg font-semibold text-gray-900">
                  Eligibility Criteria
                </h2>
              </div>

              {eligibilityList.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {eligibilityList.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-start gap-3 text-sm leading-6 text-gray-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  Eligibility criteria are available on the
                  official scholarship application page.
                </p>
              )}
            </div>

            {/* Benefits */}
            {benefitsList.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Benefits
                </h2>

                <ul className="mt-4 space-y-3">
                  {benefitsList.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-start gap-3 text-sm leading-6 text-gray-600"
                    >
                      <CheckCircle
                        size={17}
                        className="mt-1 shrink-0 text-green-600"
                      />

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Documents */}
            <div>
              <div className="flex items-center gap-2">
                <FileText
                  size={19}
                  className="text-indigo-600"
                />

                <h2 className="text-lg font-semibold text-gray-900">
                  Required Documents
                </h2>
              </div>

              {documentsList.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {documentsList.map((document, index) => (
                    <li
                      key={`${document}-${index}`}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                      <span>{document}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  Required documents may vary. Check the
                  official application instructions.
                </p>
              )}
            </div>
          </div>

          {/* Application Sidebar */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h2 className="text-base font-semibold text-gray-900">
                Application
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-400">
                    Application Deadline
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {formatDate(scholarship?.deadline)}
                  </p>
                </div>

                {scholarship?.educationLevel && (
                  <div>
                    <p className="text-xs text-gray-400">
                      Education Level
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {scholarship.educationLevel}
                    </p>
                  </div>
                )}

                {scholarship?.course && (
                  <div>
                    <p className="text-xs text-gray-400">
                      Course / Stream
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {scholarship.course}
                    </p>
                  </div>
                )}
              </div>

              {onApply && (
                <button
                  type="button"
                  onClick={() => onApply(scholarship)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
                >
                  Apply Now
                  <ExternalLink size={17} />
                </button>
              )}

              {scholarship?.applicationUrl && (
                <a
                  href={scholarship.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Official Application Page
                  <ExternalLink size={16} />
                </a>
              )}

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 p-3">
                <CheckCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-xs leading-5 text-blue-700">
                  Verify the latest eligibility criteria and
                  deadline on the official scholarship website
                  before applying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScholarshipDetails;