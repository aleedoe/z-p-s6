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
  Select,
  SelectItem,
  useDisclosure,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Switch,
} from '@nextui-org/react';
import {
  Plus,
  Calendar,
  Edit,
  Trash2,
  MoreVertical,
  Clock,
  MapPin,
  User,
  QrCode,
} from 'lucide-react';
import { Schedule, CreateScheduleData, Employee } from '../types';
import { scheduleService } from '../services/scheduleService';
import { employeeService } from '../services/employeeService';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { EmptyState } from '../components/Common/EmptyState';
import { formatDate, formatTime } from '../utils/formatters';
import toast from 'react-hot-toast';

export const SchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState('');

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

  const [formData, setFormData] = useState<CreateScheduleData>({
    employeeId: '',
    date: '',
    shiftStart: '',
    shiftEnd: '',
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load employees
      const employeesResponse = await employeeService.getEmployees();
      setEmployees(employeesResponse);

      // Load schedules
      const params = filterDate ? { date: filterDate } : {};
      const schedulesResponse = await scheduleService.getSchedules(params);
      setSchedules(schedulesResponse);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load schedules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        employeeId: formData.employeeId,
        date: new Date(formData.date).toISOString(),
        shiftStart: new Date(`1970-01-01T${formData.shiftStart}:00`).toISOString(),
        shiftEnd: new Date(`1970-01-01T${formData.shiftEnd}:00`).toISOString(),
        isActive: formData.isActive
      };
      if (selectedSchedule) {
        // Update schedule
        const updatedSchedule = await scheduleService.updateSchedule(
          selectedSchedule.id,
          payload
        );
        setSchedules(schedules.map(sch =>
          sch.id === selectedSchedule.id ? updatedSchedule : sch
        ));
        toast.success('Schedule updated successfully');
        loadData();
        onEditClose();
      } else {
        // Create new schedule
        const newSchedule = await scheduleService.createSchedule(payload);
        setSchedules([...schedules, newSchedule]);
        toast.success('Schedule created successfully');
        loadData();
        onAddClose();
      }
      resetForm();
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSchedule) return;

    try {
      await scheduleService.deleteSchedule(selectedSchedule.id);
      setSchedules(schedules.filter(sch => sch.id !== selectedSchedule.id));
      toast.success('Schedule deleted successfully');
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete schedule. There are related records.');
    } finally {
      onDeleteClose();
      setSelectedSchedule(null);
    }
  };

  const handleToggleActive = async (schedule: Schedule) => {
    try {
      const updatedSchedule = await scheduleService.updateSchedule(schedule.id, {
        isActive: !schedule.isActive
      });

      // Preserve the employee data in the updated schedule
      const updatedScheduleWithEmployee = {
        ...updatedSchedule,
        employee: schedule.employee
      };

      setSchedules(schedules.map(sch =>
        sch.id === schedule.id ? updatedScheduleWithEmployee : sch
      ));

      toast.success(`Schedule ${updatedSchedule.isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error toggling schedule status:', error);
      toast.error('Failed to update schedule status');
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      date: '',
      shiftStart: '',
      shiftEnd: '',
      isActive: true,
    });
    setSelectedSchedule(null);
  };

  const openAddModal = () => {
    resetForm();
    onAddOpen();
  };

  const openEditModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      employeeId: schedule.employeeId,
      date: schedule.date.split('T')[0], // Extract date part from ISO string
      shiftStart: new Date(schedule.shiftStart).toTimeString().substring(0, 5),
      shiftEnd: new Date(schedule.shiftEnd).toTimeString().substring(0, 5),
      isActive: schedule.isActive,
    });
    onEditOpen();
  };

  const openDeleteModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    onDeleteOpen();
  };

  const filteredSchedules = schedules.filter(schedule => {
    if (!filterDate) return true;
    return new Date(schedule.date).toISOString().split('T')[0] === filterDate;
  });

  if (isLoading) {
    return <LoadingSpinner label="Loading schedules..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Schedule Management</h1>
          <p className="text-gray-600 mt-1">Manage employee work schedules</p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={openAddModal}
        >
          Add Schedule
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex gap-4">
            <Input
              type="date"
              placeholder="Filter by date"
              value={filterDate}
              onValueChange={setFilterDate}
              variant="bordered"
              className="max-w-xs"
              startContent={<Calendar className="w-4 h-4 text-gray-400" />}
            />
            {filterDate && (
              <Button
                variant="light"
                onPress={() => setFilterDate('')}
              >
                Clear Filter
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Schedules Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Schedules ({filteredSchedules.length})
            </h3>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredSchedules.length === 0 ? (
            <EmptyState
              title="No schedules found"
              description="Start by creating a schedule for your employees."
              actionLabel="Add Schedule"
              onAction={openAddModal}
              icon={<Calendar className="w-12 h-12 text-gray-400" />}
            />
          ) : (
            <Table aria-label="Schedules table">
              <TableHeader>
                <TableColumn>EMPLOYEE</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>SHIFT TIME</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {schedule.employee?.name || 'Unknown Employee'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {schedule.employee?.email || ''}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip variant="flat" color="secondary">
                        {formatDate(schedule.date)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {schedule.shiftStart ? formatTime(schedule.shiftStart) : '--:--'} -
                          {schedule.shiftEnd ? formatTime(schedule.shiftEnd) : '--:--'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        isSelected={schedule.isActive}
                        onValueChange={() => handleToggleActive(schedule)}
                        color="success"
                      >
                        {schedule.isActive ? 'Active' : 'Inactive'}
                      </Switch>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          onPress={() => {
                            // Implement QR code display functionality
                            console.log('Show QR for:', schedule.qrToken);
                          }}
                        >
                          <QrCode className="w-4 h-4" />
                        </Button>
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
                              onPress={() => openEditModal(schedule)}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              className="text-danger"
                              color="danger"
                              startContent={<Trash2 className="w-4 h-4" />}
                              onPress={() => openDeleteModal(schedule)}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Add/Edit Schedule Modal */}
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
              {selectedSchedule ? 'Edit Schedule' : 'Add New Schedule'}
            </ModalHeader>
            <ModalBody className="space-y-4">
              <Select
                label="Employee"
                placeholder="Select an employee"
                selectedKeys={formData.employeeId ? new Set([formData.employeeId]) : new Set()}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFormData({ ...formData, employeeId: selectedKey });
                }}
                variant="bordered"
                isRequired
              >
                {employees.map((employee) => (
                  <SelectItem
                    key={employee.id}
                    value={employee.id}
                    textValue={`${employee.name} - ${employee.email}`}
                  >
                    {employee.name} - {employee.email}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="date"
                label="Date"
                value={formData.date}
                onValueChange={(value) =>
                  setFormData({ ...formData, date: value })
                }
                variant="bordered"
                isRequired
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  label="Shift Start"
                  value={formData.shiftStart}
                  onValueChange={(value) =>
                    setFormData({ ...formData, shiftStart: value })
                  }
                  variant="bordered"
                  isRequired
                />
                <Input
                  type="time"
                  label="Shift End"
                  value={formData.shiftEnd}
                  onValueChange={(value) =>
                    setFormData({ ...formData, shiftEnd: value })
                  }
                  variant="bordered"
                  isRequired
                />
              </div>
              <Switch
                isSelected={formData.isActive}
                onValueChange={(isActive) =>
                  setFormData({ ...formData, isActive })
                }
              >
                Active Schedule
              </Switch>
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
                {selectedSchedule ? 'Update Schedule' : 'Add Schedule'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalContent>
          <ModalHeader>Delete Schedule</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete the schedule for{' '}
              <strong>{selectedSchedule?.employee.name}</strong> on{' '}
              <strong>{selectedSchedule && formatDate(selectedSchedule.date)}</strong>?
              This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDelete}>
              Delete Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};