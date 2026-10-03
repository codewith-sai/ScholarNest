import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  FileText,
  IndianRupee,
  Loader2,
  MapPin,
  Share2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import gsap from "gsap";

import ScholarshipDetailsComponent from "../components/scholarships/ScholarshipDetails";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

import { useScholarship } from "../context/ScholarshipContext";

import api from "../services/api";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const pageRef = useRef(null);

  const {
    selectedScholarship,
    loading,
    error,
    fetchScholarshipById,
    saveScholarship,
    removeSavedScholarship,
    isScholarshipSaved,
  } = useScholarship();

  const [localError, setLocalError] = useState("");
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState("");

  // ============================================================
  // FETCH SCHOLARSHIP
  // ============================================================

  useEffect(() => {
    if (!id) return;

    fetchScholarshipById(id);
  }, [id, fetchScholarshipById]);

  // ============================================================
  // GSAP ANIMATION
  // ============================================================

  useEffect(() => {
    if (!selectedScholarship) return;

    const ctx = gsap.context(() => {
      gsap.from(".details-page-content", {
        opacity: 0,
        y: 25,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".details-back-button", {
        opacity: 0,
        x: -15,
        duration: 0.5,
        ease: "power2.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, [selectedScholarship]);

  // ============================================================
  // SAVE SCHOLARSHIP
  // ============================================================

  const handleSave = async () => {
    if (!selectedScholarship) return;

    const scholarshipId =
      selectedScholarship?._id ||
      selectedScholarship?.id ||
      id;

    try {
      setSaving(true);
      setLocalError("");
      setSuccess("");

      const alreadySaved =
        isScholarshipSaved(scholarshipId);

      const result = alreadySaved
        ? await removeSavedScholarship(scholarshipId)
        : await saveScholarship(scholarshipId);

      if (!result?.success) {
        setLocalError(
          result?.error || "Unable to update saved scholarship."
        );
        return;
      }

      setSuccess(
        alreadySaved
          ? "Scholarship removed from saved scholarships."
          : "Scholarship saved successfully."
      );
    } catch (err) {
      console.error("Save scholarship error:", err);

      if (err?.response?.status === 401) {
        navigate("/login", {
          state: {
            from: location.pathname,
          },
        });

        return;
      }

      setLocalError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save scholarship."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // APPLY FOR SCHOLARSHIP
  // ============================================================

  const handleApply = async () => {
    if (!selectedScholarship || applying) return;

    const scholarshipId =
      selectedScholarship?._id ||
      selectedScholarship?.id ||
      id;

    if (!scholarshipId) {
      setLocalError("Scholarship ID is missing.");
      return;
    }

    try {
      setApplying(true);
      setLocalError("");
      setSuccess("");

      // --------------------------------------------------------
      // CREATE APPLICATION THROUGH BACKEND
      // --------------------------------------------------------

      const response = await api.post(
        "/applications",
        {
          scholarshipId,
        }
      );

      setSuccess(
        response?.data?.message ||
          "Application submitted successfully."
      );

    } catch (err) {
      console.error("Apply scholarship error:", err);

      // --------------------------------------------------------
      // USER IS NOT LOGGED IN
      // --------------------------------------------------------

      if (err?.response?.status === 401) {
        navigate("/login", {
          state: {
            from: location.pathname,
            scholarshipId,
          },
        });

        return;
      }

      // --------------------------------------------------------
      // ALREADY APPLIED
      // --------------------------------------------------------

      if (err?.response?.status === 409) {
        setLocalError(
          err?.response?.data?.message ||
            "You have already applied for this scholarship."
        );

        return;
      }

      // --------------------------------------------------------
      // OTHER BACKEND ERRORS
      // --------------------------------------------------------

      setLocalError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to submit application."
      );
    } finally {
      setApplying(false);
    }
  };

  // ============================================================
  // SHARE SCHOLARSHIP
  // ============================================================

  const handleShare = async () => {
    if (!selectedScholarship) return;

    const title =
      selectedScholarship.title ||
      selectedScholarship.name ||
      "Scholarship";

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check out this scholarship on ScholarNet: ${title}`,
          url,
        });

        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);

        setSuccess(
          "Scholarship link copied to clipboard."
        );

        return;
      }

      setLocalError(
        "Unable to copy scholarship link."
      );
    } catch (err) {
      if (err?.name !== "AbortError") {
        setLocalError(
          "Unable to share this scholarship."
        );
      }
    }
  };

  // ============================================================
  // SCHOLARSHIP DATA
  // ============================================================

  const scholarshipId =
    selectedScholarship?._id ||
    selectedScholarship?.id ||
    id;

  const saved =
    selectedScholarship &&
    isScholarshipSaved(scholarshipId);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading && !selectedScholarship) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <LoadingSpinner
          text="Loading scholarship details..."
          size={32}
        />
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (!selectedScholarship && (error || localError)) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-3xl">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <ErrorMessage
            message={
              localError ||
              error ||
              "Unable to load scholarship."
            }
          />

          <button
            type="button"
            onClick={() => {
              setLocalError("");
              fetchScholarshipById(id);
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ============================================================
  // SCHOLARSHIP NOT FOUND
  // ============================================================

  if (!selectedScholarship) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">

          <FileText
            size={48}
            className="mx-auto text-slate-700"
          />

          <h2 className="mt-4 text-xl font-semibold">
            Scholarship not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The scholarship you are looking for could not
            be found.
          </p>

          <button
            type="button"
            onClick={() => navigate("/scholarships")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            Browse Scholarships
            <ArrowRight size={17} />
          </button>

        </div>
      </div>
    );
  }

  // ============================================================
  // DISPLAY DATA
  // ============================================================

  const scholarshipName =
    selectedScholarship.title ||
    selectedScholarship.name ||
    "Scholarship";

  const provider =
    selectedScholarship.provider ||
    selectedScholarship.organization ||
    selectedScholarship.providerName ||
    "Scholarship Provider";

  const amount =
    selectedScholarship.amount ||
    selectedScholarship.scholarshipAmount ||
    selectedScholarship.awardAmount;

  const deadline =
    selectedScholarship.deadline ||
    selectedScholarship.applicationDeadline;

  const locationValue =
    selectedScholarship.state ||
    selectedScholarship.location ||
    "India";

  const eligibility =
    selectedScholarship.eligibility ||
    selectedScholarship.eligibilityCriteria ||
    [];

  const documents =
    selectedScholarship.requiredDocuments ||
    selectedScholarship.documents ||
    [];

  const benefits =
    selectedScholarship.benefits ||
    selectedScholarship.benefit ||
    [];

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">

        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="details-back-button mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Scholarships
        </button>

        {/* SUCCESS */}

        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 size={17} />
            {success}
          </div>
        )}

        {/* ERROR */}

        {(error || localError) && (
          <div className="mb-5">
            <ErrorMessage
              message={
                localError ||
                error ||
                "Something went wrong."
              }
              onClose={() => setLocalError("")}
            />
          </div>
        )}

        <div className="details-page-content">

          {/* ==================================================
              TOP SUMMARY
          =================================================== */}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              <div className="flex gap-5">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <GraduationCapIcon />
                </div>

                <div>

                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                    <Sparkles size={13} />
                    Scholarship Opportunity
                  </div>

                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {scholarshipName}
                  </h1>

                  <p className="mt-2 text-sm text-slate-400">
                    Offered by{" "}
                    <span className="font-medium text-slate-300">
                      {provider}
                    </span>
                  </p>

                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  title="Share scholarship"
                >
                  <Share2 size={18} />
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    saved
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {saving ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Bookmark
                      size={17}
                      fill={
                        saved
                          ? "currentColor"
                          : "none"
                      }
                    />
                  )}

                  {saved ? "Saved" : "Save"}
                </button>

              </div>
            </div>

            {/* SUMMARY STATS */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <SummaryCard
                icon={IndianRupee}
                label="Scholarship Amount"
                value={
                  amount
                    ? `₹${Number(amount).toLocaleString("en-IN")}`
                    : "Varies"
                }
              />

              <SummaryCard
                icon={Clock}
                label="Application Deadline"
                value={
                  deadline
                    ? formatDate(deadline)
                    : "Check details"
                }
              />

              <SummaryCard
                icon={MapPin}
                label="Location"
                value={locationValue}
              />

              <SummaryCard
                icon={FileText}
                label="Application"
                value="Online"
              />

            </div>
          </div>

          {/* ==================================================
              MAIN CONTENT
          =================================================== */}

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* =================================================
                DETAILS
            ================================================== */}

            <div className="space-y-6">

              {/* ABOUT */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">

                <h2 className="text-xl font-bold">
                  About this Scholarship
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-400">
                  {selectedScholarship.description ||
                    selectedScholarship.about ||
                    "No description has been provided for this scholarship."}
                </p>

              </section>

              {/* ELIGIBILITY */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">

                <h2 className="text-xl font-bold">
                  Eligibility Criteria
                </h2>

                {Array.isArray(eligibility) &&
                eligibility.length > 0 ? (
                  <ul className="mt-5 space-y-3">

                    {eligibility.map((item, index) => (
                      <li
                        key={`eligibility-${index}`}
                        className="flex gap-3 text-sm leading-6 text-slate-400"
                      >
                        <CheckCircle2
                          size={18}
                          className="mt-1 shrink-0 text-emerald-400"
                        />

                        <span>
                          {typeof item === "string"
                            ? item
                            : item?.description ||
                              item?.value ||
                              JSON.stringify(item)}
                        </span>
                      </li>
                    ))}

                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Eligibility details are not available.
                  </p>
                )}

              </section>

              {/* BENEFITS */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">

                <h2 className="text-xl font-bold">
                  Benefits
                </h2>

                {Array.isArray(benefits) &&
                benefits.length > 0 ? (
                  <ul className="mt-5 space-y-3">

                    {benefits.map((item, index) => (
                      <li
                        key={`benefit-${index}`}
                        className="flex gap-3 text-sm leading-6 text-slate-400"
                      >
                        <Sparkles
                          size={18}
                          className="mt-1 shrink-0 text-blue-400"
                        />

                        <span>
                          {typeof item === "string"
                            ? item
                            : item?.description ||
                              item?.value ||
                              JSON.stringify(item)}
                        </span>
                      </li>
                    ))}

                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Benefit details are not available.
                  </p>
                )}

              </section>

              {/* REQUIRED DOCUMENTS */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">

                <h2 className="text-xl font-bold">
                  Required Documents
                </h2>

                {Array.isArray(documents) &&
                documents.length > 0 ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">

                    {documents.map((document, index) => (
                      <div
                        key={`document-${index}`}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-4"
                      >
                        <FileText
                          size={18}
                          className="shrink-0 text-slate-500"
                        />

                        <span className="text-sm text-slate-300">
                          {typeof document === "string"
                            ? document
                            : document?.name ||
                              document?.title ||
                              JSON.stringify(document)}
                        </span>
                      </div>
                    ))}

                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Required document information is not available.
                  </p>
                )}

              </section>

              {/* EXISTING COMPONENT */}

              <ScholarshipDetailsComponent
                scholarship={selectedScholarship}
                isSaved={saved}
                onSave={handleSave}
                onApply={handleApply}
                onBack={() => navigate(-1)}
              />

            </div>

            {/* =================================================
                SIDEBAR
            ================================================== */}

            <aside className="h-fit space-y-5 lg:sticky lg:top-6">

              {/* APPLY */}

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">

                <h3 className="font-semibold">
                  Ready to apply?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Review the eligibility criteria and
                  required documents before starting
                  your application.
                </p>

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={applying}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {applying ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Applying...
                    </>
                  ) : (
                    <>
                      Apply Now
                      <ExternalLink size={17} />
                    </>
                  )}
                </button>

              </div>

              {/* SCHOLARSHIP INFORMATION */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                <h3 className="font-semibold">
                  Scholarship Information
                </h3>

                <div className="mt-5 space-y-4">

                  <InfoRow
                    label="Provider"
                    value={provider}
                  />

                  <InfoRow
                    label="Location"
                    value={locationValue}
                  />

                  <InfoRow
                    label="Deadline"
                    value={
                      deadline
                        ? formatDate(deadline)
                        : "Not specified"
                    }
                  />

                  <InfoRow
                    label="Amount"
                    value={
                      amount
                        ? `₹${Number(amount).toLocaleString(
                            "en-IN"
                          )}`
                        : "Varies"
                    }
                  />

                </div>
              </div>

              {/* BROWSE MORE */}

              <Link
                to="/scholarships"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft size={16} />
                Browse More Scholarships
              </Link>

            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SUMMARY CARD
// ============================================================

const SummaryCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Icon size={18} />
        </div>

        <div className="min-w-0">

          <p className="text-xs text-slate-500">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-200">
            {value}
          </p>

        </div>

      </div>
    </div>
  );
};

// ============================================================
// INFO ROW
// ============================================================

const InfoRow = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-slate-300">
        {value}
      </span>

    </div>
  );
};

// ============================================================
// GRADUATION CAP ICON
// ============================================================

const GraduationCapIcon = () => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10L12 5 2 10l10 5 10-5Z" />
      <path d="M6 12.5V17c3.5 2.5 8.5 2.5 12 0v-4.5" />
      <path d="M22 10v6" />
    </svg>
  );
};

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (date) => {
  if (!date) {
    return "Not specified";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default ScholarshipDetails;