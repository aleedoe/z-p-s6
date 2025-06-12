# Warung Makan Joglo Nartoatmojo - Admin Panel

A modern, responsive admin dashboard for managing employee attendance and scheduling in a restaurant environment.

## 🚀 Features

### Authentication & Security
- Secure JWT-based authentication with automatic token refresh
- Role-based access control for admin users
- Protected routes with automatic redirect

### Employee Management
- Complete CRUD operations for employee records
- Search and filter functionality
- Employee profile management with contact details
- Position-based organization

### Schedule Management
- Create and manage work schedules for employees
- Date-based filtering and organization
- Shift time management with location assignment
- Visual schedule overview

### Attendance Tracking
- Daily attendance monitoring with real-time status
- Monthly attendance summaries and reports
- Automated status calculation (Present, Late, Absent)
- Attendance rate analytics

### Notifications System
- Real-time notifications for check-ins and system events
- Mark as read/unread functionality
- Categorized notification types
- Notification statistics dashboard

### Dashboard Analytics
- Key performance indicators (KPIs)
- Real-time attendance statistics
- Recent activity feed
- Quick overview of daily operations

## 🛠 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: NextUI (HeroUI)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd warung-makan-admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Common/         # Generic components (LoadingSpinner, EmptyState)
│   └── Layout/         # Layout components (Sidebar, Header, Layout)
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── EmployeesPage.tsx
│   ├── SchedulesPage.tsx
│   ├── AttendancePage.tsx
│   └── NotificationsPage.tsx
├── routes/             # Route protection and configuration
├── services/           # API service layer
│   ├── api.ts          # Base API configuration
│   ├── authService.ts
│   ├── employeeService.ts
│   ├── scheduleService.ts
│   ├── attendanceService.ts
│   └── notificationService.ts
├── store/              # State management (Zustand)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## 🔐 Authentication

The application uses JWT-based authentication with the following demo credentials:

- **Email**: `admin@warungmakan.com`
- **Password**: `admin123`

### Features:
- Automatic token refresh
- Secure token storage
- Session persistence
- Automatic logout on token expiration

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full sidebar navigation with detailed views
- **Tablet**: Collapsible sidebar with adapted layouts
- **Mobile**: Mobile-first design with touch-friendly interactions

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main actions and branding
- **Secondary**: Purple (#7C3AED) - Secondary actions and accents
- **Success**: Green (#17C964) - Success states and positive actions
- **Warning**: Amber (#F5A524) - Warning states and cautions
- **Danger**: Red (#F31260) - Error states and destructive actions

### Typography
- Clean, modern font stack optimized for readability
- Consistent sizing and spacing throughout the application
- Proper hierarchy with semantic heading structure

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Any static hosting service

## 🔗 API Integration

The application is designed to work with RESTful APIs. Update the API base URL in your `.env` file:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Expected API Endpoints:

**Authentication**
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`

**Employees**
- `GET /admin/employees`
- `POST /admin/employees`
- `PUT /admin/employees/:id`
- `DELETE /admin/employees/:id`

**Schedules**
- `GET /admin/schedules`
- `POST /admin/schedules`
- `PUT /admin/schedules/:id`
- `DELETE /admin/schedules/:id`

**Attendance**
- `GET /admin/attendance/daily`
- `GET /admin/attendance/monthly`

**Notifications**
- `GET /admin/notifications`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Warung Makan Joglo Nartoatmojo**