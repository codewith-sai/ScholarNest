import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  ArrowRight,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";
import gsap from "gsap";

import ScholarshipCard from "../components/scholarships/ScholarshipCard";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

import { useScholarship } from "../context/ScholarshipContext";

const SavedScholarships = () => {
  const {
    savedScholarships,
    loading,
    error,
    fetchSavedScholarships,
    removeSavedScholarship,
    isScholarshipSaved,
  } = useScholarship();

  const [localError, setLocalError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchSavedScholarships();
  }, [fetchSavedScholarships]);

  useEffect(() => {
    if (!loading && savedScholarships.length > 0) {
      gsap.fromTo(
        ".saved-scholarship-card",
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
  }, [loading, savedScholarships]);

  const handleRemove = async (scholarship) => {
    const id = scholarship?._id || scholarship?.id;

    if (!id) return;

    try {
      setRemovingId(id);
      setLocalError("");

      const result = await removeSavedScholarship(id);

      if (!result.success) {
        setLocalError(result.error);
      }
    } finally {
      setRemovingId(null);
    }
  };

  if (loading && savedScholarships.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <Loader2
            size={40}
            className="mx-auto animate-spin text-blue-500"
          />

          <p className="mt-4 text-sm text-slate-400">
            Loading your saved scholarships...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                <Bookmark size={14} />
                Your Collection
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Saved Scholarships
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Keep track of scholarship opportunities you want to
                review or apply for later.
              </p>
            </div>

            <Link
              to="/scholarships"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              <Search size={17} />
              Find Scholarships
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* Error */}
        {(error || localError) && (
          <div className="mb-6">
            <ErrorMessage
              message={localError || error}
              onRetry={() => fetchSavedScholarships()}
              showRetry
            />
          </div>
        )}

        {/* Count */}
        {savedScholarships.length > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Your Saved List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {savedScholarships.length} scholarship
                {savedScholarships.length === 1 ? "" : "s"} saved
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && savedScholarships.length === 0 && (
          <EmptyState
            icon={Bookmark}
            title="No saved scholarships yet"
            message="When you find a scholarship that interests you, save it here so you can easily review it later."
            buttonText="Explore Scholarships"
            onAction={() => {
              window.location.href = "/scholarships";
            }}
          />
        )}

        {/* Scholarship Grid */}
        {savedScholarships.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {savedScholarships.map((scholarship) => {
              const id =
                scholarship?._id || scholarship?.id;

              return (
                <div
                  key={id}
                  className="saved-scholarship-card relative"
                >
                  <ScholarshipCard
                    scholarship={scholarship}
                    isSaved={isScholarshipSaved(id)}
                    onSave={() => handleRemove(scholarship)}
                    onView={() => {
                      window.location.href =
                        `/scholarships/${id}`;
                    }}
                  />

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(scholarship)}
                    disabled={removingId === id}
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-slate-950/90 text-red-400 backdrop-blur transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Remove from saved scholarships"
                  >
                    {removingId === id ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {savedScholarships.length > 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <Bookmark
              size={28}
              className="mx-auto text-blue-400"
            />

            <h3 className="mt-3 text-lg font-semibold">
              Looking for more opportunities?
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Explore more scholarships and save the ones that match
              your goals.
            </p>

            <Link
              to="/scholarships"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Browse Scholarships
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedScholarships;