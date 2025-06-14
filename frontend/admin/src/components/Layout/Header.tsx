import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarCollapsed,
}) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Navbar
      className={`fixed top-0 z-30 transition-all duration-300 ${
        isSidebarCollapsed ? 'left-16' : 'left-64'
      }`}
      style={{
        width: isSidebarCollapsed ? 'calc(100% - 4rem)' : 'calc(100% - 16rem)',
      }}
      maxWidth="full"
      isBordered
    >
      <NavbarBrand>
        <Button
          isIconOnly
          variant="light"
          onPress={onToggleSidebar}
          className="mr-2"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <p className="font-bold text-inherit">Admin Panel</p>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                name={user?.name}
                size="sm"
                src=""
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="settings" startContent={<User className="w-4 h-4" />}>
                Profile Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<LogOut className="w-4 h-4" />}
                onPress={handleLogout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};