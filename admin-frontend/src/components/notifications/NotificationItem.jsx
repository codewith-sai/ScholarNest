import {
  Bell,
  GraduationCap,
  ClipboardList,
  AlertCircle,
  FileText,
  User,
  Clock3,
  CheckCircle,
} from "lucide-react";

const notificationConfig = {
  NEW_SCHOLARSHIP: {
    label: "New Scholarship",
    icon: GraduationCap,
    className: "bg-purple-500/10 text-purple-400",
  },

  SCHOLARSHIP_MATCH: {
    label: "Scholarship Match",
    icon: GraduationCap,
    className: "bg-blue-500/10 text-blue-400",
  },

  DEADLINE: {
    label: "Deadline",
    icon: Clock3,
    className: "bg-yellow-500/10 text-yellow-400",
  },

  APPLICATION: {
    label: "Application",
    icon: ClipboardList,
    className: "bg-blue-500/10 text-blue-400",
  },

  APPLICATION_STATUS: {
    label: "Application Status",
    icon: CheckCircle,
    className: "bg-emerald-500/10 text-emerald-400",
  },

  PROFILE: {
    label: "Profile",
    icon: User,
    className: "bg-cyan-500/10 text-cyan-400",
  },

  GENERAL: {
    label: "General",
    icon: FileText,
    className: "bg-slate-500/10 text-slate-400",
  },
};

const NotificationItem = ({
  notification,
  onClick,
  onMarkRead,
}) => {
  if (!notification) return null;

  const type =
    String(notification.type || "GENERAL").toUpperCase();

  const config =
    notificationConfig[type] ||
    notificationConfig.GENERAL;

  const Icon = config.icon;

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClick = () => {
    onClick?.(notification);

    if (!notification.read) {
      onMarkRead?.(notification);
    }
  };

  return (
    <div
      className={`group flex gap-4 border-b border-white/5 p-5 transition last:border-b-0 ${
        notification.read
          ? "bg-transparent hover:bg-white/[0.02]"
          : "bg-purple-500/[0.025] hover:bg-purple-500/[0.04]"
      }`}
    >

      {/* ICON */}

      <button
        type="button"
        onClick={handleClick}
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.className}`}
        title="Open notification"
      >
        <Icon size={20} />

        {!notification.read && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-purple-500 ring-2 ring-slate-950" />
        )}
      </button>

      {/* CONTENT */}

      <button
        type="button"
        onClick={handleClick}
        className="min-w-0 flex-1 text-left"
      >

        <div className="flex flex-wrap items-center gap-2">

          <h3
            className={`text-sm font-medium ${
              notification.read
                ? "text-slate-400"
                : "text-slate-200"
            }`}
          >
            {notification.title ||
              config.label}
          </h3>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${config.className}`}
          >
            {config.label}
          </span>

        </div>

        <p className="mt-1.5 text-sm leading-5 text-slate-500">
          {notification.message ||
            "No notification message available."}
        </p>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-700">
          <Clock3 size={12} />
          {formatDate(
            notification.createdAt ||
              notification.updatedAt
          )}
        </div>

      </button>

      {/* READ STATUS */}

      <div className="hidden shrink-0 items-start sm:flex">

        {!notification.read ? (
          <span className="mt-1 rounded-full bg-purple-500/10 px-2 py-1 text-[10px] font-medium text-purple-400">
            New
          </span>
        ) : (
          <span className="mt-1 text-[10px] text-slate-700">
            Read
          </span>
        )}

      </div>

    </div>
  );
};

export default NotificationItem;