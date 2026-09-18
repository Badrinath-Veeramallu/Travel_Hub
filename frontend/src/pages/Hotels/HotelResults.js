import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import hotelService from '../../services/hotelService';
import { useCurrency } from '../../context/CurrencyContext';
import './Hotels.css';

export default function HotelResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const searchParams = location.state?.searchParams || {};

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recommended');

  // Filters
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchHotels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hotelService.search(searchParams);
      setHotels(response.hotels || []);
    } catch (err) {
      setError('Failed to search hotels: ' + (err.message || 'Server error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    searchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highestPrice = hotels.length ? Math.max(...hotels.map(h => h.pricePerNight)) : 25000;
  const lowestPrice = hotels.length ? Math.min(...hotels.map(h => h.pricePerNight)) : 1000;

  // Extract all amenities across returned hotels
  const allAmenities = [...new Set(hotels.flatMap(h => h.amenities || []))].slice(0, 8);

  const toggleStar = (star) => {
    setSelectedStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const filteredHotels = hotels.filter(hotel => {
    if (minRating > 0 && hotel.rating < minRating) return false;
    if (maxPrice && hotel.pricePerNight > parseInt(maxPrice)) return false;
    if (selectedStars.length > 0 && !selectedStars.includes(hotel.stars)) return false;
    if (selectedAmenities.length > 0) {
      const hasAll = selectedAmenities.every(a => (hotel.amenities || []).includes(a));
      if (!hasAll) return false;
    }
    return true;
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortBy === 'cheapest') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'expensive') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'recommended') {
      if (b.stars !== a.stars) return b.stars - a.stars;
      return b.rating - a.rating;
    }
    return 0;
  });

  const clearFilters = () => {
    setMinRating(0);
    setMaxPrice('');
    setSelectedStars([]);
    setSelectedAmenities([]);
  };

  return (
    <div className="hotel-results-page">
      {/* Search Summary */}
      <div className="search-summary">
        <div className="container summary-content">
          <button className="back-button" onClick={() => navigate('/hotels')}>← Back to Search</button>
          <div className="summary-info">
            <strong>{searchParams.location || 'All Destinations'}</strong>
            <span> · {searchParams.checkInDate || 'Flexible'} to {searchParams.checkOutDate || 'Flexible'}</span>
            <span> · {searchParams.guests || 2} Guest(s), {searchParams.rooms || 1} Room(s)</span>
          </div>
          <button className="edit-button" onClick={() => navigate('/hotels')}>Edit Search</button>
        </div>
      </div>

      <div className="container results-layout" style={{ marginTop: '24px' }}>
        {/* Filter Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            {(selectedStars.length > 0 || selectedAmenities.length > 0 || maxPrice || minRating > 0) && (
              <button className="clear-filters" onClick={clearFilters}>Reset</button>
            )}
          </div>

          {/* Star Rating */}
          <div className="filter-group">
            <h4>Star Rating</h4>
            {[5, 4, 3].map(stars => (
              <label key={stars} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedStars.includes(stars)}
                  onChange={() => toggleStar(stars)}
                />
                <span style={{ color: '#F59E0B' }}>{'★'.repeat(stars)}</span>
                <span style={{ marginLeft: '4px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  ({stars} Stars)
                </span>
              </label>
            ))}
          </div>

          {/* Min Guest Rating */}
          <div className="filter-group">
            <h4>Guest Rating</h4>
            {[4.5, 4.0, 3.5].map(rating => (
              <label key={rating} className="filter-checkbox">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => setMinRating(minRating === rating ? 0 : rating)}
                />
                {rating}+ rated
              </label>
            ))}
          </div>

          {/* Max Price Slider */}
          <div className="filter-group">
            <h4>Max Price per Night ({formatPrice(parseInt(maxPrice) || highestPrice)})</h4>
            <input
              type="range"
              min={lowestPrice}
              max={highestPrice}
              step={500}
              value={maxPrice || highestPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-slider"
            />
            <div className="price-range-labels">
              <span>{formatPrice(lowestPrice)}</span>
              <span>{formatPrice(highestPrice)}</span>
            </div>
          </div>

          {/* Amenities */}
          {allAmenities.length > 0 && (
            <div className="filter-group">
              <h4>Amenities</h4>
              {allAmenities.map(amenity => (
                <label key={amenity} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          )}
        </aside>

        {/* Results Main */}
        <div className="results-main">
          <div className="results-toolbar">
            <div className="results-count">
              {loading ? 'Searching...' : `${sortedHotels.length} Hotel${sortedHotels.length !== 1 ? 's' : ''} available`}
            </div>
            <div className="sort-control">
              <label>Sort by: </label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recommended">Recommended &amp; Stars</option>
                <option value="cheapest">Price: Low to High</option>
                <option value="expensive">Price: High to Low</option>
                <option value="rating">Guest Rating</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="loading-skeleton">
              {[1, 2, 3].map(i => <div key={i} className="skeleton-card" style={{ height: '180px' }} />)}
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={searchHotels} style={{ marginTop: '8px' }}>Retry</button>
            </div>
          )}

          {!loading && sortedHotels.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏨</div>
              <h3>No hotels match your filters</h3>
              <p>Try resetting filters or searching for another city.</p>
              <button className="btn btn-primary" onClick={clearFilters} style={{ marginRight: '10px' }}>
                Reset Filters
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/hotels')}>
                New Search
              </button>
            </div>
          )}

          <div className="hotels-list">
            {sortedHotels.map(hotel => (
              <div
                key={hotel.id}
                className="hotel-card"
                onClick={() => navigate(`/hotels/${hotel.id}`, { state: { hotel, searchParams } })}
                role="button"
                tabIndex={0}
              >
                <div className="hotel-image">
                  {hotel.image ? (
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      loading="lazy"
                      onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                    />
                  ) : null}
                  <div className="image-placeholder" style={{ display: hotel.image ? 'none' : 'flex' }}>🏨</div>
                  {hotel.discount && <div className="discount-badge">{hotel.discount}% OFF</div>}
                </div>

                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <div className="hotel-rating">
                    <span className="stars">{'★'.repeat(hotel.stars)}</span>
                    <span className="rating-badge">{hotel.rating} / 5</span>
                    <span className="review-count">({hotel.reviews} reviews)</span>
                  </div>
                  <p className="hotel-location">📍 {hotel.location || hotel.address}</p>
                  <p className="room-type-tag">🛏️ {hotel.roomType || 'Deluxe Room'}</p>

                  <div className="amenities-preview">
                    {(hotel.amenities || []).slice(0, 4).map((amenity, idx) => (
                      <span key={idx} className="amenity-tag">✓ {amenity}</span>
                    ))}
                  </div>
                </div>

                <div className="hotel-pricing">
                  <div className="price-info">
                    <span className="label">per night</span>
                    <div className="price-row">
                      <span className="price">{formatPrice(hotel.pricePerNight)}</span>
                      {hotel.originalPrice && (
                        <span className="original-price">{formatPrice(hotel.originalPrice)}</span>
                      )}
                    </div>
                    <span className="taxes-note">+ Taxes &amp; fees</span>
                  </div>
                  <button className="btn btn-primary" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/hotels/${hotel.id}`, { state: { hotel, searchParams } });
                  }}>
                    View Deal →
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
