import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import flightService from '../../services/flightService';
import { useCurrency } from '../../context/CurrencyContext';
import './FlightPages.css';

export default function FlightResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();

  const searchParams = location.state?.searchParams || {};

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recommended');

  // Filters
  const [filters, setFilters] = useState({
    stops: [],
    airlines: [],
    maxPrice: '',
    departureTime: []
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFlights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiParams = {
        from: searchParams.from || searchParams.fromLabel || '',
        to: searchParams.to || searchParams.toLabel || '',
        departureDate: searchParams.departureDate || '',
        returnDate: searchParams.returnDate || '',
        tripType: searchParams.tripType || 'oneway',
        cabin: searchParams.cabin || 'economy',
        adults: searchParams.adults || 1,
        children: searchParams.children || 0,
        infants: searchParams.infants || 0
      };
      const response = await flightService.search(apiParams);
      setFlights(response.flights || []);
    } catch (err) {
      setError(err.message || 'Unable to load flights. Please try again.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute min price for range
  const minPrice = flights.length ? Math.min(...flights.map(f => f.price)) : 0;
  const maxFlightPrice = flights.length ? Math.max(...flights.map(f => f.price)) : 100000;

  // Apply filters & sort
  const filtered = flights.filter(f => {
    if (filters.stops.length > 0 && !filters.stops.includes(f.stops)) return false;
    if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline)) return false;
    if (filters.maxPrice && f.price > parseInt(filters.maxPrice)) return false;
    if (filters.departureTime.length > 0) {
      const hour = parseInt(f.departure?.split(':')[0] || f.departureTime?.split(':')[0] || 0, 10);
      const timeSlot = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
      if (!filters.departureTime.includes(timeSlot)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'cheapest') return a.price - b.price;
    if (sortBy === 'fastest') return (a.durationMinutes || 999) - (b.durationMinutes || 999);
    if (sortBy === 'best') {
      const scoreA = a.price * 0.6 + (a.stops * 10000) * 0.4;
      const scoreB = b.price * 0.6 + (b.stops * 10000) * 0.4;
      return scoreA - scoreB;
    }
    return 0;
  });

  const toggleFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({ stops: [], airlines: [], maxPrice: '', departureTime: [] });
  };

  const hasActiveFilters = filters.stops.length > 0 || filters.airlines.length > 0 ||
    filters.maxPrice || filters.departureTime.length > 0;

  // Available airlines in results
  const availableAirlines = [...new Set(flights.map(f => f.airline))];

  return (
    <div className="results-page">
      {/* Summary Bar */}
      <div className="search-summary-bar">
        <div className="container">
          <div className="summary-content">
            <button className="back-button" onClick={() => navigate('/flights')}>← Back</button>
            <div className="summary-route">
              <strong>{searchParams.fromLabel || searchParams.from}</strong>
              <span className="arrow">→</span>
              <strong>{searchParams.toLabel || searchParams.to}</strong>
              {searchParams.departureDate && (
                <span className="summary-date">· {new Date(searchParams.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              )}
              <span className="summary-pax">· {(searchParams.adults || 1) + (searchParams.children || 0)} Pax</span>
            </div>
            <button className="edit-search-btn" onClick={() => navigate('/flights')}>Edit Search</button>
          </div>
        </div>
      </div>

      <div className="container results-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>Clear All</button>
            )}
          </div>

          <div className="filter-group">
            <h4>Stops</h4>
            {[
              { value: 0, label: 'Non-stop' },
              { value: 1, label: '1 Stop' },
              { value: 2, label: '2+ Stops' }
            ].map(({ value, label }) => (
              <label key={value} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.stops.includes(value)}
                  onChange={() => toggleFilter('stops', value)}
                />
                {label}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Departure Time</h4>
            {[
              { value: 'morning',   label: 'Morning  (00:00 – 11:59)' },
              { value: 'afternoon', label: 'Afternoon  (12:00 – 17:59)' },
              { value: 'evening',   label: 'Evening  (18:00 – 23:59)' }
            ].map(({ value, label }) => (
              <label key={value} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.departureTime.includes(value)}
                  onChange={() => toggleFilter('departureTime', value)}
                />
                {label}
              </label>
            ))}
          </div>

          {availableAirlines.length > 0 && (
            <div className="filter-group">
              <h4>Airlines</h4>
              {availableAirlines.map(airline => (
                <label key={airline} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.airlines.includes(airline)}
                    onChange={() => toggleFilter('airlines', airline)}
                  />
                  {airline}
                </label>
              ))}
            </div>
          )}

          <div className="filter-group">
            <h4>Max Price ({formatPrice(parseInt(filters.maxPrice) || maxFlightPrice)})</h4>
            <input
              type="range"
              min={minPrice}
              max={maxFlightPrice}
              step={500}
              value={filters.maxPrice || maxFlightPrice}
              onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="price-slider"
            />
            <div className="price-range-labels">
              <span>{formatPrice(minPrice)}</span>
              <span>{formatPrice(maxFlightPrice)}</span>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="results-main">
          <div className="results-toolbar">
            <div className="results-count">
              {loading ? 'Searching...' : `${sorted.length} flight${sorted.length !== 1 ? 's' : ''} found`}
            </div>
            <div className="sort-control">
              <label>Sort:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="cheapest">Cheapest</option>
                <option value="fastest">Fastest</option>
                <option value="best">Best Value</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="loading-skeleton">
              {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          )}

          {!loading && error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchFlights}>Try Again</button>
            </div>
          )}

          {!loading && !error && sorted.length === 0 && flights.length > 0 && (
            <div className="empty-state">
              <p>No flights match your current filters.</p>
              <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}

          {!loading && !error && flights.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✈️</div>
              <h3>No flights found</h3>
              <p>Try different dates, routes, or loosen your filters.</p>
              <button className="btn btn-primary" onClick={() => navigate('/flights')}>New Search</button>
            </div>
          )}

          <div className="flights-list">
            {sorted.map(flight => {
              const depTime = flight.departureTime || flight.departure;
              const arrTime = flight.arrivalTime || flight.arrival;
              return (
                <div
                  key={flight.id}
                  className="flight-card"
                  onClick={() => navigate(`/flights/${flight.id}`, { state: { flight, searchParams } })}
                >
                  <div className="flight-card-main">
                    <div className="airline-section">
                      <div className="airline-code">{flight.airlineCode}</div>
                      <div className="airline-name">{flight.airline}</div>
                      <div className="flight-num">{flight.flightNumber}</div>
                    </div>

                    <div className="times-section">
                      <div className="time-block">
                        <div className="time">{depTime}</div>
                        <div className="airport-code">{flight.fromCode || flight.fromAirport?.split(' ')[0]}</div>
                      </div>
                      <div className="duration-block">
                        <div className="duration">{flight.duration}</div>
                        <div className="duration-line">
                          <span className="line" />
                          {flight.stops === 0 ? (
                            <span className="stops-badge nonstop">✓ Direct</span>
                          ) : (
                            <span className="stops-badge">{flight.stops} Stop</span>
                          )}
                          <span className="line" />
                        </div>
                      </div>
                      <div className="time-block right">
                        <div className="time">{arrTime}</div>
                        <div className="airport-code">{flight.toCode || flight.toAirport?.split(' ')[0]}</div>
                      </div>
                    </div>

                    <div className="flight-meta">
                      <div className="baggage-info">{flight.baggage}</div>
                      {flight.seatsAvailable && flight.seatsAvailable <= 5 && (
                        <div className="seats-alert">⚠ Only {flight.seatsAvailable} seats left</div>
                      )}
                    </div>

                    <div className="price-section">
                      <div className="price">{formatPrice(flight.price)}</div>
                      <div className="price-note">per person · est. fare</div>
                      <button className="btn btn-primary btn-select" onClick={e => {
                        e.stopPropagation();
                        navigate(`/flights/${flight.id}`, { state: { flight, searchParams } });
                      }}>
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
