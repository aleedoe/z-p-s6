# Warung Makan Joglo Narto Atmojo - Employee App

A React Native mobile application for employees of Warung Makan Joglo Narto Atmojo to manage schedules and attendance.

## Features

- **Authentication**: Secure login with JWT token management
- **Work Schedule**: View daily and weekly work schedules
- **Attendance**: QR code-based attendance system
- **Profile Management**: View and update employee profile information

## Tech Stack

- React Native with Expo
- TypeScript
- State Management: Zustand
- Navigation: Expo Router
- API Integration: Axios
- UI Components: Custom components with React Native StyleSheet

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/joglo-narto-employee-app.git
cd joglo-narto-employee-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
API_URL=https://api.joglonarto.com/api/v1
```

## Project Structure

```
/src
  /api - API service functions
  /components - Reusable UI components
  /constants - App constants
  /hooks - Custom React hooks
  /store - Zustand state management
  /types - TypeScript type definitions
  /app - Expo Router screens
    /(auth) - Authentication screens
    /(tabs) - Main app tabs
```

## Key Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android emulator/device
- `npm run ios` - Start the app on iOS simulator/device
- `npm run web` - Start the app in web browser

## Deployment

### Android

1. Build the Android APK
```bash
eas build -p android --profile preview
```

2. Submit to Google Play Store
```bash
eas submit -p android
```

### iOS

1. Build the iOS binary
```bash
eas build -p ios --profile preview
```

2. Submit to App Store
```bash
eas submit -p ios
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For any inquiries, please contact the development team at dev@joglonarto.com