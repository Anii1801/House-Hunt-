# House Hunt – MERN Backend (Demo Without MongoDB)

## Overview

House Hunt is a backend API for a property listing and booking platform.
It demonstrates a typical **MERN stack architecture** with authentication, role-based access, and CRUD operations.

For development/demo purposes, this version runs **without MongoDB** and stores data in memory.

---

# Features

### User Management

* User registration
* User login
* Password hashing using bcrypt
* JWT authentication

### Role-Based Security

* User role
* Admin role
* Protected routes using JWT middleware

### Property Management

* Add property listings
* Admin approval system
* Property browsing
* Filter properties by:

  * Location
  * Price
  * Property type

### Booking System

* Book properties
* View user bookings

### API Security

* JWT authentication
* Password encryption
* Protected routes

---

# Tech Stack

Backend:

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* CORS

Deployment:

* Render

---

# Project Structure

```
backend
│
├── index.js
├── package.json
├── .env
└── README.md
```

---

# Installation

Clone the repository

```
git clone https://github.com/yourusername/house-hunt.git
```

Go to backend folder

```
cd house-hunt/backend
```

Install dependencies

```
npm install
```

Run the server

```
nodemon index.js
```

Server runs on

```
http://localhost:5000
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

```
PORT=5000
JWT_SECRET=househuntsecret
```

---

# API Endpoints

## Register User

POST `/register`

Body

```
{
"name": "Anii",
"email": "anii@test.com",
"password": "1234"
}
```

---

## Login

POST `/login`

```
{
"email": "anii@test.com",
"password": "1234"
}
```

Returns a JWT token.

---

## Add Property

POST `/property`

Headers

```
Authorization: <token>
```

Body

```
{
"title":"2BHK Apartment",
"location":"Delhi",
"price":12000,
"type":"rent"
}
```

---

## Get Properties

GET `/properties`

Optional filters

```
/properties?location=Delhi
/properties?price=15000
/properties?type=rent
```

---

## Book Property

POST `/booking`

Headers

```
Authorization: <token>
```

Body

```
{
"propertyId":123
}
```

---

# Deploying on Render

## 1. Push Code to GitHub

Initialize git

```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/house-hunt.git
git push -u origin main
```

---

## 2. Create Render Web Service

1. Go to Render Dashboard
2. Click **New → Web Service**
3. Connect your GitHub repository

---

## 3. Render Configuration

Set the following:

Root Directory

```
backend
```

Build Command

```
npm install
```

Start Command

```
node index.js
```

---

## 4. Environment Variables on Render

Add:

```
JWT_SECRET=househuntsecret
PORT=5000
```

---

## 5. Deploy

Click **Deploy Web Service**.

Your API will be available at:

```
https://your-service-name.onrender.com
```

---

# Notes

Since this version does not use MongoDB:

* Data is stored in memory
* Data resets when the server restarts

For production use, integrate MongoDB with Mongoose models.

---

# Learning Outcomes

This project demonstrates:

* Express API development
* JWT authentication
* Role-based authorization
* CRUD operations
* RESTful routing
* Backend deployment on Render

---

# Author

Aniruddha Singh
