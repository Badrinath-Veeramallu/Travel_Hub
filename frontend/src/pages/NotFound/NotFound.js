import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Destination Not Found</h1>
        <p>The page or route you were looking for doesn't exist, may have moved, or has expired.</p>

        <div className="suggested-actions">
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            🏠 Back to Home
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Previous Page
          </button>
        </div>

        <div className="suggestions">
          <h2>Quick Destinations</h2>
          <ul>
            <li><Link to="/">Home &amp; Comparison</Link></li>
            <li><Link to="/flights">Flight Deals</Link></li>
            <li><Link to="/hotels">Hotel Stays</Link></li>
            <li><Link to="/cars">Car Rentals</Link></li>
            <li><Link to="/trips">My Bookings</Link></li>
            <li><Link to="/help">Help Center &amp; Support</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
