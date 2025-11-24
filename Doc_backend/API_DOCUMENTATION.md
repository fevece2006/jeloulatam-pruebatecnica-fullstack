# API Documentation

This document provides comprehensive documentation for the Project Management API.

## Base URL
```
http://localhost:3001/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-11-22T10:00:00.000Z",
    "updatedAt": "2025-11-22T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-11-22T10:00:00.000Z",
  "updatedAt": "2025-11-22T10:00:00.000Z"
}
```

### Projects

#### GET /projects
Get list of projects (requires authentication).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term

**Response (200):**
```json
{
  "projects": [
    {
      "id": 1,
      "name": "Project Name",
      "description": "Project description",
      "color": "#FF5733",
      "owner": {
        "id": 1,
        "email": "owner@example.com",
        "name": "Owner Name"
      },
      "collaborators": [],
      "createdAt": "2025-11-22T10:00:00.000Z",
      "updatedAt": "2025-11-22T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### POST /projects
Create a new project (requires authentication).

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "color": "#FF5733"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Project Name",
  "description": "Project description",
  "color": "#FF5733",
  "owner": {
    "id": 1,
    "email": "owner@example.com",
    "name": "Owner Name"
  },
  "collaborators": [],
  "createdAt": "2025-11-22T10:00:00.000Z",
  "updatedAt": "2025-11-22T10:00:00.000Z"
}
```

#### PUT /projects/:id
Update a project (requires authentication, owner only).

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "color": "#00FF00"
}
```

#### DELETE /projects/:id
Delete a project (requires authentication, owner only).

**Response (200):**
```json
{
  "message": "Proyecto eliminado exitosamente"
}
```

#### POST /projects/:id/collaborators
Add a collaborator to a project (requires authentication, owner only).

**Request Body:**
```json
{
  "userId": 2
}
```

### Tasks

#### GET /tasks
Get list of tasks (requires authentication).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (pending, in-progress, completed)
- `priority` (optional): Filter by priority (low, medium, high)
- `projectId` (optional): Filter by project ID
- `assignedUserId` (optional): Filter by assigned user ID
- `sortBy` (optional): Sort field (createdAt, dueDate, priority, status, title)
- `sortOrder` (optional): Sort order (ASC, DESC)

**Response (200):**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task description",
      "status": "pending",
      "priority": "high",
      "dueDate": "2025-12-31T23:59:59.000Z",
      "project": {
        "id": 1,
        "name": "Project Name"
      },
      "assignedUser": {
        "id": 2,
        "email": "user@example.com",
        "name": "User Name"
      },
      "createdAt": "2025-11-22T10:00:00.000Z",
      "updatedAt": "2025-11-22T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

#### GET /tasks/:id
Get a specific task (requires authentication).

#### POST /tasks
Create a new task (requires authentication).

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "projectId": 1,
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "assignedUserId": 2
}
```

#### PUT /tasks/:id
Update a task (requires authentication).

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "in-progress",
  "priority": "medium",
  "assignedUserId": 3
}
```

#### DELETE /tasks/:id
Delete a task (requires authentication).

### Stats

#### GET /stats
Get user statistics (requires authentication).

**Response (200):**
```json
{
  "totalProjects": 5,
  "totalTasks": 20,
  "tasksByStatus": {
    "pending": 10,
    "in-progress": 5,
    "completed": 5
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Token de acceso requerido"
}
```

### 403 Forbidden
```json
{
  "message": "Token inválido"
}
```

### 404 Not Found
```json
{
  "message": "Recurso no encontrado"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error interno del servidor"
}
```
