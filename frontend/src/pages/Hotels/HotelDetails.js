import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import hotelService from '../../services/hotelService';
import { useCurrency } from '../../context/CurrencyContext';
import './Hotels.css';

export default function HotelDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { formatPrice } = useCurrency();

  const [hotel, setHotel] = useState(location.state?.hotel || null);
  const [loading, setLoading] = useState(!hotel);
  const [error, setError] = useState(null);

  const searchParams = location.state?.searchParams || {};
  const [rooms, setRooms] = useState(searchParams.rooms || 1);
  const [nights, setNights] = useState(2);

  useEffect(() => {
    if (!hotel) {
      fetchHotelDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const response = await hotelService.getById(id);
      setHotel(response.hotel || response);
      setError(null);
    } catch (err) {
      setError('Failed to load hotel details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    const rawTotal = hotel.pricePerNight * rooms * nights;
    const discountAmount = hotel.discount ? Math.round(rawTotal * (hotel.discount / 100)) : 0;
    const taxes = Math.round((rawTotal - discountAmount) * 0.12);
    const finalTotal = (rawTotal - discountAmount) + taxes;

    navigate('/booking-summary', {
      state: {
        bookingType: 'hotel',
        hotel,
        rooms,
        nights,
        checkInDate: searchParams.checkInDate || '2026-09-21',
        checkOutDate: searchParams.checkOutDate || '2026-09-23',
        guests: searchParams.guests || 2,
        totalPrice: finalTotal,
        taxes,
        discountAmount
      }
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="loading" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading hotel information...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="error-message" style={{ maxWidth: '500px', margin: '0 auto 20px' }}>
          {error || 'Hotel details could not be found'}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/hotels')}>Back to Hotels</button>
      </div>
    );
  }

  const rawTotal = hotel.pricePerNight * rooms * nights;
  const discountAmount = hotel.discount ? Math.round(rawTotal * (hotel.discount / 100)) : 0;
  const taxes = Math.round((rawTotal - discountAmount) * 0.12);
  const finalTotal = (rawTotal - discountAmount) + taxes;

  return (
    <div className="hotel-details-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>← Back to Results</button>

        <div className="hotel-details-content">
          {/* Hotel Header */}
          <div className="hotel-header">
            <div className="hotel-image-large">
              {hotel.image ? (
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-xl)' }}
                  onError={(e) => { e.target.style.display='none'; }}
                />
              ) : (
                <div className="image-placeholder-large">🏨</div>
              )}
            </div>
            <div className="hotel-header-info">
              <div className="hotel-badge-row">
                <span className="hotel-type-badge">Luxury Stay</span>
                <span className="stars" style={{ color: '#F59E0B' }}>{'★'.repeat(hotel.stars || 4)}</span>
              </div>
              <h1>{hotel.name}</h1>
              <div className="hotel-rating-large">
                <span className="rating-badge">{hotel.rating} / 5</span>
                <span className="review-count">({hotel.reviews} verified guest reviews)</span>
              </div>
              <p className="hotel-address">📍 {hotel.address || hotel.location}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="details-layout">
            <div className="details-main">
              {/* Description */}
              <section className="detail-section">
                <h2>About This Property</h2>
                <p>{hotel.description || 'Experience first-class hospitality with sophisticated interiors, exceptional dining options, state-of-the-art fitness amenities and personalized concierge support.'}</p>
              </section>

              {/* Room Type */}
              <section className="detail-section">
                <h2>Room Options Included</h2>
                <div className="room-type-info">
                  <h3>{hotel.roomType || 'Superior Deluxe Room'}</h3>
                  <p>1 King Bed or 2 Twin Beds · Up to {rooms * 2} Guests · City / Pool View</p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                    <li>Complimentary high-speed Wi-Fi</li>
                    <li>Complimentary buffet breakfast</li>
                    <li>Individual temperature control</li>
                  </ul>
                </div>
              </section>

              {/* Amenities */}
              <section className="detail-section">
                <h2>Hotel Amenities &amp; Services</h2>
                <div className="amenities-grid">
                  {(hotel.amenities || ['Swimming Pool', 'Spa & Wellness', 'Fine Dining', 'Fitness Center', 'Free Airport Shuttle', '24/7 Room Service']).map((amenity, idx) => (
                    <div key={idx} className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cancellation Policy */}
              <section className="detail-section">
                <h2>Cancellation &amp; Booking Terms</h2>
                <p className="cancellation-policy">
                  🛡️ {hotel.cancellation || 'Free cancellation up to 48 hours before check-in. Instant confirmation guaranteed.'}
                </p>
              </section>
            </div>

            {/* Booking Sidebar */}
            <div className="booking-sidebar">
              <div className="price-summary">
                <h3>Reservation Summary</h3>

                <div className="summary-row">
                  <span>Price per night:</span>
                  <span className="price">{formatPrice(hotel.pricePerNight)}</span>
                </div>

                <div className="control-group">
                  <label>Number of Rooms:</label>
                  <select value={rooms} onChange={(e) => setRooms(parseInt(e.target.value))}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="control-group">
                  <label>Length of Stay:</label>
                  <select value={nights} onChange={(e) => setNights(parseInt(e.target.value))}>
                    {[1, 2, 3, 4, 5, 7, 10, 14].map(n => (
                      <option key={n} value={n}>{n} Night{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="price-breakdown">
                  <div className="breakdown-row">
                    <span>Base rate ({rooms} room × {nights} night):</span>
                    <span>{formatPrice(rawTotal)}</span>
                  </div>
                  {hotel.discount > 0 && (
                    <div className="breakdown-row discount" style={{ color: 'var(--color-success)' }}>
                      <span>Seasonal Promo ({hotel.discount}% OFF):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="breakdown-row">
                    <span>Estimated Taxes &amp; GST (12%):</span>
                    <span>{formatPrice(taxes)}</span>
                  </div>
                </div>

                <div className="total-price">
                  <span>Total Payable:</span>
                  <span className="total-amount">{formatPrice(finalTotal)}</span>
                </div>

                <button className="btn btn-primary btn-large" onClick={handleBooking} style={{ width: '100%', marginTop: '16px' }}>
                  Reserve Now →
                </button>

                <div className="booking-info" style={{ marginTop: '16px' }}>
                  <p><strong>✓ Instant confirmation</strong></p>
                  <p>✓ No booking fee · Best price guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
