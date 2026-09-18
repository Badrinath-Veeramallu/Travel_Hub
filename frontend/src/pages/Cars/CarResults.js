import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import carService from '../../services/carService';
import { useCurrency } from '../../context/CurrencyContext';
import './Cars.css';

export default function CarResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const searchParams = location.state?.searchParams || {};

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recommended');

  // Filters
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.category ? [searchParams.category] : []
  );
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);
  const [maxPrice, setMaxPrice] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await carService.search(searchParams);
      setCars(response.cars || []);
    } catch (err) {
      setError('Failed to search cars: ' + (err.message || 'Server error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    searchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highestPrice = cars.length ? Math.max(...cars.map(c => c.pricePerDay)) : 10000;
  const lowestPrice = cars.length ? Math.min(...cars.map(c => c.pricePerDay)) : 1000;
  const availableCategories = [...new Set(cars.map(c => c.category))];

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleTransmission = (trans) => {
    setSelectedTransmissions(prev =>
      prev.includes(trans) ? prev.filter(t => t !== trans) : [...prev, trans]
    );
  };

  const filteredCars = cars.filter(car => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(car.category)) return false;
    if (selectedTransmissions.length > 0 && !selectedTransmissions.includes(car.transmission)) return false;
    if (maxPrice && car.pricePerDay > parseInt(maxPrice)) return false;
    return true;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === 'cheapest') return a.pricePerDay - b.pricePerDay;
    if (sortBy === 'expensive') return b.pricePerDay - a.pricePerDay;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'recommended') {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.pricePerDay - b.pricePerDay;
    }
    return 0;
  });

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTransmissions([]);
    setMaxPrice('');
  };

  return (
    <div className="car-results-page">
      {/* Search Summary */}
      <div className="search-summary">
        <div className="container summary-content">
          <button className="back-button" onClick={() => navigate('/cars')}>← Back to Search</button>
          <div className="summary-info">
            <strong>{searchParams.pickupLocation || 'Delhi'}</strong>
            <span> · Pickup: {searchParams.pickupDate || 'Flexible'}</span>
            <span> · Drop-off: {searchParams.dropoffDate || 'Flexible'}</span>
          </div>
          <button className="edit-button" onClick={() => navigate('/cars')}>Edit Search</button>
        </div>
      </div>

      <div className="container results-layout" style={{ marginTop: '24px' }}>
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            {(selectedCategories.length > 0 || selectedTransmissions.length > 0 || maxPrice) && (
              <button className="clear-filters" onClick={clearFilters}>Reset</button>
            )}
          </div>

          {/* Categories */}
          {availableCategories.length > 0 && (
            <div className="filter-group">
              <h4>Vehicle Category</h4>
              {availableCategories.map(cat => (
                <label key={cat} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          )}

          {/* Transmission */}
          <div className="filter-group">
            <h4>Transmission</h4>
            {['Automatic', 'Manual'].map(trans => (
              <label key={trans} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTransmissions.includes(trans)}
                  onChange={() => toggleTransmission(trans)}
                />
                {trans}
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4>Max Price / Day ({formatPrice(parseInt(maxPrice) || highestPrice)})</h4>
            <input
              type="range"
              min={lowestPrice}
              max={highestPrice}
              step={200}
              value={maxPrice || highestPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-slider"
            />
            <div className="price-range-labels">
              <span>{formatPrice(lowestPrice)}</span>
              <span>{formatPrice(highestPrice)}</span>
            </div>
          </div>
        </aside>

        {/* Results Main */}
        <div className="results-main">
          <div className="results-toolbar">
            <div className="results-count">
              {loading ? 'Searching...' : `${sortedCars.length} Car${sortedCars.length !== 1 ? 's' : ''} available`}
            </div>
            <div className="sort-control">
              <label>Sort by: </label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="cheapest">Price: Low to High</option>
                <option value="expensive">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="loading-skeleton">
              {[1, 2, 3].map(i => <div key={i} className="skeleton-card" style={{ height: '160px' }} />)}
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={searchCars} style={{ marginTop: '8px' }}>Retry</button>
            </div>
          )}

          {!loading && sortedCars.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <h3>No cars found matching filters</h3>
              <p>Try resetting filters or adjusting pickup parameters.</p>
              <button className="btn btn-primary" onClick={clearFilters} style={{ marginRight: '10px' }}>
                Reset Filters
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/cars')}>
                New Search
              </button>
            </div>
          )}

          <div className="cars-list">
            {sortedCars.map(car => (
              <div
                key={car.id}
                className="car-card"
                onClick={() => navigate(`/cars/${car.id}`, { state: { car, searchParams } })}
                role="button"
                tabIndex={0}
              >
                <div className="car-image">
                  {car.image ? (
                    <img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                    />
                  ) : null}
                  <div className="image-placeholder" style={{ display: car.image ? 'none' : 'flex' }}>🚗</div>
                  {car.discount > 0 && <div className="discount-badge">{car.discount}% OFF</div>}
                </div>

                <div className="car-info">
                  <div className="car-category">{car.category}</div>
                  <h3 className="car-name">{car.name}</h3>

                  <div className="car-specs">
                    <span className="spec">⚙️ {car.transmission}</span>
                    <span className="spec">👥 {car.seats} Seats</span>
                    <span className="spec">🧳 {car.luggage}</span>
                    <span className="spec">⛽ {car.fuel}</span>
                  </div>

                  <div className="car-features-mini">
                    <span className="provider-tag">Partner: {car.provider}</span>
                    <span className="rating-pill">★ {car.rating} ({car.reviews})</span>
                  </div>
                </div>

                <div className="car-pricing">
                  <div className="price-info">
                    <span className="label">per day</span>
                    <div className="price-row">
                      <span className="price">{formatPrice(car.pricePerDay)}</span>
                      {car.originalPrice && (
                        <span className="original-price">{formatPrice(car.originalPrice)}</span>
                      )}
                    </div>
                    <span className="mileage-note">✓ Free cancellation</span>
                  </div>
                  <button className="btn btn-primary" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/cars/${car.id}`, { state: { car, searchParams } });
                  }}>
                    Select Deal →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
