import NotificationItem from "./NotificationItem";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import { Bell } from "lucide-react";

const NotificationList = ({
  notifications = [],
  loading = false,
  onClick,
  onMarkRead,
}) => {
  if (loading) {
    return <LoadingSpinner text="Loading notifications..." />;
  }

  if (!notifications.length) {
    return (
      <EmptyState
        icon={Bell}
        title="No notifications"
        description="There are no notifications available at the moment."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id || notification.id}
          notification={notification}
          onClick={onClick}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
};

export default NotificationList;