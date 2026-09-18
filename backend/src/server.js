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

// Allowed frontend origins for CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    // In local development, permit localhost ports
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed for this origin: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Explicit preflight handling
app.options('*', cors());

// Health check endpoints (both root and /api)
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    service: 'travel-booking-backend',
    timestamp: new Date().toISOString(),
    port: PORT
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Mount routes with and without /api prefix for maximum reliability
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/flights', flightRoutes);
app.use('/flights', flightRoutes);

app.use('/api/hotels', hotelRoutes);
app.use('/hotels', hotelRoutes);

app.use('/api/cars', carRoutes);
app.use('/cars', carRoutes);

app.use('/api/trips', tripRoutes);
app.use('/trips', tripRoutes);

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

app.listen(PORT, () => {
  console.log(`✈️  Travel Booking API server running on port ${PORT}`);
  console.log(`📡 Health check available at: http://localhost:${PORT}/health`);
  console.log(`🌐 Allowed frontend origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
