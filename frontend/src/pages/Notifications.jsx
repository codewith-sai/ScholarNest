import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import gsap from "gsap";

import NotificationList from "../components/notifications/NotificationList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

import { useNotification } from "../context/NotificationContext";

const Notifications = () => {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!loading && notifications.length > 0) {
      gsap.fromTo(
        ".notifications-header",
        {
          opacity: 0,
          y: -20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [loading, notifications]);

  const handleNotificationClick = async (notification) => {
    const id = notification?._id || notification?.id;

    if (!id) return;

    if (!notification.read) {
      await markAsRead(id);
    }

    const targetUrl =
      notification?.link ||
      notification?.actionUrl ||
      notification?.url;

    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  const handleNotificationDelete = async (notification) => {
    const id = notification?._id || notification?.id;

    if (!id) return;

    await deleteNotification(id);
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    await markAllAsRead();
    await fetchNotifications();
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete all notifications?"
    );

    if (!confirmed) return;

    await clearAllNotifications();
    await fetchNotifications();
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950">
        <LoadingSpinner
          fullScreen
          message="Loading notifications..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="notifications-header mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                <Bell size={14} />
                Notifications
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Notifications
              </h1>

              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Stay updated with your scholarship applications,
                deadlines, and account activity.
              </p>
            </div>

            {notifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCheck size={16} />
                  Mark all read
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Unread count */}
          {unreadCount > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              {unreadCount} unread notification
              {unreadCount === 1 ? "" : "s"}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <ErrorMessage
              message={error}
              onRetry={() => fetchNotifications()}
              showRetry
            />
          </div>
        )}

        {/* Notification list */}
        <NotificationList
          notifications={notifications}
          loading={loading}
          onNotificationClick={handleNotificationClick}
          onNotificationDelete={handleNotificationDelete}
        />
      </div>
    </div>
  );
};

export default Notifications;