# Local-E-Commerce-Project1

# LocalShop (AssignmentTF)

A simple full-stack e-commerce demo app with a Node.js + Express + MySQL backend and a vanilla JS frontend.

---

##  Tech Stack

### Backend
- Node.js + Express
- MySQL (via `mysql2`)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Environment config (`dotenv`)

### Frontend
- Vanilla HTML/CSS/JavaScript (no framework)
- Uses `fetch()` for API calls
- Stores session token + cart in `localStorage`

---

##  Features

### Frontend Features
- Browse products with live refresh
- Add products to cart (stored in `localStorage`)
- View cart with totals and remove items
- Checkout using authenticated API calls
- Login / signup pages
- View order history
- Update user profile

### Backend Features
- User authentication (signup/login) with JWT tokens
- Protected routes (orders + profile) using middleware
- Products API (CRUD endpoints)
- Order creation with transaction-safe inserts
- Order history retrieval (joins order items with products)
- Input validation to prevent invalid orders (e.g., missing product IDs)

---

##  Getting Started

### 1) Install dependencies (backend)

```bash
cd backend
npm install
```

### 2) Configure environment variables

Create a `.env` file in `backend/` (it is ignored by git) with the following variables:

```env
PORT=8080
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=localshop_db
JWT_SECRET=YOUR_SECRET_KEY
```

### 3) Initialize the database

1. Create the database structure by running the schema in `backend/schema.sql`.

   ```bash
   mysql -u your_db_user -p < backend/schema.sql
   ```

2. The script seeds example products into the `products` table.

---

##  Run the backend server

From the `backend/` folder:

```bash
node server.js
```

You should see:

```
Server running on port 8080
```

---

##  Run the frontend

The frontend is pure static HTML/JS. You can open `frontend/index.html` directly, but using a local server avoids CORS issues.

Example using VS Code Live Server or a simple Python server:

```bash
cd frontend
python -m http.server 5500
```

Then visit: `http://127.0.0.1:5500/index.html`

---

##  API Endpoints

### Auth
- `POST /api/auth/signup` — Create a user
  - Body: `{ name, email, password }`
- `POST /api/auth/login` — Sign in
  - Body: `{ email, password }`
  - Response includes `token` (JWT) used for authenticated routes

### Products (public)
- `GET /api/products` — List products
- `GET /api/products/:id` — Get product by ID
- `POST /api/products` — Add a product
- `PUT /api/products/:id` — Update a product
- `DELETE /api/products/:id` — Delete a product

### Orders (authenticated)
- `POST /api/orders` — Place an order
  - Body: `{ items: [{ id, price }], total }`
- `GET /api/orders/history` — Get order history for the current user

### Profile (authenticated)
- `GET /api/profile` — Get current user profile
- `PUT /api/profile` — Update profile
  - Body: `{ name, location, bio }`

---

##  Authentication

Authenticated routes require the `Authorization` header:

```
Authorization: Bearer <token>
```

The frontend stores the token in `localStorage` and sends it automatically via the `apiFetch()` helper in `frontend/js/main.js`.

---

##  Troubleshooting

### 500 error on /api/orders
This can happen when the cart includes product IDs that don’t exist in the database. To fix:

- Confirm the backend `products` table contains the product IDs being ordered.
- Refresh the frontend product list (calls `/api/products`).

### Login/signup doesn’t work
- Ensure `.env` has correct DB credentials.
- Ensure the `users` table exists and is accessible.

---

##  Notes

- This project is intended as a demo and does not include production hardening (rate limiting, HTTPS enforcement, etc.).
- Feel free to extend it with features like quantity per cart item, payment integration, or admin product management.


