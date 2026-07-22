# Quickstart Guide

## 1) Backend

Open a terminal in the `backend` folder and run:

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

## 2) Frontend

Open a second terminal in the `frontend` folder and run:

```bash
npm install
npm run dev
```

## 3) Visit the app

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/api/v1/health`

## 4) Demo login

After seeding, use:

- Email: `demo@example.com`
- Password: `password123`

## 5) What to test first

- Home page restaurant list
- Search bar filtering
- Restaurant detail page
- Add to cart flow
- Checkout and order success
- Order history page

## 6) If something breaks

- Make sure MongoDB is running
- Check `backend/.env`
- Confirm the backend port is `5000`
- Confirm the frontend API base URL is still `http://localhost:5000/api/v1`
