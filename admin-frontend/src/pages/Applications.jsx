import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock3,
  Loader2,
  User,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [remark, setRemark] =
    useState("");

  // =========================================================
  // FETCH APPLICATIONS
  // =========================================================

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/admin/applications"
      );

      const applicationData =
        data?.data?.applications ||
        data?.applications ||
        data?.data ||
        [];

      setApplications(
        Array.isArray(applicationData)
          ? applicationData
          : []
      );
    } catch (error) {
      console.error(
        "FETCH APPLICATIONS ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // =========================================================
  // UPDATE APPLICATION STATUS
  // =========================================================

  const updateStatus = async (
    applicationId,
    status,
    adminRemark = ""
  ) => {
    if (!applicationId) {
      return;
    }

    try {
      setUpdatingId(applicationId);

      const { data } = await api.patch(
        `/admin/applications/${applicationId}/status`,
        {
          status,
          adminRemark,
        }
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to update application."
        );
      }

      toast.success(
        `Application ${status.replace(
          "_",
          " "
        )} successfully.`
      );

      setSelectedApplication(null);
      setRemark("");

      await fetchApplications();
    } catch (error) {
      console.error(
        "UPDATE APPLICATION STATUS ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update application."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================================
  // OPEN APPLICATION DETAILS
  // =========================================================

  const openApplication = (application) => {
    setSelectedApplication(application);

    setRemark(
      application?.adminRemark || ""
    );
  };

  // =========================================================
  // CLOSE DETAILS
  // =========================================================

  const closeApplication = () => {
    if (updatingId) {
      return;
    }

    setSelectedApplication(null);
    setRemark("");
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredApplications =
    applications.filter((application) => {
      const student =
        application.student ||
        application.user ||
        {};

      const scholarship =
        application.scholarship ||
        {};

      const searchableText = `
        ${student.name || ""}
        ${student.fullName || ""}
        ${student.email || ""}
        ${scholarship.title || ""}
        ${application.scholarshipTitle || ""}
        ${application.status || ""}
      `.toLowerCase();

      const matchesSearch =
        searchableText.includes(
          search.toLowerCase()
        );

      const currentStatus = String(
        application.status || "pending"
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        currentStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (
      String(status || "pending").toLowerCase()
    ) {
      case "approved":
        return {
          className:
            "bg-emerald-500/10 text-emerald-400",
          icon: CheckCircle,
        };

      case "rejected":
        return {
          className:
            "bg-red-500/10 text-red-400",
          icon: XCircle,
        };

      case "under_review":
        return {
          className:
            "bg-blue-500/10 text-blue-400",
          icon: Eye,
        };

      case "saved":
        return {
          className:
            "bg-purple-500/10 text-purple-400",
          icon: FileText,
        };

      default:
        return {
          className:
            "bg-yellow-500/10 text-yellow-400",
          icon: Clock3,
        };
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Applications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage student scholarship
            applications.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="mb-5 flex flex-col gap-3 lg:flex-row">

        {/* SEARCH */}

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search student or scholarship..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
          />
        </div>

        {/* STATUS */}

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-purple-500"
        >
          <option value="all">
            All Status
          </option>

          <option value="saved">
            Saved
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="under_review">
            Under Review
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>
        </select>
      </div>

      {/* =====================================================
          APPLICATION TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-white/10">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] text-left">

            <thead className="border-b border-white/10 bg-white/[0.03]">

              <tr>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Scholarship
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applied On
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="5"
                    className="py-14 text-center"
                  >
                    <Loader2
                      size={26}
                      className="mx-auto animate-spin text-purple-400"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading applications...
                    </p>
                  </td>
                </tr>

              ) : filteredApplications.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="py-14 text-center"
                  >
                    <p className="text-sm text-slate-500">
                      No applications found.
                    </p>
                  </td>
                </tr>

              ) : (

                filteredApplications.map(
                  (application) => {

                    const student =
                      application.student ||
                      application.user ||
                      {};

                    const scholarship =
                      application.scholarship ||
                      {};

                    const status =
                      String(
                        application.status ||
                          "pending"
                      ).toLowerCase();

                    const statusData =
                      getStatusStyle(status);

                    const StatusIcon =
                      statusData.icon;

                    const isUpdating =
                      updatingId ===
                      application._id;

                    return (
                      <tr
                        key={application._id}
                        className="border-b border-white/5 transition hover:bg-white/[0.02]"
                      >

                        {/* STUDENT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                              <User
                                size={16}
                              />
                            </div>

                            <div>
                              <p className="font-medium text-white">
                                {student.name ||
                                  student.fullName ||
                                  "Unknown Student"}
                              </p>

                              <p className="mt-1 text-xs text-slate-600">
                                {student.email ||
                                  "No email"}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* SCHOLARSHIP */}

                        <td className="px-5 py-4">

                          <p className="max-w-xs text-sm text-slate-300">
                            {scholarship.title ||
                              application.scholarshipTitle ||
                              "Unknown Scholarship"}
                          </p>

                          {scholarship.provider && (
                            <p className="mt-1 text-xs text-slate-600">
                              {scholarship.provider}
                            </p>
                          )}

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4 text-sm text-slate-500">

                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "—"}

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusData.className}`}
                          >
                            <StatusIcon
                              size={13}
                            />

                            {status
                              .replace(
                                "_",
                                " "
                              )
                              .replace(
                                /\b\w/g,
                                (char) =>
                                  char.toUpperCase()
                              )}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                openApplication(
                                  application
                                )
                              }
                              className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                              title="View application"
                            >
                              <Eye
                                size={16}
                              />
                            </button>

                            {/* UNDER REVIEW */}

                            {status !==
                              "under_review" &&
                              status !==
                                "approved" &&
                              status !==
                                "rejected" && (
                                <button
                                  type="button"
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() =>
                                    updateStatus(
                                      application._id,
                                      "under_review"
                                    )
                                  }
                                  className="rounded-lg border border-blue-500/20 p-2 text-blue-400 transition hover:bg-blue-500/10 disabled:opacity-50"
                                  title="Mark under review"
                                >
                                  {isUpdating ? (
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Clock3
                                      size={16}
                                    />
                                  )}
                                </button>
                              )}

                            {/* APPROVE */}

                            {status !==
                              "approved" && (
                              <button
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  updateStatus(
                                    application._id,
                                    "approved"
                                  )
                                }
                                className="rounded-lg border border-emerald-500/20 p-2 text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-50"
                                title="Approve"
                              >
                                {isUpdating ? (
                                  <Loader2
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <CheckCircle
                                    size={16}
                                  />
                                )}
                              </button>
                            )}

                            {/* REJECT */}

                            {status !==
                              "rejected" && (
                              <button
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  updateStatus(
                                    application._id,
                                    "rejected"
                                  )
                                }
                                className="rounded-lg border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                                title="Reject"
                              >
                                {isUpdating ? (
                                  <Loader2
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <XCircle
                                    size={16}
                                  />
                                )}
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="mt-4 text-xs text-slate-600">
        Showing{" "}
        {filteredApplications.length}{" "}
        of {applications.length} applications
      </div>

      {/* =====================================================
          APPLICATION DETAILS MODAL
      ===================================================== */}

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 p-5">

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Application Details
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Review application information
                </p>
              </div>

              <button
                type="button"
                onClick={closeApplication}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <XCircle
                  size={20}
                />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-5 p-5">

              {/* STUDENT */}

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">

                <h3 className="mb-3 text-sm font-semibold text-white">
                  Student
                </h3>

                <p className="text-sm text-slate-300">
                  {
                    (
                      selectedApplication.student ||
                      selectedApplication.user ||
                      {}
                    ).name ||
                      "Unknown Student"
                  }
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {
                    (
                      selectedApplication.student ||
                      selectedApplication.user ||
                      {}
                    ).email ||
                      "No email"
                  }
                </p>

              </div>

              {/* SCHOLARSHIP */}

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">

                <h3 className="mb-3 text-sm font-semibold text-white">
                  Scholarship
                </h3>

                <p className="text-sm text-slate-300">
                  {selectedApplication
                    .scholarship
                    ?.title ||
                    selectedApplication.scholarshipTitle ||
                    "Unknown Scholarship"}
                </p>

                {selectedApplication
                  .scholarship
                  ?.provider && (
                  <p className="mt-1 text-xs text-slate-500">
                    {
                      selectedApplication
                        .scholarship
                        .provider
                    }
                  </p>
                )}

              </div>

              {/* STATUS */}

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">

                <h3 className="mb-3 text-sm font-semibold text-white">
                  Current Status
                </h3>

                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    getStatusStyle(
                      selectedApplication.status
                    ).className
                  }`}
                >
                  {String(
                    selectedApplication.status ||
                      "pending"
                  )
                    .replace(
                      "_",
                      " "
                    )
                    .replace(
                      /\b\w/g,
                      (char) =>
                        char.toUpperCase()
                    )}
                </span>

              </div>

              {/* ADMIN REMARK */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Admin Remark
                </label>

                <textarea
                  value={remark}
                  onChange={(e) =>
                    setRemark(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Add a remark for the student..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
                />

              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  disabled={
                    updatingId ===
                    selectedApplication._id
                  }
                  onClick={() =>
                    updateStatus(
                      selectedApplication._id,
                      "under_review",
                      remark
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-blue-500/20 px-4 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10 disabled:opacity-50"
                >
                  <Clock3
                    size={16}
                  />

                  Under Review
                </button>

                <button
                  type="button"
                  disabled={
                    updatingId ===
                    selectedApplication._id
                  }
                  onClick={() =>
                    updateStatus(
                      selectedApplication._id,
                      "approved",
                      remark
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  <CheckCircle
                    size={16}
                  />

                  Approve
                </button>

                <button
                  type="button"
                  disabled={
                    updatingId ===
                    selectedApplication._id
                  }
                  onClick={() =>
                    updateStatus(
                      selectedApplication._id,
                      "rejected",
                      remark
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                >
                  <XCircle
                    size={16}
                  />

                  Reject
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Applications;