# Employee Attendance & Scheduling Management System - Backend

Backend API for Warung Makan Joglo Nartoatmojo's employee management system.

## Features

- JWT-based authentication for Admin and Employee
- Admin dashboard for managing employees, schedules, and attendance
- Employee mobile app for viewing schedules and checking in
- QR code-based attendance system
- Push notifications and email alerts
- Automated daily reminders and monthly reports

## Technologies

- Node.js + Express.js
- Prisma ORM with PostgreSQL
- JWT for authentication
- Firebase Cloud Messaging for push notifications
- SendGrid for email notifications

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Set up your PostgreSQL database and update `DATABASE_URL`
5. Run migrations: `npx prisma migrate dev`
6. Seed the database (optional): `npx prisma db seed`
7. Start the server: `npm run dev`

## API Documentation

The API follows RESTful conventions with JSON responses. All endpoints require authentication unless noted.

### Authentication

- `POST /auth/login` - Login with email and password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (invalidate token)

### Admin Endpoints

- Employees:
  - `GET /admin/employees` - List all employees
  - `POST /admin/employees` - Create new employee
  - `GET /admin/employees/:id` - Get employee details
  - `PUT /admin/employees/:id` - Update employee
  - `DELETE /admin/employees/:id` - Delete employee

- Schedules:
  - `GET /admin/schedules` - List schedules (filter by date/employee)
  - `POST /admin/schedules` - Create new schedule
  - `PUT /admin/schedules/:id` - Update schedule
  - `DELETE /admin/schedules/:id` - Delete schedule

- Attendance:
  - `GET /admin/attendance/daily` - Get daily attendance
  - `GET /admin/attendance/monthly` - Get monthly attendance summary

### Employee Endpoints

- `GET /employee/schedule` - Get current schedule
- `POST /employee/attendance/check-in` - Check in with QR code
- `GET /employee/attendance/history` - Get attendance history