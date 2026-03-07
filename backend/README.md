# Dental College Backend API

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
   - Set your MongoDB URI
   - Set a secure JWT secret
   - Configure other environment variables as needed

4. Start MongoDB (if using local installation):
```bash
mongod
```

5. Run the server:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register a new user
- **POST** `/api/auth/register`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login
- **POST** `/api/auth/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get current user
- **GET** `/api/auth/me`
- **Headers**: 
  - `Authorization: Bearer <token>`

### Health Check
- **GET** `/api/health`

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (only in development)"
}
```

## Features

- ✅ User registration with validation
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ Role-based authorization
- ✅ MongoDB integration with Mongoose
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- CORS protection
- Input validation and sanitization
- Environment variables for sensitive data

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   └── authController.js     # Authentication logic
├── middleware/
│   └── authMiddleware.js     # Auth & authorization middleware
├── models/
│   └── User.js              # User model
├── routes/
│   └── authRoutes.js        # Authentication routes
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Entry point
└── README.md               # This file
```
