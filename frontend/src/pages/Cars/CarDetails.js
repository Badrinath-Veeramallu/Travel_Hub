import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import carService from '../../services/carService';
import { useCurrency } from '../../context/CurrencyContext';
import './Cars.css';

export default function CarDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { formatPrice } = useCurrency();

  const [car, setCar] = useState(location.state?.car || null);
  const [loading, setLoading] = useState(!car);
  const [error, setError] = useState(null);

  const searchParams = location.state?.searchParams || {};
  const [days, setDays] = useState(3);
  const [insuranceOption, setInsuranceOption] = useState('standard');

  useEffect(() => {
    if (!car) {
      fetchCarDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await carService.getById(id);
      setCar(response.car || response);
      setError(null);
    } catch (err) {
      setError('Failed to load car details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    const rawTotal = car.pricePerDay * days;
    const discountAmount = car.discount ? Math.round(rawTotal * (car.discount / 100)) : 0;
    const insuranceCost = insuranceOption === 'premium' ? 500 * days : 0;
    const taxes = Math.round((rawTotal - discountAmount) * 0.18);
    const finalTotal = (rawTotal - discountAmount) + insuranceCost + taxes;

    navigate('/booking-summary', {
      state: {
        bookingType: 'car',
        car,
        days,
        pickupLocation: searchParams.pickupLocation || 'Delhi Airport T3',
        dropoffLocation: searchParams.dropoffLocation || searchParams.pickupLocation || 'Delhi Airport T3',
        pickupDate: searchParams.pickupDate || '2026-09-22',
        dropoffDate: searchParams.dropoffDate || '2026-09-25',
        insuranceOption,
        totalPrice: finalTotal,
        taxes,
        insuranceCost,
        discountAmount
      }
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="loading" style={{ margin: '0 auto 16px' }}></div>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="error-message" style={{ maxWidth: '500px', margin: '0 auto 20px' }}>
          {error || 'Vehicle not found'}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/cars')}>Back to Cars</button>
      </div>
    );
  }

  const rawTotal = car.pricePerDay * days;
  const discountAmount = car.discount ? Math.round(rawTotal * (car.discount / 100)) : 0;
  const insuranceCost = insuranceOption === 'premium' ? 500 * days : 0;
  const taxes = Math.round((rawTotal - discountAmount) * 0.18);
  const finalTotal = (rawTotal - discountAmount) + insuranceCost + taxes;

  return (
    <div className="car-details-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>← Back to Results</button>

        <div className="car-details-content">
          {/* Header */}
          <div className="car-header">
            <div className="car-image-large">
              {car.image ? (
                <img
                  src={car.image}
                  alt={car.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-xl)' }}
                  onError={(e) => { e.target.style.display='none'; }}
                />
              ) : (
                <div className="image-placeholder-large">🚗</div>
              )}
            </div>
            <div className="car-header-info">
              <div className="car-category-large">{car.category} Class</div>
              <h1>{car.name}</h1>
              <div className="car-rating-large">
                <span className="rating-value">★ {car.rating}</span>
                <span className="review-count">({car.reviews} verified renter reviews)</span>
              </div>
              <div className="car-provider">
                Fleet Partner: <strong>{car.provider}</strong>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="details-layout">
            <div className="details-main">
              {/* Specifications */}
              <section className="detail-section">
                <h2>Vehicle Specifications</h2>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Transmission</span>
                    <span className="spec-value">⚙️ {car.transmission}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Passenger Capacity</span>
                    <span className="spec-value">👥 {car.seats} Adults</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Luggage Room</span>
                    <span className="spec-value">🧳 {car.luggage}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Fuel Type</span>
                    <span className="spec-value">⛽ {car.fuel}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Air Conditioning</span>
                    <span className="spec-value">{car.ac ? '✓ Powerful AC' : 'Standard'}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Airbags &amp; Safety</span>
                    <span className="spec-value">🛡️ {car.airbags || 2} Airbags + ABS</span>
                  </div>
                </div>
              </section>

              {/* Insurance Choice */}
              <section className="detail-section">
                <h2>Protection Options</h2>
                <div className="protection-options" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label className="protection-card" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    border: insuranceOption === 'standard' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: insuranceOption === 'standard' ? 'var(--color-primary-light)' : '#fff'
                  }}>
                    <input
                      type="radio"
                      name="insurance"
                      value="standard"
                      checked={insuranceOption === 'standard'}
                      onChange={() => setInsuranceOption('standard')}
                    />
                    <div style={{ flex: 1 }}>
                      <strong>Basic Protection (Included)</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        Third-party liability &amp; collision damage waiver with standard deductible.
                      </p>
                    </div>
                    <span style={{ fontWeight: 600 }}>Free</span>
                  </label>

                  <label className="protection-card" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    border: insuranceOption === 'premium' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: insuranceOption === 'premium' ? 'var(--color-primary-light)' : '#fff'
                  }}>
                    <input
                      type="radio"
                      name="insurance"
                      value="premium"
                      checked={insuranceOption === 'premium'}
                      onChange={() => setInsuranceOption('premium')}
                    />
                    <div style={{ flex: 1 }}>
                      <strong>Full Protection / Zero Excess</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                        Zero deductible for collision damage, theft protection, windshield &amp; tire cover.
                      </p>
                    </div>
                    <span style={{ fontWeight: 600 }}>+{formatPrice(500)}/day</span>
                  </label>
                </div>
              </section>

              {/* Policies */}
              <section className="detail-section">
                <h2>Rental Terms &amp; Policies</h2>
                <div className="policy-item">
                  <h3>Fuel Policy</h3>
                  <p>Full-to-Full: Pick up with a full tank and return full to avoid refueling surcharges.</p>
                </div>
                <div className="policy-item">
                  <h3>Mileage Policy</h3>
                  <p>Unlimited kilometers included for all trip durations.</p>
                </div>
                <div className="policy-item">
                  <h3>Cancellation Policy</h3>
                  <p>🛡️ {car.cancellation || 'Free cancellation up to 24 hours before pickup time.'}</p>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="booking-sidebar">
              <div className="price-summary">
                <h3>Rental Cost Breakdown</h3>

                <div className="summary-row">
                  <span>Daily Rental Rate:</span>
                  <span className="price">{formatPrice(car.pricePerDay)}</span>
                </div>

                <div className="control-group">
                  <label>Duration of Rental:</label>
                  <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
                    {[1, 2, 3, 4, 5, 7, 10, 14, 21, 30].map(n => (
                      <option key={n} value={n}>{n} Day{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="price-breakdown">
                  <div className="breakdown-row">
                    <span>Base rental ({days} day{days > 1 ? 's' : ''}):</span>
                    <span>{formatPrice(rawTotal)}</span>
                  </div>
                  {car.discount > 0 && (
                    <div className="breakdown-row discount" style={{ color: 'var(--color-success)' }}>
                      <span>Discount ({car.discount}%):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  {insuranceCost > 0 && (
                    <div className="breakdown-row">
                      <span>Full Protection cover:</span>
                      <span>+{formatPrice(insuranceCost)}</span>
                    </div>
                  )}
                  <div className="breakdown-row">
                    <span>GST &amp; Vehicle Taxes (18%):</span>
                    <span>{formatPrice(taxes)}</span>
                  </div>
                </div>

                <div className="total-price">
                  <span>Total Payable:</span>
                  <span className="total-amount">{formatPrice(finalTotal)}</span>
                </div>

                <button className="btn btn-primary btn-large" onClick={handleBooking} style={{ width: '100%', marginTop: '16px' }}>
                  Proceed to Reserve →
                </button>

                <div className="booking-info" style={{ marginTop: '16px' }}>
                  <p><strong>✓ Guaranteed vehicle availability</strong></p>
                  <p>✓ Instant email &amp; SMS confirmation voucher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
