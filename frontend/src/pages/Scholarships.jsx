import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  GraduationCap,
  MapPin,
  IndianRupee,
  CalendarDays,
  ChevronDown,
  Bookmark,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

const DEFAULT_FILTERS = {
  category: "",
  state: "",
  course: "",
  educationLevel: "",
  scholarshipType: "",
  provider: "",
  incomeLimit: "",
  academicRequirement: "",
};

function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eligibleOnly, setEligibleOnly] = useState(true);
  const [filters, setFilters] =
    useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] =
    useState(false);
  const [savedIds, setSavedIds] = useState(
    new Set()
  );

  useEffect(() => {
    loadScholarships();
    loadSavedScholarships();
  }, [eligibleOnly]);

  const loadScholarships = async () => {
    setLoading(true);

    try {
      const endpoint = eligibleOnly
        ? "/scholarships/eligible"
        : "/scholarships";

      const response = await api.get(endpoint);

      const data = response.data;

      setScholarships(
        data.scholarships ||
          data.results ||
          data ||
          []
      );
    } catch (error) {
      console.error(
        "Scholarship loading error:",
        error
      );

      toast.error(
        "Unable to load scholarships."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSavedScholarships =
    async () => {
      try {
        const response =
          await api.get("/saved");

        const saved =
          response.data.saved ||
          response.data ||
          [];

        setSavedIds(
          new Set(
            saved.map(
              (item) =>
                item.scholarship?._id ||
                item.scholarship?.id ||
                item.scholarshipId ||
                item._id ||
                item.id
            )
          )
        );
      } catch (error) {
        console.error(
          "Saved scholarships error:",
          error
        );
      }
    };

  const updateFilter = (
    name,
    value
  ) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
  };

  const activeFilterCount =
    Object.values(filters).filter(Boolean)
      .length;

  const filteredScholarships =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return scholarships.filter(
        (scholarship) => {
          const name =
            scholarship.name ||
            scholarship.title ||
            "";

          const provider =
            scholarship.provider || "";

          const description =
            scholarship.description || "";

          const matchesSearch =
            !query ||
            name
              .toLowerCase()
              .includes(query) ||
            provider
              .toLowerCase()
              .includes(query) ||
            description
              .toLowerCase()
              .includes(query);

          if (!matchesSearch) return false;

          if (
            filters.category &&
            !matchesValue(
              scholarship.category,
              filters.category
            ) &&
            !matchesValue(
              scholarship.eligibility?.category,
              filters.category
            )
          ) {
            return false;
          }

          if (
            filters.state &&
            !matchesValue(
              scholarship.state,
              filters.state
            ) &&
            !matchesValue(
              scholarship.eligibility?.states,
              filters.state
            ) &&
            !matchesValue(
              scholarship.eligibility?.state,
              filters.state
            )
          ) {
            return false;
          }

          if (
            filters.course &&
            !matchesValue(
              scholarship.course,
              filters.course
            ) &&
            !matchesValue(
              scholarship.eligibility?.courses,
              filters.course
            )
          ) {
            return false;
          }

          if (
            filters.educationLevel &&
            !matchesValue(
              scholarship.educationLevel,
              filters.educationLevel
            ) &&
            !matchesValue(
              scholarship.eligibility
                ?.educationLevel,
              filters.educationLevel
            )
          ) {
            return false;
          }

          if (
            filters.scholarshipType &&
            !matchesValue(
              scholarship.type,
              filters.scholarshipType
            )
          ) {
            return false;
          }

          if (
            filters.provider &&
            !provider
              .toLowerCase()
              .includes(
                filters.provider.toLowerCase()
              )
          ) {
            return false;
          }

          if (
            filters.incomeLimit &&
            !matchesIncome(
              scholarship,
              filters.incomeLimit
            )
          ) {
            return false;
          }

          if (
            filters.academicRequirement &&
            !matchesAcademicRequirement(
              scholarship,
              filters.academicRequirement
            )
          ) {
            return false;
          }

          return true;
        }
      );
    }, [
      scholarships,
      search,
      filters,
    ]);

  const toggleSave = async (
    scholarship
  ) => {
    const id =
      scholarship._id ||
      scholarship.id;

    if (!id) return;

    const isSaved =
      savedIds.has(id);

    try {
      if (isSaved) {
        await api.delete(
          `/saved/${id}`
        );

        setSavedIds((current) => {
          const next = new Set(current);
          next.delete(id);
          return next;
        });

        toast.success(
          "Scholarship removed from saved list."
        );
      } else {
        await api.post(
          `/saved/${id}`
        );

        setSavedIds((current) => {
          const next = new Set(current);
          next.add(id);
          return next;
        });

        toast.success(
          "Scholarship saved."
        );
      }
    } catch (error) {
      console.error(
        "Save scholarship error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update saved scholarship."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getDaysLeft = (date) => {
    if (!date) return null;

    const today = new Date();
    const deadline = new Date(date);

    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    return Math.ceil(
      (deadline - today) /
        (1000 * 60 * 60 * 24)
    );
  };

  const getDeadlineStatus = (
    date
  ) => {
    const days = getDaysLeft(date);

    if (days === null) {
      return {
        label: "Deadline unavailable",
        className:
          "bg-slate-100 text-slate-500",
      };
    }

    if (days < 0) {
      return {
        label: "Application Closed",
        className:
          "bg-slate-100 text-slate-500",
      };
    }

    if (days === 0) {
      return {
        label: "Due Today",
        className:
          "bg-rose-100 text-rose-700",
      };
    }

    if (days <= 7) {
      return {
        label: `${days} days left`,
        className:
          "bg-rose-50 text-rose-600",
      };
    }

    if (days <= 30) {
      return {
        label: `${days} days left`,
        className:
          "bg-amber-50 text-amber-600",
      };
    }

    return {
      label: `${days} days left`,
      className:
        "bg-emerald-50 text-emerald-600",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-100 sm:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
            <Sparkles size={14} />
            Scholarship Discovery
          </div>

          <h1 className="text-2xl font-black sm:text-3xl">
            Find Scholarships That Match You
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
            Explore scholarships based on your profile,
            eligibility criteria, academic information and
            financial requirements.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search scholarships, providers or keywords..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (current) => !current
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <SlidersHorizontal
              size={17}
            />
            Filters

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}

            <ChevronDown
              size={16}
              className={`transition ${
                showFilters
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>
        </div>

        {/* Eligible toggle */}
        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={eligibleOnly}
              onClick={() =>
                setEligibleOnly(
                  (current) => !current
                )
              }
              className={`relative h-6 w-11 rounded-full transition ${
                eligibleOnly
                  ? "bg-indigo-600"
                  : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                  eligibleOnly
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

            <span className="text-sm font-bold text-slate-700">
              Show scholarships matching my profile
            </span>
          </label>

          <p className="text-xs text-slate-400">
            {filteredScholarships.length}{" "}
            scholarship
            {filteredScholarships.length !==
            1
              ? "s"
              : ""}{" "}
            found
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
          />
        )}
      </section>

      {/* Results */}
      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {eligibleOnly
                ? "Eligible for You"
                : "Browse Scholarships"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {eligibleOnly
                ? "Based on the information provided in your profile."
                : "Browse available scholarship opportunities."}
            </p>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex w-fit items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <ScholarshipLoading />
        ) : filteredScholarships.length ===
          0 ? (
          <EmptyState
            clearFilters={clearFilters}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredScholarships.map(
              (scholarship) => (
                <ScholarshipCard
                  key={
                    scholarship._id ||
                    scholarship.id
                  }
                  scholarship={scholarship}
                  saved={
                    savedIds.has(
                      scholarship._id ||
                        scholarship.id
                    )
                  }
                  toggleSave={toggleSave}
                  formatDate={formatDate}
                  getDeadlineStatus={
                    getDeadlineStatus
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

/* -------------------------------------------------
   Filter Panel
------------------------------------------------- */

function FilterPanel({
  filters,
  updateFilter,
  clearFilters,
}) {
  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-800">
          Filter Scholarships
        </h3>

        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-bold text-slate-400 hover:text-indigo-600"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <FilterSelect
          label="Category"
          value={filters.category}
          onChange={(value) =>
            updateFilter(
              "category",
              value
            )
          }
          options={[
            "General",
            "OBC",
            "SC",
            "ST",
            "EWS",
            "Minority",
            "Other",
          ]}
        />

        <FilterSelect
          label="State"
          value={filters.state}
          onChange={(value) =>
            updateFilter(
              "state",
              value
            )
          }
          options={[
            "Maharashtra",
            "Gujarat",
            "Karnataka",
            "Madhya Pradesh",
            "Rajasthan",
            "Uttar Pradesh",
            "Tamil Nadu",
            "Delhi",
          ]}
        />

        <FilterSelect
          label="Course"
          value={filters.course}
          onChange={(value) =>
            updateFilter(
              "course",
              value
            )
          }
          options={[
            "Engineering",
            "Computer Science",
            "Management",
            "Medicine",
            "Commerce",
            "Arts",
            "Science",
            "Diploma",
          ]}
        />

        <FilterSelect
          label="Education Level"
          value={
            filters.educationLevel
          }
          onChange={(value) =>
            updateFilter(
              "educationLevel",
              value
            )
          }
          options={[
            "School",
            "Diploma",
            "Undergraduate",
            "Postgraduate",
            "PhD",
          ]}
        />

        <FilterSelect
          label="Scholarship Type"
          value={
            filters.scholarshipType
          }
          onChange={(value) =>
            updateFilter(
              "scholarshipType",
              value
            )
          }
          options={[
            "Government",
            "Private",
            "Merit",
            "Need Based",
            "Category Based",
            "Minority",
          ]}
        />

        <FilterSelect
          label="Income Limit"
          value={filters.incomeLimit}
          onChange={(value) =>
            updateFilter(
              "incomeLimit",
              value
            )
          }
          options={[
            "₹1 Lakh",
            "₹2 Lakh",
            "₹2.5 Lakh",
            "₹3 Lakh",
            "₹5 Lakh",
            "₹8 Lakh",
          ]}
        />

        <FilterSelect
          label="Academic Requirement"
          value={
            filters.academicRequirement
          }
          onChange={(value) =>
            updateFilter(
              "academicRequirement",
              value
            )
          }
          options={[
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "85%",
          ]}
        />

        <div>
          <label className="mb-2 block text-xs font-bold text-slate-600">
            Provider
          </label>

          <input
            type="text"
            value={filters.provider}
            onChange={(event) =>
              updateFilter(
                "provider",
                event.target.value
              )
            }
            placeholder="Search provider..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-600">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
      >
        <option value="">
          All {label}s
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* -------------------------------------------------
   Scholarship Card
------------------------------------------------- */

function ScholarshipCard({
  scholarship,
  saved,
  toggleSave,
  formatDate,
  getDeadlineStatus,
}) {
  const id =
    scholarship._id ||
    scholarship.id;

  const deadline =
    scholarship.deadline ||
    scholarship.applicationDeadline;

  const deadlineStatus =
    getDeadlineStatus(deadline);

  const benefit =
    scholarship.benefit ||
    scholarship.amount ||
    scholarship.benefits?.amount ||
    scholarship.benefits?.tuition ||
    "Benefits vary";

  const category =
    scholarship.category ||
    scholarship.eligibility?.category ||
    "General";

  const state =
    scholarship.state ||
    scholarship.eligibility?.state ||
    scholarship.eligibility?.states?.[0] ||
    "Multiple states";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50">
      <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
            <GraduationCap size={23} />
          </div>

          <button
            type="button"
            aria-label={
              saved
                ? "Remove from saved"
                : "Save scholarship"
            }
            onClick={() =>
              toggleSave(scholarship)
            }
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
              saved
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-500 hover:bg-indigo-600 hover:text-white"
            }`}
          >
            <Bookmark
              size={18}
              fill={
                saved
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-indigo-600 shadow-sm">
            {category}
          </span>

          {scholarship.isEligible !==
            false && (
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white">
              Matches you
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold text-slate-400">
          {scholarship.provider ||
            "Scholarship Provider"}
        </p>

        <Link
          to={`/scholarships/${id}`}
          className="mt-1"
        >
          <h3 className="line-clamp-2 text-lg font-black leading-6 text-slate-900 transition group-hover:text-indigo-600">
            {scholarship.name ||
              scholarship.title ||
              "Scholarship"}
          </h3>
        </Link>

        <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">
          {scholarship.description ||
            "Scholarship opportunity for eligible students."}
        </p>

        <div className="mt-5 space-y-3">
          <InfoRow
            icon={IndianRupee}
            label="Benefit"
            value={
              typeof benefit ===
              "number"
                ? `₹${benefit.toLocaleString(
                    "en-IN"
                  )}`
                : benefit
            }
            iconClass="text-emerald-500"
          />

          <InfoRow
            icon={MapPin}
            label="Location"
            value={state}
            iconClass="text-blue-500"
          />

          <InfoRow
            icon={CalendarDays}
            label="Deadline"
            value={formatDate(deadline)}
            iconClass="text-purple-500"
          />
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-center justify-between">
            <span
              className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${deadlineStatus.className}`}
            >
              {deadlineStatus.label}
            </span>

            {scholarship.type && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {scholarship.type}
              </span>
            )}
          </div>

          <Link
            to={`/scholarships/${id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
          >
            View Details
            <ExternalLink size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  iconClass,
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon
        size={16}
        className={`shrink-0 ${iconClass}`}
      />

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="truncate text-xs font-bold text-slate-700">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   Loading
------------------------------------------------- */

function ScholarshipLoading() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(
        (item) => (
          <div
            key={item}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
          >
            <div className="h-40 animate-pulse bg-slate-100" />

            <div className="space-y-4 p-5">
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* -------------------------------------------------
   Empty
------------------------------------------------- */

function EmptyState({
  clearFilters,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500">
        <Search size={28} />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-900">
        No scholarships found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try changing your search or filters. You can also browse
        all available scholarships instead of only the ones
        matching your profile.
      </p>

      <button
        type="button"
        onClick={clearFilters}
        className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
      >
        Clear Search & Filters
      </button>
    </div>
  );
}

/* -------------------------------------------------
   Helpers
------------------------------------------------- */

function matchesValue(
  source,
  target
) {
  if (!source) return false;

  if (Array.isArray(source)) {
    return source.some(
      (item) =>
        String(item).toLowerCase() ===
        String(target).toLowerCase()
    );
  }

  return (
    String(source).toLowerCase() ===
    String(target).toLowerCase()
  );
}

function matchesIncome(
  scholarship,
  selected
) {
  const amount =
    parseIncome(selected);

  if (!amount) return true;

  const limit =
    scholarship.incomeLimit ||
    scholarship.eligibility
      ?.maxIncome ||
    scholarship.eligibility
      ?.incomeLimit;

  if (!limit) return true;

  return Number(limit) <= amount;
}

function matchesAcademicRequirement(
  scholarship,
  selected
) {
  const requirement =
    parseFloat(selected);

  if (Number.isNaN(requirement)) {
    return true;
  }

  const minimum =
    scholarship.minimumPercentage ||
    scholarship.minPercentage ||
    scholarship.eligibility
      ?.minimumPercentage ||
    scholarship.eligibility
      ?.minPercentage;

  if (!minimum) return true;

  return Number(minimum) >=
    requirement;
}

function parseIncome(value) {
  if (!value) return null;

  const match = String(value).match(
    /[\d.]+/
  );

  if (!match) return null;

  const number = Number(match[0]);

  if (String(value).includes("Lakh")) {
    return number * 100000;
  }

  return number;
}

export default Scholarships;