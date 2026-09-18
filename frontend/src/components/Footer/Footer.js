import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import './Footer.css';

export default function Footer() {
  const { currency, changeCurrency, availableCurrencies, currencyLabels } = useCurrency();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>✈️ TravelHub</h4>
            <p>Your trusted travel companion for flights, hotels, and car rentals. Compare and book with confidence.</p>
          </div>

          <div className="footer-section">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/flights">Search Flights</Link></li>
              <li><Link to="/hotels">Search Hotels</Link></li>
              <li><Link to="/cars">Rent Cars</Link></li>
              <li><Link to="/trips">My Trips</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/help">FAQs</Link></li>
              <li><Link to="/help">Contact Us</Link></li>
              <li><Link to="/signup">Create Account</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/help">Privacy Policy</Link></li>
              <li><Link to="/help">Terms &amp; Conditions</Link></li>
              <li><Link to="/help">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            © {new Date().getFullYear()} TravelHub. All rights reserved.
            <span className="disclaimer"> · Prices shown are estimated indicative fares and may vary.</span>
          </div>
          <div className="footer-links">
            <select
              className="currency-select"
              value={currency}
              onChange={(e) => changeCurrency(e.target.value)}
              title="Change currency"
            >
              {availableCurrencies.map(c => (
                <option key={c} value={c}>{currencyLabels[c]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
