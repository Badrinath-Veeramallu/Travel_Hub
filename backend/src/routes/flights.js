import express from 'express';
import { flights } from '../data/mockData.js';

const router = express.Router();

// Helper to normalize search text (e.g. "HYD (Hyderabad)" -> "hyd", "delhi" -> "delhi")
const normalize = (text) => {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Generates dynamic flights for any arbitrary route entered in demo mode
const generateDynamicFlights = (from, to, departureDate, cabinClass = 'economy') => {
  const airlines = [
    { name: 'IndiGo', code: '6E', base: 4800, craft: 'Airbus A321neo', rating: 4.5 },
    { name: 'Air India', code: 'AI', base: 5400, craft: 'Airbus A320', rating: 4.2 },
    { name: 'Vistara', code: 'UK', base: 6900, craft: 'Boeing 787 Dreamliner', rating: 4.8 },
    { name: 'SpiceJet', code: 'SG', base: 4100, craft: 'Boeing 737-800', rating: 3.8 }
  ];

  const times = [
    { dep: '06:15', arr: '08:45', dur: '2h 30m', mins: 150, stops: 0, stopDetails: 'Direct flight' },
    { dep: '09:30', arr: '12:10', dur: '2h 40m', mins: 160, stops: 0, stopDetails: 'Direct flight' },
    { dep: '14:00', arr: '18:15', dur: '4h 15m', mins: 255, stops: 1, stopDetails: '1 stop (1h layover)' },
    { dep: '19:45', arr: '22:15', dur: '2h 30m', mins: 150, stops: 0, stopDetails: 'Direct flight' }
  ];

  return airlines.map((airline, idx) => {
    const t = times[idx % times.length];
    const basePrice = airline.base + (idx * 250);
    const taxes = Math.round(basePrice * 0.18);
    const price = basePrice + taxes;

    return {
      id: `DF_${Date.now()}_${idx + 1}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code} ${Math.floor(100 + Math.random() * 899)}`,
      departure: t.dep,
      departureTime: t.dep,
      arrival: t.arr,
      arrivalTime: t.arr,
      departureDate: departureDate || new Date().toISOString().split('T')[0],
      duration: t.dur,
      durationMinutes: t.mins,
      stops: t.stops,
      stopDetails: t.stopDetails,
      fromAirport: from,
      origin: from,
      toAirport: to,
      destination: to,
      price,
      basePrice,
      taxes,
      currency: 'INR',
      baggage: cabinClass === 'business' ? '30kg check-in, 10kg cabin' : '15kg check-in, 7kg cabin',
      cabin: cabinClass || 'economy',
      seatsAvailable: Math.floor(3 + Math.random() * 12),
      provider: airline.name,
      rating: airline.rating,
      lastChecked: Math.floor(1 + Math.random() * 10),
      aircraft: airline.craft
    };
  });
};

// GET /api/flights
router.get('/', (req, res) => {
  res.json({
    flights,
    count: flights.length
  });
});

// GET /api/flights/:id
router.get('/:id', (req, res) => {
  let flight = flights.find(f => f.id === req.params.id);

  // If dynamic flight ID lookup
  if (!flight && req.params.id.startsWith('DF_')) {
    flight = {
      id: req.params.id,
      airline: 'IndiGo',
      airlineCode: '6E',
      flightNumber: '6E 542',
      departure: '08:30',
      departureTime: '08:30',
      arrival: '11:00',
      arrivalTime: '11:00',
      departureDate: new Date().toISOString().split('T')[0],
      duration: '2h 30m',
      durationMinutes: 150,
      stops: 0,
      stopDetails: 'Direct flight',
      fromAirport: 'Origin Airport',
      origin: 'Origin Airport',
      toAirport: 'Destination Airport',
      destination: 'Destination Airport',
      price: 5499,
      basePrice: 4400,
      taxes: 1099,
      currency: 'INR',
      baggage: '15kg check-in, 7kg cabin',
      cabin: 'economy',
      seatsAvailable: 6,
      provider: 'IndiGo',
      rating: 4.4,
      lastChecked: 2,
      aircraft: 'Airbus A320neo'
    };
  }

  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }

  res.json({ flight });
});

// POST /api/flights/search
router.post('/search', (req, res) => {
  try {
    const { 
      from, 
      to, 
      departureDate, 
      returnDate, 
      tripType = 'oneway', 
      cabin = 'economy', 
      adults = 1, 
      children = 0, 
      infants = 0 
    } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: 'Origin (from) and Destination (to) are required.' });
    }

    const normFrom = normalize(from);
    const normTo = normalize(to);

    // Search existing flights database
    let matches = flights.filter(f => {
      const fromMatch = 
        normalize(f.fromAirport).includes(normFrom) ||
        normalize(f.fromCity).includes(normFrom) ||
        normalize(f.fromCode).includes(normFrom) ||
        normFrom.includes(normalize(f.fromCode));

      const toMatch = 
        normalize(f.toAirport).includes(normTo) ||
        normalize(f.toCity).includes(normTo) ||
        normalize(f.toCode).includes(normTo) ||
        normTo.includes(normalize(f.toCode));

      return fromMatch && toMatch;
    });

    // If no static match, generate realistic demo flights for the given city pair
    if (matches.length === 0) {
      matches = generateDynamicFlights(from, to, departureDate, cabin);
    }

    // Assign search date and calculate passenger-adjusted prices
    const adultCount = Math.max(1, parseInt(adults, 10) || 1);
    const childCount = Math.max(0, parseInt(children, 10) || 0);
    const infantCount = Math.max(0, parseInt(infants, 10) || 0);

    // Passenger multiplier: full fare for adult, 75% for child, 10% for infant
    const passengerMultiplier = adultCount + (childCount * 0.75) + (infantCount * 0.1);

    const formattedResults = matches.map(f => {
      const singlePrice = f.basePrice + f.taxes;
      const calculatedTotalPrice = Math.round(singlePrice * passengerMultiplier);
      const calculatedBaseFare = Math.round(f.basePrice * passengerMultiplier);
      const calculatedTaxes = calculatedTotalPrice - calculatedBaseFare;

      return {
        ...f,
        departureDate: departureDate || f.departureDate,
        returnDate: tripType === 'roundtrip' ? returnDate : null,
        departureTime: f.departureTime || f.departure,
        arrivalTime: f.arrivalTime || f.arrival,
        origin: f.origin || f.fromAirport,
        destination: f.destination || f.toAirport,
        singleAdultPrice: singlePrice,
        price: calculatedTotalPrice,
        basePrice: calculatedBaseFare,
        taxes: calculatedTaxes,
        currency: 'INR',
        passengers: {
          adults: adultCount,
          children: childCount,
          infants: infantCount,
          total: adultCount + childCount + infantCount
        }
      };
    });

    res.json({
      flights: formattedResults,
      count: formattedResults.length,
      searchParams: { 
        from, 
        to, 
        departureDate, 
        returnDate, 
        tripType, 
        cabin,
        adults: adultCount,
        children: childCount,
        infants: infantCount
      }
    });
  } catch (err) {
    console.error('Flight search error:', err);
    res.status(500).json({ error: 'Failed to search flights. Please try again.' });
  }
});

export default router;
