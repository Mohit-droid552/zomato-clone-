# Deployment Checklist

## Backend

- Set `backend/.env` with your production values
- Verify `MONGODB_URI` points to a live MongoDB Atlas cluster
- Set a strong `JWT_SECRET`
- Run `npm install` in the backend folder
- Run `npm run seed` once to create demo data if needed
- Test `GET /api/v1/health`
- Test auth flows, restaurants, orders, and partner routes

## Frontend

- Set the Vite API base URL in `frontend/src/api/client.js` to your deployed backend URL
- Run `npm install` in the frontend folder
- Run `npm run build`
- Verify the build output is clean
- Test browsing, auth, cart, checkout, and order history

## Database

- Create collections in MongoDB automatically via Mongoose
- Confirm indexes and uniqueness on `User.email` and partner email fields
- Check sample data after seeding

## Security

- Use HTTPS in production
- Restrict CORS to your real frontend domain
- Keep secrets out of source control
- Rotate JWT secrets before launch if needed
- Use proper rate limiting and request validation before real traffic

## Deployment Targets

- Backend on Render, Railway, Fly, or a VPS
- Frontend on Vercel, Netlify, or a static hosting provider
- MongoDB Atlas for the database

## Final Launch Validation

- Create a new user account
- Log in and log out successfully
- Browse restaurants
- Open a restaurant detail page
- Add items to cart
- Place an order
- View order history
- Register and log in as a partner
- Confirm partner endpoints are reachable
