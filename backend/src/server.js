
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import flightRoutes from './routes/flights.js';
import hotelRoutes from './routes/hotels.js';
import carRoutes from './routes/cars.js';
import tripRoutes from './routes/trips.js';
import bookingRoutes from './routes/bookings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --------------------------------------------------
// CORS CONFIGURATION
// --------------------------------------------------

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',

  // Vercel frontend domains
  'https://travel-hub-flax-five.vercel.app',
  'https://travel-hub-git-main-tech-vengers.vercel.app',
  'https://travel-6kf8c3di6-tech-vengers.vercel.app',
  'https://travel-pxt4coyrm-tech-vengers.vercel.app',

  // Render/frontend URL from environment variables
  process.env.FRONTEND_URL
].filter(Boolean);

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // Example: Postman, curl, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow listed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Allow localhost during development
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }

      console.log('Blocked CORS origin:', origin);

      return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With'
    ]
  })
);

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(express.json());

// --------------------------------------------------
// HEALTH CHECK ROUTES
// --------------------------------------------------

const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'travel-booking-backend',
    timestamp: new Date().toISOString(),
    port: PORT
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Flight routes
app.use('/api/flights', flightRoutes);
app.use('/flights', flightRoutes);

// Hotel routes
app.use('/api/hotels', hotelRoutes);
app.use('/hotels', hotelRoutes);

// Car routes
app.use('/api/cars', carRoutes);
app.use('/cars', carRoutes);

// Trip routes
app.use('/api/trips', tripRoutes);
app.use('/trips', tripRoutes);

// Booking routes
app.use('/api/bookings', bookingRoutes);
app.use('/bookings', bookingRoutes);

// --------------------------------------------------
// ROOT ROUTE
// --------------------------------------------------

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'TravelHub backend is running',
    health: '/health'
  });
});

// --------------------------------------------------
// 404 ERROR HANDLER
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.url}`,
    status: 404
  });
});

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err.message);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`TravelHub backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(
    `Frontend URL: ${process.env.FRONTEND_URL || 'Not configured'}`
  );
});