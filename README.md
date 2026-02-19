# 🔐 AuthFlow Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**A robust and secure authentication backend system built with Node.js & Express**

[![Run In Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/51642188/2sBXcEjKkp)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#-api-documentation)
- [Postman Collection](#-postman-collection)
- [Contributing](#-contributing)

---

## 🚀 About the Project

**AuthFlow Backend** is a training project that implements a complete authentication and authorization system. It provides secure endpoints for user registration, login, email verification, password management, and token-based access control using JWT.

---

## ✨ Features

- ✅ User Registration with email validation
- ✅ Secure Login with hashed passwords (bcrypt)
- ✅ JWT Access & Refresh Token system
- ✅ Email Verification via OTP or link
- ✅ Forgot Password & Reset Password flow
- ✅ Logout and token invalidation
- ✅ Protected routes with middleware
- ✅ Input validation & error handling

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcrypt |
| Email Service | Nodemailer |
| Validation | express-validator / Joi |
| Environment | dotenv |

---

## 📁 Project Structure

```
AuthFlow-Backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   └── auth.controller.js
│   ├── models/             # Mongoose schemas
│   │   └── user.model.js
│   ├── routes/             # API route definitions
│   │   └── auth.routes.js
│   ├── middlewares/        # Auth & validation middleware
│   │   └── auth.middleware.js
│   ├── utils/              # Helper functions (email, tokens)
│   │   └── email.util.js
│   └── config/             # DB & app configuration
│       └── db.js
├── server.js               # Entry point
├── package.json
├── .gitignore
└── .env.example
```

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/mahmoud-atta1/AuthFlow-Backend.git
cd AuthFlow-Backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

4. **Run the server**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:3000`

---

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/authflow

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=AuthFlow <noreply@authflow.com>
```

---

## 📖 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login with email & password | ❌ |
| `POST` | `/auth/logout` | Logout and invalidate token | ✅ |
| `POST` | `/auth/verify-email` | Verify email with OTP/token | ❌ |
| `POST` | `/auth/forgot-password` | Send reset password email | ❌ |
| `POST` | `/auth/reset-password/:token` | Reset password with token | ❌ |
| `POST` | `/auth/refresh-token` | Get new access token | ❌ |
| `GET` | `/auth/me` | Get current user profile | ✅ |

---

### Request & Response Examples

#### 📌 Register

**POST** `/api/auth/register`

```json
// Request Body
{
  "name": "Mahmoud Atta",
  "email": "mahmoud@example.com",
  "password": "StrongPass123!"
}
```

```json
// Response 201 Created
{
  "status": "success",
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "_id": "64f...",
      "name": "Mahmoud Atta",
      "email": "mahmoud@example.com",
      "isVerified": false
    }
  }
}
```

---

#### 📌 Login

**POST** `/api/auth/login`

```json
// Request Body
{
  "email": "mahmoud@example.com",
  "password": "StrongPass123!"
}
```

```json
// Response 200 OK
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64f...",
      "name": "Mahmoud Atta",
      "email": "mahmoud@example.com"
    }
  }
}
```

---

#### 📌 Forgot Password

**POST** `/api/auth/forgot-password`

```json
// Request Body
{
  "email": "mahmoud@example.com"
}
```

```json
// Response 200 OK
{
  "status": "success",
  "message": "Password reset link sent to your email."
}
```

---

#### 📌 Reset Password

**POST** `/api/auth/reset-password/:token`

```json
// Request Body
{
  "password": "NewStrongPass456!",
  "confirmPassword": "NewStrongPass456!"
}
```

---

### Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Description of the error",
  "errors": [] // optional field-level errors
}
```

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad Request – Invalid input |
| `401` | Unauthorized – Missing or invalid token |
| `403` | Forbidden – Access denied |
| `404` | Not Found – Resource doesn't exist |
| `409` | Conflict – Email already registered |
| `500` | Internal Server Error |

---

## 📬 Postman Collection

You can explore and test all API endpoints using the Postman collection:

[![Run In Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/51642188/2sBXcEjKkp)

**Or import manually:**

1. Open [Postman](https://www.postman.com/)
2. Click **Import**
3. Paste this URL:
   ```
   https://documenter.getpostman.com/view/51642188/2sBXcEjKkp
   ```
4. Set the `base_url` environment variable to `http://localhost:3000`

---

## 🤝 Contributing

This is a training project, but contributions and suggestions are welcome!

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Mahmoud Atta**

- GitHub: [@mahmoud-atta1](https://github.com/mahmoud-atta1)

---

<div align="center">
  Made with ❤️ as a training project
</div>
