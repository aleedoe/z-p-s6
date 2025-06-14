import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
} from '@nextui-org/react';
import {
  Users,
  Calendar,
  UserCheck,
  Clock,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { DashboardStats } from '../types';
import { dashboardService } from '../services/dashboardService';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { useAuthStore } from '../store/authStore';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning';
}> = ({ title, value, icon, color }) => (
  <Card className="h-full">
    <CardBody className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10`}>
          {icon}
        </div>
      </div>
    </CardBody>
  </Card>
);

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardStats();

    // Set up polling every 5 minutes to refresh data
    const intervalId = setInterval(loadDashboardStats, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="opacity-90">
              Here's what's happening at Warung Makan Joglo Nartoatmojo today
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-semibold">{currentTime}</span>
            </div>
            <p className="opacity-90">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees || 0}
          icon={<Users className="w-6 h-6 text-primary" />}
          color="primary"
        />
        <StatCard
          title="Today's Schedule"
          value={stats?.todayScheduled || 0}
          icon={<Calendar className="w-6 h-6 text-secondary" />}
          color="secondary"
        />
        <StatCard
          title="Checked In Today"
          value={stats?.todayCheckedIn || 0}
          icon={<UserCheck className="w-6 h-6 text-success" />}
          color="success"
        />
        <StatCard
          title="Pending Schedules"
          value={stats?.pendingSchedules || 0}
          icon={<Activity className="w-6 h-6 text-warning" />}
          color="warning"
        />
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Today's Overview</h3>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Attendance Rate</span>
                <Chip color="success" variant="flat">
                  {stats?.todayScheduled
                    ? Math.round(
                        ((stats.todayCheckedIn || 0) / stats.todayScheduled) * 100
                      )
                    : 0}
                  %
                </Chip>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">On Time</span>
                <Chip color="primary" variant="flat">
                  {stats?.todayCheckedIn || 0} employees
                </Chip>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Not Yet Checked In</span>
                <Chip color="warning" variant="flat">
                  {(stats?.todayScheduled || 0) - (stats?.todayCheckedIn || 0)}{' '}
                  employees
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="pt-4">
            <div className="space-y-4">
              {stats?.recentActivities?.length ? (
                stats.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${
                      activity.type === 'CHECK_IN' ? 'bg-success' : 'bg-primary'
                    } rounded-full`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        {activity.employeeName} checked in at{' '}
                        {new Date(activity.time).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(activity.createdAt.toString())}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};