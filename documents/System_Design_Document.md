# SprintForge — System Design Document (SSD)

## Version

**Version:** 1.0

---

# 1. System Overview

SprintForge is a full-stack project management platform designed to demonstrate production-oriented backend engineering.

The platform allows users to:

- Create and manage workspaces
- Manage workspace members
- Create and manage projects
- Plan and manage sprints
- Create and manage tasks
- Assign tasks to users
- Track project progress
- View dashboard information
- Manage their profile

---

# 2. Technology Stack

## Backend

```text
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
Nodemailer
Cloudinary
```

## Frontend

```text
Next.js
React
Axios
```

---

# 3. Database Architecture

SprintForge uses MongoDB as the primary database.

```text
Application
     │
     ▼
Express API
     │
     ▼
Service Layer
     │
     ▼
Repository Layer
     │
     ▼
Mongoose
     │
     ▼
MongoDB
```

---

# 4. Authentication Architecture

Authentication uses:

```text
JWT
+
Access Token
+
Refresh Token
+
HTTP-only Cookies
```

Flow:

```text
Login
  │
  ▼
Validate Credentials
  │
  ▼
Generate Tokens
  │
  ├── Access Token
  │
  └── Refresh Token
          │
          ▼
      MongoDB
```

---

# 5. Password Security

Passwords are never stored directly.

```text
Password
   │
   ▼
bcrypt
   │
   ▼
Password Hash
   │
   ▼
MongoDB
```

---

# 6. Backend Architecture

SprintForge follows a layered architecture:

```text
Client
  │
  ▼
Routes
  │
  ▼
Middlewares
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Repositories
  │
  ▼
Mongoose
  │
  ▼
MongoDB
```

---

# 7. Responsibilities

## Routes

Define HTTP endpoints.

## Middleware

Handle cross-cutting concerns such as:

- Authentication
- Authorization
- Validation
- Error handling
- File upload handling

## Controllers

Handle:

- HTTP request
- HTTP response
- Request parameters
- Calling services

Controllers should not contain database logic.

## Services

Contain business logic.

Examples:

- Workspace ownership validation
- Sprint date validation
- Task assignment rules
- Permission checks

## Repositories

Handle database access through Mongoose.

---

# 8. Shared Layer

```text
shared/
├── ApiError.js
├── ApiResponse.js
└── asyncHandler.js
```

### ApiError

Standardized application errors.

### ApiResponse

Standardized successful responses.

### asyncHandler

Handles asynchronous controller errors.

---

# 9. Module Architecture

Each module follows the same structure:

```text
module/
├── module.routes.js
├── module.controller.js
├── module.service.js
├── module.repository.js
├── module.validation.js
└── module.constants.js
```

Modules:

```text
auth
workspace
member
project
sprint
task
dashboard
profile
```

---

# 10. File Upload Architecture

Cloudinary will be used for profile images.

```text
Client
  │
  ▼
Profile Photo API
  │
  ▼
Upload Middleware
  │
  ▼
Cloudinary
  │
  ▼
Image URL
  │
  ▼
MongoDB User Document
```

MongoDB stores the Cloudinary URL rather than the image itself.

---

# 11. Email Architecture

Nodemailer will be used for password-reset emails.

```text
Forgot Password
       │
       ▼
Generate Reset Token
       │
       ▼
Hash Token
       │
       ▼
MongoDB
       │
       ▼
Nodemailer
       │
       ▼
Reset Email
```

---

# 12. Error Handling

All application errors will flow through a global error middleware.

```text
Route
  ↓
Controller
  ↓
Service
  ↓
ApiError
  ↓
Global Error Middleware
  ↓
Standard JSON Response
```

Example:

```json
{
  "success": false,
  "message": "Workspace not found."
}
```

---

# 13. API Versioning

All APIs use:

```text
/api/v1
```

Example:

```http
GET /api/v1/workspaces
```

This allows future versions to be introduced without breaking existing clients.

---

# 14. Security

SprintForge will implement:

- JWT authentication
- HTTP-only cookies
- Secure cookies in production
- Password hashing
- Refresh token management
- Authorization
- Request validation
- MongoDB ObjectId validation
- Centralized error handling
- Secure password reset flow

---

# 15. Deferred Features

The following features are intentionally excluded from v1.0:

- Attachments
- Notifications
- Activity logs
- Comments
- AI features
- Backlog management
- Email verification

They may be introduced in future versions.

---

# 16. Database Decision

### Locked

```text
MongoDB + Mongoose
```

PostgreSQL + Prisma is deferred for future learning and is not part of the current SprintForge implementation.
