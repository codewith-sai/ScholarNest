import { useEffect, useState } from "react";
import {
  GraduationCap,
  IndianRupee,
  CalendarDays,
  FileText,
  Save,
} from "lucide-react";

const defaultFormData = {
  title: "",
  provider: "",
  description: "",
  amount: "",
  deadline: "",
  educationLevel: "",
  category: "",
  state: "",
  course: "",
  branch: "",
  maxIncome: "",
  minPercentage: "",
  minCGPA: "",
  disability: "",
  active: true,
};

const ScholarshipForm = ({
  initialData = null,
  onSubmit,
  loading = false,
  submitText = "Create Scholarship",
}) => {
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (!initialData) {
      setFormData(defaultFormData);
      return;
    }

    setFormData({
      title: initialData.title || "",
      provider: initialData.provider || "",
      description: initialData.description || "",
      amount: initialData.amount ?? "",
      deadline: initialData.deadline
        ? String(initialData.deadline).slice(0, 10)
        : "",
      educationLevel: initialData.educationLevel || "",
      category: initialData.category || "",
      state: initialData.state || "",
      course: initialData.course || "",
      branch: initialData.branch || "",
      maxIncome: initialData.maxIncome ?? "",
      minPercentage: initialData.minPercentage ?? "",
      minCGPA: initialData.minCGPA ?? "",
      disability: initialData.disability || "",
      active:
        initialData.active !== undefined
          ? initialData.active
          : true,
    });
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      amount:
        formData.amount === ""
          ? undefined
          : Number(formData.amount),
      maxIncome:
        formData.maxIncome === ""
          ? undefined
          : Number(formData.maxIncome),
      minPercentage:
        formData.minPercentage === ""
          ? undefined
          : Number(formData.minPercentage),
      minCGPA:
        formData.minCGPA === ""
          ? undefined
          : Number(formData.minCGPA),
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =====================================================
          BASIC INFORMATION
      ===================================================== */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <GraduationCap size={20} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              Basic Information
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Enter the main scholarship details.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* TITLE */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Scholarship Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter scholarship title"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500"
            />
          </div>

          {/* PROVIDER */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Provider *
            </label>

            <input
              type="text"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              required
              placeholder="Government / Organization"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500"
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Scholarship Amount
            </label>

            <div className="relative">
              <IndianRupee
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                placeholder="50000"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500"
              />
            </div>
          </div>

          {/* DEADLINE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Application Deadline *
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-purple-500"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe the scholarship, benefits and eligibility..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500"
            />
          </div>

        </div>
      </section>

      {/* =====================================================
          ELIGIBILITY
      ===================================================== */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <FileText size={20} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              Eligibility Criteria
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Define who can apply for this scholarship.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* EDUCATION LEVEL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Education Level
            </label>

            <input
              type="text"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              placeholder="e.g. Undergraduate"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. SC / ST / OBC / General"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
            />
          </div>

          {/* STATE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              State
            </label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
            />
          </div>

          {/* COURSE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Course
            </label>

            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g. B.Tech"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
            />
          </div>

          {/* BRANCH */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Branch
            </label>

            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
            />
          </div>

          {/* MAX INCOME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Maximum Annual Income
            </label>

            <div className="relative">
              <IndianRupee
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="number"
                name="maxIncome"
                value={formData.maxIncome}
                onChange={handleChange}
                min="0"
                placeholder="250000"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
              />
            </div>
          </div>

          {/* MIN PERCENTAGE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Minimum Percentage
            </label>

            <input
              type="number"
              name="minPercentage"
              value={formData.minPercentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              placeholder="60"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
            />
          </div>

          {/* MIN CGPA */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Minimum CGPA
            </label>

            <input
              type="number"
              name="minCGPA"
              value={formData.minCGPA}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.01"
              placeholder="7.5"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
            />
          </div>

          {/* DISABILITY */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Disability Requirement
            </label>

            <select
              name="disability"
              value={formData.disability}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
            >
              <option value="" className="bg-slate-950">
                Any
              </option>

              <option value="yes" className="bg-slate-950">
                Required
              </option>

              <option value="no" className="bg-slate-950">
                Not Required
              </option>
            </select>
          </div>

        </div>
      </section>

      {/* =====================================================
          STATUS
      ===================================================== */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

        <label className="flex cursor-pointer items-center justify-between gap-4">

          <div>
            <p className="text-sm font-medium text-white">
              Scholarship Status
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Inactive scholarships will not be available to students.
            </p>
          </div>

          <div className="relative shrink-0">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="peer sr-only"
            />

            <div className="h-6 w-11 rounded-full bg-slate-700 transition peer-checked:bg-purple-600" />

            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
          </div>

        </label>

      </section>

      {/* =====================================================
          SUBMIT
      ===================================================== */}

      <div className="flex justify-end">

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={17} />

          {loading
            ? "Saving..."
            : submitText}
        </button>

      </div>
    </form>
  );
};

export default ScholarshipForm;