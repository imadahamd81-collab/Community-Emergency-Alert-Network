# Community Emergency Alert Network - Backend

Production-ready Express.js backend for the Community Emergency Alert Network.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO
- Multer + Cloudinary
- Nodemailer
- express-validator
- Helmet, CORS, rate limiting

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── socket.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── emergencyController.js
│   │   ├── responderController.js
│   │   ├── organizationController.js
│   │   ├── notificationController.js
│   │   ├── messageController.js
│   │   ├── analyticsController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Emergency.js
│   │   ├── Responder.js
│   │   ├── Organization.js
│   │   ├── Notification.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── emergencyRoutes.js
│   │   ├── responderRoutes.js
│   │   ├── organizationRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── rateLimitMiddleware.js
│   ├── services/
│   │   ├── notificationService.js
│   │   ├── emergencyService.js
│   │   ├── emailService.js
│   │   └── aiService.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── distance.js
│   │   └── priority.js
│   ├── app.js
│   └── server.js
├── uploads/
├── .env
├── .env.example
├── package.json
└── README.md
```

## Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cean
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## Run

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## Seed Data

```bash
npm run seed
```

Demo accounts:
- Admin: `admin@cean.com` / `admin123`
- Citizen: `citizen@cean.com` / `citizen123`
- Responder: `responder@cean.com` / `responder123`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

### Emergencies
- `POST /api/emergencies`
- `GET /api/emergencies`
- `GET /api/emergencies/:id`
- `PATCH /api/emergencies/:id`
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

- `emergency:created`
- `emergency:verified`
- `emergency:assigned`
- `emergency:accepted`
- `emergency:statusUpdated`
- `emergency:resolved`
- `notification:new`
- `message:new`
