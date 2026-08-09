import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, Button, Alert } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useAuth } from '../contexts/AuthContext';
import * as notificationService from '../services/notificationService';
import { extractErrorMessage } from '../services/api';
import type { NotificationResponse } from '../types';
import Loader from '../components/Loader';
import './NotificationPage.css';

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function NotificationPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingId, setMarkingId] = useState<number | null>(null);

  const loadNotifications = async () => {
    if (!user?.email) return;
    setLoading(true);
    setError('');
    try {
      const data = await notificationService.getNotificationsByEmail(user.email);
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user?.email]);

  const handleMarkRead = async (id: number) => {
    setMarkingId(id);
    try {
      await notificationService.markNotificationAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setMarkingId(null);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Box className="notification-page page-container">
      <Box className="notification-header">
        <Box>
          <Typography variant="overline" className="notification-eyebrow">
            Notifications
          </Typography>
          <Typography variant="h4" className="notification-title">
            Your activity feed
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Chip
            icon={<NotificationsNoneIcon />}
            label={`${unreadCount} unread`}
            className="notification-unread-chip"
          />
        )}
      </Box>

      {error && (
        <Alert severity="error" className="notification-alert">
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader label="Loading notifications…" />
      ) : notifications.length === 0 ? (
        <Box className="notification-empty">
          <NotificationsNoneIcon className="notification-empty-icon" />
          <Typography variant="body1" color="text.secondary">
            You don't have any notifications yet.
          </Typography>
        </Box>
      ) : (
        <Box className="notification-list">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              elevation={0}
              className={`notification-card ${notification.isRead ? '' : 'notification-card--unread'}`}
            >
              <CardContent className="notification-card-content">
                <Box className="notification-card-main">
                  {!notification.isRead && <Box className="notification-dot" aria-hidden="true" />}
                  <Box>
                    <Typography variant="subtitle1">{notification.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" className="notification-timestamp">
                      {formatTimestamp(notification.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                {!notification.isRead && (
                  <Button
                    size="small"
                    startIcon={<MarkEmailReadIcon fontSize="small" />}
                    disabled={markingId === notification.id}
                    onClick={() => handleMarkRead(notification.id)}
                  >
                    {markingId === notification.id ? 'Marking…' : 'Mark as read'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default NotificationPage;
