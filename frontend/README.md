# Community Emergency Alert Network (CEAN) - Frontend

Production-quality frontend for the Community Emergency Alert Network built with React, Vite, Redux Toolkit, and Tailwind CSS.

## Tech Stack

- **React.js** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Leaflet + React Leaflet** - Maps
- **Socket.IO Client** - Real-time updates
- **Recharts** - Charts and analytics
- **Lucide React** - Icons
- **React Hook Form + Zod** - Form validation
- **Sonner** - Toast notifications

## Project Structure

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── maps/
│   │   ├── emergency/
│   │   ├── notifications/
│   │   └── charts/
│   ├── pages/
│   │   ├── auth/
│   │   ├── citizen/
│   │   ├── responder/
│   │   ├── admin/
│   │   └── organization/
│   ├── layouts/
│   ├── routes/
│   ├── redux/
│   │   ├── store.js
│   │   └── slices/
│   ├── services/
│   │   ├── api.js
│   │   ├── authApi.js
│   │   ├── emergencyApi.js
│   │   ├── notificationApi.js
│   │   └── socket.js
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── package.json
└── README.md
```

## User Roles & Routes

### Authentication
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Forgot password
- `/reset-password` - Reset password

### Citizen (`/citizen/*`)
- `/citizen/dashboard` - Dashboard with stats and recent emergencies
- `/citizen/report` - Report emergency with AI analysis
- `/citizen/nearby` - Nearby emergencies
- `/citizen/my-reports` - My reports history
- `/citizen/map` - Emergency map with Leaflet
- `/citizen/notifications` - Notifications page
- `/citizen/messages` - Real-time chat
- `/citizen/profile` - Profile management
- `/citizen/emergency/:id` - Emergency details with timeline

### Responder (`/responder/*`)
- `/responder/dashboard` - Dashboard with assignments
- `/responder/nearby` - Nearby emergencies
- `/responder/assigned` - Assigned emergencies
- `/responder/map` - Emergency map
- `/responder/messages` - Real-time chat
- `/responder/notifications` - Notifications
- `/responder/profile` - Profile management
- `/responder/emergency/:id` - Emergency details

### Admin (`/admin/*`)
- `/admin/dashboard` - Control room dashboard with stats and charts
- `/admin/live-emergencies` - Live emergency monitoring
- `/admin/organizations` - Organization management
- `/admin/responders` - Responder management
- `/admin/citizens` - Citizen management
- `/admin/reports` - Emergency reports
- `/admin/verification` - Verify/reject/assign emergencies
- `/admin/analytics` - Analytics with Recharts
- `/admin/notifications` - System notifications
- `/admin/settings` - Platform settings
- `/admin/heatmap` - Emergency heatmap
- `/admin/emergency/:id` - Emergency details

### Organization (`/organization/*`)
- `/organization/dashboard` - Organization dashboard
- `/organization/incidents` - Incidents list
- `/organization/nearby` - Nearby emergencies
- `/organization/responders` - Responder management
- `/organization/members` - Member management
- `/organization/analytics` - Analytics
- `/organization/notifications` - Notifications
- `/organization/profile` - Profile management
- `/organization/settings` - Settings
- `/organization/emergency/:id` - Emergency details

## Features

### Authentication & Authorization
- JWT-based authentication with persistence
- Role-based route protection
- Automatic token refresh handling
- Session expiration handling

### Real-time Features
- Socket.IO integration for live updates
- Real-time emergency notifications
- Live chat between citizens and responders
- Status update notifications

### Maps
- Interactive Leaflet maps
- Emergency markers with priority colors
- Current location tracking
- Popup information
- Emergency heatmap (admin)

### Emergency Management
- Report emergencies with photos/video
- AI analysis suggestions (UI only)
- Priority-based categorization
- Status timeline tracking
- Emergency details with full timeline

### Analytics
- Emergencies by type (bar chart)
- Emergencies by status (pie chart)
- Emergencies over time (line chart)
- Response time analysis (bar chart)

### UI/UX
- Fully responsive design (desktop, laptop, tablet, mobile)
- Collapsible sidebar on mobile
- Loading, error, and empty states
- Toast notifications
- Confirmation dialogs
- Form validation with Zod + React Hook Form
- Tailwind CSS styling with custom navy theme

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## API Contract

The frontend expects the following backend endpoints:

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `PATCH /api/users/me`

### Emergencies
- `POST /api/emergencies`
- `GET /api/emergencies`
- `GET /api/emergencies/:id`
- `PATCH /api/emergencies/:id`
- `DELETE /api/emergencies/:id`
- `POST /api/emergencies/:id/verify`
- `POST /api/emergencies/:id/assign`
- `POST /api/emergencies/:id/accept`
- `POST /api/emergencies/:id/status`
- `POST /api/emergencies/:id/resolve`

### Responders
- `GET /api/responders`
- `GET /api/responders/nearby`
- `GET /api/responders/:id`
- `PATCH /api/responders/:id/status`

### Organizations
- `GET /api/organizations`
- `POST /api/organizations`
- `GET /api/organizations/:id`
- `PATCH /api/organizations/:id`
- `DELETE /api/organizations/:id`

### Notifications
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

### Messages
- `GET /api/messages/:conversationId`
- `POST /api/messages`
- `POST /api/messages/:conversationId/read`

### Analytics
- `GET /api/analytics/overview`
- `GET /api/analytics/emergencies`
- `GET /api/analytics/response-times`
- `GET /api/analytics/heatmap`

### Users
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `PATCH /api/users/:id/status`

## Socket.IO Events

The frontend listens for the following real-time events:

- `emergency:created` - New emergency reported
- `emergency:verified` - Emergency verified by admin
- `emergency:assigned` - Responder assigned to emergency
- `emergency:accepted` - Responder accepted emergency
- `emergency:statusUpdated` - Emergency status changed
- `emergency:resolved` - Emergency resolved
- `notification:new` - New notification received
- `message:new` - New message received

## Notes

- This is a frontend-only implementation. Backend API endpoints must be available for full functionality.
- If backend endpoints are not available, the frontend handles loading/error states gracefully.
- AI analysis feature is implemented as a UI simulation (the actual AI analysis happens on the backend).
- All API calls are centralized in the `services/` directory.
- Error handling is implemented globally via Axios interceptors.
