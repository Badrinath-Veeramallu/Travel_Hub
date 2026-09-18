import express from 'express';
import { cars } from '../data/mockData.js';

const router = express.Router();

// Helper to calculate days between dates
const calculateDays = (pickup, dropoff) => {
  if (!pickup || !dropoff) return 1;
  const pDate = new Date(pickup);
  const dDate = new Date(dropoff);
  const diffTime = dDate - pDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

// GET /api/cars
router.get('/', (req, res) => {
  res.json({
    cars,
    count: cars.length
  });
});

// GET /api/cars/:id
router.get('/:id', (req, res) => {
  const car = cars.find(c => c.id === req.params.id);

  if (!car) {
    return res.status(404).json({ error: 'Car rental not found' });
  }

  res.json({ car });
});

// POST /api/cars/search
router.post('/search', (req, res) => {
  try {
    const { 
      pickupLocation = '', 
      dropoffLocation, 
      pickupDate, 
      dropoffDate, 
      driverAge = 25, 
      category 
    } = req.body;

    let results = cars.filter(c => {
      const matchCategory = !category || c.category.toLowerCase() === category.toLowerCase();
      const validAge = !driverAge || driverAge >= 18;
      return matchCategory && validAge;
    });

    if (results.length === 0 && cars.length > 0) {
      results = cars;
    }

    const days = calculateDays(pickupDate, dropoffDate);

    const enrichedCars = results.map(c => ({
      ...c,
      pickupLocation: pickupLocation || 'City Center Pickup',
      dropoffLocation: dropoffLocation || pickupLocation || 'City Center Dropoff',
      pickupDate: pickupDate || new Date().toISOString().split('T')[0],
      dropoffDate: dropoffDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      rentalDays: days,
      totalPrice: c.pricePerDay * days
    }));

    res.json({
      cars: enrichedCars,
      count: enrichedCars.length,
      searchParams: { pickupLocation, dropoffLocation, pickupDate, dropoffDate, driverAge, category, days }
    });
  } catch (err) {
    console.error('Car search error:', err);
    res.status(500).json({ error: 'Failed to search cars' });
  }
});

export default router;
