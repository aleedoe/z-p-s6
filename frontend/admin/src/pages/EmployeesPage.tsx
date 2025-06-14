import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  Mail,
  Phone,
} from 'lucide-react';
import { Employee, CreateEmployeeData } from '../types';
import { employeeService } from '../services/employeeService';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { EmptyState } from '../components/Common/EmptyState';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: '',
    email: '',
    phone: '',
    password: 'defaultPassword',
    role: 'EMPLOYEE', // Temporary default password
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await employeeService.getEmployees();
      setEmployees(data.map(employee => ({
        ...employee,
        isActive: employee.isActive !== undefined ? employee.isActive : true,
      })));
    } catch (error) {
      console.error('Error loading employees:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        useAuthStore.getState().logout();
        // Optionally redirect to login
        window.location.href = '/login';
      } else {
        toast.error('Failed to load employees');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedEmployee) {
        // Update employee - note: password shouldn't be updated here
        const { password, ...updateData } = formData;
        const updatedEmployee = await employeeService.updateEmployee(
          selectedEmployee.id,
          updateData
        );
        setEmployees(employees.map(emp =>
          emp.id === selectedEmployee.id ? {
            ...updatedEmployee,
            position: updatedEmployee.role || 'EMPLOYEE'
          } : emp
        ));
        toast.success('Employee updated successfully');
        onEditClose();
      } else {
        // Create new employee
        const newEmployee = await employeeService.createEmployee(formData);
        setEmployees([...employees, {
          ...newEmployee,
        }]);
        toast.success('Employee created successfully');
        onAddClose();
      }
      resetForm();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await employeeService.deleteEmployee(selectedEmployee.id);
      setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
      toast.success('Employee deleted successfully');
      onDeleteClose();
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: 'defaultPassword',
    });
    setSelectedEmployee(null);
  };

  const openAddModal = () => {
    resetForm();
    onAddOpen();
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || '',
      password: '', // Password shouldn't be included in edit
    });
    onEditOpen();
  };

  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    onDeleteOpen();
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employee.position && employee.position.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return <LoadingSpinner label="Loading employees..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant staff</p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={openAddModal}
        >
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardBody className="p-4">
          <Input
            placeholder="Search employees by name, email, or position..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Search className="w-4 h-4 text-gray-400" />}
            variant="bordered"
            className="max-w-md"
          />
        </CardBody>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Employees ({filteredEmployees.length})
            </h3>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredEmployees.length === 0 ? (
            <EmptyState
              title="No employees found"
              description="Start by adding your first employee to the system."
              actionLabel="Add Employee"
              onAction={openAddModal}
              icon={<Users className="w-12 h-12 text-gray-400" />}
            />
          ) : (
            <Table aria-label="Employees table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>CONTACT</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>JOINED</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {employee.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {employee.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          {employee.email}
                        </div>
                        {employee.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {employee.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        variant="flat"
                        color={employee.isActive ? 'success' : 'danger'}
                      >
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(employee.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly variant="light" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem
                            key="edit"
                            startContent={<Edit className="w-4 h-4" />}
                            onPress={() => openEditModal(employee)}
                          >
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<Trash2 className="w-4 h-4" />}
                            onPress={() => openDeleteModal(employee)}
                          >
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Add/Edit Employee Modal */}
      <Modal
        isOpen={isAddOpen || isEditOpen}
        onClose={() => {
          onAddClose();
          onEditClose();
          resetForm();
        }}
        size="lg"
      >
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
            </ModalHeader>
            <ModalBody className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter employee name"
                value={formData.name}
                onValueChange={(value) =>
                  setFormData({ ...formData, name: value })
                }
                variant="bordered"
                isRequired
              />
              <Input
                type="email"
                label="Email"
                placeholder="Enter email address"
                value={formData.email}
                onValueChange={(value) =>
                  setFormData({ ...formData, email: value })
                }
                variant="bordered"
                isRequired
                isDisabled={!!selectedEmployee}
              />
              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                value={formData.phone}
                onValueChange={(value) =>
                  setFormData({ ...formData, phone: value })
                }
                variant="bordered"
              />
              {!selectedEmployee && (
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter password"
                  value={formData.password}
                  onValueChange={(value) =>
                    setFormData({ ...formData, password: value })
                  }
                  variant="bordered"
                  isRequired
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => {
                  onAddClose();
                  onEditClose();
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={isSubmitting}
              >
                {selectedEmployee ? 'Update Employee' : 'Add Employee'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalContent>
          <ModalHeader>Delete Employee</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete{' '}
              <strong>{selectedEmployee?.name}</strong>? This action cannot be
              undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDelete}>
              Delete Employee
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};