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
    } finally {
      setLoading(false);
    }
  };

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

