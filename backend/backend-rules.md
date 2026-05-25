# Backend Rules

## Folder Responsibilities

| Folder | Responsibility |
|--------|----------------|
| config/ | Environment variables and app configurations |
| controllers/ | Request and response handling |
| services/ | Business logic layer |
| dao/ | Database access logic |
| middleware/ | Express middlewares |
| models/ | Database schemas/models |
| routes/ | API route definitions |
| validation/ | Request validation schemas |
| utils/ | Shared helper utilities |

---

## Coding Standards

### General Rules

- Use `async/await` instead of `.then()`
- Use ES Modules (`import/export`)
- Keep functions small and reusable
- Follow consistent naming conventions
- Avoid duplicated logic

---

## Controller Rules

Controllers should only:

- Handle requests and responses
- Call service functions
- Return API responses
- Wrap all async operations using `catchAsync` utility
- Pass errors to the centralized error handler using `next(error)`

Controllers should NOT:

- Contain business logic
- Directly access the database

---

## Service Layer Rules

Services should:

- Contain business logic
- Communicate with DAO layer
- Remain independent from Express request/response objects

---

## DAO Layer Rules

DAO layer should:

- Handle all database operations
- Interact directly with models
- Avoid business logic

---

## Validation Rules

- Validate all incoming requests
- Use `express-validator`
- Keep validation schemas inside `validation/`

---

## Error Handling Rules

- Use centralized error handling middleware
- Create reusable custom error classes
- Wrap async controllers using `catchAsync`

Example structure:

```bash
src/
├── middleware/
│   └── error.middleware.js
│
├── utils/
│   ├── catchAsync.js
│   └── errors/
│       ├── AppError.js
│       ├── ValidationError.js
│       ├── AuthError.js
│       └── NotFoundError.js
```

---

## API Response Standards

### Success Response Example

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {}
}
```

### Error Response Example

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

## Upload + Processing Flow Notes

- Uploads are stored locally for AI processing even when Cloudinary is enabled.
- When Cloudinary is configured, local files are removed after `/api/process` finishes.
- This prevents `/api/process` from failing due to missing local files while still avoiding long-term disk growth.
