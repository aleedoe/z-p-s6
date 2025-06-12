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
  Input,
  Tabs,
  Tab,
  Chip,
  Select,
  SelectItem,
} from '@nextui-org/react';
import {
  ClipboardCheck,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Attendance } from '../types';
import { attendanceService } from '../services/attendanceService';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { EmptyState } from '../components/Common/EmptyState';
import { formatDate, formatTime, getStatusColor } from '../utils/formatters';

export const AttendancePage: React.FC = () => {
  const [dailyAttendance, setDailyAttendance] = useState<Attendance[]>([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadDailyAttendance();
  }, [selectedDate]);

  useEffect(() => {
    loadMonthlyAttendance();
  }, [selectedMonth, selectedYear]);

  const loadDailyAttendance = async () => {
    try {
      setIsLoading(true);
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockAttendance: Attendance[] = [
        {
          id: '1',
          employeeId: '1',
          employeeName: 'Sari Wulandari',
          date: selectedDate,
          checkInTime: '08:00',
          checkOutTime: '16:00',
          shiftStart: '08:00',
          shiftEnd: '16:00',
          status: 'present',
        },
        {
          id: '2',
          employeeId: '2',
          employeeName: 'Budi Santoso',
          date: selectedDate,
          checkInTime: '12:15',
          shiftStart: '12:00',
          shiftEnd: '20:00',
          status: 'late',
        },
        {
          id: '3',
          employeeId: '3',
          employeeName: 'Andi Pratama',
          date: selectedDate,
          checkInTime: '',
          shiftStart: '09:00',
          shiftEnd: '17:00',
          status: 'absent',
        },
      ];
      setDailyAttendance(mockAttendance);
    } catch (error) {
      console.error('Error loading daily attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMonthlyAttendance = async () => {
    try {
      // Simulate API call with mock data
      const mockMonthlyData = [
        {
          employeeId: '1',
          employeeName: 'Sari Wulandari',
          totalScheduled: 22,
          totalPresent: 20,
          totalLate: 2,
          totalAbsent: 0,
          attendanceRate: 91,
        },
        {
          employeeId: '2',
          employeeName: 'Budi Santoso',
          totalScheduled: 20,
          totalPresent: 18,
          totalLate: 1,
          totalAbsent: 1,
          attendanceRate: 90,
        },
        {
          employeeId: '3',
          employeeName: 'Andi Pratama',
          totalScheduled: 18,
          totalPresent: 15,
          totalLate: 2,
          totalAbsent: 1,
          attendanceRate: 83,
        },
      ];
      setMonthlyAttendance(mockMonthlyData);
    } catch (error) {
      console.error('Error loading monthly attendance:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'late':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-danger" />;
      default:
        return null;
    }
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (isLoading) {
    return <LoadingSpinner label="Loading attendance data..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
        <p className="text-gray-600 mt-1">Track and monitor employee attendance</p>
      </div>

      {/* Tabs */}
      <Card>
        <CardBody className="p-0">
          <Tabs
            fullWidth
            size="lg"
            aria-label="Attendance tabs"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-gray-200",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-6 h-12",
              tabContent: "group-data-[selected=true]:text-white"
            }}
          >
            <Tab
              key="daily"
              title={
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Daily Attendance
                </div>
              }
            >
              <div className="p-6 space-y-6">
                {/* Date Filter */}
                <div className="flex items-center gap-4">
                  <Input
                    type="date"
                    label="Select Date"
                    value={selectedDate}
                    onValueChange={setSelectedDate}
                    variant="bordered"
                    className="max-w-xs"
                  />
                  <Button
                    variant="light"
                    onPress={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  >
                    Today
                  </Button>
                </div>

                {/* Daily Attendance Table */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        Attendance for {formatDate(selectedDate)}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                    {dailyAttendance.length === 0 ? (
                      <EmptyState
                        title="No attendance records"
                        description="No attendance data found for the selected date."
                        icon={<ClipboardCheck className="w-12 h-12 text-gray-400" />}
                      />
                    ) : (
                      <Table aria-label="Daily attendance table">
                        <TableHeader>
                          <TableColumn>EMPLOYEE</TableColumn>
                          <TableColumn>SCHEDULED TIME</TableColumn>
                          <TableColumn>CHECK-IN</TableColumn>
                          <TableColumn>CHECK-OUT</TableColumn>
                          <TableColumn>STATUS</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {dailyAttendance.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                  </div>
                                  <span className="font-medium">
                                    {record.employeeName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm">
                                    {formatTime(record.shiftStart)} - {formatTime(record.shiftEnd)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {record.checkInTime ? (
                                  <span className="text-sm font-medium">
                                    {formatTime(record.checkInTime)}
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-400">
                                    Not checked in
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {record.checkOutTime ? (
                                  <span className="text-sm font-medium">
                                    {formatTime(record.checkOutTime)}
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-400">
                                    Not checked out
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  variant="flat"
                                  color={getStatusColor(record.status) as any}
                                  startContent={getStatusIcon(record.status)}
                                >
                                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </Chip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardBody>
                </Card>
              </div>
            </Tab>

            <Tab
              key="monthly"
              title={
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Monthly Summary
                </div>
              }
            >
              <div className="p-6 space-y-6">
                {/* Month/Year Filter */}
                <div className="flex items-center gap-4">
                  <Select
                    label="Month"
                    selectedKeys={[selectedMonth.toString()]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setSelectedMonth(parseInt(selectedKey));
                    }}
                    variant="bordered"
                    className="max-w-xs"
                  >
                    {months.map((month) => (
                      <SelectItem key={month.value.toString()} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Year"
                    selectedKeys={[selectedYear.toString()]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setSelectedYear(parseInt(selectedKey));
                    }}
                    variant="bordered"
                    className="max-w-xs"
                  >
                    {years.map((year) => (
                      <SelectItem key={year.toString()} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Monthly Summary Table */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        Monthly Summary - {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                    {monthlyAttendance.length === 0 ? (
                      <EmptyState
                        title="No monthly data"
                        description="No attendance summary available for the selected month."
                        icon={<ClipboardCheck className="w-12 h-12 text-gray-400" />}
                      />
                    ) : (
                      <Table aria-label="Monthly attendance summary">
                        <TableHeader>
                          <TableColumn>EMPLOYEE</TableColumn>
                          <TableColumn>SCHEDULED DAYS</TableColumn>
                          <TableColumn>PRESENT</TableColumn>
                          <TableColumn>LATE</TableColumn>
                          <TableColumn>ABSENT</TableColumn>
                          <TableColumn>ATTENDANCE RATE</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {monthlyAttendance.map((summary, index) => (
                            <TableRow key={summary.employeeId}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                  </div>
                                  <span className="font-medium">
                                    {summary.employeeName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">
                                  {summary.totalScheduled} days
                                </span>
                              </TableCell>
                              <TableCell>
                                <Chip variant="flat" color="success">
                                  {summary.totalPresent}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <Chip variant="flat" color="warning">
                                  {summary.totalLate}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <Chip variant="flat" color="danger">
                                  {summary.totalAbsent}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  variant="flat"
                                  color={
                                    summary.attendanceRate >= 95
                                      ? 'success'
                                      : summary.attendanceRate >= 85
                                      ? 'warning'
                                      : 'danger'
                                  }
                                >
                                  {summary.attendanceRate}%
                                </Chip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardBody>
                </Card>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};