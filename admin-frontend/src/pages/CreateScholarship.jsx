import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../services/api";

const CreateScholarship = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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
    disability: false,
  });

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter scholarship title.");
      return;
    }

    if (!form.provider.trim()) {
      toast.error("Please enter scholarship provider.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Please enter scholarship description.");
      return;
    }

    if (!form.deadline) {
      toast.error("Please select application deadline.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        provider: form.provider.trim(),
        description: form.description.trim(),

        amount: form.amount
          ? Number(form.amount)
          : undefined,

        deadline: form.deadline,

        educationLevel:
          form.educationLevel.trim() || undefined,

        category:
          form.category.trim() || undefined,

        state:
          form.state.trim() || undefined,

        course:
          form.course.trim() || undefined,

        branch:
          form.branch.trim() || undefined,

        maxIncome: form.maxIncome
          ? Number(form.maxIncome)
          : undefined,

        minPercentage: form.minPercentage
          ? Number(form.minPercentage)
          : undefined,

        minCGPA: form.minCGPA
          ? Number(form.minCGPA)
          : undefined,

        disability: form.disability,
      };

      console.log(
        "CREATE SCHOLARSHIP PAYLOAD:",
        payload
      );

      const { data } = await api.post(
        "/admin/scholarships",
        payload
      );

      console.log(
        "CREATE SCHOLARSHIP RESPONSE:",
        data
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to create scholarship."
        );
      }

      toast.success(
        "Scholarship created successfully."
      );

      navigate("/admin/scholarships", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "CREATE SCHOLARSHIP ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to create scholarship."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INPUT STYLE
  // =========================================================

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10";

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">

        <button
          type="button"
          onClick={() =>
            navigate("/admin/scholarships")
          }
          className="flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div>
          <div className="flex items-center gap-2">
            <GraduationCap
              size={22}
              className="text-purple-400"
            />

            <h1 className="text-2xl font-bold">
              Create Scholarship
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Add a new scholarship opportunity for students.
          </p>
        </div>

      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl space-y-6"
      >

        {/* ===================================================
            BASIC INFORMATION
        =================================================== */}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">

          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              General information about the scholarship.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Scholarship Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Maharashtra State Scholarship"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Provider *
              </label>

              <input
                type="text"
                name="provider"
                value={form.provider}
                onChange={handleChange}
                placeholder="Example: Government of Maharashtra"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Scholarship Amount
              </label>

              <input
                type="number"
                name="amount"
                min="0"
                value={form.amount}
                onChange={handleChange}
                placeholder="Example: 50000"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Application Deadline *
              </label>

              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="Enter complete scholarship details..."
                className={inputClass}
              />
            </div>

          </div>

        </section>

        {/* ===================================================
            ELIGIBILITY
        =================================================== */}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">

          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Eligibility Criteria
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define which students can apply for this scholarship.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Education Level
              </label>

              <input
                type="text"
                name="educationLevel"
                value={form.educationLevel}
                onChange={handleChange}
                placeholder="Example: Undergraduate"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Example: SC / ST / OBC / Open"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                State
              </label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Example: Maharashtra"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Course
              </label>

              <input
                type="text"
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="Example: B.Tech"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Branch
              </label>

              <input
                type="text"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                placeholder="Example: Computer Science"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Maximum Family Income
              </label>

              <input
                type="number"
                name="maxIncome"
                min="0"
                value={form.maxIncome}
                onChange={handleChange}
                placeholder="Example: 250000"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Minimum Percentage
              </label>

              <input
                type="number"
                name="minPercentage"
                min="0"
                max="100"
                step="0.01"
                value={form.minPercentage}
                onChange={handleChange}
                placeholder="Example: 60"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Minimum CGPA
              </label>

              <input
                type="number"
                name="minCGPA"
                min="0"
                max="10"
                step="0.01"
                value={form.minCGPA}
                onChange={handleChange}
                placeholder="Example: 7.5"
                className={inputClass}
              />
            </div>

          </div>

          {/* Disability */}

          <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950 p-4">

            <input
              type="checkbox"
              name="disability"
              checked={form.disability}
              onChange={handleChange}
              className="h-4 w-4 accent-purple-600"
            />

            <div>
              <p className="text-sm font-medium text-slate-300">
                Scholarship for students with disabilities
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Enable this if disability eligibility is required.
              </p>
            </div>

          </label>

        </section>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/scholarships")
            }
            disabled={loading}
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Scholarship
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  );
};

export default CreateScholarship;