import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Divider,
  Avatar,
  Card,
  CardBody,
} from '@nextui-org/react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardCheck,
  LogOut,
  ChefHat,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    key: 'employees',
    label: 'Employees',
    icon: Users,
    path: '/employees',
  },
  {
    key: 'schedules',
    label: 'Schedules',
    icon: Calendar,
    path: '/schedules',
  },
  {
    key: 'attendance',
    label: 'Attendance',
    icon: ClipboardCheck,
    path: '/attendance',
  },
  // {
  //   key: 'notifications',
  //   label: 'Notifications',
  //   icon: Bell,
  //   path: '/notifications',
  // },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary rounded-lg p-2">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg text-gray-800">Warung Makan</h1>
              <p className="text-xs text-gray-500">Joglo Nartoatmojo</p>
            </div>
          )}
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardBody className="p-3">
              <div className="flex items-center gap-3">
                <Avatar
                  name={user?.name}
                  size="sm"
                  className="bg-primary text-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Button
                key={item.key}
                variant={isActive ? 'solid' : 'light'}
                color={isActive ? 'primary' : 'default'}
                className={`w-full justify-start h-12 ${
                  isCollapsed ? 'px-3' : 'px-4'
                }`}
                startContent={<Icon className="w-5 h-5" />}
                onPress={() => navigate(item.path)}
              >
                {!isCollapsed && item.label}
              </Button>
            );
          })}
        </nav>

        <Divider className="my-4" />

        {/* Logout Button */}
        <Button
          variant="light"
          color="danger"
          className={`w-full justify-start h-12 ${
            isCollapsed ? 'px-3' : 'px-4'
          }`}
          startContent={<LogOut className="w-5 h-5" />}
          onPress={handleLogout}
        >
          {!isCollapsed && 'Logout'}
        </Button>
      </div>
    </div>
  );
};