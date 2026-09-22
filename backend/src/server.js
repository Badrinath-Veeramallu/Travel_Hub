
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

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',

  // Vercel production and deployment domains
  'https://travel-hub-flax-five.vercel.app',
  'https://travel-pxt4coyrm-tech-vengers.vercel.app',
  'https://travel-6kf8c3di6-tech-vengers.vercel.app',

  // Optional Render environment variable
  process.env.FRONTEND_URL
].filter(Boolean);

// Check whether the request origin is allowed
const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  // Allow listed origins
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const url = new URL(origin);

    // Allow localhost during development
    if (
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1'
    ) {
      return true;
    }

    // Allow Vercel deployment and preview domains
    if (
      url.protocol === 'https:' &&
      url.hostname.endsWith('.vercel.app')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked CORS origin:', origin);
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
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
};

// Apply CORS once
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Health check endpoints
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.url}`,
    status: 404
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err.message);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `✈️ Travel Booking API server running on port ${PORT}`
  );

  console.log(
    `📡 Health check available at: http://localhost:${PORT}/health`
  );

  console.log(
    `🌐 Frontend URL: ${
      process.env.FRONTEND_URL || 'Not configured'
    }`
  );
});