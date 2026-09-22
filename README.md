# TravelHub - Full-Stack Travel Booking & Comparison Platform

A functional, modern, and locally runnable travel comparison and booking platform developed using **React** and **Node.js/Express**.

---

## 🌟 Key Features

1. **Flight Search & Comparison**:

   - Multi-airline flight search across major airports (DEL, BOM, BLR, HYD, GOI, MAA, CCU, PNQ, JAI).

   - Filter flights by stops (Non-stop, 1 Stop, 2+ Stops), departure time slots (Morning, Afternoon, Evening), airlines, and price range.

   - Dynamic sorting options including Recommended, Cheapest, Fastest, and Best Value.

   - Cabin class selection (Economy, Premium Economy, Business, First Class) with traveller counters (Adults, Children, Infants).

2. **Hotel Stays & Resorts**:

   - Search destinations with check-in / check-out date calculations.

   - Star rating filters (5★, 4★, 3★), guest rating filters, amenities tags, and price slider.

   - Room and night multipliers with automatic GST & tax calculations.

3. **Car Rentals & Drive**:

   - Vehicle category selector (Economy, Sedan, SUV, Luxury) with transmission filters (Manual, Automatic).

   - Protection plan options (Basic Included vs. Full Protection / Zero Excess).

   - Rental duration calculations and instant vehicle voucher generation.

4. **Multi-Currency System**:

   - Live conversion across **INR (₹)**, **USD ($)**, **EUR (€)**, and **GBP (£)**.

   - Global currency selector available in the header and footer with persistent localStorage state.

   - Real-time price formatting across search cards, details pages, and booking summaries.

5. **Complete Checkout & Confirmation Flow**:

   - Guest and passenger details form with validation.

   - Payment method selector (Credit/Debit Card, UPI / QR, Net Banking).

   - Real backend `POST /api/bookings` creation that generates unique Confirmation Numbers (e.g. `CONF-XYZ...`) and booking references.

   - Printable ticket and voucher view with direct "View in My Trips" navigation.

6. **Trip Management & Booking Tracking**:

   - Displays all confirmed reservations synchronized across flights, hotels, and cars.

   - Tab filtering for All, Upcoming, and Completed bookings.

   - Cancellation feature with backend synchronization (`DELETE /api/trips/:id`).

7. **Authentication & Profile**:

   - Secure registration and login using `bcryptjs` password hashing and `jsonwebtoken` (JWT).

   - Pre-seeded demo account:

     - **Email**: `demo@travelbooking.com`
     - **Password**: `demo123`

   - Profile management with editing and update capabilities.

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

**Backend (`backend/.env`):**

```env
PORT=5001

NODE_ENV=development

JWT_SECRET=supersecret_jwt_key_travel_hub_2026

FRONTEND_URL=http://localhost:3000