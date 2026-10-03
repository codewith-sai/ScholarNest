import { useEffect, useMemo, useState } from "react";
import { Bell, RefreshCw, Filter, CheckCheck } from "lucide-react";
import { toast } from "react-toastify";

import api from "../services/api";
import PageHeader from "../components/common/PageHeader";
import NotificationList from "../components/notifications/NotificationList";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const { data } = await api.get("/admin/notifications");

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Fetch notifications error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (filter === "all") {
      return notifications;
    }

    return notifications.filter(
      (notification) =>
        String(notification.type || "").toLowerCase() ===
        filter.toLowerCase()
    );
  }, [notifications, filter]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
  };

  const handleMarkRead = async (notification) => {
    /*
      The current backend does not provide a
      mark-notification-as-read endpoint.

      Keep the UI state updated locally for now.
      A backend PATCH endpoint can be connected later.
    */

    setNotifications((previous) =>
      previous.map((item) =>
        item._id === notification._id
          ? { ...item, read: true }
          : item
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    toast.success("All notifications marked as read.");
  };

  const filterOptions = [
    { value: "all", label: "All" },
    {
      value: "new_scholarship",
      label: "New Scholarships",
    },
    {
      value: "application",
      label: "Applications",
    },
    {
      value: "application_status",
      label: "Application Status",
    },
    {
      value: "deadline",
      label: "Deadlines",
    },
    {
      value: "profile",
      label: "Profile",
    },
    {
      value: "general",
      label: "General",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="View important updates and system notifications."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fetchNotifications(false)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
              Refresh
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-600"
              >
                <CheckCheck size={16} />
                Mark All Read
              </button>
            )}
          </div>
        }
      />

      {/* SUMMARY */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Bell size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Total Notifications
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {notifications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Filter size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Showing
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {filteredNotifications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <Bell size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Unread
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {unreadCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER */}

      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          {filterOptions.map((option) => {
            const active = filter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-purple-500 text-white"
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* NOTIFICATION LIST */}

      <NotificationList
        notifications={filteredNotifications}
        loading={loading}
        onClick={handleNotificationClick}
        onMarkRead={handleMarkRead}
      />
    </div>
  );
};

export default Notifications;