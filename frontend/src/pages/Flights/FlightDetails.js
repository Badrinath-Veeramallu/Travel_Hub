import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import flightService from '../../services/flightService';
import { useCurrency } from '../../context/CurrencyContext';
import './FlightPages.css';

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();

  const [flight, setFlight] = useState(location.state?.flight || null);
  const [loading, setLoading] = useState(!flight);
  const [error, setError] = useState(null);

  const searchParams = location.state?.searchParams || {};
  const travellers = (searchParams.adults || 1) + (searchParams.children || 0);

  useEffect(() => {
    if (!flight) {
      fetchFlight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchFlight = async () => {
    try {
      setLoading(true);
      const response = await flightService.getById(id);
      setFlight(response.flight);
      setError(null);
    } catch (err) {
      setError('Failed to load flight details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    const totalAmount = flight.price * (travellers || 1);
    navigate('/booking-summary', {
      state: {
        bookingType: 'flight',
        flight,
        searchParams,
        travellers,
        totalPrice: totalAmount
      }
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="loading" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading flight details...</p>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="error-message" style={{ maxWidth: '500px', margin: '0 auto 20px' }}>
          {error || 'Flight not found'}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/flights')}>
          Back to Flights
        </button>
      </div>
    );
  }

  const basePrice = flight.basePrice || Math.round(flight.price * 0.85);
  const taxes = flight.taxes || (flight.price - basePrice);
  const totalAmount = flight.price * (travellers || 1);

  return (
    <div className="flight-details-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>← Back to Results</button>

        <div className="flight-details-grid">
          {/* Main Details */}
          <div className="flight-main">
            <div className="flight-header-details">
              <div className="airline-bar">
                <span className="airline-badge">{flight.airlineCode || 'AIR'}</span>
                <div>
                  <h2>{flight.airline}</h2>
                  <span className="flight-number-tag">{flight.flightNumber} · {flight.aircraft || 'Airbus A320'}</span>
                </div>
              </div>

              <div className="flight-route-card">
                <div className="airport-info">
                  <div className="time">{flight.departureTime || flight.departure}</div>
                  <div className="airport-code">{flight.fromCode || 'DEP'}</div>
                  <div className="airport-name">{flight.fromAirport || flight.fromCity}</div>
                </div>

                <div className="flight-duration-center">
                  <div className="duration-label">{flight.duration}</div>
                  <div className="duration-track">
                    <span className="dot start"></span>
                    <span className="line"></span>
                    <span className="plane-icon">✈</span>
                    <span className="line"></span>
                    <span className="dot end"></span>
                  </div>
                  <div className="stops-info">
                    {flight.stops === 0 ? 'Direct / Non-stop' : `${flight.stops} Stop (${flight.stopLocation || 'Layover'})`}
                  </div>
                </div>

                <div className="airport-info right">
                  <div className="time">{flight.arrivalTime || flight.arrival}</div>
                  <div className="airport-code">{flight.toCode || 'ARR'}</div>
                  <div className="airport-name">{flight.toAirport || flight.toCity}</div>
                </div>
              </div>

              <div className="flight-info-grid">
                <div className="info-item">
                  <label>Cabin Class</label>
                  <span>{searchParams.cabin ? (searchParams.cabin.charAt(0).toUpperCase() + searchParams.cabin.slice(1)) : 'Economy'}</span>
                </div>
                <div className="info-item">
                  <label>Baggage Included</label>
                  <span>🧳 {flight.baggage || '7 kg cabin + 15 kg check-in'}</span>
                </div>
                <div className="info-item">
                  <label>Refund Policy</label>
                  <span className="badge-refundable">✓ Free cancellation within 24h</span>
                </div>
                <div className="info-item">
                  <label>Meals</label>
                  <span>🍽️ Complimentary snacks &amp; water</span>
                </div>
              </div>
            </div>

            {/* Flight Timeline / Amenities */}
            <div className="flight-perks-card">
              <h3>Flight Amenities &amp; Services</h3>
              <div className="perks-grid">
                <div className="perk-item">
                  <span className="perk-icon">🔌</span>
                  <div>
                    <strong>USB Charging</strong>
                    <p>At-seat power outlets</p>
                  </div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">📶</span>
                  <div>
                    <strong>Wi-Fi Available</strong>
                    <p>High-speed connectivity on board</p>
                  </div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🎬</span>
                  <div>
                    <strong>Entertainment</strong>
                    <p>Movies, shows &amp; music streaming</p>
                  </div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">💺</span>
                  <div>
                    <strong>Standard Pitch</strong>
                    <p>30-inch ergonomic seat pitch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price & Booking Sidebar */}
          <aside className="flight-sidebar">
            <div className="price-card">
              <div className="price-header">
                <div className="price-amount">{formatPrice(flight.price)}</div>
                <div className="price-label">per person · inclusive of all taxes</div>
              </div>

              <div className="price-breakdown">
                <div className="breakdown-item">
                  <span>Base Fare ({travellers} traveller{travellers > 1 ? 's' : ''})</span>
                  <span>{formatPrice(basePrice * travellers)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Taxes &amp; Airport Surcharges</span>
                  <span>{formatPrice(taxes * travellers)}</span>
                </div>
                <div className="breakdown-divider"></div>
                <div className="breakdown-item total">
                  <span>Total Amount</span>
                  <span className="total-val">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="price-confidence">
                ✓ Instant ticket confirmation via email &amp; SMS
              </div>

              <button 
                className="btn btn-primary btn-large" 
                style={{ width: '100%', marginTop: '16px' }}
                onClick={handleBookNow}
              >
                Proceed to Booking →
              </button>
            </div>

            <div className="amenities-card">
              <h3>Included in this fare</h3>
              <ul className="included-list">
                <li>✓ {flight.baggage || 'Cabin + Check-in baggage'}</li>
                <li>✓ Free standard seat assignment at check-in</li>
                <li>✓ 100% Guaranteed seat upon booking</li>
                <li>✓ 24/7 Travel assistance</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Policies */}
        <div className="policies-section">
          <h2>Fare Rules &amp; Important Notes</h2>
          <div className="policies-grid">
            <div className="policy-card">
              <h4>Cancellation</h4>
              <p>Cancel up to 24 hours prior to departure with a flat nominal processing fee. Instant refunds initiated to source.</p>
            </div>
            <div className="policy-card">
              <h4>Date Changes</h4>
              <p>Reschedule your travel easily up to 4 hours before the departure time subject to airline fare difference.</p>
            </div>
            <div className="policy-card">
              <h4>Baggage Guidelines</h4>
              <p>Hand baggage maximum 7 kg (1 bag). Check-in baggage up to 15 kg per adult ticket.</p>
            </div>
            <div className="policy-card">
              <h4>Check-in Requirement</h4>
              <p>Web check-in opens 48 hours before departure. Airport counters close 60 minutes before scheduled flight.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
