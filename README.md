# ShopKart

ShopKart is a full-stack e-commerce application. Customers can create an account, browse and search products, manage a wishlist and shopping cart, complete checkout with Razorpay, and review their orders.

## Features

- Customer registration, login, logout, and profile retrieval
- JWT authentication stored in an HTTP-only cookie
- Protected customer pages and APIs
- Product catalog with name search and category filtering
- Wishlist and cart management
- Checkout with shipping-address and product-stock validation
- Razorpay order creation and server-side payment-signature verification
- Order history and order details

## Technology

- Frontend: React, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT, bcrypt, and HTTP-only cookies
- Payments: Razorpay

## Repository layout

```text
ShopKart/
├── backend/
│   ├── controllers/      # Request handlers and business logic
│   ├── middleware/       # Authentication and Razorpay setup
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express API routes
│   ├── utils/            # Shared backend utilities
│   ├── index.js          # API entry point
│   └── package.json
├── client/
│   └── frontend/
│       ├── src/
│       │   ├── axiosCalls/
│       │   ├── components/
│       │   ├── context/
│       │   └── pages/
│       ├── vercel.json   # SPA route fallback for Vercel
│       └── package.json
└── README.md
```

The backend and frontend are separate npm projects. Install dependencies and run scripts from their respective directories; the repository-root `package.json` is not an application workspace.

## Requirements

- Node.js 20.19+ (Node.js 22 LTS recommended) and npm
- A MongoDB database, local or MongoDB Atlas
- Razorpay API credentials; use Test Mode credentials during development

## Run locally

### 1. Get the project

```bash
git clone https://github.com/Uniqueone222/ShopKart.git
cd ShopKart
```

### 2. Configure the backend

Create `backend/.env` with the following values:

```env
PORT=8085
dbUrl=mongodb://127.0.0.1:27017/shopkart
jwt_secret=replace_with_a_long_random_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, use the connection string provided by Atlas as `dbUrl`. Do not commit `.env` files or put backend secrets in frontend environment variables.

Install dependencies and start the API:

```bash
cd backend
npm install
npm run dev
```

The development script uses Nodemon. To run without file watching, use `npm start`. The API listens on port `8085` by default, or on the port supplied via `PORT`. Its root endpoint (`GET /`) returns a basic health response. Keep this process running, then open a second terminal for the frontend.

### 3. Configure and start the frontend

Create `client/frontend/.env`:

```env
VITE_API_URL=http://localhost:8085
```

From the backend directory, install dependencies and start Vite:

```bash
cd ../client/frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`). `VITE_API_URL` is the backend base URL; it must be set before building the frontend. If omitted, the frontend falls back to `http://localhost:8085`.

Other frontend commands, run from `client/frontend`:

```bash
npm run build    # Production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Application pages

| Path | Page | Access |
| --- | --- | --- |
| `/` | Landing | Public |
| `/signup` | Sign up | Public |
| `/login` | Log in | Public |
| `/home` | Home | Authenticated |
| `/profile` | Profile | Authenticated |
| `/products` | Product catalog | Authenticated |
| `/products/:id` | Product details | Authenticated |
| `/wishlist` | Wishlist | Authenticated |
| `/cart` | Cart | Authenticated |
| `/checkout` | Checkout | Authenticated |
| `/orders` | Order history | Authenticated |
| `/orders/:id` | Order details | Authenticated |
| `/order-success/:id` | Order confirmation | Authenticated |

## API reference

The API base URL is the backend origin (for example, `http://localhost:8085`). Authentication-required routes use the JWT cookie; browser requests must send credentials.

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` | No | API health response |
| `POST` | `/users/register` | No | Register a customer |
| `POST` | `/users/login` | No | Authenticate and set the JWT cookie |
| `GET` | `/users/logout` | No | Clear the JWT cookie |
| `GET` | `/users/me` | Yes | Get the authenticated customer |
| `GET` | `/products` | No | List products; optional `search` and `category` query parameters |
| `GET` | `/products/:id` | No | Get a product |
| `POST` | `/products` | No | Create a product |
| `GET` | `/wishlist` | Yes | Get the customer wishlist |
| `POST` | `/wishlist/:productId` | Yes | Add a product to the wishlist |
| `DELETE` | `/wishlist/:productId` | Yes | Remove a product from the wishlist |
| `GET` | `/cart` | Yes | Get the customer cart |
| `POST` | `/cart/:productId` | Yes | Add a product to the cart |
| `PATCH` | `/cart/:productId` | Yes | Update a cart item's quantity |
| `DELETE` | `/cart/:productId` | Yes | Remove a cart item |
| `POST` | `/orders/create-payment-order` | Yes | Validate checkout details and create a pending order and Razorpay order |
| `POST` | `/orders/verify-payment` | Yes | Verify Razorpay's payment signature and place the order |
| `GET` | `/orders` | Yes | List the authenticated customer's orders |
| `GET` | `/orders/:id` | Yes | Get one of the authenticated customer's orders |

Product creation currently has no authentication or administrative authorization. Protect it before exposing the API for public production use.

## Checkout and payments

1. The backend validates the shipping address and checks the customer's current cart and stock.
2. It stores a pending ShopKart order and creates a Razorpay order in INR.
3. The frontend opens Razorpay Checkout using the returned public key and order details.
4. After checkout succeeds, the frontend sends the Razorpay payment details to `/orders/verify-payment`.
5. The backend verifies the signature with the secret key, marks the payment as paid, places the order, and clears the cart.

Never expose `RAZORPAY_KEY_SECRET` in the frontend. Keep Razorpay in Test Mode until the payment flow and deployment have been validated.

## Deploy

The frontend and backend are deployed separately. Use HTTPS for both services.

### Backend (Render or similar Node.js host)

- Set the service root directory to `backend`.
- Build/install command: `npm install`
- Start command: `npm start`
- Configure these environment variables in the hosting provider:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | Usually assigned by the host; the server reads it automatically |
| `dbUrl` | Production MongoDB connection string |
| `jwt_secret` | Long, random, unique signing secret |
| `RAZORPAY_KEY_ID` | Razorpay key for the selected mode |
| `RAZORPAY_KEY_SECRET` | Matching Razorpay secret |
| `CLIENT_URL` | Exact frontend origin(s), comma-separated if needed |

For `CLIENT_URL`, use the origin only—scheme and hostname, without a route path. Example:

```text
https://shop.example.com,https://shopkart-git-preview.vercel.app
```

The backend allows the configured origins plus local development origins. It trims surrounding whitespace and trailing slashes from configured origins. Redeploy/restart the backend after changing its environment variables.

### Frontend (Vercel or similar static host)

- Set the project root directory to `client/frontend`.
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to the backend origin, for example `https://your-api.onrender.com`, with no trailing slash.
- Redeploy after changing `VITE_API_URL`; Vite embeds it into the built assets.

The included `client/frontend/vercel.json` rewrites frontend routes to `index.html`, allowing React Router routes to work when loaded directly.

### Cross-site cookies

In production, the authentication cookie uses `SameSite=None` and `Secure`, which requires HTTPS. The API also enables credentialed CORS for allowed origins, and Axios is configured with `withCredentials: true`. The browser origin must exactly match one of the backend's `CLIENT_URL` origins. Some browsers restrict third-party cookies across unrelated domains; custom frontend and backend domains under the same registrable domain are more reliable.

After deployment, check the API root health endpoint and test registration, login, loading the authenticated profile after a page refresh, cart operations, payment verification, order history, and logout.

## Security and operational notes

- Keep `.env` files, JWT secrets, database credentials, and Razorpay secrets out of source control.
- Use HTTPS and strong, unique production secrets.
- Only use payment keys from the intended Razorpay mode.
- Add administrative authorization to product creation before public production use.
- Configure database backups, monitoring, and appropriate rate limits for a public deployment.

## License

No license is currently specified in this repository. Add a license before redistributing the project if you intend to grant reuse rights.
