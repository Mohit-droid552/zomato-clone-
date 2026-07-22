# Zomato Clone MERN Stack

A production-ready starter for a Zomato-style food ordering app built with **MongoDB, Express, React, Node.js**, **Redux Toolkit**, **React Router v6**, and **Tailwind CSS**.

## Features

**Frontend**

- Restaurant discovery homepage
- Search and filtering
- Restaurant detail page with tabs
- Interactive menu cards with add-to-cart and quantity controls
- Persistent cart with localStorage
- Login and signup flows
- Protected cart, orders, and order success pages
- Order history screen
- Loading, empty, and error states

**Backend**

- JWT authentication
- User profile and saved addresses
- Restaurant CRUD
- Food item CRUD
- Order creation and order history
- Centralized error handling
- MongoDB + Mongoose models
- Seed data script

## Folder Structure

See `PROJECT_STRUCTURE.md` for the full tree.

## Environment Variables

Create `backend/.env` from `backend/.env.example` and set:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/zomato_clone
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

To seed demo data:

```bash
npm run seed
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Default Demo Credentials

After seeding, use:

- Email: `demo@example.com`
- Password: `password123`

## API Overview

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Users

- `GET /api/v1/users/me`
- `PUT /api/v1/users/me`
- `PUT /api/v1/users/me/password`
- `POST /api/v1/users/me/addresses`
- `DELETE /api/v1/users/me/addresses/:index`

### Restaurants

- `GET /api/v1/restaurants`
- `GET /api/v1/restaurants/:id`
- `POST /api/v1/restaurants`
- `PUT /api/v1/restaurants/:id`
- `DELETE /api/v1/restaurants/:id`

### Food Items

- `GET /api/v1/food-items`
- `POST /api/v1/food-items`
- `PUT /api/v1/food-items/:id`
- `DELETE /api/v1/food-items/:id`

### Orders

- `POST /api/v1/orders`
- `GET /api/v1/orders/my-orders`
- `GET /api/v1/orders/:id`
- `PUT /api/v1/orders/:id/status`

## Notes

This is a strong base for a full clone, but in a real production deployment you would still want:

- form validation with Zod or Joi
- token refresh flow
- refresh-safe auth persistence
- image upload support
- admin dashboards
- restaurant partner onboarding
- payment gateway integration
- test coverage
