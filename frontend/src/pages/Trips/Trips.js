import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import tripService from '../../services/tripService';
import './Trips.css';

export default function Trips() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'completed'

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripService.getAll(user?.id);
      setTrips(response.trips || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve trips');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleCancelTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    try {
      await tripService.delete(tripId);
      // Remove or update status locally
      setTrips(prev => prev.filter(t => t.id !== tripId && t.id !== String(tripId)));
      alert('Trip cancelled successfully.');
    } catch (err) {
      alert('Failed to cancel trip: ' + (err.message || 'Unknown error'));
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (activeTab === 'upcoming') return trip.status === 'upcoming' || trip.status === 'confirmed';
    if (activeTab === 'completed') return trip.status === 'completed';
    return true;
  });

  return (
    <div className="trips-page">
      <div className="container">
        <div className="trips-header">
          <div>
            <h1>My Bookings &amp; Trips</h1>
            <p style={{ color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
              Manage, review and track all your flight, hotel, and vehicle reservations
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            + Plan New Journey
          </button>
        </div>

        {/* Tab Filters */}
        <div className="trips-tabs" style={{ display: 'flex', gap: '8px', margin: '24px 0 16px', borderBottom: '1px solid var(--color-border)' }}>
          {[
            { id: 'all', label: `All Bookings (${trips.length})` },
            { id: 'upcoming', label: `Upcoming (${trips.filter(t => t.status === 'upcoming' || t.status === 'confirmed').length})` },
            { id: 'completed', label: `Completed (${trips.filter(t => t.status === 'completed').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '-1px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="loading-container" style={{ padding: '60px 0', textAlign: 'center' }}>
            <div className="loading" style={{ margin: '0 auto 12px' }}></div>
            <p>Loading your trips and reservations...</p>
          </div>
        )}

        {error && (
          <div className="error-message" style={{ margin: '20px 0' }}>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchTrips} style={{ marginTop: '8px' }}>Retry</button>
          </div>
        )}

        {!loading && filteredTrips.length === 0 && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', margin: '20px 0' }}>
            <div className="empty-icon" style={{ fontSize: '48px', marginBottom: '12px' }}>✈️</div>
            <h2>No {activeTab !== 'all' ? activeTab : ''} trips found</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              Your reservations and planned journeys will appear right here once booked.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Explore Destinations
            </button>
          </div>
        )}

        <div className="trips-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          {filteredTrips.map(trip => {
            const isUpcoming = trip.status === 'upcoming' || trip.status === 'confirmed';
            return (
              <div key={trip.id} className={`trip-card ${trip.status || 'upcoming'}`} style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div className="trip-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '20px' }}>
                        {trip.type === 'flight' ? '✈️' : trip.type === 'hotel' ? '🏨' : trip.type === 'car' ? '🚗' : '🗺️'}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{trip.title}</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                      📅 {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date confirmed'}
                      {trip.endDate && ` – ${new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </p>
                  </div>

                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: isUpcoming ? '#DCFCE7' : '#F1F5F9',
                    color: isUpcoming ? '#15803D' : '#64748B'
                  }}>
                    {trip.status || 'CONFIRMED'}
                  </span>
                </div>

                <div className="trip-details" style={{ padding: '16px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--color-text-primary)' }}>{trip.details}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: 'var(--color-text-light)', fontFamily: 'monospace' }}>
                      Ref: {trip.bookingId || trip.id}
                    </span>
                    <strong style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
                      {formatPrice(trip.price)}
                    </strong>
                  </div>
                </div>

                <div className="trip-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => window.print()}
                    style={{ fontSize: '13px', padding: '6px 14px' }}
                  >
                    🖨️ Print Ticket
                  </button>
                  {isUpcoming && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancelTrip(trip.id)}
                      style={{ fontSize: '13px', padding: '6px 14px' }}
                    >
                      Cancel Reservation
                    </button>
                  )}
                  {!isUpcoming && (
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/')}
                      style={{ fontSize: '13px', padding: '6px 14px' }}
                    >
                      Book Again
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
