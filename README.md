# Zomato Clone (Food Delivery App)

A full-stack food delivery application built with a modern **React + Vite** frontend and a **Node.js + Express + TypeScript** backend. This project simulates a simplified Zomato-like experience, including restaurant browsing, menu selection, cart management, ordering, rider tracking, and payments.

---

## 🚀 Tech Stack

### Frontend
- **React** (with TypeScript)
- **Vite** (bundler)
- **Redux Toolkit** (state management)
- **Axios** (HTTP client)
- **React Router** (routing)
- **Zod / Yup** (validation schemas)

### Backend
- **Node.js** + **Express** (API server)
- **TypeScript**
- **MongoDB** (presumed DB; check `db/` implementation)
- **RabbitMQ** (event-driven order/payment processing)
- **Socket.IO** (real-time rider/order updates)
- **Razorpay** (payment integration)
- **Google Auth** (OAuth login)
- **Docker / Docker Compose** (containerized backend + MongoDB + RabbitMQ)

---

## ⭐ Features

- ✅ **User authentication** (including Google login)
- ✅ **Restaurant discovery** + filters by location
- ✅ **Menu browsing** and **cart management**
- ✅ **Checkout flow** with payment integration (Razorpay)
- ✅ **Order placement** + real-time updates via Socket.IO
- ✅ **Rider dashboard** (accept/track orders)
- ✅ **Admin/restaurant dashboard** (manage menu, orders)
- ✅ **Address management**
- ✅ **RabbitMQ-powered async processing** for orders/payments

---

## 🗂 Project Structure

```
backend/              # Express API server
  src/
    app.ts            # Express app setup
    server.ts         # HTTP server entrypoint
    config/           # 3rd-party integration config (Google, Razorpay)
    controllers/      # Route controllers (business logic)
    db/               # DB connection setup
    middleware/       # Auth, file uploads, sockets
    models/           # Data models (MongoDB schemas)
    rabbitmq/         # Producers/consumers for async flows
    routes/           # API route definitions
    socket/           # Socket.IO setup
    utils/            # Shared utilities
    validations/      # Request validation schemas

frontend/             # React/Vite SPA
  src/
    apis/             # Axios API wrappers
    components/       # UI components & layouts
    features/         # Redux slices
    hooks/            # Custom React hooks
    layouts/          # Route layouts
    pages/            # Route pages
    store/            # Redux store setup
    utils/            # Utility helpers
    validations/      # Zod schemas
```

---

## 🧩 API Endpoints (Backend)

> Base URL: `http://localhost:5000/api` (default, confirm in `backend/src/app.ts`)

### Auth
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email/password
- `POST /auth/google` - Login/Register via Google

### Restaurants
- `GET /restaurants` - List restaurants
- `GET /restaurants/:id` - Get restaurant details
- `POST /restaurants` - Add a restaurant (seller/admin)
- `PUT /restaurants/:id` - Update restaurant info

### Menu
- `GET /menu/:restaurantId` - Get menu for a restaurant
- `POST /menu` - Add a menu item
- `PUT /menu/:id` - Update menu item

### Cart
- `GET /cart` - Get active cart for user
- `POST /cart` - Add/update cart item
- `DELETE /cart/:itemId` - Remove cart item

### Orders
- `POST /orders` - Place a new order
- `GET /orders` - Get orders (user/restaurant based)
- `PUT /orders/:id/status` - Update order status (rider/restaurant)

### Rider
- `GET /riders` - List riders
- `POST /riders` - Create rider profile
- `PUT /riders/:id` - Update rider status

### Payments
- `POST /payments/create` - Create payment order (Razorpay)
- `POST /payments/verify` - Verify payment signature

> Note: Many endpoints are protected and require an auth token (JWT). See `auth.middleware.ts`.

---

## 🛠 Local Setup

### 1) Clone the repo

```bash
git clone <repo-url>
cd zomato
```

### 2) Backend (API)

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example` if available) and set the required keys:

- `PORT` (e.g., 5000)
- `MONGODB_URI` (MongoDB connection string, e.g. `mongodb://localhost:27017`)
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
- `RABBITMQ_URL` (RabbitMQ connection URL)

Start backend server:

```bash
npm run dev
```

### 2b) Backend + MongoDB + RabbitMQ (Docker)

From the `backend/` folder you can start everything with Docker Compose:

```bash
cd backend
docker compose up --build
```

This will start:

- `backend` API on `http://localhost:5000`
- `mongodb` on `mongodb://localhost:27017`
- `rabbitmq` on `amqp://localhost:5672` (management UI at `http://localhost:15672`)

To stop and remove containers:

```bash
docker compose down
```

### 3) Frontend (Web App)

```bash
cd ../frontend
npm install
```

Create a `.env` file (copy from `.env.example` if available) and set the required keys, e.g.:

- `VITE_API_BASE_URL=http://localhost:5000/api`

Start the frontend:

```bash
npm run dev
```

Then open the provided local URL (usually `http://localhost:5173`).

---

## ✅ Notes

- Make sure your backend is running before using the frontend.
- If you update the database schema or models, restart the backend and ensure your MongoDB collection structure matches.
- For real-time functionality, ensure Socket.IO is connected (frontend uses `useSocket`).

---

## 📌 Contribution

Feel free to open issues or submit pull requests to improve features, stabilize the flows, or add documentation.

---

## License

This project is provided as-is. Add a license file if you intend to open-source it.
