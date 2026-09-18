import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { trips } from '../data/mockData.js';

const router = express.Router();

// GET /api/trips
router.get('/', (req, res) => {
  const userId = req.query.userId || req.user?.userId;

  if (!userId) {
    // If no userId query param provided, return all demo trips
    return res.json({
      trips,
      count: trips.length
    });
  }

  const userTrips = trips.filter(t => t.userId === userId);

  res.json({
    trips: userTrips,
    count: userTrips.length
  });
});

// POST /api/trips
router.post('/', (req, res) => {
  const { 
    userId = 'user1', 
    title, 
    destination, 
    startDate, 
    endDate, 
    flights = [], 
    hotels = [], 
    cars = [], 
    notes = '',
    totalPrice = 0
  } = req.body;

  if (!destination || !startDate || !endDate) {
    return res.status(400).json({ error: 'Destination, start date, and end date are required' });
  }

  const newTrip = {
    id: 'trip_' + uuidv4().slice(0, 8),
    userId,
    title: title || `${destination} Trip`,
    destination,
    startDate,
    endDate,
    status: 'upcoming',
    flights: Array.isArray(flights) ? flights : [],
    hotels: Array.isArray(hotels) ? hotels : [],
    cars: Array.isArray(cars) ? cars : [],
    notes: notes || '',
    totalPrice: totalPrice || 0,
    bookingId: 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  trips.unshift(newTrip);

  res.status(201).json({
    message: 'Trip created successfully',
    trip: newTrip
  });
});

// GET /api/trips/:id
router.get('/:id', (req, res) => {
  const trip = trips.find(t => t.id === req.params.id);

  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  res.json({ trip });
});

// PUT /api/trips/:id
router.put('/:id', (req, res) => {
  const tripIndex = trips.findIndex(t => t.id === req.params.id);

  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const { title, destination, startDate, endDate, flights, hotels, cars, notes, status, totalPrice } = req.body;

  if (title) trips[tripIndex].title = title;
  if (destination) trips[tripIndex].destination = destination;
  if (startDate) trips[tripIndex].startDate = startDate;
  if (endDate) trips[tripIndex].endDate = endDate;
  if (flights) trips[tripIndex].flights = flights;
  if (hotels) trips[tripIndex].hotels = hotels;
  if (cars) trips[tripIndex].cars = cars;
  if (notes !== undefined) trips[tripIndex].notes = notes;
  if (status) trips[tripIndex].status = status;
  if (totalPrice !== undefined) trips[tripIndex].totalPrice = totalPrice;

  trips[tripIndex].updatedAt = new Date().toISOString();

  res.json({
    message: 'Trip updated successfully',
    trip: trips[tripIndex]
  });
});

// DELETE /api/trips/:id
router.delete('/:id', (req, res) => {
  const tripIndex = trips.findIndex(t => t.id === req.params.id);

  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const deletedTrip = trips.splice(tripIndex, 1)[0];

  res.json({
    message: 'Trip deleted successfully',
    trip: deletedTrip
  });
});

export default router;
