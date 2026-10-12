import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Search, ArrowRight } from "lucide-react";
import gsap from "gsap";

import ApplicationCard from "../components/applications/ApplicationCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

import { useApplication } from "../context/ApplicationContext";

const Applications = () => {
  const navigate = useNavigate();

  const {
    applications,
    loading,
    error,
    fetchApplications,
    cancelApplication,
  } = useApplication();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    if (!loading && applications.length > 0) {
      gsap.fromTo(
        ".application-card",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    }
  }, [loading, applications]);

  const handleView = (application) => {
    const id = application?._id || application?.id;

    if (id) {
      navigate(`/applications/${id}`);
    }
  };

  const handleCancel = async (application) => {
    const id = application?._id || application?.id;

    if (!id) return;

    await cancelApplication(id);

    // Refresh after cancellation so the UI reflects backend state.
    await fetchApplications();
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950">
        <LoadingSpinner
          fullScreen
          message="Loading your applications..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
              <FileText size={14} />
              Application Tracker
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              My Applications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Track the scholarships you have applied for and monitor
              their current status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/scholarships")}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            <Search size={17} />
            Find Scholarships
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <ErrorMessage
              message={error}
              onRetry={() => fetchApplications()}
              showRetry
            />
          </div>
        )}

        {/* Application count */}
        {applications.length > 0 && (
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              Your Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {applications.length} application
              {applications.length === 1 ? "" : "s"} found
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && applications.length === 0 && (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            message="You have not applied for any scholarships yet. Explore available scholarships and submit your first application."
            buttonText="Explore Scholarships"
            onAction={() => navigate("/scholarships")}
          />
        )}

        {/* Applications */}
        {applications.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {applications.map((application) => {
              const id =
                application?._id || application?.id;

              return (
                <div
                  key={id}
                  className="application-card"
                >
                  <ApplicationCard
                    application={application}
                    onView={() => handleView(application)}
                    onCancel={() => handleCancel(application)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {applications.length > 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <FileText
              size={28}
              className="mx-auto text-blue-400"
            />

            <h3 className="mt-3 text-lg font-semibold">
              Want to apply for another scholarship?
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Discover more scholarships that match your education,
              financial background, category, and eligibility.
            </p>

            <button
              type="button"
              onClick={() => navigate("/scholarships")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Browse Scholarships
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;