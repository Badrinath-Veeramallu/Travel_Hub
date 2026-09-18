import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import './Cars.css';

const CAR_CATEGORIES = [
  { name: 'Economy & Compact', desc: 'Agile & fuel-efficient, ideal for quick city navigation', icon: '🚗', startingPrice: 1200 },
  { name: 'Sedan & Comfort', desc: 'Spacious trunk & superior ride quality for family trips', icon: '🚙', startingPrice: 1700 },
  { name: 'SUVs & All-Terrain', desc: 'Commanding seating, robust power & expansive luggage space', icon: '🛻', startingPrice: 2400 },
  { name: 'Luxury & Executive', desc: 'Premium interiors, top performance & executive chauffeuring', icon: '✨', startingPrice: 4200 }
];

const TODAY = new Date().toISOString().split('T')[0];
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const FOUR_DAYS_LATER = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];

export default function CarSearch() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [form, setForm] = useState({
    pickupLocation: 'Delhi',
    dropoffLocation: '',
    pickupDate: TOMORROW,
    dropoffDate: FOUR_DAYS_LATER,
    category: '',
    driverAge: 25
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!form.pickupLocation) {
      alert('Please specify a pickup location or city');
      return;
    }
    navigate('/cars/results', { state: { searchParams: form } });
  };

  const handleCategorySelect = (category) => {
    navigate('/cars/results', {
      state: {
        searchParams: {
          ...form,
          category
        }
      }
    });
  };

  return (
    <div className="car-search-page">
      <div className="search-page-hero">
        <div className="hero-content">
          <h1>🚗 Car Rentals &amp; Drive Options</h1>
          <p>Find the best rental rates from trusted providers with unlimited mileage options</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div className="search-card">
          <form onSubmit={handleSearch}>
            <div className="search-fields-grid" style={{ gridTemplateColumns: '2fr 2fr 1.2fr 1.2fr 1fr' }}>
              <div className="form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  name="pickupLocation"
                  placeholder="City, airport, or train station"
                  value={form.pickupLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Drop-off Location (Optional)</label>
                <input
                  type="text"
                  name="dropoffLocation"
                  placeholder="Same as pickup or different"
                  value={form.dropoffLocation}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Pickup Date</label>
                <input
                  type="date"
                  name="pickupDate"
                  value={form.pickupDate}
                  min={TODAY}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Drop-off Date</label>
                <input
                  type="date"
                  name="dropoffDate"
                  value={form.dropoffDate}
                  min={form.pickupDate || TODAY}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Driver Age</label>
                <select name="driverAge" value={form.driverAge} onChange={handleChange}>
                  <option value={21}>21 - 24</option>
                  <option value={25}>25 - 65</option>
                  <option value={66}>66+</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-search-large" style={{ marginTop: '16px' }}>
              🔍 Search Available Cars
            </button>
          </form>
        </div>

        {/* Vehicle Classes */}
        <div className="car-categories-section" style={{ marginTop: '40px' }}>
          <h2>Explore by Vehicle Class</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Choose the vehicle that fits your travel style and group size
          </p>

          <div className="car-categories-grid">
            {CAR_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                className="category-card"
                onClick={() => handleCategorySelect(cat.name.split(' ')[0])}
                role="button"
                tabIndex={0}
              >
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                  <div className="cat-price">
                    From <strong>{formatPrice(cat.startingPrice)}</strong>/day
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Car Perks */}
        <div className="car-perks-section" style={{ marginTop: '50px', marginBottom: '60px' }}>
          <h2>Why Rent with TravelHub?</h2>
          <div className="car-perks-grid">
            <div className="perk-box">
              <span className="perk-icon">⚡</span>
              <h4>Zero Hidden Charges</h4>
              <p>All taxes, vehicle registration fees, and standard insurance coverages are included upfront.</p>
            </div>
            <div className="perk-box">
              <span className="perk-icon">🛡️</span>
              <h4>Free Cancellation</h4>
              <p>Modify or cancel your reservation without penalties up to 24 hours prior to pickup time.</p>
            </div>
            <div className="perk-box">
              <span className="perk-icon">📍</span>
              <h4>Airport &amp; Downtown Pickup</h4>
              <p>Pick up your keys right at the terminal or from convenient central city locations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
