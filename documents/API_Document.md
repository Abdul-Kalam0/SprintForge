# SprintForge — API Design v1.0

## API Base URL

```text
/api/v1
```

---

# Phase 1 — Authentication

### Register

```http
POST /api/v1/auth/register
```

### Login

```http
POST /api/v1/auth/login
```

### Logout

```http
POST /api/v1/auth/logout
```

### Refresh Access Token

```http
POST /api/v1/auth/refresh-token
```

### Current User

```http
GET /api/v1/auth/me
```

### Future Authentication APIs

These APIs are intentionally deferred:

```http
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

---

# Phase 2 — Workspace

### Get All Workspaces

```http
GET /api/v1/workspaces
```

### Create Workspace

```http
POST /api/v1/workspaces
```

### Get Workspace

```http
GET /api/v1/workspaces/:workspaceId
```

### Update Workspace

```http
PATCH /api/v1/workspaces/:workspaceId
```

### Delete Workspace

```http
DELETE /api/v1/workspaces/:workspaceId
```

---

# Phase 3 — Members

### Get Workspace Members

```http
GET /api/v1/workspaces/:workspaceId/members
```

### Add Workspace Member

```http
POST /api/v1/workspaces/:workspaceId/members
```

### Update Member

```http
PATCH /api/v1/members/:memberId
```

### Remove Member

```http
DELETE /api/v1/members/:memberId
```

---

# Phase 4 — Projects

### Get Workspace Projects

```http
GET /api/v1/workspaces/:workspaceId/projects
```

### Create Project

```http
POST /api/v1/workspaces/:workspaceId/projects
```

### Get Project

```http
GET /api/v1/projects/:projectId
```

### Update Project

```http
PATCH /api/v1/projects/:projectId
```

### Delete Project

```http
DELETE /api/v1/projects/:projectId
```

---

# Phase 5 — Tasks

Tasks belong directly to Projects.

### Get Project Tasks

```http
GET /api/v1/projects/:projectId/tasks
```

### Create Task

```http
POST /api/v1/projects/:projectId/tasks
```

### Get Task

```http
GET /api/v1/tasks/:taskId
```

### Update Task

```http
PATCH /api/v1/tasks/:taskId
```

### Delete Task

```http
DELETE /api/v1/tasks/:taskId
```

---

# Phase 6 — Dashboard

### Dashboard Overview

```http
GET /api/v1/dashboard/overview
```

The dashboard can provide aggregated information such as:

```text
Total Workspaces
Total Projects
Active Projects
Total Tasks
Pending Tasks
In Progress Tasks
Completed Tasks
```

---

# Phase 7 — Profile

### Get Profile

```http
GET /api/v1/profile
```

### Update Profile

```http
PATCH /api/v1/profile
```

### Change Password

```http
PATCH /api/v1/profile/password
```

### Upload Profile Photo

```http
PATCH /api/v1/profile/photo
```

### Delete Profile Photo

```http
DELETE /api/v1/profile/photo
```

---

# Complete API List

```text
# Phase 1 — Authentication

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
GET    /api/v1/auth/me

# Future

POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password


# Phase 2 — Workspace

GET    /api/v1/workspaces
POST   /api/v1/workspaces
GET    /api/v1/workspaces/:workspaceId
PATCH  /api/v1/workspaces/:workspaceId
DELETE /api/v1/workspaces/:workspaceId


# Phase 3 — Members

GET    /api/v1/workspaces/:workspaceId/members
POST   /api/v1/workspaces/:workspaceId/members
PATCH  /api/v1/members/:memberId
DELETE /api/v1/members/:memberId


# Phase 4 — Projects

GET    /api/v1/workspaces/:workspaceId/projects
POST   /api/v1/workspaces/:workspaceId/projects
GET    /api/v1/projects/:projectId
PATCH  /api/v1/projects/:projectId
DELETE /api/v1/projects/:projectId


# Phase 5 — Tasks

GET    /api/v1/projects/:projectId/tasks
POST   /api/v1/projects/:projectId/tasks
GET    /api/v1/tasks/:taskId
PATCH  /api/v1/tasks/:taskId
DELETE /api/v1/tasks/:taskId


# Phase 6 — Dashboard

GET    /api/v1/dashboard/overview


# Phase 7 — Profile

GET    /api/v1/profile
PATCH  /api/v1/profile
PATCH  /api/v1/profile/password
PATCH  /api/v1/profile/photo
DELETE /api/v1/profile/photo
```

---

# API Summary

| Module         | Active APIs |
| -------------- | ----------: |
| Authentication |           5 |
| Workspace      |           5 |
| Members        |           4 |
| Projects       |           5 |
| Tasks          |           5 |
| Dashboard      |           1 |
| Profile        |           5 |
| **Total**      |      **30** |

### Future APIs

```text
Forgot Password
Reset Password
```

These are **not included in the current 30 API implementation scope**.

---

# SprintForge v1.0 Module Hierarchy

```text
User
 │
 ▼
Workspace
 │
 ├── Members
 │
 └── Projects
       │
       └── Tasks
```

---

# Deferred Features

The following are intentionally excluded from SprintForge v1.0:

```text
❌ Sprint Management
❌ Backlog Management
❌ Comments
❌ Activity Logs
❌ Notifications
❌ Attachments
❌ AI Features
❌ Email Verification
❌ Forgot Password
❌ Reset Password
❌ Project-specific Member Management
```

These can be introduced in future versions without changing the core v1.0 architecture.

---

# Database

```text
MongoDB
   │
   ▼
Mongoose
```

MongoDB will be used for:

```text
Users
Refresh Tokens
Workspaces
Workspace Members
Projects
Tasks
```

---

# Architecture

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

**Status: API Contract Locked — SprintForge v1.0**
