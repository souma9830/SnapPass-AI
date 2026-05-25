# Admin Backend & Dashboard Developer Guide

Welcome to the SnapPass AI Admin Backend! This guide provides comprehensive, step-by-step instructions on how to seed default users, run the backend/frontend servers locally, and easily extend features for contribution via Pull Requests (PRs).

---

##  1. How to Setup and Run Locally

### Prerequisites
Make sure you have Node.js (v18+) and a running MongoDB instance (local or Atlas) ready.

### Environment Configuration
1. In the `backend` folder, copy `.env.example` to `.env` (it may already be configured). Make sure `MONGO_URI` is pointing to your MongoDB instance.
2. In the `frontend` folder, verify `.env` contains the correct API endpoint (e.g. `VITE_API_URL=http://localhost:5000/api`).

### Database Seeding
To register a default Administrator account and set up default database parameters, run the following command in the **`backend`** directory:

```bash
npm run seed:admin
```

This registers the default account:
* **Admin Email:** `admin@snappass.ai`
* **Admin Password:** `AdminPass123!`

---

##  2. Starting the Servers

To start the application, run both the backend and frontend dev servers:

### Start Backend
In the `backend` directory, run:
```bash
npm run dev
```
The API server will listen on [http://localhost:5000](http://localhost:5000).

### Start Frontend
In the `frontend` directory, run:
```bash
npm run dev
```
The React development server will start on [http://localhost:5173](http://localhost:5173).

---

##  3. Logging into the Admin Panel

1. Open [http://localhost:5173/admin](http://localhost:5173/admin) or click the **Admin** link in the header navbar.
2. Enter the credentials seeded above:
   * **Email:** `{admin-email}`
   * **Password:** `{Password}`
3. Explore the dashboard! You can view uploads, preview pictures, manage/search uploads, list users, and update real-time application settings which are persisted in MongoDB.

---

##  4. How to Extend the Admin Backend (Adding new features)

If you are a developer looking to add a new admin backend capability, follow these layers in order:

### Step A: Define/Modify Models
If you need a new model or fields, add it in `backend/src/models/`. For example, our settings model is defined in `backend/src/models/settings.model.js`.

### Step B: Create/Extend DAOs
Add a helper database query in `backend/src/dao/admin.dao.js` to separate concerns:
```javascript
export async function myNewQuery(param) {
  return Model.find({ param });
}
```

### Step C: Update Services
Add business logic in `backend/src/service/admin.service.js` which interfaces between controllers and DAOs.

### Step D: Register Route & Controller
1. Create/update a method in `backend/src/controllers/admin.controller.js`.
2. Register the endpoint in `backend/src/routes/admin.routes.js` with the admin middleware:
```javascript
router.post("/my-new-endpoint", adminController.myNewControllerAction);
```

### Step E: Update Frontend Services
Add the API call in `frontend/src/services/adminService.jsx` using the `api` helper.

---

