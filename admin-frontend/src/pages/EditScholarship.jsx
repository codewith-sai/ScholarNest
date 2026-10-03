import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../services/api";

const EditScholarship = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    active: true,
  });

  // =========================================================
  // FETCH SCHOLARSHIP
  // =========================================================

  const fetchScholarship = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/scholarships/${id}`
      );

      const scholarship =
        data?.data?.scholarship ||
        data?.scholarship ||
        data?.data;

      if (!scholarship) {
        throw new Error("Scholarship not found.");
      }

      setForm({
        title: scholarship.title || "",
        provider: scholarship.provider || "",
        description: scholarship.description || "",
        amount: scholarship.amount ?? "",
        deadline: scholarship.deadline
          ? scholarship.deadline.split("T")[0]
          : "",
        educationLevel:
          scholarship.educationLevel || "",
        category: scholarship.category || "",
        state: scholarship.state || "",
        course: scholarship.course || "",
        branch: scholarship.branch || "",
        maxIncome: scholarship.maxIncome ?? "",
        minPercentage:
          scholarship.minPercentage ?? "",
        minCGPA: scholarship.minCGPA ?? "",
        disability:
          scholarship.disability || false,
        active:
          scholarship.active !== false,
      });
    } catch (error) {
      console.error(
        "FETCH SCHOLARSHIP ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load scholarship."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchScholarship();
    }
  }, [id]);

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================================================
  // UPDATE SCHOLARSHIP
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
      toast.error(
        "Please enter scholarship description."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        provider: form.provider.trim(),
        description: form.description.trim(),
        amount: form.amount
          ? Number(form.amount)
          : undefined,
        deadline: form.deadline || undefined,
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
        active: form.active,
      };

      const { data } = await api.put(
        `/admin/scholarships/${id}`,
        payload
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to update scholarship."
        );
      }

      toast.success(
        "Scholarship updated successfully."
      );

      navigate("/admin/scholarships", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "UPDATE SCHOLARSHIP ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update scholarship."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10";

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-purple-400"
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading scholarship...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">

        <button
          type="button"
          onClick={() =>
            navigate("/admin/scholarships")
          }
          className="flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
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
              Edit Scholarship
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Update scholarship information and eligibility.
          </p>
        </div>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl space-y-6"
      >

        {/* BASIC INFORMATION */}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">

          <h2 className="mb-6 text-lg font-semibold">
            Basic Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Scholarship Title *
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Provider *
              </label>

              <input
                name="provider"
                value={form.provider}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Deadline
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
              <label className="mb-2 block text-sm text-slate-300">
                Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                className={inputClass}
              />
            </div>

          </div>
        </section>

        {/* ELIGIBILITY */}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">

          <h2 className="mb-6 text-lg font-semibold">
            Eligibility Criteria
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            {[
              ["educationLevel", "Education Level"],
              ["category", "Category"],
              ["state", "State"],
              ["course", "Course"],
              ["branch", "Branch"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="mb-2 block text-sm text-slate-300">
                  {label}
                </label>

                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            ))}

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Maximum Family Income
              </label>

              <input
                type="number"
                name="maxIncome"
                value={form.maxIncome}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
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
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
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
                className={inputClass}
              />
            </div>

          </div>

          <div className="mt-6 space-y-3">

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950 p-4">

              <input
                type="checkbox"
                name="disability"
                checked={form.disability}
                onChange={handleChange}
                className="h-4 w-4 accent-purple-600"
              />

              <span className="text-sm text-slate-300">
                Requires disability eligibility
              </span>

            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-950 p-4">

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-4 w-4 accent-purple-600"
              />

              <span className="text-sm text-slate-300">
                Scholarship is active
              </span>

            </label>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/scholarships")
            }
            disabled={saving}
            className="rounded-xl border border-white/10 px-6 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditScholarship;