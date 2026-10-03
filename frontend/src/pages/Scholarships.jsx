import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import gsap from "gsap";

import ScholarshipCard from "../components/scholarships/ScholarshipCard";
import ScholarshipFilters from "../components/scholarships/ScholarshipFilters";
import ScholarshipSearch from "../components/scholarships/ScholarshipSearch";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

import { useScholarship } from "../context/ScholarshipContext";

// ============================================================
// SCHOLARSHIPS PAGE
// ============================================================

const Scholarships = () => {
  const navigate = useNavigate();

  // ==========================================================
  // REFS
  // ==========================================================

  const pageRef = useRef(null);
  const gridRef = useRef(null);

  // ==========================================================
  // SCHOLARSHIP CONTEXT
  // ==========================================================

  const {
    scholarships,
    loading,
    error,

    fetchScholarships,
    searchScholarships,

    saveScholarship,
    removeSavedScholarship,

    fetchSavedScholarships,
    isScholarshipSaved,

    savedScholarships,
  } = useScholarship();

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [searchValue, setSearchValue] = useState("");

  const [filters, setFilters] = useState({});

  const [showFilters, setShowFilters] = useState(false);

  const [savedOnly, setSavedOnly] = useState(false);

  const [sortBy, setSortBy] = useState("relevance");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [localError, setLocalError] = useState("");

  // ==========================================================
  // CONSTANTS
  // ==========================================================

  const itemsPerPage = 12;

  // ==========================================================
  // PAGINATION HELPER
  // ==========================================================

  const updatePagination = (result) => {
    const pages =
      Number(
        result?.pagination?.totalPages
      ) || 1;

    setTotalPages(Math.max(1, pages));
  };

  // ==========================================================
  // LOAD SCHOLARSHIPS
  // ==========================================================

  const loadScholarships = async (
    customPage = 1
  ) => {
    try {
      setLocalError("");

      const params = {
        page: customPage,
        limit: itemsPerPage,
        sort: sortBy,
        ...filters,
      };

      if (searchValue.trim()) {
        params.search =
          searchValue.trim();
      }

      const result =
        await fetchScholarships(params);

      if (!result?.success) {
        setLocalError(
          result?.error ||
            "Failed to load scholarships."
        );

        return;
      }

      updatePagination(result);
    } catch (error) {
      console.error(
        "LOAD SCHOLARSHIPS ERROR:",
        error
      );

      setLocalError(
        error?.message ||
          "Failed to load scholarships."
      );
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    const loadInitialScholarships =
      async () => {
        try {
          setLocalError("");

          const result =
            await fetchScholarships({
              page: 1,
              limit: itemsPerPage,
              sort: "relevance",
            });

          if (!result?.success) {
            setLocalError(
              result?.error ||
                "Failed to load scholarships."
            );

            return;
          }

          updatePagination(result);
        } catch (error) {
          console.error(
            "INITIAL SCHOLARSHIP LOAD ERROR:",
            error
          );

          setLocalError(
            error?.message ||
              "Failed to load scholarships."
          );
        }
      };

    loadInitialScholarships();

    // Intentionally runs once when the page mounts.
    // Do not add loadScholarships here because it
    // depends on changing search/filter state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================================
  // HEADER GSAP ANIMATION
  // ==========================================================

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from(
        ".scholarships-header",
        {
          opacity: 0,
          y: 25,
          duration: 0.7,
          ease: "power3.out",
        }
      );

      gsap.from(
        ".scholarship-toolbar",
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.15,
          ease: "power3.out",
        }
      );
    }, pageRef);

    return () => {
      context.revert();
    };
  }, []);

  // ==========================================================
  // SCHOLARSHIP GRID ANIMATION
  // ==========================================================

  useEffect(() => {
    if (
      loading ||
      !gridRef.current ||
      !gridRef.current.children.length
    ) {
      return;
    }

    gsap.fromTo(
      gridRef.current.children,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
      }
    );
  }, [loading, scholarships, savedOnly]);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearch = async (
    value
  ) => {
    try {
      setSearchValue(value);
      setPage(1);
      setLocalError("");

      // Empty search = load normal scholarships
      if (!value.trim()) {
        const result =
          await fetchScholarships({
            page: 1,
            limit: itemsPerPage,
            sort: sortBy,
            ...filters,
          });

        if (!result?.success) {
          setLocalError(
            result?.error ||
              "Failed to load scholarships."
          );

          return;
        }

        updatePagination(result);

        return;
      }

      const result =
        await searchScholarships(
          value.trim(),
          {
            ...filters,
            page: 1,
            limit: itemsPerPage,
            sort: sortBy,
          }
        );

      if (!result?.success) {
        setLocalError(
          result?.error ||
            "Failed to search scholarships."
        );

        return;
      }

      updatePagination(result);
    } catch (error) {
      console.error(
        "SEARCH ERROR:",
        error
      );

      setLocalError(
        error?.message ||
          "Failed to search scholarships."
      );
    }
  };

  // ==========================================================
  // APPLY FILTERS
  // ==========================================================

  const handleApplyFilters = async (
    newFilters
  ) => {
    try {
      setFilters(newFilters);
      setShowFilters(false);
      setPage(1);
      setLocalError("");

      const params = {
        ...newFilters,
        page: 1,
        limit: itemsPerPage,
        sort: sortBy,
      };

      if (searchValue.trim()) {
        params.search =
          searchValue.trim();
      }

      const result =
        await fetchScholarships(params);

      if (!result?.success) {
        setLocalError(
          result?.error ||
            "Failed to apply filters."
        );

        return;
      }

      updatePagination(result);
    } catch (error) {
      console.error(
        "APPLY FILTERS ERROR:",
        error
      );

      setLocalError(
        error?.message ||
          "Failed to apply filters."
      );
    }
  };

  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const handleResetFilters =
    async () => {
      try {
        setFilters({});
        setSearchValue("");
        setPage(1);
        setSortBy("relevance");
        setSavedOnly(false);
        setLocalError("");

        const result =
          await fetchScholarships({
            page: 1,
            limit: itemsPerPage,
            sort: "relevance",
          });

        if (!result?.success) {
          setLocalError(
            result?.error ||
              "Failed to reset filters."
          );

          return;
        }

        updatePagination(result);
      } catch (error) {
        console.error(
          "RESET FILTERS ERROR:",
          error
        );

        setLocalError(
          error?.message ||
            "Failed to reset filters."
        );
      }
    };

  // ==========================================================
  // SORT CHANGE
  // ==========================================================

  const handleSortChange = async (
    event
  ) => {
    try {
      const value =
        event.target.value;

      setSortBy(value);
      setPage(1);
      setLocalError("");

      const params = {
        ...filters,
        page: 1,
        limit: itemsPerPage,
        sort: value,
      };

      if (searchValue.trim()) {
        params.search =
          searchValue.trim();
      }

      const result =
        await fetchScholarships(params);

      if (!result?.success) {
        setLocalError(
          result?.error ||
            "Failed to sort scholarships."
        );

        return;
      }

      updatePagination(result);
    } catch (error) {
      console.error(
        "SORT ERROR:",
        error
      );

      setLocalError(
        error?.message ||
          "Failed to sort scholarships."
      );
    }
  };

  // ==========================================================
  // SAVE / REMOVE SCHOLARSHIP
  // ==========================================================

  const handleSave = async (
    scholarship
  ) => {
    try {
      const id =
        scholarship?._id ||
        scholarship?.id;

      if (!id) {
        setLocalError(
          "Scholarship ID is missing."
        );

        return;
      }

      setLocalError("");

      let result;

      if (isScholarshipSaved(id)) {
        result =
          await removeSavedScholarship(
            id
          );
      } else {
        result =
          await saveScholarship(id);
      }

      if (!result?.success) {
        setLocalError(
          result?.error ||
            "Failed to update saved scholarship."
        );
      }
    } catch (error) {
      console.error(
        "SAVE SCHOLARSHIP ERROR:",
        error
      );

      setLocalError(
        error?.message ||
          "Failed to update saved scholarship."
      );
    }
  };

  // ==========================================================
  // SAVED ONLY
  // ==========================================================

  const handleSavedOnly =
    async () => {
      try {
        const nextValue =
          !savedOnly;

        setSavedOnly(nextValue);
        setPage(1);
        setLocalError("");

        if (!nextValue) {
          await loadScholarships(1);
          return;
        }

        const result =
          await fetchSavedScholarships();

        if (!result?.success) {
          setLocalError(
            result?.error ||
              "Failed to load saved scholarships."
          );
        }
      } catch (error) {
        console.error(
          "SAVED ONLY ERROR:",
          error
        );

        setLocalError(
          error?.message ||
            "Failed to load saved scholarships."
        );
      }
    };

  // ==========================================================
  // PAGE CHANGE
  // ==========================================================

  const handlePageChange = async (
    nextPage
  ) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      loading
    ) {
      return;
    }

    try {
      setPage(nextPage);
      setLocalError("");

      const params = {
        ...filters,
        page: nextPage,
        limit: itemsPerPage,
        sort: sortBy,
      };

      if (searchValue.trim()) {
        params.search =
          searchValue.trim();
      }

      const result =
        await fetchScholarships(params);

      if (!result?.success) {
        setLocalError(
          result?.error ||
            "Failed to load page."
        );

        return;
      }

      updatePagination(result);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "PAGE CHANGE ERROR:",
        error
      );

      setLocalError(
        error?.message ||
          "Failed to load scholarships."
      );
    }
  };

  // ==========================================================
  // DISPLAYED SCHOLARSHIPS
  // ==========================================================

  const displayedScholarships =
    savedOnly
      ? savedScholarships
      : scholarships;

  // ==========================================================
  // ACTIVE FILTER COUNT
  // ==========================================================

  const activeFilterCount =
    Object.values(filters).filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    ).length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="scholarships-header mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                <Sparkles size={14} />
                Personalized Scholarship Discovery
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Find Scholarships
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Discover scholarship opportunities based on your
                education, category, income, location, academic
                performance, and eligibility.
              </p>
            </div>

            <Link
              to="/saved-scholarships"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Bookmark size={17} />
              Saved Scholarships
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* ==================================================
            SEARCH TOOLBAR
        ================================================== */}

        <div className="scholarship-toolbar mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">

          <ScholarshipSearch
            value={searchValue}
            onSearch={handleSearch}
            onFilterClick={() =>
              setShowFilters(true)
            }
            placeholder="Search scholarships by name, provider, course..."
          />

          <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex flex-wrap items-center gap-2">

              {/* Saved Only */}

              <button
                type="button"
                onClick={handleSavedOnly}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  savedOnly
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Bookmark size={14} />
                Saved Only
              </button>

              {/* Filters */}

              <button
                type="button"
                onClick={() =>
                  setShowFilters(true)
                }
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:text-white"
              >
                <SlidersHorizontal
                  size={14}
                />

                Filters

                {activeFilterCount >
                  0 && (
                  <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Sort */}

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Sort by
              </span>

              <select
                value={sortBy}
                onChange={
                  handleSortChange
                }
                className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500"
              >
                <option value="relevance">
                  Relevance
                </option>

                <option value="deadline">
                  Deadline
                </option>

                <option value="amount-high">
                  Amount: High to Low
                </option>

                <option value="amount-low">
                  Amount: Low to High
                </option>

                <option value="newest">
                  Newest
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ==================================================
            FILTER DRAWER
        ================================================== */}

        {showFilters && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-2xl sm:p-6">

              <ScholarshipFilters
                filters={filters}
                onApply={
                  handleApplyFilters
                }
                onReset={
                  handleResetFilters
                }
                onClose={() =>
                  setShowFilters(false)
                }
              />

            </div>
          </div>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {(error || localError) &&
          !loading && (
            <div className="mb-6">
              <ErrorMessage
                message={
                  localError || error
                }
                onRetry={() =>
                  loadScholarships(1)
                }
                showRetry
              />
            </div>
          )}

        {/* ==================================================
            RESULTS HEADER
        ================================================== */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold">
              {savedOnly
                ? "Saved Scholarships"
                : "Available Scholarships"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Finding scholarships..."
                : `${displayedScholarships.length} scholarship${
                    displayedScholarships.length ===
                    1
                      ? ""
                      : "s"
                  } found`}
            </p>
          </div>

          {activeFilterCount >
            0 && (
            <button
              type="button"
              onClick={
                handleResetFilters
              }
              className="inline-flex w-fit items-center gap-2 text-sm text-blue-400 transition hover:text-blue-300"
            >
              <Filter size={15} />
              Clear filters
            </button>
          )}
        </div>

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <LoadingSpinner
              size="large"
              message="Finding scholarships for you..."
            />
          </div>
        )}

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          displayedScholarships.length ===
            0 && (
            <EmptyState
              icon={Search}
              title={
                savedOnly
                  ? "No saved scholarships"
                  : "No scholarships found"
              }
              message={
                savedOnly
                  ? "Save scholarships you are interested in and they will appear here."
                  : "Try changing your search or filters to find more scholarship opportunities."
              }
              buttonText={
                savedOnly
                  ? "Explore Scholarships"
                  : "Clear Filters"
              }
              onAction={
                savedOnly
                  ? () =>
                      setSavedOnly(
                        false
                      )
                  : handleResetFilters
              }
            />
          )}

        {/* ==================================================
            SCHOLARSHIP GRID
        ================================================== */}

        {!loading &&
          displayedScholarships.length >
            0 && (
            <>
              <div
                ref={gridRef}
                className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              >
                {displayedScholarships.map(
                  (scholarship) => {
                    const id =
                      scholarship?._id ||
                      scholarship?.id;

                    if (!id) {
                      return null;
                    }

                    return (
                      <ScholarshipCard
                        key={id}
                        scholarship={
                          scholarship
                        }
                        isSaved={isScholarshipSaved(
                          id
                        )}
                        onSave={() =>
                          handleSave(
                            scholarship
                          )
                        }
                        onView={() =>
                          navigate(
                            `/scholarships/${id}`
                          )
                        }
                      />
                    );
                  }
                )}
              </div>

              {/* ==================================================
                  PAGINATION
              ================================================== */}

              {!savedOnly &&
                totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">

                    {/* Previous */}

                    <button
                      type="button"
                      disabled={
                        page === 1 ||
                        loading
                      }
                      onClick={() =>
                        handlePageChange(
                          page - 1
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft
                        size={18}
                      />
                    </button>

                    {/* Page Numbers */}

                    {Array.from(
                      {
                        length:
                          Math.min(
                            totalPages,
                            5
                          ),
                      },
                      (_, index) => {
                        let pageNumber =
                          index + 1;

                        if (
                          totalPages >
                          5
                        ) {
                          if (
                            page <= 3
                          ) {
                            pageNumber =
                              index + 1;
                          } else if (
                            page >=
                            totalPages -
                              2
                          ) {
                            pageNumber =
                              totalPages -
                              4 +
                              index;
                          } else {
                            pageNumber =
                              page -
                              2 +
                              index;
                          }
                        }

                        return (
                          <button
                            key={
                              pageNumber
                            }
                            type="button"
                            onClick={() =>
                              handlePageChange(
                                pageNumber
                              )
                            }
                            disabled={loading}
                            className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
                              page ===
                              pageNumber
                                ? "bg-blue-600 text-white"
                                : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {
                              pageNumber
                            }
                          </button>
                        );
                      }
                    )}

                    {/* Next */}

                    <button
                      type="button"
                      disabled={
                        page ===
                          totalPages ||
                        loading
                      }
                      onClick={() =>
                        handlePageChange(
                          page + 1
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight
                        size={18}
                      />
                    </button>
                  </div>
                )}
            </>
          )}

        {/* ==================================================
            INFORMATION
        ================================================== */}

        <div className="mt-10 grid gap-4 md:grid-cols-3">

          {/* Personalized Matching */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Sparkles size={19} />
            </div>

            <h3 className="font-semibold">
              Personalized Matching
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your profile information
              helps identify scholarships
              that fit your eligibility.
            </p>
          </div>

          {/* Track Deadlines */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CalendarDays size={19} />
            </div>

            <h3 className="font-semibold">
              Track Deadlines
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep an eye on upcoming
              scholarship deadlines so you
              do not miss opportunities.
            </p>
          </div>

          {/* Save Opportunities */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Bookmark size={19} />
            </div>

            <h3 className="font-semibold">
              Save Opportunities
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Save interesting scholarships
              and review them later before
              applying.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Scholarships;