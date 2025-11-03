# FlyMail Frontend

A modern email web application built with React + Vite.

## Features

- ✅ User authentication (Login, Register, Forgot Password, Reset Password)
- ✅ Email inbox management
- ✅ Compose and send emails
- ✅ Save drafts
- ✅ View sent emails
- ✅ Delete emails
- ✅ Search functionality
- ✅ Admin panel (for admin users)
- ✅ Protected routes
- ✅ Modern, responsive UI

## Tech Stack

- React 19
- React Router v7
- Axios for API calls
- Context API for state management
- Vite for build tooling

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- Backend API running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API URL (optional):
   - Create a `.env` file in the root directory
   - Add: `VITE_API_URL=http://localhost:5000/api`
   - Default is already set to `http://localhost:5000/api` in `src/utils/axios.js`

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Header and Sidebar
│   ├── Mail/           # Mail-related components
│   └── DashboardPage.jsx
├── context/
│   └── AuthContext.jsx # Global auth state
├── hooks/
│   └── useLocalStorage.js
├── services/           # API service functions
│   ├── authService.js
│   ├── mailService.js
│   └── adminService.js
├── utils/
│   ├── axios.js        # Axios instance with interceptors
│   └── constants.js
├── App.jsx
└── main.jsx
```

## API Endpoints

The app connects to the backend at http://localhost:5000/api

- `/users/register` - Register new user
- `/users/signin` - Login
- `/users/otp` - Request OTP for password reset
- `/users/reset-password` - Reset password with OTP
- `/mail` - Get inbox
- `/mail/sent` - Get sent emails
- `/mail/drafts` - Get drafts
- `/mail/compose` - Compose/send email or save draft
- `/mail/:id` - Get specific email
- `/mail/:id/read` - Mark as read
- `/mail/:id` - Delete email
- `/mail/search?q=query` - Search emails
- `/admin/users` - Get all users (admin only)
- `/admin/users/:id/toggle-active` - Toggle user status
- `/admin/user/:id` - Delete user

## Features in Detail

### Authentication
- Secure login with JWT tokens
- User registration with validation
- Password reset via OTP
- Protected routes requiring authentication

### Email Management
- View inbox with unread indicators
- Compose new emails
- Save drafts
- View sent emails
- Delete emails
- Mark as read
- Search across all emails

### Admin Panel
- View all users
- Activate/deactivate users
- Delete users
- View all user emails

## License

MIT
