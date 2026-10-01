import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Edit3,
  Eye,
  FileText,
  IndianRupee,
  Loader2,
  Plus,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../services/api";

const AdminScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const loadScholarships = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/scholarships");

      const data =
        response.data?.scholarships ||
        response.data?.data ||
        response.data ||
        [];

      setScholarships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load scholarships:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load scholarships."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScholarships();
  }, []);

  const categories = useMemo(() => {
    const values = scholarships
      .map((item) => item.category)
      .filter(Boolean);

    return [...new Set(values)];
  }, [scholarships]);

  const filteredScholarships = useMemo(() => {
    const query = search.trim().toLowerCase();

    return scholarships.filter((scholarship) => {
      const matchesSearch =
        !query ||
        scholarship.name
          ?.toLowerCase()
          .includes(query) ||
        scholarship.provider
          ?.toLowerCase()
          .includes(query) ||
        scholarship.type
          ?.toLowerCase()
          .includes(query);

      const isActive =
        scholarship.isActive !== false;

      const matchesStatus =
        status === "all" ||
        (status === "active" && isActive) ||
        (status === "inactive" && !isActive);

      const matchesCategory =
        category === "all" ||
        scholarship.category === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [scholarships, search, status, category]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return "Varies";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const handleDelete = async (scholarship) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${scholarship.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(scholarship._id);

      await api.delete(
        `/admin/scholarships/${scholarship._id}`
      );

      setScholarships((current) =>
        current.filter(
          (item) => item._id !== scholarship._id
        )
      );

      toast.success("Scholarship deleted successfully.");
    } catch (error) {
      console.error(
        "Delete scholarship error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete scholarship."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (scholarship) => {
    try {
      setTogglingId(scholarship._id);

      const nextStatus =
        scholarship.isActive === false;

      const response = await api.put(
        `/admin/scholarships/${scholarship._id}`,
        {
          isActive: nextStatus,
        }
      );

      const updated =
        response.data?.scholarship ||
        response.data?.data ||
        response.data;

      setScholarships((current) =>
        current.map((item) =>
          item._id === scholarship._id
            ? {
                ...item,
                ...(updated || {}),
                isActive: nextStatus,
              }
            : item
        )
      );

      toast.success(
        nextStatus
          ? "Scholarship activated."
          : "Scholarship deactivated."
      );
    } catch (error) {
      console.error(
        "Toggle scholarship error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update scholarship status."
      );
    } finally {
      setTogglingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setCategory("all");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold text-indigo-600">
            Admin Panel
          </p>

          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
            Scholarship Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create, update, activate and manage
            scholarships available on ScholarNet.
          </p>
        </div>

        <Link
          to="/admin/scholarships/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700"
        >
          <Plus size={18} />
          Add Scholarship
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                Total
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {scholarships.length}
              </p>
            </div>

            <FileText
              size={28}
              className="text-indigo-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                Active
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {
                  scholarships.filter(
                    (item) => item.isActive !== false
                  ).length
                }
              </p>
            </div>

            <ToggleRight
              size={28}
              className="text-emerald-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                Inactive
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {
                  scholarships.filter(
                    (item) => item.isActive === false
                  ).length
                }
              </p>
            </div>

            <ToggleLeft
              size={28}
              className="text-amber-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                Categories
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {categories.length}
              </p>
            </div>

            <Users
              size={28}
              className="text-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 lg:grid-cols-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search scholarship or provider..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={17} />
              </button>
            )}
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          {/* Category */}
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {(search ||
          status !== "all" ||
          category !== "all") && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table / Cards */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="text-center">
              <Loader2
                size={36}
                className="mx-auto animate-spin text-indigo-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading scholarships...
              </p>
            </div>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <FileText
                size={28}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 text-lg font-black text-slate-900">
              No scholarships found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Try changing your search or filters, or
              create a new scholarship.
            </p>

            <Link
              to="/admin/scholarships/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <Plus size={17} />
              Add Scholarship
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Scholarship
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Benefit
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Deadline
                    </th>

                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredScholarships.map(
                    (scholarship) => {
                      const active =
                        scholarship.isActive !== false;

                      return (
                        <tr
                          key={scholarship._id}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <div className="max-w-sm">
                              <p className="font-bold text-slate-900">
                                {scholarship.name ||
                                  "Unnamed scholarship"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {scholarship.provider ||
                                  "Unknown provider"}
                              </p>

                              {scholarship.type && (
                                <span className="mt-2 inline-block rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600">
                                  {scholarship.type}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                              {scholarship.category ||
                                "Multiple"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                              <IndianRupee
                                size={14}
                              />

                              {formatAmount(
                                scholarship.amount ||
                                  scholarship.benefitAmount
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <CalendarDays
                                size={15}
                              />

                              {formatDate(
                                scholarship.deadline
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                active
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {active
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/scholarships/${scholarship._id}`}
                                title="View"
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                <Eye size={16} />
                              </Link>

                              <Link
                                to={`/admin/scholarships/${scholarship._id}/edit`}
                                title="Edit"
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Edit3 size={16} />
                              </Link>

                              <button
                                type="button"
                                title={
                                  active
                                    ? "Deactivate"
                                    : "Activate"
                                }
                                disabled={
                                  togglingId ===
                                  scholarship._id
                                }
                                onClick={() =>
                                  handleToggleStatus(
                                    scholarship
                                  )
                                }
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-50"
                              >
                                {togglingId ===
                                scholarship._id ? (
                                  <Loader2
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : active ? (
                                  <ToggleRight
                                    size={16}
                                  />
                                ) : (
                                  <ToggleLeft
                                    size={16}
                                  />
                                )}
                              </button>

                              <button
                                type="button"
                                title="Delete"
                                disabled={
                                  deletingId ===
                                  scholarship._id
                                }
                                onClick={() =>
                                  handleDelete(
                                    scholarship
                                  )
                                }
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              >
                                {deletingId ===
                                scholarship._id ? (
                                  <Loader2
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2
                                    size={16}
                                  />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet cards */}
            <div className="grid gap-4 p-4 lg:hidden">
              {filteredScholarships.map(
                (scholarship) => {
                  const active =
                    scholarship.isActive !== false;

                  return (
                    <div
                      key={scholarship._id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black text-slate-900">
                            {scholarship.name ||
                              "Unnamed scholarship"}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {scholarship.provider ||
                              "Unknown provider"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-bold uppercase text-slate-400">
                            Category
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-700">
                            {scholarship.category ||
                              "Multiple"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-bold uppercase text-slate-400">
                            Benefit
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-700">
                            {formatAmount(
                              scholarship.amount ||
                                scholarship.benefitAmount
                            )}
                          </p>
                        </div>

                        <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-bold uppercase text-slate-400">
                            Deadline
                          </p>

                          <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-700">
                            <CalendarDays size={15} />
                            {formatDate(
                              scholarship.deadline
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          to={`/scholarships/${scholarship._id}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          <Eye size={14} />
                          View
                        </Link>

                        <Link
                          to={`/admin/scholarships/${scholarship._id}/edit`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                        >
                          <Edit3 size={14} />
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={
                            togglingId ===
                            scholarship._id
                          }
                          onClick={() =>
                            handleToggleStatus(
                              scholarship
                            )
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                        >
                          {togglingId ===
                          scholarship._id ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : active ? (
                            <ToggleLeft
                              size={14}
                            />
                          ) : (
                            <ToggleRight
                              size={14}
                            />
                          )}

                          {active
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            scholarship._id
                          }
                          onClick={() =>
                            handleDelete(
                              scholarship
                            )
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId ===
                          scholarship._id ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} />
                          )}

                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>

      {/* Result count */}
      {!loading && (
        <p className="text-center text-xs text-slate-400">
          Showing {filteredScholarships.length} of{" "}
          {scholarships.length} scholarships
        </p>
      )}
    </div>
  );
};

export default AdminScholarshipsPage;