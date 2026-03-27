# 📅 Calendar Backend API

This is a **Node.js + Express + Supabase + JWT authentication** backend for a calendar application.

The API allows users to:

* Register & login
* Create calendars
* Get all calendars
* Get calendars created by a user
* Delete calendars
* (Events and collaborators modules are prepared for future use)

---

# 🚀 Tech Stack

* Node.js
* Express.js
* Supabase (PostgreSQL database)
* JWT Authentication
* REST API architecture

---

# 📂 Project Structure

```
src/
│
├── index.js
│
├── config/
│   └── supabaseClient.js
│
├── middleware/
│   └── auth.middleware.js
│
├── modules/
│   │
│   ├── user/
│   │   ├── user.controller.js
│   │   ├── user.routes.js
│   │   └── user.service.js
│   │
│   ├── calendar/
│   │   ├── calendar.controller.js
│   │   ├── calendar.routes.js
│   │   └── calendar.service.js
│   │
│   ├── event/              (coming soon)
│   └── collaborator/       (coming soon)
```

---

# ⚙️ Installation

### 1. Install dependencies

```bash
npm install
```

---

### 2. Create `.env` file

Create a file called `.env` in the root folder and add:

```env
PORT=3000

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

JWT_SECRET=your_secret_key
```

---

### 3. Run the server

```bash
npm run dev
```

Server will run at:

```
http://localhost:3000
```

---

# 🔐 JWT Authentication

This API uses **JWT tokens** to protect routes.

### How it works

1. User logs in
2. Server generates a JWT token
3. The token must be sent in the request header

---

# 🔑 How to Login Using Postman

## Step 1 – Login Request

**POST**

```
http://localhost:3000/api/users/login
```

### Body (JSON)

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

---

## Step 2 – Copy the token

Response example:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Copy the token.

---

## Step 3 – Use the token in protected routes

Go to **Headers** in Postman and add:

```
Authorization: Bearer YOUR_TOKEN
```

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

# 📡 API Routes

Base URL:

```
http://localhost:3000/api
```

---

# 👤 User Routes

### Register User

**POST**

```
/api/users/register
```

Body:

```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "123456"
}
```

---

### Login User

**POST**

```
/api/users/login
```

Body:

```json
{
  "email": "john@gmail.com",
  "password": "123456"
}
```

---

# 📅 Calendar Routes

All calendar routes are **protected** (require JWT token).

---

### Create Calendar

**POST**

```
/api/calendars
```

Body:

```json
{
  "name": "Work Calendar",
  "type": "work"
}
```

---

### Get All Calendars

**GET**

```
/api/calendars
```

---

### Get Logged-in User Calendars

**GET**

```
/api/calendars/my-calendars
```

Returns only calendars created by the logged-in user.

---

### Delete Calendar

**DELETE**

```
/api/calendars/:id
```

Example:

```
http://localhost:3000/api/calendars/123
```

---

# 🔒 Protected Routes

These routes require a valid JWT token:

```
POST   /api/calendars
GET    /api/calendars
GET    /api/calendars/my-calendars
DELETE /api/calendars/:id
```

---

# 🧪 Testing Using Postman

### 1. Register User

```
POST http://localhost:3000/api/users/register
```

### 2. Login

```
POST http://localhost:3000/api/users/login
```

### 3. Copy JWT Token

### 4. Use token in header

```
Authorization: Bearer YOUR_TOKEN
```

### 5. Test calendar routes

```
GET http://localhost:3000/api/calendars
GET http://localhost:3000/api/calendars/my-calendars
POST http://localhost:3000/api/calendars
DELETE http://localhost:3000/api/calendars/:id
```

---

# 🧱 Architecture

The project follows **Controller → Service → Database** structure.

* **Routes** handle HTTP requests
* **Controllers** handle request/response logic
* **Services** interact with Supabase
* **Middleware** handles authentication

---

# 🚧 Coming Next

The following modules are already created and will be implemented next:

* Events inside calendars
* Collaborators (shared calendars)
* Update calendar API
* Event reminders
* Calendar search & filters

---

# 📄 License

This project is for learning and development purposes.
