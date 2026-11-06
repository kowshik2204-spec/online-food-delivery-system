# Online Food Delivery System (FoodExpress)

React + Vite project with two modules, using Local Storage as the data store.

## Modules
**User** – sign up / log in, browse menu by category, add to cart, place an order with a delivery address, track order status.
**Admin** – dashboard stats, add / edit / delete menu items, view all orders and update their status, view registered users.

## Login & Signup (Local Storage)
- Users sign up on `/signup` (stored in Local Storage), then are logged in automatically.
- Seeded admin account: **admin@food.com / admin123**
- Routes are protected by role (`/user`, `/admin`).
- Note: passwords are stored in plain text for this academic demo only.

## Run locally
```bash
npm install
npm run dev
```

## Deploy on Vercel
1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New → Project**, import the repo (Framework Preset: Vite).
3. Build command `npm run build`, output directory `dist`, then **Deploy**.
`vercel.json` already rewrites all routes to `index.html` so page refreshes work.
