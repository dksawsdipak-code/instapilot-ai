# Authentication Implementation Guide

## Overview

This document outlines the complete authentication system implemented for InstaPilot AI, including JWT-based authentication, protected routes, and user state management.

## Architecture

### Backend (FastAPI)
- **JWT Tokens**: Access tokens (30 min expiry) + Refresh tokens (7 days expiry)
- **Password Security**: bcrypt hashing with passlib
- **Endpoints**:
  - `POST /api/auth/signup` - Register new user
  - `POST /api/auth/login` - Authenticate and get tokens
  - `POST /api/auth/refresh` - Get new access token
  - `GET /api/auth/me` - Get current user (requires auth)
  - `POST /api/auth/logout` - Logout user

### Frontend (Next.js + React)
- **State Management**: Zustand store with persistence
- **Pages**:
  - `/auth/login` - User login form
  - `/auth/signup` - User registration form
  - `/dashboard` - Protected dashboard (requires auth)
- **Components**:
  - `Navbar` - Auth-aware navigation
  - `ProtectedRoute` - Route protection wrapper

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
All dependencies are already in `requirements.txt`:
```bash
pip install -r backend/requirements.txt
```

Key packages:
- `python-jose` - JWT handling
- `passlib` - Password hashing
- `bcrypt` - Cryptographic hashing
- `pydantic` - Data validation

#### Environment Configuration
1. Copy `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```

2. **IMPORTANT**: Update `SECRET_KEY` in `.env` with a strong secret:
```bash
# Generate a secure key:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

3. Verify other environment variables (DATABASE_URL, REDIS_URL, etc.)

#### Database Migration
The User model needs to be created in the database:
```bash
# If using SQLAlchemy with Alembic (recommended for production):
alembic upgrade head

# Or manually create tables:
python -c "from app.db import Base, engine; from app.models import *; Base.metadata.create_all(bind=engine)"
```

### 2. Frontend Setup

#### Install Dependencies
Zustand is already in `package.json`:
```bash
npm install
```

#### No additional setup needed
Auth store is configured with local persistence.

## API Endpoints

### Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "securepassword123"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00"
  }
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response: Same as signup
```

### Refresh Token
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <access_token>

Response:
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00"
}
```

## Frontend Usage

### Using Auth Store

```typescript
import { useAuthStore } from '@/lib/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, getAuthHeader } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <p>Please log in</p>;
  }

  // Use auth header for API requests
  const response = await fetch('/api/posts', {
    headers: getAuthHeader(),
  });

  // Logout
  const handleLogout = () => {
    logout();
  };

  return <div>Welcome {user?.full_name}</div>;
}
```

### Protected Routes

Wrap protected pages with `ProtectedRoute` component:

```typescript
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';

export default function Page() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

## Flow Diagrams

### Signup Flow
```
User fills form
    ↓
Frontend validates (length, match)
    ↓
POST /api/auth/signup
    ↓
Backend validates email not exists
    ↓
Backend hashes password (bcrypt)
    ↓
Backend saves user to DB
    ↓
Backend generates JWT tokens
    ↓
Frontend stores tokens in localStorage
    ↓
Frontend redirects to /dashboard
```

### Login Flow
```
User enters credentials
    ↓
POST /api/auth/login
    ↓
Backend finds user by email
    ↓
Backend verifies password (bcrypt compare)
    ↓
Backend generates JWT tokens
    ↓
Frontend stores tokens in localStorage
    ↓
Frontend redirects to /dashboard
```

### Protected Route Flow
```
User navigates to /dashboard
    ↓
ProtectedRoute checks isAuthenticated()
    ↓
If no token → redirect to /auth/login
    ↓
If token exists → render dashboard
```

### API Request Flow
```
Component calls useAuthStore().getAuthHeader()
    ↓
Returns { Authorization: "Bearer <token>" }
    ↓
Frontend sends request with auth header
    ↓
Backend validates JWT in get_current_user()
    ↓
If valid → allow request
    ↓
If invalid → 401 Unauthorized
```

## Security Features

### Password Security
- Passwords hashed with bcrypt (not stored in plaintext)
- Salt automatically generated per password
- Industry-standard hashing algorithm

### JWT Security
- Tokens signed with SECRET_KEY
- Access tokens short-lived (30 minutes)
- Refresh tokens for obtaining new access tokens
- Tokens include expiration time (exp)

### CORS Protection
- Backend configured to accept requests from frontend URL
- Credentials allowed in CORS requests

### Token Storage
- Tokens stored in browser's localStorage (persisted across sessions)
- Automatically cleared on logout

## Next Steps / Advanced Features

### 1. Password Reset
- Create `POST /api/auth/forgot-password` endpoint
- Send reset link via email
- Implement `POST /api/auth/reset-password` with token verification

### 2. Email Verification
- Add email verification on signup
- Send verification link to user's email
- Only allow login after verification

### 3. OAuth Integration
- Add Google/GitHub login
- Reduce friction for user registration

### 4. Rate Limiting
- Implement rate limiting on auth endpoints
- Prevent brute force attacks

### 5. Session Management
- Track active sessions
- Allow user to logout all sessions
- Detect suspicious login attempts

### 6. Two-Factor Authentication
- SMS or authenticator app
- Additional security layer

## Troubleshooting

### "Invalid token" Error
- Token may be expired → use refresh endpoint
- Token may be malformed → re-login
- SECRET_KEY may have changed → users must re-login

### CORS Errors
- Verify CORS_ORIGINS in backend .env
- Ensure frontend URL is in allowed origins

### Token Not Persisting
- Check browser localStorage is enabled
- Check Zustand middleware persistence is configured
- Check browser console for errors

### Password Validation Failing
- Ensure password is at least 8 characters
- Check for special character requirements (if any)

## Files Modified/Created

### Backend
- `app/services/auth.py` - JWT utilities (created)
- `app/routes/auth.py` - Auth endpoints (updated)
- `app/models.py` - User model with password hashing (updated)
- `app/schemas.py` - Auth schemas (updated)
- `backend/.env.example` - Environment template (created)

### Frontend
- `lib/auth.ts` - Zustand auth store (created)
- `components/ProtectedRoute.tsx` - Protected route wrapper (created)
- `app/auth/login/page.tsx` - Login page (updated)
- `app/auth/signup/page.tsx` - Signup page (updated)
- `app/dashboard/page.tsx` - Dashboard page (created)
- `components/Navbar.tsx` - Auth-aware navbar (updated)

## Testing

### Manual Testing Checklist
- [ ] Signup with new email → redirects to dashboard
- [ ] Login with correct credentials → redirects to dashboard
- [ ] Login with wrong password → shows error
- [ ] Direct access to /dashboard without auth → redirects to /auth/login
- [ ] Logout → redirects to home, auth state cleared
- [ ] Navbar shows user info when authenticated
- [ ] Navbar shows Sign In/Get Started when not authenticated
- [ ] Tokens persist after page refresh
- [ ] API requests include auth header

### Curl Testing Examples
```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "full_name": "Test User",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user (replace TOKEN)
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  full_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_user_email ON users(email);
```

## Deployment Considerations

1. **Secret Key**: Generate unique SECRET_KEY for each environment
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiry**: Adjust token expiry times based on security needs
4. **Database**: Use production PostgreSQL (not SQLite)
5. **Email Service**: Integrate email provider for password reset
6. **Monitoring**: Log authentication failures for security analysis
7. **Backups**: Regular database backups for user data

---

For questions or issues, refer to the source code or contact the development team.
