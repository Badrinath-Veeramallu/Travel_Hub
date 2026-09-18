import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { bookings, trips } from '../data/mockData.js';

const router = express.Router();

// GET /api/bookings
router.get('/', (req, res) => {
  const userId = req.query.userId || req.user?.userId;

  if (!userId) {
    return res.json({
      bookings,
      count: bookings.length
    });
  }

  const userBookings = bookings.filter(b => b.userId === userId);

  res.json({
    bookings: userBookings,
    count: userBookings.length
  });
});

// POST /api/bookings
router.post('/', (req, res) => {
  const { 
    userId = 'user1', 
    type, 
    itemId, 
    itemDetails, 
    passengers = [], 
    totalPrice, 
    status = 'confirmed',
    bookingSummary
  } = req.body;

  if (!type || !itemId || totalPrice === undefined) {
    return res.status(400).json({ error: 'Booking type, item ID, and total price are required' });
  }

  const confirmationNumber = 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const newBooking = {
    id: 'bkg_' + uuidv4().slice(0, 8),
    userId,
    type, // 'flight', 'hotel', 'car'
    itemId,
    itemDetails: itemDetails || {},
    passengers: Array.isArray(passengers) ? passengers : [passengers],
    totalPrice,
    status,
    paymentStatus: 'completed',
    confirmationNumber,
    bookingSummary: bookingSummary || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);

  // Sync with Trips so it immediately appears in user's Trips view
  let tripTitle = 'My Trip';
  let destination = 'Travel Destination';
  let startDate = new Date().toISOString().split('T')[0];
  let endDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  if (type === 'flight' && itemDetails) {
    tripTitle = `${itemDetails.destination || itemDetails.toAirport || 'Flight'} Getaway`;
    destination = itemDetails.destination || itemDetails.toAirport || 'Destination';
    startDate = itemDetails.departureDate || startDate;
    endDate = itemDetails.returnDate || startDate;
  } else if (type === 'hotel' && itemDetails) {
    tripTitle = `Stay at ${itemDetails.name || 'Hotel'}`;
    destination = itemDetails.location || itemDetails.city || 'Hotel Stay';
    startDate = itemDetails.checkInDate || startDate;
    endDate = itemDetails.checkOutDate || endDate;
  } else if (type === 'car' && itemDetails) {
    tripTitle = `Rental: ${itemDetails.name || 'Car'}`;
    destination = itemDetails.pickupLocation || 'Road Trip';
    startDate = itemDetails.pickupDate || startDate;
    endDate = itemDetails.dropoffDate || endDate;
  }

  const newTrip = {
    id: 'trip_' + uuidv4().slice(0, 8),
    userId,
    title: tripTitle,
    destination,
    startDate,
    endDate,
    status: 'upcoming',
    flights: type === 'flight' ? [itemDetails] : [],
    hotels: type === 'hotel' ? [itemDetails] : [],
    cars: type === 'car' ? [itemDetails] : [],
    notes: `Confirmed booking ref: ${confirmationNumber}`,
    totalPrice,
    bookingId: confirmationNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  trips.unshift(newTrip);

  res.status(201).json({
    message: 'Booking confirmed successfully',
    booking: newBooking,
    tripId: newTrip.id
  });
});

// GET /api/bookings/:id
router.get('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id || b.confirmationNumber === req.params.id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json({ booking });
});

// PUT /api/bookings/:id
router.put('/:id', (req, res) => {
  const bookingIndex = bookings.findIndex(b => b.id === req.params.id || b.confirmationNumber === req.params.id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const { status, passengers } = req.body;

  if (status) bookings[bookingIndex].status = status;
  if (passengers) bookings[bookingIndex].passengers = passengers;
  bookings[bookingIndex].updatedAt = new Date().toISOString();

  res.json({
    message: 'Booking updated successfully',
    booking: bookings[bookingIndex]
  });
});

export default router;
