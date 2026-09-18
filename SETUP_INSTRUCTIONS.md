# TravelHub Travel Booking Platform - Setup Instructions

## Quick Start

### Prerequisites
- Node.js v16 or higher
- npm v8 or higher

### Backend Setup (Terminal 1)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the backend server
npm run dev
```

Backend will start on http://localhost:5001

### Frontend Setup (Terminal 2)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file  
cp .env.example .env

# Start the frontend application
npm start
```

Frontend will start on http://localhost:3000

## Project Architecture

### Backend (Express.js)
- **Port**: 5000
- **API Routes**:
  - `/api/health` - Server health check
  - `/api/auth/` - Authentication endpoints
  - `/api/flights/` - Flight search and details
  - `/api/hotels/` - Hotel search and details
  - `/api/cars/` - Car rental search
  - `/api/trips/` - Trip management
  - `/api/bookings/` - Booking management

### Frontend (React + Router)
- **Port**: 3000
- **Pages**:
  - `/` - Home page with search
  - `/login` - Login page
  - `/signup` - Sign up page
  - `/profile` - User profile
  - `/flights` - Flights search page
  - `/flights/results` - Flight results
  - `/hotels` - Hotels search
  - `/cars` - Car rental search
  - `/trips` - Trip planner
  - `/help` - Help & support

## Testing the Application

### Demo Credentials
- Email: `demo@travelbooking.com`
- Password: `demo123`

### Test Workflows

#### 1. Flight Search
1. Go to home page
2. Select "Flights" tab
3. Adjust search parameters (pre-filled)
4. Click "Search Flights"
5. View results and filtering

#### 2. Authentication
1. Click "Sign In" button
2. Use demo credentials above
3. View profile page
4. Edit profile information
5. Sign out

#### 3. Hotels & Cars
1. Navigate using top navigation
2. Explore search interfaces
3. View booking flows

## Development

### File Structure
```
travel-booking/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express app
│   │   ├── routes/                # API endpoints
│   │   │   ├── auth.js
│   │   │   ├── flights.js
│   │   │   ├── hotels.js
│   │   │   ├── cars.js
│   │   │   ├── trips.js
│   │   │   └── bookings.js
│   │   └── data/
│   │       └── mockData.js        # Mock database
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Header/
│   │   │   └── Footer/
│   │   ├── pages/                 # Page components
│   │   │   ├── Home/
│   │   │   ├── Auth/
│   │   │   ├── Flights/
│   │   │   ├── Hotels/
│   │   │   ├── Cars/
│   │   │   ├── Trips/
│   │   │   ├── Help/
│   │   │   ├── Booking/
│   │   │   └── NotFound/
│   │   ├── context/               # React Context providers
│   │   │   └── AuthContext.js
│   │   ├── services/              # API client services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── flightService.js
│   │   │   ├── hotelService.js
│   │   │   └── carService.js
│   │   ├── styles/                # Global styles
│   │   │   └── globals.css
│   │   ├── App.js                 # Root component
│   │   └── index.js               # Entry point
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
│
├── README.md                       # Project documentation
└── SETUP_INSTRUCTIONS.md           # This file

```

## Environment Configuration

### Backend (.env)
```
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key_here
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5001
```

## Common Issues

### Backend won't start
- Check if port 5001 is already in use
- Ensure Node.js is installed: `node --version`
- Clear node_modules: `rm -rf node_modules && npm install`

### Frontend can't connect to backend
- Ensure backend is running on port 5001
- Check `REACT_APP_API_URL` in .env file
- Check browser console for CORS errors
- Verify backend CORS is configured correctly

### Port already in use
```bash
# Kill process on port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```
Creates optimized production build in `build/` directory

### Backend Production
```bash
cd backend
npm start
```
Set `NODE_ENV=production` in .env

## Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `build/` folder
3. Set environment variable `REACT_APP_API_URL` to production backend URL

### Backend Deployment (Heroku/Railway)
1. Ensure `.env` is NOT committed
2. Set environment variables on deployment platform
3. Deploy using platform-specific method
4. Ensure CORS allows production frontend URL

## API Response Examples

### Flight Search
```bash
POST /api/flights/search
{
  "from": "HYD",
  "to": "DEL",
  "departureDate": "2026-09-18",
  "tripType": "roundtrip",
  "cabin": "economy",
  "adults": 1
}

Response:
{
  "flights": [
    {
      "id": "F001",
      "airline": "Air India",
      "departure": "06:15",
      "arrival": "08:45",
      "price": 5842,
      ...
    }
  ],
  "count": 10,
  "searchParams": {...}
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "demo@travelbooking.com",
  "password": "demo123"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": "user1",
    "email": "demo@travelbooking.com",
    "firstName": "Demo",
    "lastName": "User",
    ...
  }
}
```

## Features Implemented

✅ Responsive design for mobile, tablet, desktop
✅ Authentication (login, signup, profile)
✅ Flight search and filtering
✅ Hotel search interface
✅ Car rental search
✅ Trip management
✅ Modern UI with CSS Grid/Flexbox
✅ Backend API with Express.js
✅ Mock data persistence
✅ Error handling
✅ Loading states

## Features In Development

🚧 Complete flight results with real filtering
🚧 Hotel and car results pages
🚧 Booking summary and confirmation
🚧 Payment integration
🚧 Email notifications
🚧 Admin dashboard
🚧 Database integration (MongoDB/PostgreSQL)

## Support

For issues or questions:
1. Check browser console (F12)
2. Check server logs in terminal
3. Verify .env files are configured correctly
4. Try clearing browser cache and restarting servers

## Next Steps

1. Install dependencies for both frontend and backend
2. Start both servers in separate terminals
3. Open http://localhost:3000 in browser
4. Test demo login or search flights
5. Explore different pages and features
6. Check console for any errors
7. Read README.md for more detailed documentation

Happy traveling! 🌍✈️
