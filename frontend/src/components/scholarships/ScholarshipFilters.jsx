import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Filter, RotateCcw, X } from "lucide-react";

const ScholarshipFilters = ({
  filters = {},
  onApply,
  onReset,
  onClose,
}) => {
  const panelRef = useRef(null);

  const [localFilters, setLocalFilters] = useState({
    category: filters.category || "",
    educationLevel: filters.educationLevel || "",
    state: filters.state || "",
    minAmount: filters.minAmount || "",
    maxAmount: filters.maxAmount || "",
    deadline: filters.deadline || "",
  });

  useEffect(() => {
    if (!panelRef.current) return;

    const animation = gsap.fromTo(
      panelRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  useEffect(() => {
    setLocalFilters({
      category: filters.category || "",
      educationLevel: filters.educationLevel || "",
      state: filters.state || "",
      minAmount: filters.minAmount || "",
      maxAmount: filters.maxAmount || "",
      deadline: filters.deadline || "",
    });
  }, [filters]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLocalFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleApply = (event) => {
    event.preventDefault();

    const cleanedFilters = Object.fromEntries(
      Object.entries(localFilters).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== ""
      )
    );

    onApply?.(cleanedFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      category: "",
      educationLevel: "",
      state: "",
      minAmount: "",
      maxAmount: "",
      deadline: "",
    };

    setLocalFilters(emptyFilters);
    onReset?.();
  };

  return (
    <aside
      ref={panelRef}
      className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Filter size={18} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Filters
            </h2>

            <p className="text-xs text-gray-500">
              Find scholarships matching your needs.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleApply} className="mt-6 space-y-5">
        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            value={localFilters.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All Categories</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
            <option value="EWS">EWS</option>
            <option value="General">General</option>
            <option value="Minority">Minority</option>
          </select>
        </div>

        {/* Education Level */}
        <div>
          <label
            htmlFor="educationLevel"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Education Level
          </label>

          <select
            id="educationLevel"
            name="educationLevel"
            value={localFilters.educationLevel}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All Education Levels</option>
            <option value="school">School</option>
            <option value="higher-secondary">
              Higher Secondary
            </option>
            <option value="undergraduate">
              Undergraduate
            </option>
            <option value="postgraduate">
              Postgraduate
            </option>
            <option value="phd">PhD</option>
            <option value="diploma">Diploma</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            State
          </label>

          <select
            id="state"
            name="state"
            value={localFilters.state}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Madhya Pradesh">
              Madhya Pradesh
            </option>
            <option value="Gujarat">Gujarat</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Telangana">Telangana</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Uttar Pradesh">
              Uttar Pradesh
            </option>
            <option value="Delhi">Delhi</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Kerala">Kerala</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Scholarship Amount
          </label>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="minAmount"
              value={localFilters.minAmount}
              onChange={handleChange}
              placeholder="Min amount"
              min="0"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <input
              type="number"
              name="maxAmount"
              value={localFilters.maxAmount}
              onChange={handleChange}
              placeholder="Max amount"
              min="0"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label
            htmlFor="deadline"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Deadline
          </label>

          <select
            id="deadline"
            name="deadline"
            value={localFilters.deadline}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Any Deadline</option>
            <option value="7">Within 7 days</option>
            <option value="30">Within 30 days</option>
            <option value="60">Within 60 days</option>
            <option value="90">Within 90 days</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={handleReset}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 active:scale-95"
          >
            <RotateCcw size={15} />
            Reset
          </button>

          <button
            type="submit"
            className="flex flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </aside>
  );
};

export default ScholarshipFilters;