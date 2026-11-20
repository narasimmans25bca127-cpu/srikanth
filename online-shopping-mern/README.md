# ShopEase - Online Shopping Application (MERN Stack)

A full-stack e-commerce app. Customers browse, search, add to cart and place Cash on Delivery orders. An admin manages products, users and orders.

**Stack:** React (Vite) + Bootstrap 5, Node.js + Express, MongoDB + Mongoose, JWT, bcryptjs, REST API.

## Folder structure

```
online-shopping-mern/
├── backend/
│   ├── config/database.js
│   ├── controllers/   auth, user, product, order, admin
│   ├── middleware/    authMiddleware, adminMiddleware, errorMiddleware
│   ├── models/        User, Product, Order
│   ├── routes/        auth, user, product, order, admin
│   ├── utils/         generateToken, asyncHandler
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/       AuthContext, CartContext
    │   ├── components/    Navbar, Footer, ProductCard, ProductForm, OrderTracker, Admin*...
    │   ├── pages/         Home, Login, Register, ProductList, ProductDetails, Cart,
    │   │                  Checkout, OrderConfirmation, MyOrders, UserDashboard
    │   ├── pages/admin/   AdminDashboard, ManageProducts, AddProduct, EditProduct,
    │   │                  ManageOrders, ManageUsers
    │   ├── styles/main.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── .env.example
```

## 1. Install Node.js
Install the LTS version from https://nodejs.org, then check: `node -v` and `npm -v`.

## 2. Set up MongoDB (choose ONE)

**Option A: Local MongoDB**
1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community (the installer can also install MongoDB Compass, a visual viewer).
2. Make sure the MongoDB service is running.
3. Use this in `backend/.env`: `MONGO_URI=mongodb://127.0.0.1:27017/shopease`

**Option B: MongoDB Atlas (free cloud database)**
1. Create a free account at https://www.mongodb.com/atlas and create a free (M0) cluster.
2. Database Access: add a database user (username + password).
3. Network Access: add IP address `0.0.0.0/0` (allow from anywhere) for development.
4. Click Connect, then Drivers, and copy the connection string.
5. Put it in `backend/.env`, replacing `<user>` and `<password>`, and add `/shopease` before the `?`:
   `MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/shopease?retryWrites=true&w=majority`
   If your password has special characters (such as @ or #), URL-encode them.

## 3. Run the backend

```bash
cd backend
npm install
# backend/.env is already included. Open it only if you want to change MONGO_URI.
npm run dev                 # starts the API on http://localhost:5000
```

The first time the server connects to MongoDB it **automatically adds** two demo users and 13
sample products (it only adds what is missing, it never deletes your data). Admin accounts are
provisioned separately from a password stored in `backend/.env`.
`npm run seed` is still there if you want to RESET the database to the sample data.

### Provision the admin account

Set `ADMIN_INITIAL_PASSWORD` in `backend/.env` to the initial admin password, then run
`npm run provision-admin` from `backend/`. This creates `nara4545@gmail.com` if missing, or
ensures that existing account has the admin role and matches the configured password. It does not
delete or recreate users. The User model hashes passwords with bcryptjs before saving.

### Safely update existing product images

`node updateProductImages.js` performs a read-only dry run. To apply the image-only update to the
13 expected products, run `node updateProductImages.js --apply` from `backend/`. The script checks
the database product count, IDs, names and categories before writing, and never seeds, deletes or
recreates products.

You should see `MongoDB connected` and `Server running on http://localhost:5000`.
Open http://localhost:5000 to see `{"message":"ShopEase API is running"}` and http://localhost:5000/api/health to see `"database":"connected"`.

## 4. Run the frontend (new terminal)

```bash
cd frontend
npm install
# frontend/.env is already included (API address http://localhost:5000/api)
npm run dev                 # opens http://localhost:5173
```

## Demo customer credentials (created automatically on first start)

| Role | Email | Password |
|---|---|---|
| User | user@shop.com | User@123 |
| User | priya@shop.com | Priya@123 |

You can also register new users. They always get the "user" role.

## API endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | Public | Register a user |
| POST | /api/auth/login | Public | Login, returns JWT |
| GET | /api/users/profile | User | Get own profile |
| PUT | /api/users/profile | User | Update own profile / password |
| GET | /api/products?keyword=&category= | Public | List, search and filter products |
| GET | /api/products/categories | Public | List categories |
| GET | /api/products/:id | Public | Product details |
| POST | /api/products | Admin | Add product |
| PUT | /api/products/:id | Admin | Edit product |
| DELETE | /api/products/:id | Admin | Delete product |
| POST | /api/orders | User | Place order (Cash on Delivery) |
| GET | /api/orders/myorders | User | Own order history |
| GET | /api/orders/:id | Owner/Admin | Single order |
| GET | /api/admin/stats | Admin | Totals + recent orders |
| GET | /api/admin/users | Admin | All users |
| GET | /api/admin/orders | Admin | All orders |
| PUT | /api/admin/orders/:id/status | Admin | Update order status |

## Testing checklist

**As a customer** (log in as user@shop.com, or register):
1. Home shows categories and products. Products page: search "watch", then click a category pill.
2. Open a product, change quantity, click Add to cart. The navbar cart badge updates.
3. Cart: use + and -, remove an item, check that the subtotal and total change.
4. Checkout: fill the address, place the order. You land on the confirmation page.
5. My Orders shows the order with the tracker at "Pending". My Account lets you edit your profile.
6. Logged out, clicking My Orders or Checkout sends you to Login.

**As admin** (after running `npm run provision-admin`):
1. You are redirected to the Admin Dashboard: totals for products, users and orders.
2. Add Product, Edit Product, Delete Product from Manage Products.
3. Manage Orders: change an order's status to Processing, Shipped, Delivered.
4. Log back in as the customer: My Orders now shows the new status.
5. Users page lists all registered users.
6. As a customer, open http://localhost:5173/admin. You are sent back to Home.

## Troubleshooting

| Problem | Fix |
|---|---|
| `MongoDB connection error` | Check that MongoDB is running (local) or the Atlas user, password, IP access and URI (Atlas). |
| Port 5000 already in use (common on macOS) | Change `PORT` in `backend/.env` to 5001 and `VITE_API_URL` in `frontend/.env` to `http://localhost:5001/api`. Restart both servers. |
| Products page shows a network error | The backend is not running, or `VITE_API_URL` does not match the backend port. Restart `npm run dev` after editing `.env` files. |
| CORS error in browser console | `CLIENT_URL` in `backend/.env` must equal the frontend address (http://localhost:5173). |
| Login says invalid credentials | Confirm the email and password. For admin access, check `ADMIN_INITIAL_PASSWORD` and run `npm run provision-admin` from `backend/`. Do not run `npm run seed` to fix login; it resets database collections. |
| Images do not load | Seed images come from placehold.co and need internet. Product images are plain URLs, so you can paste any image URL when editing a product. |

## Design notes
- The cart is kept in the browser (localStorage), and the order is saved to MongoDB at checkout. There is no Cart collection.
- Order prices and stock are checked on the server, so a customer cannot change a price from the browser.
- Currency symbol: edit `frontend/src/utils/format.js`.
