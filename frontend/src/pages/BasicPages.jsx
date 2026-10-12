import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BellRing,
  Bookmark,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  GraduationCap,
  IndianRupee,
  LogOut,
  Mail,
  Save,
  Settings,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import api from "../services/api";

const APPLICATION_STATUSES = [
  "Saved",
  "Planning to Apply",
  "Applied",
  "Under Review",
  "Selected",
  "Rejected",
];

function BasicPages({ page }) {
  switch (page) {
    case "saved":
      return <SavedScholarships />;

    case "applications":
      return <Applications />;

    case "notifications":
      return <Notifications />;

    case "settings":
      return <SettingsPage />;

    default:
      return <NotFoundPage />;
  }
}

/* =========================================================
   SAVED SCHOLARSHIPS
========================================================= */

function SavedScholarships() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      const response = await api.get("/saved");

      setSaved(
        response.data.saved ||
          response.data ||
          []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to load saved scholarships."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const removeSaved = async (id) => {
    try {
      await api.delete(`/saved/${id}`);

      setSaved((current) =>
        current.filter((item) => {
          const scholarshipId =
            item.scholarship?._id ||
            item.scholarship?.id ||
            item.scholarshipId ||
            item._id ||
            item.id;

          return String(scholarshipId) !== String(id);
        })
      );

      toast.success(
        "Scholarship removed."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to remove scholarship."
      );
    }
  };

  return (
    <PageShell
      icon={Bookmark}
      iconClass="bg-pink-100 text-pink-600"
      title="Saved Scholarships"
      description="Keep track of scholarship opportunities you may want to apply for."
    >
      {loading ? (
        <PageLoading />
      ) : saved.length === 0 ? (
        <EmptyPage
          icon={Bookmark}
          title="No saved scholarships"
          description="Save scholarships while browsing them and they will appear here."
          actionText="Browse Scholarships"
          actionLink="/scholarships"
        />
      ) : (
        <div className="space-y-4">
          {saved.map((item) => {
            const scholarship =
              item.scholarship ||
              item;

            const id =
              scholarship._id ||
              scholarship.id ||
              item.scholarshipId;

            return (
              <SavedScholarshipCard
                key={id}
                scholarship={scholarship}
                onRemove={() =>
                  removeSaved(id)
                }
              />
            );
          })}
        </div>
      )}
    </PageShell>
  );
}

function SavedScholarshipCard({
  scholarship,
  onRemove,
}) {
  const deadline =
    scholarship.deadline ||
    scholarship.applicationDeadline;

  const daysLeft = getDaysLeft(deadline);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <GraduationCap size={22} />
          </div>

          <div className="min-w-0">
            <Link
              to={`/scholarships/${
                scholarship._id ||
                scholarship.id
              }`}
            >
              <h3 className="truncate text-base font-black text-slate-900 hover:text-indigo-600">
                {scholarship.name ||
                  scholarship.title ||
                  "Scholarship"}
              </h3>
            </Link>

            <p className="mt-1 text-xs font-semibold text-slate-400">
              {scholarship.provider ||
                "Scholarship Provider"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {scholarship.category && (
                <Tag>
                  {scholarship.category}
                </Tag>
              )}

              <Tag>
                Deadline:{" "}
                {formatDate(deadline)}
              </Tag>

              <DeadlineTag
                daysLeft={daysLeft}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            to={`/scholarships/${
              scholarship._id ||
              scholarship.id
            }`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
          >
            View Details
            <ExternalLink size={15} />
          </Link>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={15} />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   APPLICATIONS
========================================================= */

function Applications() {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  const loadApplications = async () => {
    try {
      const response =
        await api.get("/applications");

      setApplications(
        response.data.applications ||
          response.data ||
          []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateStatus = async (
    application,
    status
  ) => {
    const id =
      application._id ||
      application.id;

    setUpdatingId(id);

    try {
      await api.put(
        `/applications/${id}`,
        { status }
      );

      setApplications((current) =>
        current.map((item) =>
          String(
            item._id || item.id
          ) === String(id)
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      toast.success(
        "Application status updated."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update application."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const statusCounts = useMemo(() => {
    return APPLICATION_STATUSES.reduce(
      (result, status) => {
        result[status] =
          applications.filter(
            (application) =>
              application.status ===
              status
          ).length;

        return result;
      },
      {}
    );
  }, [applications]);

  return (
    <PageShell
      icon={FileText}
      iconClass="bg-blue-100 text-blue-600"
      title="Application Tracking"
      description="Track the scholarships you plan to apply for and manage their progress."
    >
      {/* Status summary */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {APPLICATION_STATUSES.map(
          (status) => (
            <div
              key={status}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {status}
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {statusCounts[status] ||
                  0}
              </p>
            </div>
          )
        )}
      </div>

      {loading ? (
        <PageLoading />
      ) : applications.length === 0 ? (
        <EmptyPage
          icon={FileText}
          title="No applications tracked"
          description="Start tracking a scholarship from its details page."
          actionText="Find Scholarships"
          actionLink="/scholarships"
        />
      ) : (
        <div className="space-y-4">
          {applications.map(
            (application) => (
              <ApplicationCard
                key={
                  application._id ||
                  application.id
                }
                application={application}
                updating={
                  String(updatingId) ===
                  String(
                    application._id ||
                      application.id
                  )
                }
                onStatusChange={
                  updateStatus
                }
              />
            )
          )}
        </div>
      )}
    </PageShell>
  );
}

function ApplicationCard({
  application,
  updating,
  onStatusChange,
}) {
  const scholarship =
    application.scholarship ||
    {};

  const id =
    scholarship._id ||
    scholarship.id ||
    application.scholarshipId;

  const deadline =
    scholarship.deadline ||
    scholarship.applicationDeadline;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FileText size={21} />
          </div>

          <div className="min-w-0">
            <Link
              to={`/scholarships/${id}`}
            >
              <h3 className="text-base font-black text-slate-900 hover:text-indigo-600">
                {scholarship.name ||
                  scholarship.title ||
                  application.scholarshipName ||
                  "Scholarship"}
              </h3>
            </Link>

            <p className="mt-1 text-xs font-semibold text-slate-400">
              {scholarship.provider ||
                application.provider ||
                "Scholarship Provider"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge
                status={
                  application.status ||
                  "Saved"
                }
              />

              <Tag>
                Deadline:{" "}
                {formatDate(deadline)}
              </Tag>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-56">
          <label className="mb-2 block text-xs font-bold text-slate-500">
            Application Status
          </label>

          <select
            value={
              application.status ||
              "Saved"
            }
            disabled={updating}
            onChange={(event) =>
              onStatusChange(
                application,
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:opacity-60"
          >
            {APPLICATION_STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {application.notes && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Notes
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {application.notes}
          </p>
        </div>
      )}

      {updating && (
        <p className="mt-3 text-xs font-semibold text-indigo-600">
          Updating application status...
        </p>
      )}
    </article>
  );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

function Notifications() {
  const { fetchNotifications: refreshGlobalNotifs } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(
        response.data.notifications ||
          response.data ||
          []
      );
      if (refreshGlobalNotifs) refreshGlobalNotifs();
    } catch (error) {
      console.error(error);
      toast.error("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (notification) => {
    const id = notification._id || notification.id;

    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((current) =>
        current.map((item) =>
          String(item._id || item.id) === String(id)
            ? {
                ...item,
                read: true,
                isRead: true,
              }
            : item
        )
      );
      if (refreshGlobalNotifs) refreshGlobalNotifs();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read: true,
          isRead: true,
        }))
      );
      if (refreshGlobalNotifs) refreshGlobalNotifs();

      toast.success("All notifications marked as read.");
    } catch (error) {
      console.error("Notifications update error:", error);
      toast.error("Unable to update notifications.");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read && !notification.isRead
  ).length;

  return (
    <PageShell
      icon={Bell}
      iconClass="bg-rose-100 text-rose-600"
      title="Notifications"
      description="Stay updated about scholarship matches, deadlines and application activity."
      action={
        unreadCount > 0 ? (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            <Check size={15} />
            Mark all as read
          </button>
        ) : null
      }
    >
      {unreadCount > 0 && (
        <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex items-center gap-3">
            <BellRing size={19} className="text-indigo-600" />
            <p className="text-sm font-bold text-indigo-900">
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <PageLoading />
      ) : notifications.length === 0 ? (
        <EmptyPage
          icon={Bell}
          title="You're all caught up"
          description="New scholarship and application updates will appear here."
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification._id || notification.id}
              notification={notification}
              onRead={markRead}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function NotificationCard({ notification, onRead }) {
  const isRead = notification.read || notification.isRead;
  const type = notification.type || "general";
  const config = getNotificationConfig(type);

  // Extract rich scholarship details if present
  let metadata = notification.metadata;
  if (typeof metadata === "string") {
    try {
      metadata = JSON.parse(metadata);
    } catch {
      metadata = null;
    }
  }

  const scholarshipId = notification.scholarshipId || metadata?.scholarshipId;
  const scholarshipName = notification.scholarshipName || metadata?.scholarshipName;
  const department =
    notification.governmentDepartment ||
    notification.provider ||
    metadata?.department ||
    metadata?.provider;
  const amount = notification.amount || metadata?.amount;
  const benefits = notification.benefitsSummary || metadata?.benefits;
  const deadline = notification.deadline || metadata?.deadline;
  const mahadbtUrl =
    notification.actionUrl ||
    notification.scholarshipApplicationUrl ||
    metadata?.mahadbtUrl ||
    "https://mahadbt.maharashtra.gov.in/";

  const hasScholarshipInfo = Boolean(scholarshipId || scholarshipName || benefits || deadline);

  return (
    <article
      className={`w-full rounded-2xl border p-5 transition-all ${
        isRead
          ? "border-slate-200 bg-white"
          : "border-indigo-200 bg-indigo-50/40 shadow-sm"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-xs ${config.className}`}
        >
          <config.icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Header Row */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold text-slate-900">
                {notification.title || getNotificationTitle(type)}
              </h3>
              {!isRead && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  New
                </span>
              )}
            </div>

            <span className="text-xs font-medium text-slate-400">
              {formatDateTime(notification.createdAt)}
            </span>
          </div>

          {/* Description / Message */}
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
            {notification.message || notification.body || "You have a new notification."}
          </p>

          {/* Detailed Scholarship Highlight Card */}
          {hasScholarshipInfo && (
            <div className="mt-3.5 rounded-xl border border-slate-200/90 bg-slate-50/90 p-4 space-y-2 text-xs">
              {scholarshipName && (
                <div className="font-bold text-slate-900 text-sm">
                  {scholarshipName}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-slate-600">
                {department && (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Building size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{department}</span>
                  </div>
                )}

                {(amount || benefits) && (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <IndianRupee size={14} className="text-emerald-600 shrink-0" />
                    <span>
                      {amount ? `Up to ₹${Number(amount).toLocaleString("en-IN")}` : benefits}
                    </span>
                  </div>
                )}

                {deadline && (
                  <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                    <Calendar size={14} className="text-rose-500 shrink-0" />
                    <span>Deadline: {formatDate(deadline)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 pt-1">
            {/* Direct MahaDBT Official Portal Link */}
            <a
              href={mahadbtUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (!isRead) onRead(notification);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
            >
              <span>Apply on MahaDBT Portal</span>
              <ExternalLink size={13} />
            </a>

            {/* View Scheme Details on ScholarNest */}
            {scholarshipId && (
              <Link
                to={`/scholarships/${scholarshipId}`}
                onClick={() => {
                  if (!isRead) onRead(notification);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <span>View Scheme Details</span>
                <ArrowRight size={13} />
              </Link>
            )}

            {/* Mark as read toggle */}
            {!isRead && (
              <button
                type="button"
                onClick={() => onRead(notification)}
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-1 px-2"
              >
                <Check size={14} />
                <span>Mark as read</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {
  const { user, updateUser, logout } =
    useAuth();

  const [form, setForm] = useState({
    name:
      user?.name ||
      user?.fullName ||
      "",
    email: user?.email || "",
  });

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    setForm({
      name:
        user?.name ||
        user?.fullName ||
        "",
      email: user?.email || "",
    });
  }, [user]);

  const updateField = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveProfile = async (
    event
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error(
        "Please enter your name."
      );
      return;
    }

    setSaving(true);

    try {
      const response =
        await api.put("/profile", {
          fullName:
            form.name.trim(),
        });

      const updatedProfile =
        response.data.profile ||
        response.data;

      if (updateUser) {
        updateUser({
          ...user,
          name: form.name.trim(),
          profile:
            updatedProfile ||
            user?.profile,
        });
      }

      toast.success(
        "Profile settings updated."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      icon={Settings}
      iconClass="bg-slate-100 text-slate-600"
      title="Settings"
      description="Manage your ScholarNet account and profile settings."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Account information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="font-black text-slate-900">
                  Account Information
                </h2>

                <p className="text-xs text-slate-400">
                  Update your basic account details.
                </p>
              </div>
            </div>

            <form
              onSubmit={saveProfile}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-500 outline-none"
                  />
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  Your email address is used for account
                  authentication.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </form>
          </section>

          {/* Profile */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <GraduationCap size={19} />
                </div>

                <div>
                  <h2 className="font-black text-slate-900">
                    Student Profile
                  </h2>

                  <p className="text-xs text-slate-400">
                    Your profile controls scholarship matching.
                  </p>
                </div>
              </div>

              <Link
                to="/profile/edit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Edit Profile
              </Link>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <Bell size={19} />
              </div>

              <div>
                <h2 className="font-black text-slate-900">
                  Notifications
                </h2>

                <p className="text-xs text-slate-400">
                  ScholarNet notifications are delivered in-app.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 text-emerald-500"
                />

                <p className="text-xs leading-5 text-slate-600">
                  You will receive notifications for new matching
                  scholarships, approaching deadlines and
                  application status updates.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right side */}
        <aside className="space-y-5">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-lg">
            <Settings
              size={25}
              className="text-indigo-200"
            />

            <h2 className="mt-5 text-lg font-black">
              ScholarNet Account
            </h2>

            <p className="mt-2 text-xs leading-5 text-indigo-100">
              Keep your student profile accurate so scholarship
              matching can use the latest information.
            </p>
          </div>

          <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <LogOut size={18} />
              </div>

              <div>
                <h3 className="font-black text-slate-900">
                  Sign Out
                </h3>

                <p className="text-xs text-slate-400">
                  End your current session.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

/* =========================================================
   SHARED COMPONENTS
========================================================= */

function PageShell({
  icon: Icon,
  iconClass,
  title,
  description,
  action,
  children,
}) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
          >
            <Icon size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {title}
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              {description}
            </p>
          </div>
        </div>

        {action}
      </header>

      {children}
    </div>
  );
}

function EmptyPage({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500">
        <Icon size={28} />
      </div>

      <h2 className="mt-5 text-lg font-black text-slate-900">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}

function PageLoading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl bg-slate-200"
          />
        )
      )}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
      {children}
    </span>
  );
}

function StatusBadge({
  status,
}) {
  const config =
    getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${config.className}`}
    >
      <config.icon size={12} />
      {status}
    </span>
  );
}

function DeadlineTag({
  daysLeft,
}) {
  if (daysLeft === null) {
    return (
      <Tag>
        Deadline unavailable
      </Tag>
    );
  }

  if (daysLeft < 0) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
        Closed
      </span>
    );
  }

  if (daysLeft <= 7) {
    return (
      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600">
        {daysLeft === 0
          ? "Due today"
          : `${daysLeft} days left`}
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
      {daysLeft} days left
    </span>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(date) {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDateTime(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function getDaysLeft(date) {
  if (!date) return null;

  const today = new Date();
  const deadline = new Date(date);

  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  return Math.ceil(
    (deadline - today) /
      (1000 * 60 * 60 * 24)
  );
}

function getStatusConfig(status) {
  switch (status) {
    case "Planning to Apply":
      return {
        icon: Clock3,
        className:
          "bg-amber-50 text-amber-600",
      };

    case "Applied":
      return {
        icon: Check,
        className:
          "bg-blue-50 text-blue-600",
      };

    case "Under Review":
      return {
        icon: Clock3,
        className:
          "bg-purple-50 text-purple-600",
      };

    case "Selected":
      return {
        icon: CheckCircle2,
        className:
          "bg-emerald-50 text-emerald-600",
      };

    case "Rejected":
      return {
        icon: X,
        className:
          "bg-rose-50 text-rose-600",
      };

    default:
      return {
        icon: Bookmark,
        className:
          "bg-slate-100 text-slate-600",
      };
  }
}

function getNotificationConfig(type) {
  switch (type) {
    case "DEADLINE":
    case "DEADLINE_APPROACHING":
      return {
        icon: Clock3,
        className:
          "bg-amber-100 text-amber-600",
      };

    case "SCHOLARSHIP":
    case "NEW_SCHOLARSHIP":
    case "MATCH":
    case "SCHOLARSHIP_MATCH":
      return {
        icon: GraduationCap,
        className:
          "bg-indigo-100 text-indigo-600",
      };

    case "APPLICATION":
    case "APPLICATION_STATUS":
      return {
        icon: FileText,
        className:
          "bg-blue-100 text-blue-600",
      };

    case "PROFILE":
      return {
        icon: UserRound,
        className:
          "bg-purple-100 text-purple-600",
      };

    default:
      return {
        icon: Bell,
        className:
          "bg-slate-100 text-slate-600",
      };
  }
}

function getNotificationTitle(type) {
  switch (type) {
    case "DEADLINE":
    case "DEADLINE_APPROACHING":
      return "Scholarship deadline approaching";

    case "SCHOLARSHIP":
    case "NEW_SCHOLARSHIP":
      return "New scholarship scheme available";

    case "MATCH":
    case "SCHOLARSHIP_MATCH":
      return "New scholarship match";

    case "APPLICATION":
    case "APPLICATION_STATUS":
      return "Application update";

    case "PROFILE":
      return "Profile reminder";

    default:
      return "ScholarNet notification";
  }
}

function NotFoundPage() {
  return (
    <EmptyPage
      icon={AlertCircle}
      title="Page not found"
      description="The requested ScholarNet page could not be found."
      actionText="Go to Dashboard"
      actionLink="/dashboard"
    />
  );
}

export default BasicPages;