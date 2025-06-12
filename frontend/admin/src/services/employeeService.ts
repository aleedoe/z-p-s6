import { apiService } from './api';
import { Employee, CreateEmployeeData } from '../types';

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    return await apiService.get<Employee[]>('/admin/employees');
  },

  async getEmployee(id: string): Promise<Employee> {
    return await apiService.get<Employee>(`/admin/employees/${id}`);
  },

  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    return await apiService.post<Employee>('/admin/employees', data);
  },

  async updateEmployee(id: string, data: Partial<CreateEmployeeData>): Promise<Employee> {
    return await apiService.put<Employee>(`/admin/employees/${id}`, data);
  },

  async deleteEmployee(id: string): Promise<void> {
    return await apiService.delete<void>(`/admin/employees/${id}`);
  },
};