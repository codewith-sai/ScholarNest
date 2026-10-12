import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
  X,
} from "lucide-react";

const NotificationCard = ({
  notification,
  onClick,
  onDelete,
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        x: -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power3.out",
      }
    );
  }, []);

  if (!notification) return null;

  const type = notification.type?.toLowerCase() || "info";

  const getNotificationConfig = () => {
    switch (type) {
      case "success":
      case "approved":
        return {
          icon: CheckCircle,
          iconColor: "text-green-600",
          iconBg: "bg-green-100",
        };

      case "warning":
      case "deadline":
        return {
          icon: AlertCircle,
          iconColor: "text-yellow-600",
          iconBg: "bg-yellow-100",
        };

      case "application":
        return {
          icon: FileText,
          iconColor: "text-indigo-600",
          iconBg: "bg-indigo-100",
        };

      case "error":
      case "rejected":
        return {
          icon: AlertCircle,
          iconColor: "text-red-600",
          iconBg: "bg-red-100",
        };

      case "info":
      default:
        return {
          icon: Info,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100",
        };
    }
  };

  const config = getNotificationConfig();
  const Icon = config.icon;

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onClick?.(notification)}
      className={`group relative flex cursor-pointer gap-4 rounded-xl border p-4 transition-all duration-200 ${
        notification.read
          ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
          : "border-indigo-100 bg-indigo-50/50 hover:border-indigo-200 hover:shadow-sm"
      }`}
    >
      {/* Notification Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
      >
        <Icon
          size={20}
          className={config.iconColor}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pr-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm ${
                notification.read
                  ? "font-medium text-gray-800"
                  : "font-semibold text-gray-900"
              }`}
            >
              {notification.title || "Notification"}
            </h3>

            {/* Unread indicator */}
            {!notification.read && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
            )}
          </div>
        </div>

        <p className="mt-1 text-sm leading-5 text-gray-600">
          {notification.message || "You have a new notification."}
        </p>

        {/* Related scholarship */}
        {notification.scholarshipName && (
          <p className="mt-2 text-xs font-medium text-indigo-600">
            {notification.scholarshipName}
          </p>
        )}

        {/* Date */}
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
          <span>
            {formatDate(
              notification.createdAt || notification.date
            )}
          </span>

          {formatTime(
            notification.createdAt || notification.date
          ) && (
            <>
              <span>•</span>

              <span>
                {formatTime(
                  notification.createdAt || notification.date
                )}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Delete Button */}
      {onDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(notification);
          }}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
          aria-label="Delete notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default NotificationCard;