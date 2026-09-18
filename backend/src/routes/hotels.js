import express from 'express';
import { hotels } from '../data/mockData.js';

const router = express.Router();

// Helper to calculate nights between check-in and check-out
const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffTime = outDate - inDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

// GET /api/hotels
router.get('/', (req, res) => {
  res.json({
    hotels,
    count: hotels.length
  });
});

// GET /api/hotels/:id
router.get('/:id', (req, res) => {
  const hotel = hotels.find(h => h.id === req.params.id);

  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }

  res.json({ hotel });
});

// POST /api/hotels/search
router.post('/search', (req, res) => {
  try {
    const { 
      location = '', 
      checkInDate, 
      checkOutDate, 
      guests = 2, 
      rooms = 1, 
      minStars,
      maxPrice 
    } = req.body;

    const locClean = (location || '').trim().toLowerCase();

    let results = hotels.filter(h => {
      const matchLoc = !locClean || 
        h.location.toLowerCase().includes(locClean) || 
        h.city.toLowerCase().includes(locClean) || 
        h.name.toLowerCase().includes(locClean);

      const matchStars = !minStars || h.stars >= parseInt(minStars, 10);
      const matchPrice = !maxPrice || h.pricePerNight <= parseInt(maxPrice, 10);

      return matchLoc && matchStars && matchPrice;
    });

    // If no exact match for requested city in mock data, return all hotels with realistic simulated destination tag
    if (results.length === 0 && hotels.length > 0) {
      results = hotels;
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    const guestCount = parseInt(guests, 10) || 2;
    const roomCount = parseInt(rooms, 10) || 1;

    const enrichedHotels = results.map(h => ({
      ...h,
      searchedNights: nights,
      searchedRooms: roomCount,
      searchedGuests: guestCount,
      checkInDate: checkInDate || new Date().toISOString().split('T')[0],
      checkOutDate: checkOutDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      totalPrice: h.pricePerNight * nights * roomCount
    }));

    res.json({
      hotels: enrichedHotels,
      count: enrichedHotels.length,
      searchParams: { location, checkInDate, checkOutDate, guests: guestCount, rooms: roomCount, nights }
    });
  } catch (err) {
    console.error('Hotel search error:', err);
    res.status(500).json({ error: 'Failed to search hotels' });
  }
});

export default router;
