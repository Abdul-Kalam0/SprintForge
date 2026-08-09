# SprintForge — Database Design Document (DDD)

## Version

**Version:** 1.0
**Database:** MongoDB
**ODM:** Mongoose

---

# 1. Database Strategy

SprintForge will use **MongoDB as the primary database for the entire backend**.

MongoDB will store:

- Authentication data
- User profiles
- Workspaces
- Workspace members
- Projects
- Sprints
- Tasks

The application will use **Mongoose** as the ODM layer.

### Architecture

```text
Node.js
   │
   ▼
Express.js
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

# 2. Collections

SprintForge v1.0 will contain the following collections:

```text
MongoDB
│
├── users
├── refreshTokens
├── passwordResetTokens
├── workspaces
├── workspaceMembers
├── projects
├── sprints
└── tasks
```

---

# 3. Users Collection

Collection:

```text
users
```

### Fields

| Field          | Type     | Required | Description           |
| -------------- | -------- | -------- | --------------------- |
| `_id`          | ObjectId | Yes      | MongoDB document ID   |
| `firstName`    | String   | Yes      | User first name       |
| `lastName`     | String   | Yes      | User last name        |
| `email`        | String   | Yes      | Unique email          |
| `passwordHash` | String   | Yes      | Hashed password       |
| `profileImage` | String   | No       | Cloudinary image URL  |
| `createdAt`    | Date     | Yes      | Creation timestamp    |
| `updatedAt`    | Date     | Yes      | Last update timestamp |

### Indexes

```text
email → UNIQUE INDEX
```

---

# 4. Refresh Tokens Collection

Collection:

```text
refreshTokens
```

### Fields

| Field       | Type     | Required | Description          |
| ----------- | -------- | -------- | -------------------- |
| `_id`       | ObjectId | Yes      | Document ID          |
| `userId`    | ObjectId | Yes      | Reference to User    |
| `tokenHash` | String   | Yes      | Hashed refresh token |
| `expiresAt` | Date     | Yes      | Token expiration     |
| `createdAt` | Date     | Yes      | Creation timestamp   |

### Relationships

```text
User
  │
  └── Refresh Tokens
```

A user can have multiple active sessions.

---

# 5. Password Reset Tokens Collection

Collection:

```text
passwordResetTokens
```

### Fields

| Field       | Type     | Required | Description        |
| ----------- | -------- | -------- | ------------------ |
| `_id`       | ObjectId | Yes      | Document ID        |
| `userId`    | ObjectId | Yes      | Reference to User  |
| `tokenHash` | String   | Yes      | Hashed reset token |
| `expiresAt` | Date     | Yes      | Token expiration   |
| `createdAt` | Date     | Yes      | Creation timestamp |

Expired tokens should be automatically removed using a MongoDB TTL index.

---

# 6. Workspaces Collection

Collection:

```text
workspaces
```

### Fields

| Field         | Type     | Required | Description           |
| ------------- | -------- | -------- | --------------------- |
| `_id`         | ObjectId | Yes      | Workspace ID          |
| `name`        | String   | Yes      | Workspace name        |
| `description` | String   | No       | Workspace description |
| `ownerId`     | ObjectId | Yes      | Workspace owner       |
| `createdAt`   | Date     | Yes      | Creation timestamp    |
| `updatedAt`   | Date     | Yes      | Last update timestamp |

---

# 7. Workspace Members Collection

Collection:

```text
workspaceMembers
```

### Fields

| Field         | Type     | Required | Description         |
| ------------- | -------- | -------- | ------------------- |
| `_id`         | ObjectId | Yes      | Membership ID       |
| `workspaceId` | ObjectId | Yes      | Workspace reference |
| `userId`      | ObjectId | Yes      | User reference      |
| `role`        | String   | Yes      | Workspace role      |
| `joinedAt`    | Date     | Yes      | Membership date     |

### Roles

```text
OWNER
ADMIN
MEMBER
```

### Important Constraint

A user can belong to a workspace only once.

```text
workspaceId + userId
```

should have a compound unique index.

---

# 8. Projects Collection

Collection:

```text
projects
```

### Fields

| Field         | Type     | Required | Description              |
| ------------- | -------- | -------- | ------------------------ |
| `_id`         | ObjectId | Yes      | Project ID               |
| `workspaceId` | ObjectId | Yes      | Workspace reference      |
| `name`        | String   | Yes      | Project name             |
| `description` | String   | No       | Project description      |
| `status`      | String   | Yes      | Project status           |
| `createdBy`   | ObjectId | Yes      | User who created project |
| `createdAt`   | Date     | Yes      | Creation timestamp       |
| `updatedAt`   | Date     | Yes      | Last update timestamp    |

### Project Status

```text
ACTIVE
COMPLETED
ARCHIVED
```

---

# 9. Sprints Collection

Collection:

```text
sprints
```

### Fields

| Field       | Type     | Required | Description           |
| ----------- | -------- | -------- | --------------------- |
| `_id`       | ObjectId | Yes      | Sprint ID             |
| `projectId` | ObjectId | Yes      | Project reference     |
| `name`      | String   | Yes      | Sprint name           |
| `goal`      | String   | No       | Sprint goal           |
| `startDate` | Date     | Yes      | Sprint start          |
| `endDate`   | Date     | Yes      | Sprint end            |
| `status`    | String   | Yes      | Sprint status         |
| `createdAt` | Date     | Yes      | Creation timestamp    |
| `updatedAt` | Date     | Yes      | Last update timestamp |

### Sprint Status

```text
PLANNED
ACTIVE
COMPLETED
```

---

# 10. Tasks Collection

Collection:

```text
tasks
```

### Fields

| Field         | Type     | Required | Description           |
| ------------- | -------- | -------- | --------------------- |
| `_id`         | ObjectId | Yes      | Task ID               |
| `sprintId`    | ObjectId | Yes      | Sprint reference      |
| `title`       | String   | Yes      | Task title            |
| `description` | String   | No       | Task description      |
| `status`      | String   | Yes      | Task status           |
| `priority`    | String   | Yes      | Task priority         |
| `assignedTo`  | ObjectId | No       | Assigned user         |
| `dueDate`     | Date     | No       | Task deadline         |
| `createdBy`   | ObjectId | Yes      | Creator               |
| `createdAt`   | Date     | Yes      | Creation timestamp    |
| `updatedAt`   | Date     | Yes      | Last update timestamp |

### Task Status

```text
TODO
IN_PROGRESS
IN_REVIEW
DONE
```

### Priority

```text
LOW
MEDIUM
HIGH
URGENT
```

---

# 11. Relationships

SprintForge uses references between collections.

```text
User
 │
 ├── Refresh Tokens
 ├── Password Reset Tokens
 └── Workspace Memberships
          │
          ▼
      Workspace
          │
          ▼
       Projects
          │
          ▼
       Sprints
          │
          ▼
        Tasks
```

---

# 12. MongoDB Design Principles

SprintForge will follow these principles:

### Use References

Large independent entities will remain in separate collections.

```text
Workspace
Project
Sprint
Task
```

will not be deeply embedded inside one document.

### Use ObjectId References

Example:

```javascript
workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace"
}
```

### Use Indexes

Indexes will be created for frequently queried fields such as:

```text
users.email
workspaceMembers.workspaceId
workspaceMembers.userId
projects.workspaceId
sprints.projectId
tasks.sprintId
tasks.assignedTo
```

### Use Timestamps

Mongoose timestamps will be enabled where appropriate:

```javascript
{
  timestamps: true;
}
```

---

# 13. Database Security

The backend must:

- Never store plain-text passwords.
- Hash passwords using bcrypt.
- Store hashed refresh tokens.
- Store hashed password-reset tokens.
- Validate ObjectIds.
- Restrict database access through the repository layer.
- Never expose sensitive authentication fields through API responses.

---

# 14. Database Decision

### Locked for SprintForge v1.0

```text
Database → MongoDB
ODM      → Mongoose
```

PostgreSQL and Prisma are **not part of the current SprintForge v1.0 implementation**.
