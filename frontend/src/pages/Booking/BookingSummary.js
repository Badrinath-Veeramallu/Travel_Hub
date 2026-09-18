import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import './BookingSummary.css';

export default function BookingSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const state = location.state || {};
  const bookingType = state.bookingType || (state.flight ? 'flight' : state.hotel ? 'hotel' : state.car ? 'car' : null);

  const flight = state.flight;
  const hotel = state.hotel;
  const car = state.car;
  const searchParams = state.searchParams || {};

  // Form State
  const [contactInfo, setContactInfo] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+91 9876543210'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    name: 'JOHN DOE',
    expiry: '12/28',
    cvv: '123'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!bookingType || (!flight && !hotel && !car)) {
    return (
      <div className="booking-page empty-booking">
        <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div className="empty-icon" style={{ fontSize: '48px', marginBottom: '16px' }}>🎫</div>
          <h2>No Booking Selected</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Please search and choose a flight, hotel, or car rental to proceed with your booking.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/flights" className="btn btn-primary">Find Flights</Link>
            <Link to="/hotels" className="btn btn-secondary">Find Hotels</Link>
            <Link to="/cars" className="btn btn-secondary">Rent Cars</Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate prices
  let baseAmount = 0;
  let taxes = 0;
  let totalAmount = 0;
  let summaryTitle = '';

  if (bookingType === 'flight') {
    const travellers = state.travellers || 1;
    baseAmount = (flight.basePrice || Math.round(flight.price * 0.85)) * travellers;
    taxes = (flight.taxes || Math.round(flight.price * 0.15)) * travellers;
    totalAmount = state.totalPrice || (flight.price * travellers);
    summaryTitle = `${flight.airline} · ${flight.flightNumber}`;
  } else if (bookingType === 'hotel') {
    const rooms = state.rooms || 1;
    const nights = state.nights || 2;
    baseAmount = hotel.pricePerNight * rooms * nights;
    taxes = state.taxes || Math.round(baseAmount * 0.12);
    totalAmount = state.totalPrice || (baseAmount + taxes);
    summaryTitle = `${hotel.name} (${rooms} Room, ${nights} Night${nights > 1 ? 's' : ''})`;
  } else if (bookingType === 'car') {
    const days = state.days || 3;
    baseAmount = car.pricePerDay * days;
    taxes = state.taxes || Math.round(baseAmount * 0.18);
    totalAmount = state.totalPrice || (baseAmount + taxes);
    summaryTitle = `${car.name} (${days} Days Rental)`;
  }

  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.phone) {
      alert('Please fill in all contact details');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build the itemId and itemDetails expected by the backend API
      let itemId, itemDetails;

      if (bookingType === 'flight') {
        itemId = flight.id;
        itemDetails = {
          ...flight,
          departureDate: searchParams.departureDate || flight.departureDate,
          returnDate: searchParams.returnDate,
          travellers: state.travellers || 1,
          cabin: searchParams.cabin || flight.cabin || 'economy'
        };
      } else if (bookingType === 'hotel') {
        itemId = hotel.id;
        itemDetails = {
          ...hotel,
          rooms: state.rooms || 1,
          nights: state.nights || 2,
          checkInDate: state.checkInDate,
          checkOutDate: state.checkOutDate,
          guests: state.guests || 2
        };
      } else if (bookingType === 'car') {
        itemId = car.id;
        itemDetails = {
          ...car,
          days: state.days || 3,
          pickupLocation: state.pickupLocation,
          dropoffLocation: state.dropoffLocation,
          pickupDate: state.pickupDate,
          dropoffDate: state.dropoffDate
        };
      }

      const bookingPayload = {
        userId: user?.id || 'user1',
        type: bookingType,
        itemId,
        itemDetails,
        passengers: [
          {
            firstName: contactInfo.firstName,
            lastName: contactInfo.lastName,
            email: contactInfo.email,
            phone: contactInfo.phone,
            type: 'Adult'
          }
        ],
        totalPrice: totalAmount,
        contact: contactInfo,
        payment: {
          method: paymentMethod,
          last4: paymentMethod === 'card' ? (cardDetails.number.replace(/\D/g, '').slice(-4) || '4242') : 'N/A'
        },
        bookingSummary: {
          summaryTitle,
          baseAmount,
          taxes,
          totalAmount
        }
      };

      const response = await bookingService.create(bookingPayload);
      setConfirmedBooking(response.booking);
    } catch (err) {
      setError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (confirmedBooking) {
    return (
      <div className="booking-page">
        <div className="container confirmation-wrapper">
          <div className="confirmation-card">
            <div className="success-badge">
              <span className="checkmark">✓</span>
            </div>
            <h1>Booking Confirmed!</h1>
            <p className="confirmation-subtitle">
              Your reservation has been securely processed and confirmed. A confirmation receipt has been dispatched to <strong>{contactInfo.email}</strong>.
            </p>

            <div className="confirmation-meta">
              <div className="meta-box">
                <span className="meta-label">Confirmation Number</span>
                <span className="meta-value pnr">{confirmedBooking.confirmationNumber}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Booking Reference</span>
                <span className="meta-value">{confirmedBooking.id}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Payment Status</span>
                <span className="meta-value status-paid">● Paid · {formatPrice(confirmedBooking.totalPrice)}</span>
              </div>
            </div>

            {/* Booking Details Summary */}
            <div className="confirmation-details">
              <h3>Reservation Summary</h3>
              {bookingType === 'flight' && (
                <div className="ticket-summary">
                  <div className="ticket-header">
                    <strong>{flight.airline} · {flight.flightNumber}</strong>
                    <span className="badge-confirmed">Confirmed</span>
                  </div>
                  <div className="ticket-route">
                    <div>
                      <div className="ticket-time">{flight.departureTime || flight.departure}</div>
                      <div className="ticket-city">{flight.fromAirport || flight.fromCode || 'DEP'}</div>
                    </div>
                    <div className="ticket-duration">
                      <span>{flight.duration}</span>
                      <span className="ticket-arrow">✈ ─────── ✈</span>
                      <span>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="ticket-time">{flight.arrivalTime || flight.arrival}</div>
                      <div className="ticket-city">{flight.toAirport || flight.toCode || 'ARR'}</div>
                    </div>
                  </div>
                  <div className="ticket-footer">
                    <span>Passenger: {contactInfo.firstName} {contactInfo.lastName}</span>
                    <span>Baggage: {flight.baggage || 'Included'}</span>
                  </div>
                </div>
              )}

              {bookingType === 'hotel' && (
                <div className="ticket-summary">
                  <div className="ticket-header">
                    <strong>🏨 {hotel.name}</strong>
                    <span className="badge-confirmed">Confirmed</span>
                  </div>
                  <p style={{ margin: '8px 0', color: 'var(--color-text-secondary)' }}>📍 {hotel.address || hotel.location}</p>
                  <div className="hotel-voucher-dates">
                    <div>
                      <span className="label">Check-in:</span>
                      <strong>{state.checkInDate || 'Scheduled'}</strong>
                    </div>
                    <div>
                      <span className="label">Check-out:</span>
                      <strong>{state.checkOutDate || 'Scheduled'}</strong>
                    </div>
                    <div>
                      <span className="label">Rooms &amp; Nights:</span>
                      <strong>{state.rooms || 1} Room · {state.nights || 2} Nights</strong>
                    </div>
                  </div>
                </div>
              )}

              {bookingType === 'car' && (
                <div className="ticket-summary">
                  <div className="ticket-header">
                    <strong>🚗 {car.name} ({car.category})</strong>
                    <span className="badge-confirmed">Confirmed</span>
                  </div>
                  <p style={{ margin: '8px 0', color: 'var(--color-text-secondary)' }}>Fleet Partner: {car.provider}</p>
                  <div className="hotel-voucher-dates">
                    <div>
                      <span className="label">Pickup:</span>
                      <strong>{state.pickupLocation} ({state.pickupDate})</strong>
                    </div>
                    <div>
                      <span className="label">Drop-off:</span>
                      <strong>{state.dropoffLocation} ({state.dropoffDate})</strong>
                    </div>
                    <div>
                      <span className="label">Duration:</span>
                      <strong>{state.days || 3} Days</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="confirmation-actions">
              <button className="btn btn-primary" onClick={() => navigate('/trips')}>
                🗺️ View in My Trips
              </button>
              <button className="btn btn-secondary" onClick={() => window.print()}>
                🖨️ Print Ticket / Voucher
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/')}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT VIEW
  return (
    <div className="booking-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>← Back to Details</button>
        <h1 className="checkout-title">Review &amp; Secure Your Booking</h1>

        {error && (
          <div className="error-message" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <div className="booking-grid">
          {/* Main Form Content */}
          <div className="booking-main">
            {/* 1. Item Summary Card */}
            <div className="booking-section">
              <h2>1. {bookingType === 'flight' ? 'Flight Itinerary' : bookingType === 'hotel' ? 'Stay Details' : 'Car Rental Details'}</h2>
              <div className="summary-banner">
                <div className="banner-icon">
                  {bookingType === 'flight' ? '✈️' : bookingType === 'hotel' ? '🏨' : '🚗'}
                </div>
                <div className="banner-text">
                  <h3>{summaryTitle}</h3>
                  {bookingType === 'flight' && (
                    <p>{flight.fromAirport || flight.fromCity || 'DEP'} → {flight.toAirport || flight.toCity || 'ARR'} · {flight.departureTime || flight.departure} - {flight.arrivalTime || flight.arrival}</p>
                  )}
                  {bookingType === 'hotel' && (
                    <p>{hotel.location || hotel.address} · {state.rooms || 1} Room · {state.nights || 2} Nights</p>
                  )}
                  {bookingType === 'car' && (
                    <p>Pickup: {state.pickupLocation} · {state.days || 3} Days · Transmission: {car.transmission}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Contact & Passenger Details */}
            <div className="booking-section">
              <h2>2. Contact &amp; Guest Details</h2>
              <form onSubmit={handleConfirmBooking} id="bookingForm">
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={contactInfo.firstName}
                      onChange={(e) => handleContactChange('firstName', e.target.value)}
                      placeholder="e.g. John"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={contactInfo.lastName}
                      onChange={(e) => handleContactChange('lastName', e.target.value)}
                      placeholder="e.g. Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address (for ticket &amp; confirmation) *</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Phone *</label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* 3. Payment Method */}
            <div className="booking-section">
              <h2>3. Payment Method</h2>
              <div className="payment-method-selector">
                <label className={`payment-pill ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  💳 Credit / Debit Card
                </label>
                <label className={`payment-pill ${paymentMethod === 'upi' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  📱 UPI / QR Code
                </label>
                <label className={`payment-pill ${paymentMethod === 'netbanking' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                  />
                  🏦 Net Banking
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-input-box">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="form-grid" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        placeholder="12/28"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV / CVC</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        placeholder="123"
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="upi-box" style={{ padding: '16px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                  <p>⚡ Instant verification with Google Pay, PhonePe, or Paytm UPI ID</p>
                  <input type="text" placeholder="example@okhdfcbank" defaultValue="demo@okaxis" style={{ marginTop: '8px' }} />
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="netbanking-box" style={{ padding: '16px', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                  <select defaultValue="HDFC">
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="AXIS">Axis Bank</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="booking-sidebar">
            <div className="price-summary-card">
              <h3>Price Breakdown</h3>
              <div className="breakdown-table">
                <div className="breakdown-row">
                  <span>Base Rate</span>
                  <span>{formatPrice(baseAmount)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Taxes, Fees &amp; Surcharges</span>
                  <span>{formatPrice(taxes)}</span>
                </div>
                <div className="breakdown-divider"></div>
                <div className="breakdown-total">
                  <span>Total Amount</span>
                  <span className="final-sum">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="security-assurances">
                <div className="assurance-item">
                  <span>🔒</span>
                  <span>256-bit SSL encrypted checkout</span>
                </div>
                <div className="assurance-item">
                  <span>✓</span>
                  <span>Instant booking confirmation</span>
                </div>
                <div className="assurance-item">
                  <span>🛡️</span>
                  <span>Free cancellation supported</span>
                </div>
              </div>

              <button
                type="submit"
                form="bookingForm"
                className="btn btn-primary btn-large btn-confirm"
                disabled={loading}
              >
                {loading ? 'Processing Booking...' : `Pay ${formatPrice(totalAmount)} & Confirm`}
              </button>

              <p className="terms-note">
                By confirming this booking, you agree to the fare terms, cancellation policies, and TravelHub terms of service.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
