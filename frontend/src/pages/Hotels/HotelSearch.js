import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import './Hotels.css';

const POPULAR_DESTINATIONS = [
  { city: 'Delhi', state: 'Delhi', desc: 'Historic monuments, lively markets & diplomatic hub', icon: '🏛️', minPrice: 2200 },
  { city: 'Mumbai', state: 'Maharashtra', desc: 'Marine Drive, Bollywood & seaside luxury hotels', icon: '🌊', minPrice: 2500 },
  { city: 'Goa', state: 'Goa', desc: 'Sun-kissed beaches, seaside resorts & nightlife', icon: '🏖️', minPrice: 2800 },
  { city: 'Bangalore', state: 'Karnataka', desc: 'Tech corridors, pleasant weather & gardens', icon: '🌿', minPrice: 1900 },
  { city: 'Jaipur', state: 'Rajasthan', desc: 'Heritage havelis, royal forts & desert culture', icon: '🏰', minPrice: 2100 },
  { city: 'Kolkata', state: 'West Bengal', desc: 'Colonial charm, cultural heritage & cuisine', icon: '🎭', minPrice: 1800 }
];

const TODAY = new Date().toISOString().split('T')[0];
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const THREE_DAYS_LATER = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

export default function HotelSearch() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [form, setForm] = useState({
    location: 'Delhi',
    checkInDate: TOMORROW,
    checkOutDate: THREE_DAYS_LATER,
    guests: 2,
    rooms: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.location) {
      alert('Please specify a destination or hotel name');
      return;
    }
    navigate('/hotels/results', { state: { searchParams: form } });
  };

  const handleQuickDestination = (city) => {
    const searchParams = {
      ...form,
      location: city
    };
    navigate('/hotels/results', { state: { searchParams } });
  };

  return (
    <div className="hotel-search-page">
      <div className="search-page-hero">
        <div className="hero-content">
          <h1>🏨 Stays, Resorts &amp; Hotels</h1>
          <p>Discover handpicked accommodations across top destinations worldwide</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div className="search-card">
          <form onSubmit={handleSearch}>
            <div className="search-fields-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
              <div className="form-group">
                <label>Destination / City</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Where are you going? (e.g. Delhi, Goa, Mumbai)"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Check-in</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={form.checkInDate}
                  min={TODAY}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Check-out</label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={form.checkOutDate}
                  min={form.checkInDate || TODAY}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Guests</label>
                <select name="guests" value={form.guests} onChange={handleChange}>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Rooms</label>
                <select name="rooms" value={form.rooms} onChange={handleChange}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-search-large" style={{ marginTop: '16px' }}>
              🔍 Search Hotels
            </button>
          </form>
        </div>

        {/* Popular Hotel Destinations */}
        <div className="popular-destinations-section" style={{ marginTop: '40px' }}>
          <h2>Popular Hotel Destinations</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Book premier stays with verified guest reviews and instant confirmation
          </p>

          <div className="hotel-destinations-grid">
            {POPULAR_DESTINATIONS.map((dest) => (
              <div
                key={dest.city}
                className="hotel-dest-card"
                onClick={() => handleQuickDestination(dest.city)}
                role="button"
                tabIndex={0}
              >
                <div className="dest-icon">{dest.icon}</div>
                <div className="dest-details">
                  <h3>{dest.city}</h3>
                  <span className="dest-state">{dest.state}</span>
                  <p>{dest.desc}</p>
                  <div className="dest-price-tag">
                    Starting from <strong>{formatPrice(dest.minPrice)}</strong>/night
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hotel Perks Section */}
        <div className="hotel-perks-section" style={{ marginTop: '50px', marginBottom: '60px' }}>
          <h2>Book with Confidence</h2>
          <div className="hotel-perks-grid">
            <div className="perk-box">
              <span className="perk-icon">🏷️</span>
              <h4>Best Rate Guarantee</h4>
              <p>Found a cheaper room elsewhere? We'll match the price with zero questions asked.</p>
            </div>
            <div className="perk-box">
              <span className="perk-icon">💳</span>
              <h4>Reserve Now, Pay at Hotel</h4>
              <p>Enjoy flexible bookings with zero cancellation charges up to 24-48 hours before check-in.</p>
            </div>
            <div className="perk-box">
              <span className="perk-icon">⭐</span>
              <h4>Verified Guest Reviews</h4>
              <p>Read authentic ratings and honest reviews from actual travelers who stayed there.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
