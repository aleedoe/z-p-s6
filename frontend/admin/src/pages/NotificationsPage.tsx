import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
} from '@nextui-org/react';
import { Bell, CheckCircle, Clock, Calendar, Settings, MailSearch as MarkEmailRead, AlertCircle } from 'lucide-react';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { EmptyState } from '../components/Common/EmptyState';
import { formatDateTime } from '../utils/formatters';
import toast from 'react-hot-toast';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'check-in',
          title: 'Employee Check-in',
          message: 'Sari Wulandari has checked in at 08:00 AM',
          isRead: false,
          createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        },
        {
          id: '2',
          type: 'check-in',
          title: 'Late Check-in',
          message: 'Budi Santoso checked in 15 minutes late at 12:15 PM',
          isRead: false,
          createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        },
        {
          id: '3',
          type: 'schedule',
          title: 'Schedule Created',
          message: 'New schedule created for Andi Pratama on December 21, 2024',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: '4',
          type: 'system',
          title: 'System Update',
          message: 'Attendance system has been updated with new features',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          id: '5',
          type: 'check-out',
          title: 'Employee Check-out',
          message: 'Maya Sari has checked out at 04:30 PM',
          isRead: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'check-in':
      case 'check-out':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'schedule':
        return <Calendar className="w-5 h-5 text-primary" />;
      case 'system':
        return <Settings className="w-5 h-5 text-secondary" />;
      default:
        return <AlertCircle className="w-5 h-5 text-warning" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'check-in':
      case 'check-out':
        return 'success';
      case 'schedule':
        return 'primary';
      case 'system':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return <LoadingSpinner label="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <Chip color="danger" size="sm">
                {unreadCount} unread
              </Chip>
            )}
          </div>
          <p className="text-gray-600 mt-1">Stay updated with latest activities</p>
        </div>
        {unreadCount > 0 && (
          <Button
            color="primary"
            variant="light"
            startContent={<MarkEmailRead className="w-4 h-4" />}
            onPress={handleMarkAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Recent Notifications ({notifications.length})
            </h3>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {notifications.length === 0 ? (
            <EmptyState
              title="No notifications"
              description="You don't have any notifications at the moment."
              icon={<Bell className="w-12 h-12 text-gray-400" />}
            />
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50/50 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead 
                            ? 'text-gray-900' 
                            : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <Chip
                          variant="flat"
                          color={getNotificationColor(notification.type) as any}
                          size="sm"
                        >
                          {notification.type.replace('-', ' ')}
                        </Chip>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(notification.createdAt)}
                        </div>
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="light"
                            color="primary"
                            onPress={() => handleMarkAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-success/10 to-success/5">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {notifications.filter(n => n.type === 'check-in').length}
                </p>
                <p className="text-sm text-gray-600">Check-in Alerts</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {notifications.filter(n => n.type === 'schedule').length}
                </p>
                <p className="text-sm text-gray-600">Schedule Updates</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {notifications.filter(n => n.type === 'system').length}
                </p>
                <p className="text-sm text-gray-600">System Alerts</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-r from-warning/10 to-warning/5">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {unreadCount}
                </p>
                <p className="text-sm text-gray-600">Unread</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};