# TravelHub - Full-Stack Travel Booking & Comparison Platform

A functional, modern, and locally runnable travel comparison and booking platform built with **React** and **Node.js/Express**.

---

## 🌟 Key Features

1. **Flight Search & Comparison**:
   - Multi-airline flight search across major airports (DEL, BOM, BLR, HYD, GOI, MAA, CCU, PNQ, JAI).
   - Filter by stops (Non-stop, 1 Stop, 2+ Stops), departure time slots (Morning, Afternoon, Evening), airlines, and price range.
   - Dynamic sorting by Recommended, Cheapest, Fastest, and Best Value.
   - Cabin class selection (Economy, Premium Economy, Business, First Class) and traveller counters (Adults, Children, Infants).

2. **Hotel Stays & Resorts**:
   - Destination search with check-in / check-out date arithmetic.
   - Star rating filters (5★, 4★, 3★), guest rating filters, amenities tags, and price slider.
   - Room and night multipliers with automated GST & tax calculations.

3. **Car Rentals & Drive**:
   - Vehicle category selector (Economy, Sedan, SUV, Luxury) with transmission filters (Manual, Automatic).
   - Protection plan toggles (Basic Included vs. Full Protection / Zero Excess).
   - Rental duration calculations and instant vehicle vouchers.

4. **Multi-Currency System**:
   - Live conversion across **INR (₹)**, **USD ($)**, **EUR (€)**, and **GBP (£)**.
   - Global currency selector in the header and footer with persistent localStorage state.
   - Real-time price formatting across all search cards, details pages, and booking summaries.

5. **Complete Checkout & Confirmation Flow**:
   - Guest and passenger details form with validation.
   - Payment method selector (Credit/Debit Card, UPI / QR, Net Banking).
   - Real backend `POST /api/bookings` creation generating unique Confirmation Numbers (e.g. `CONF-XYZ...`) and booking references.
   - Printable ticket and voucher view with direct "View in My Trips" navigation.

6. **Trip Management & Booking Tracking**:
   - Displays all confirmed reservations synced across flights, hotels, and cars.
   - Tab filtering for All, Upcoming, and Completed bookings.
   - Cancellation feature with backend sync (`DELETE /api/trips/:id`).

7. **Authentication & Profile**:
   - Secure registration and login using `bcryptjs` password hashing and `jsonwebtoken` (JWT).
   - Pre-seeded demo account:
     - **Email**: `demo@travelbooking.com`
     - **Password**: `demo123`
   - Profile management with edit and update capabilities.

---

## 🏗️ Architecture & Ports

- **Frontend**: React 18 SPA (port **3000**)
- **Backend API**: Express / Node.js ESM (port **5001**)
  - *Note: Avoids macOS AirPlay port 5000 conflict.*
  - Supports dual-mode routing: `/api/*` and direct `/*`.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v26)
- **npm** v9+

### 2. Environment Variables

**Backend (`backend/.env`)**:
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=supersecret_jwt_key_travel_hub_2026
FRONTEND_URL=http://localhost:3000
```

**Frontend (`frontend/.env`)**:
```env
REACT_APP_API_URL=http://localhost:5001
```

### 3. Start Both Servers

**Option A: From Root Directory**
```bash
# Start backend on port 5001
npm run start:backend

# In a separate terminal, start frontend on port 3000
npm run start:frontend
```

**Option B: Independent Directory Execution**
```bash
# Backend
cd backend
npm start

# Frontend (in another terminal)
cd frontend
npm start
```

Visit **http://localhost:3000** in your browser.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check |
| `POST` | `/api/auth/login` | User authentication (returns JWT & user profile) |
| `POST` | `/api/auth/signup` | Register new user with bcrypt-hashed password |
| `GET` | `/api/auth/profile` | Retrieve authenticated user profile |
| `PUT` | `/api/auth/profile` | Update profile information |
| `POST` | `/api/flights/search` | Search flights by origin, destination, and dates |
| `GET` | `/api/flights` | Retrieve all flights |
| `GET` | `/api/flights/:id` | Get flight by ID |
| `POST` | `/api/hotels/search` | Search hotels by location, guests, and dates |
| `GET` | `/api/hotels` | Retrieve all hotels |
| `GET` | `/api/hotels/:id` | Get hotel by ID |
| `POST` | `/api/cars/search` | Search rental vehicles by location and dates |
| `GET` | `/api/cars` | Retrieve all cars |
| `GET` | `/api/cars/:id` | Get car by ID |
| `POST` | `/api/bookings` | Create confirmed booking and sync to trips |
| `GET` | `/api/bookings` | Get user bookings |
| `GET` | `/api/trips` | Get all user trips and upcoming itineraries |
| `DELETE` | `/api/trips/:id` | Cancel reservation |

---

## 🧪 Testing the Flows

1. **Flight Search**: Go to Home, select `From: HYD`, `To: DEL`, and click **Search Flights**.
2. **Filter & Sort**: Filter by "Non-stop" or adjust the price slider.
3. **Currency Switch**: Switch currency in the top navbar to **USD ($)** or **EUR (€)** and observe instant price re-calculation.
4. **Checkout**: Select a flight, click **Proceed to Booking**, enter guest details, and click **Pay & Confirm**.
5. **Voucher & Trips**: Review the confirmed ticket receipt with confirmation code, then click **View in My Trips** to see your active booking.
6. **Hotel & Car Search**: Navigate to the **Hotels** or **Cars** tabs to complete hotel reservations or car rentals.
