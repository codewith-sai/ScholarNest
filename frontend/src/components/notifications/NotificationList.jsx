import { useEffect, useRef } from "react";
import gsap from "gsap";
import NotificationCard from "./NotificationCard";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

const NotificationList = ({
  notifications = [],
  loading = false,
  onNotificationClick,
  onNotificationDelete,
}) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (
      !listRef.current ||
      loading ||
      notifications.length === 0
    ) {
      return;
    }

    const items =
      listRef.current.querySelectorAll("[data-notification]");

    const animation = gsap.fromTo(
      items,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: "power3.out",
      }
    );

    return () => {
      animation.kill();
    };
  }, [notifications, loading]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <LoadingSpinner message="Loading notifications..." />
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <EmptyState
        title="No Notifications"
        message="You don't have any notifications right now."
      />
    );
  }

  return (
    <div
      ref={listRef}
      className="flex w-full flex-col gap-3"
    >
      {notifications.map((notification) => (
        <div
          key={notification._id || notification.id}
          data-notification
        >
          <NotificationCard
            notification={notification}
            onClick={onNotificationClick}
            onDelete={onNotificationDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationList;