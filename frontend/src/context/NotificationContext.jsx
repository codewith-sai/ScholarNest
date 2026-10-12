<<<<<<< HEAD
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data?.notifications || res.data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
=======
import { createContext, useCallback, useContext, useState } from "react";
import api from "../services/api";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/notifications", {
        params,
      });

      const data = response?.data?.data ?? response?.data;

      const notificationList = Array.isArray(data)
        ? data
        : data?.notifications || [];

      setNotifications(notificationList);

      const unread =
        response?.data?.unreadCount ??
        data?.unreadCount ??
        notificationList.filter(
          (notification) => !notification?.isRead
        ).length;

      setUnreadCount(unread);

      return {
        success: true,
        data: notificationList,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch notifications.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      setError(null);

      if (!notificationId) {
        throw new Error("Notification ID is required.");
      }

      const response = await api.patch(
        `/notifications/${notificationId}/read`
      );

      const updatedNotification =
        response?.data?.data ?? response?.data;

      setNotifications((prev) =>
        prev.map((notification) => {
          const id = notification?._id || notification?.id;

          if (String(id) === String(notificationId)) {
            return (
              updatedNotification || {
                ...notification,
                isRead: true,
                read: true,
              }
            );
          }

          return notification;
        })
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));

      return {
        success: true,
        data: updatedNotification,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to mark notification as read.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setError(null);

      const response = await api.patch(
        "/notifications/read-all"
      );

      const updatedNotifications =
        response?.data?.data;

      if (Array.isArray(updatedNotifications)) {
        setNotifications(updatedNotifications);
      } else {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
            read: true,
          }))
        );
      }

      setUnreadCount(0);

      return {
        success: true,
        data: updatedNotifications,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to mark all notifications as read.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      setError(null);

      if (!notificationId) {
        throw new Error("Notification ID is required.");
      }

      await api.delete(`/notifications/${notificationId}`);

      const notification = notifications.find((item) => {
        const id = item?._id || item?.id;

        return String(id) === String(notificationId);
      });

      setNotifications((prev) =>
        prev.filter((item) => {
          const id = item?._id || item?.id;

          return String(id) !== String(notificationId);
        })
      );

      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      return {
        success: true,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete notification.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    }
  };

  // Delete all notifications
  const clearAllNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      await api.delete("/notifications");

      setNotifications([]);
      setUnreadCount(0);

      return {
        success: true,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to clear notifications.";

      setError(message);

      return {
        success: false,
        error: message,
      };
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    let isMounted = true;
    if (user) {
      api.get('/notifications')
        .then(res => {
          if (isMounted) {
            setNotifications(res.data?.notifications || res.data || []);
          }
        })
        .catch(err => {
          console.error('Failed to load notifications', err);
        });
    } else {
      setNotifications([]);
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => (n.id === id || n._id === id) ? { ...n, read: true, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read && !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  return context || { notifications: [], unreadCount: 0, markAsRead: () => {}, markAllAsRead: () => {}, fetchNotifications: () => {} };
}

export default NotificationContext;

=======
  // Refresh unread notification count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get(
        "/notifications/unread-count"
      );

      const count =
        response?.data?.count ??
        response?.data?.data?.count ??
        0;

      setUnreadCount(Number(count));

      return {
        success: true,
        data: Number(count),
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch unread notification count.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    }
  }, []);

  // Clear notifications from frontend state
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,

    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    fetchUnreadCount,

    clearNotifications,
    clearError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used inside a NotificationProvider"
    );
  }

  return context;
};

export default NotificationContext;
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
