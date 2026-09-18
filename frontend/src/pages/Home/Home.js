import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import './Home.css';

const AIRPORTS = [
  { code: 'DEL', name: 'Delhi', label: 'DEL – Indira Gandhi International' },
  { code: 'BOM', name: 'Mumbai', label: 'BOM – Chhatrapati Shivaji International' },
  { code: 'BLR', name: 'Bangalore', label: 'BLR – Kempegowda International' },
  { code: 'HYD', name: 'Hyderabad', label: 'HYD – Rajiv Gandhi International' },
  { code: 'GOI', name: 'Goa', label: 'GOI – Goa International Airport' },
  { code: 'MAA', name: 'Chennai', label: 'MAA – Chennai International' },
  { code: 'CCU', name: 'Kolkata', label: 'CCU – Netaji Subhas Chandra Bose International' },
  { code: 'PNQ', name: 'Pune', label: 'PNQ – Pune Airport' },
  { code: 'JAI', name: 'Jaipur', label: 'JAI – Jaipur International' }
];

const TODAY = new Date().toISOString().split('T')[0];
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const WEEK_LATER = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

export default function Home() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('flights');

  // Traveller dropdown state
  const [showTravellers, setShowTravellers] = useState(false);

  const [flightSearch, setFlightSearch] = useState({
    from: 'HYD',
    to: 'DEL',
    departureDate: TOMORROW,
    returnDate: WEEK_LATER,
    tripType: 'roundtrip',
    adults: 1,
    children: 0,
    infants: 0,
    cabin: 'economy'
  });

  const [hotelSearch, setHotelSearch] = useState({
    location: '',
    checkInDate: TOMORROW,
    checkOutDate: WEEK_LATER,
    guests: 2,
    rooms: 1
  });

  const [carSearch, setCarSearch] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: TOMORROW,
    dropoffDate: WEEK_LATER,
    driverAge: 25
  });

  const handleFlightChange = (e) => {
    const { name, value } = e.target;
    setFlightSearch(prev => ({ ...prev, [name]: value }));
  };

  const totalTravellers = flightSearch.adults + flightSearch.children + flightSearch.infants;
  const travellersLabel = totalTravellers === 1 ? '1 Traveller' : `${totalTravellers} Travellers`;

  const handleFlightSearch = (e) => {
    e.preventDefault();
    if (!flightSearch.departureDate) {
      alert('Please select a departure date');
      return;
    }
    // Get airport labels
    const fromAirport = AIRPORTS.find(a => a.code === flightSearch.from);
    const toAirport = AIRPORTS.find(a => a.code === flightSearch.to);
    const searchParams = {
      ...flightSearch,
      fromLabel: fromAirport ? `${fromAirport.code} (${fromAirport.name})` : flightSearch.from,
      toLabel: toAirport ? `${toAirport.code} (${toAirport.name})` : flightSearch.to
    };
    navigate('/flights/results', { state: { searchParams } });
  };

  const handleHotelSearch = (e) => {
    e.preventDefault();
    if (!hotelSearch.location) {
      alert('Please enter a destination');
      return;
    }
    navigate('/hotels/results', { state: { searchParams: hotelSearch } });
  };

  const handleCarSearch = (e) => {
    e.preventDefault();
    if (!carSearch.pickupLocation) {
      alert('Please enter a pickup location');
      return;
    }
    navigate('/cars/results', { state: { searchParams: carSearch } });
  };

  const popularDestinations = [
    { code: 'DEL', name: 'Delhi', emoji: '🏛️', tag: 'History & Culture', price: 4920 },
    { code: 'BOM', name: 'Mumbai', emoji: '🌊', tag: 'Business & Beaches', price: 5200 },
    { code: 'BLR', name: 'Bangalore', emoji: '🌿', tag: 'Tech Hub & Gardens', price: 4650 },
    { code: 'GOI', name: 'Goa', emoji: '🏖️', tag: 'Beaches & Nightlife', price: 6450 },
    { code: 'JAI', name: 'Jaipur', emoji: '🏰', tag: 'Palaces & Heritage', price: 5100 },
    { code: 'CCU', name: 'Kolkata', emoji: '🎭', tag: 'Art & Literature', price: 5500 }
  ];

  const handleDestinationClick = (dest) => {
    setFlightSearch(prev => ({
      ...prev,
      to: dest.code
    }));
    setActiveTab('flights');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Find Your Perfect Journey</h1>
          <p>Compare flights, hotels &amp; cars from hundreds of providers in one place</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-box">
            {/* Tabs */}
            <div className="search-tabs">
              <button
                className={`tab ${activeTab === 'flights' ? 'active' : ''}`}
                onClick={() => setActiveTab('flights')}
              >
                ✈️ Flights
              </button>
              <button
                className={`tab ${activeTab === 'hotels' ? 'active' : ''}`}
                onClick={() => setActiveTab('hotels')}
              >
                🏨 Hotels
              </button>
              <button
                className={`tab ${activeTab === 'cars' ? 'active' : ''}`}
                onClick={() => setActiveTab('cars')}
              >
                🚗 Cars
              </button>
            </div>

            <div className="search-panel">
              {/* ── FLIGHTS TAB ── */}
              {activeTab === 'flights' && (
                <form onSubmit={handleFlightSearch} className="flight-search-form">
                  <div className="trip-type">
                    <label>
                      <input
                        type="radio"
                        name="tripType"
                        value="roundtrip"
                        checked={flightSearch.tripType === 'roundtrip'}
                        onChange={handleFlightChange}
                      />
                      Round Trip
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="tripType"
                        value="oneway"
                        checked={flightSearch.tripType === 'oneway'}
                        onChange={handleFlightChange}
                      />
                      One Way
                    </label>
                  </div>

                  <div className="search-fields">
                    <div className="form-group">
                      <label>From</label>
                      <select name="from" value={flightSearch.from} onChange={handleFlightChange}>
                        {AIRPORTS.map(a => (
                          <option key={a.code} value={a.code}>{a.code} – {a.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="swap-btn-wrapper">
                      <button
                        type="button"
                        className="swap-btn"
                        onClick={() => setFlightSearch(prev => ({ ...prev, from: prev.to, to: prev.from }))}
                        title="Swap origin & destination"
                      >
                        ⇄
                      </button>
                    </div>

                    <div className="form-group">
                      <label>To</label>
                      <select name="to" value={flightSearch.to} onChange={handleFlightChange}>
                        {AIRPORTS.map(a => (
                          <option key={a.code} value={a.code}>{a.code} – {a.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Departure</label>
                      <input
                        type="date"
                        name="departureDate"
                        value={flightSearch.departureDate}
                        min={TODAY}
                        onChange={handleFlightChange}
                        required
                      />
                    </div>

                    {flightSearch.tripType === 'roundtrip' && (
                      <div className="form-group">
                        <label>Return</label>
                        <input
                          type="date"
                          name="returnDate"
                          value={flightSearch.returnDate}
                          min={flightSearch.departureDate || TODAY}
                          onChange={handleFlightChange}
                        />
                      </div>
                    )}

                    <div className="form-group traveller-group">
                      <label>Travellers &amp; Class</label>
                      <div
                        className="traveller-display"
                        onClick={() => setShowTravellers(!showTravellers)}
                      >
                        {travellersLabel} · {flightSearch.cabin.charAt(0).toUpperCase() + flightSearch.cabin.slice(1)}
                        <span className="dropdown-caret">▾</span>
                      </div>

                      {showTravellers && (
                        <div className="traveller-dropdown">
                          <div className="traveller-row">
                            <div>
                              <div className="traveller-type">Adults</div>
                              <div className="traveller-note">12+ years</div>
                            </div>
                            <div className="counter">
                              <button type="button" onClick={() => setFlightSearch(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}>−</button>
                              <span>{flightSearch.adults}</span>
                              <button type="button" onClick={() => setFlightSearch(p => ({ ...p, adults: Math.min(9, p.adults + 1) }))}>+</button>
                            </div>
                          </div>
                          <div className="traveller-row">
                            <div>
                              <div className="traveller-type">Children</div>
                              <div className="traveller-note">2–11 years</div>
                            </div>
                            <div className="counter">
                              <button type="button" onClick={() => setFlightSearch(p => ({ ...p, children: Math.max(0, p.children - 1) }))}>−</button>
                              <span>{flightSearch.children}</span>
                              <button type="button" onClick={() => setFlightSearch(p => ({ ...p, children: Math.min(9, p.children + 1) }))}>+</button>
                            </div>
                          </div>
                          <div className="traveller-row">
                            <div>
                              <div className="traveller-type">Infants</div>
                              <div className="traveller-note">Under 2 years</div>
                            </div>
                            <div className="counter">
                              <button type="button" onClick={() => setFlightSearch(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))}>−</button>
                              <span>{flightSearch.infants}</span>
                              <button type="button" onClick={() => setFlightSearch(p => ({ ...p, infants: Math.min(flightSearch.adults, p.infants + 1) }))}>+</button>
                            </div>
                          </div>
                          <div className="traveller-row cabin-row">
                            <label>Cabin Class</label>
                            <select name="cabin" value={flightSearch.cabin} onChange={handleFlightChange}>
                              <option value="economy">Economy</option>
                              <option value="premium-economy">Premium Economy</option>
                              <option value="business">Business</option>
                              <option value="first">First Class</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '8px' }}
                            onClick={() => setShowTravellers(false)}
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-search">
                    🔍 Search Flights
                  </button>
                </form>
              )}

              {/* ── HOTELS TAB ── */}
              {activeTab === 'hotels' && (
                <form onSubmit={handleHotelSearch} className="hotel-search-form">
                  <div className="search-fields">
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Destination</label>
                      <input
                        type="text"
                        placeholder="City, area or hotel name"
                        value={hotelSearch.location}
                        onChange={e => setHotelSearch(p => ({ ...p, location: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-in</label>
                      <input
                        type="date"
                        value={hotelSearch.checkInDate}
                        min={TODAY}
                        onChange={e => setHotelSearch(p => ({ ...p, checkInDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-out</label>
                      <input
                        type="date"
                        value={hotelSearch.checkOutDate}
                        min={hotelSearch.checkInDate || TODAY}
                        onChange={e => setHotelSearch(p => ({ ...p, checkOutDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Guests</label>
                      <select value={hotelSearch.guests} onChange={e => setHotelSearch(p => ({ ...p, guests: parseInt(e.target.value) }))}>
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Rooms</label>
                      <select value={hotelSearch.rooms} onChange={e => setHotelSearch(p => ({ ...p, rooms: parseInt(e.target.value) }))}>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-search">
                    🔍 Search Hotels
                  </button>
                </form>
              )}

              {/* ── CARS TAB ── */}
              {activeTab === 'cars' && (
                <form onSubmit={handleCarSearch} className="car-search-form">
                  <div className="search-fields">
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Pickup Location</label>
                      <input
                        type="text"
                        placeholder="City, airport or address"
                        value={carSearch.pickupLocation}
                        onChange={e => setCarSearch(p => ({ ...p, pickupLocation: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Drop-off Location</label>
                      <input
                        type="text"
                        placeholder="Same as pickup or different"
                        value={carSearch.dropoffLocation}
                        onChange={e => setCarSearch(p => ({ ...p, dropoffLocation: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Pickup Date</label>
                      <input
                        type="date"
                        value={carSearch.pickupDate}
                        min={TODAY}
                        onChange={e => setCarSearch(p => ({ ...p, pickupDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Return Date</label>
                      <input
                        type="date"
                        value={carSearch.dropoffDate}
                        min={carSearch.pickupDate || TODAY}
                        onChange={e => setCarSearch(p => ({ ...p, dropoffDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Driver Age</label>
                      <select value={carSearch.driverAge} onChange={e => setCarSearch(p => ({ ...p, driverAge: parseInt(e.target.value) }))}>
                        <option value={18}>18–24</option>
                        <option value={25}>25–64</option>
                        <option value={65}>65+</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-search">
                    🔍 Search Cars
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Destinations</h2>
            <p>Explore top destinations with great flight deals</p>
          </div>
          <div className="destinations-grid">
            {popularDestinations.map(dest => (
              <div
                key={dest.code}
                className="destination-card"
                onClick={() => handleDestinationClick(dest)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleDestinationClick(dest)}
              >
                <div className="dest-emoji">{dest.emoji}</div>
                <div className="dest-info">
                  <h3>{dest.name}</h3>
                  <p>{dest.tag}</p>
                  <div className="dest-price">
                    From {formatPrice(dest.price)}
                    <span className="est-label"> est.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why TravelHub */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose TravelHub?</h2>
          <div className="features-grid">
            {[
              { icon: '💰', title: 'Best Price Guarantee', desc: 'Compare hundreds of airlines, hotels, and car providers to find the lowest price.' },
              { icon: '⚡', title: 'Instant Confirmation', desc: 'Book in seconds and receive instant confirmation on your mobile or email.' },
              { icon: '🛡️', title: 'Secure Booking', desc: 'Your payment and personal data are protected with industry-leading encryption.' },
              { icon: '🕐', title: '24/7 Support', desc: 'Our travel specialists are available around the clock to assist you.' }
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready for Your Next Adventure?</h2>
          <p>Join thousands of travelers booking their perfect trips every day</p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large" onClick={() => { setActiveTab('flights'); window.scrollTo({ top: 300, behavior: 'smooth' }); }}>
              Search Flights
            </button>
            <button className="btn btn-outline btn-large" onClick={() => navigate('/signup')}>
              Sign Up Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
