# ShopKart

ShopKart is a full-stack e-commerce application built for shopping, checkout, and order tracking. The project combines a React frontend with a Node.js + Express backend and MongoDB for persistent data storage.

It includes customer authentication, product listing, wishlist management, cart handling, secure checkout, and Razorpay-based payment flow.

## Features

- User signup and login with JWT-based authentication
- Protected routes for authenticated users
- Product catalog with search and category filtering
- Wishlist support for saving favorite products
- Cart management with quantity updates
- Checkout flow with shipping address validation
- Razorpay test payment integration
- Order creation and order history
- MongoDB-backed persistence for users, products, carts, and orders

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT + cookie-based sessions
- Payments: Razorpay
- Styling: Tailwind CSS

## Project Structure

```text
ShopKart/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── index.js
│   └── package.json
├── client/
│   ├── frontend/
│   └── package.json
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ and npm
- MongoDB running locally or a MongoDB Atlas connection string
- Razorpay test credentials

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Uniqueone222/ShopKart.git
cd ShopKart
```

### 2. Configure the backend environment

Create a `.env` file inside the `backend` folder:

```env
dbUrl=mongodb://localhost:27017/shopkart
jwt_secret=your_jwt_secret
cloud_name=your_cloudinary_cloud_name
cloud_api_key=your_cloudinary_api_key
cloud_secret=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
```

Note: Use your real MongoDB URI and Razorpay keys. Do not commit secrets to version control.

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Start the backend server

```bash
npx nodemon index.js
```

If you prefer not to use nodemon, you can run:

```bash
node index.js
```

The backend runs on port `8085` by default.

### 5. Install frontend dependencies

```bash
cd ../client/frontend
npm install
```

### 6. Start the frontend app

```bash
npm run dev
```

The Vite app typically runs on:

```text
http://localhost:5173
```

The frontend uses `VITE_API_URL` to select the backend API. For local development, copy `client/frontend/.env.example` to `client/frontend/.env`; its default points to `http://localhost:8085`.

## Production Deployment

The frontend and backend can be deployed separately as long as the frontend is configured with the public backend URL and the backend allows the deployed frontend origin.

Set these environment variables in the hosting providers:

| Service | Variable | Value |
| --- | --- | --- |
| Frontend | `VITE_API_URL` | Backend origin, for example `https://your-api.onrender.com` (no trailing slash) |
| Backend | `CLIENT_URL` | Comma-separated exact frontend origins, e.g. `https://your-shop.vercel.app,https://your-preview.vercel.app` |
| Backend | `NODE_ENV` | `production` |
| Backend | `dbUrl` | Production MongoDB connection string |
| Backend | `jwt_secret` | A long, unique secret |
| Backend | `RAZORPAY_KEY_ID` | Razorpay key for the intended mode |
| Backend | `RAZORPAY_KEY_SECRET` | Matching Razorpay secret |

Set `VITE_API_URL` in the frontend host before building/redeploying; Vite embeds `VITE_` variables into the frontend build. Keep backend secrets only in the backend host's secret/environment settings.

The backend uses credentialed CORS and the authentication cookie is configured for cross-site HTTPS in production (`SameSite=None; Secure`). `CLIENT_URL` can contain multiple comma-separated frontend origins; match the browser origin exactly (scheme and hostname), without a path. The backend trims surrounding whitespace and trailing slashes. Redeploy/restart the backend after changing this variable. Browsers may still restrict third-party cookies when the frontend and API use unrelated hosting domains; using custom domains under the same registrable domain is the most reliable setup. Test signup/login, page refresh while authenticated, and logout on the deployed domains.

## Main Application Flow

1. User signs up or logs in
2. User browses the product catalog
3. User adds items to wishlist or cart
4. User proceeds to checkout
5. User fills shipping details
6. Razorpay creates an order and handles payment
7. Payment verification completes the order
8. User can view order details and past purchases

## API Overview

The backend exposes key routes for:

- Users: `/users/register`, `/users/login`, `/users/logout`, `/users/me`
- Products: `/products`, `/products/:id`
- Wishlist: `/wishlist`
- Cart: `/cart`
- Orders: `/orders/create-payment-order`, `/orders/verify-payment`, `/orders`

## Notes

- The app uses cookie-based auth for JWT tokens.
- Razorpay is configured in test mode for development and testing.
- The project contains lab-based documentation files under the `backend` folder, which describe the step-by-step engineering exercises used during development.

## License

This project does not currently declare a license. If you intend to distribute or publish it, add an appropriate license file and terms.
