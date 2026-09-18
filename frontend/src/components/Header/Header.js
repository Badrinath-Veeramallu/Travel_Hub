import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { currency, changeCurrency, availableCurrencies } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setAccountMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelHub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/flights" className={`nav-link ${isActive('/flights') ? 'active' : ''}`}>Flights</Link>
          <Link to="/hotels" className={`nav-link ${isActive('/hotels') ? 'active' : ''}`}>Hotels</Link>
          <Link to="/cars" className={`nav-link ${isActive('/cars') ? 'active' : ''}`}>Cars</Link>
          <Link to="/trips" className={`nav-link ${isActive('/trips') ? 'active' : ''}`}>Trips</Link>
          <Link to="/help" className={`nav-link ${isActive('/help') ? 'active' : ''}`}>Help</Link>
        </nav>

        <div className="header-right">
          {/* Currency Selector */}
          <select
            className="currency-selector"
            value={currency}
            onChange={(e) => changeCurrency(e.target.value)}
            title="Select Currency"
          >
            {availableCurrencies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Account Section */}
          {isAuthenticated ? (
            <div className="account-dropdown" ref={dropdownRef}>
              <button
                className="account-button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                aria-expanded={accountMenuOpen}
              >
                <span className="user-avatar">
                  {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span className="user-name">{user?.firstName}</span>
                <span className="dropdown-arrow">{accountMenuOpen ? '▲' : '▼'}</span>
              </button>
              {accountMenuOpen && (
                <div className="dropdown-menu">
                  <div className="user-info">
                    <div className="user-full-name">{user?.firstName} {user?.lastName}</div>
                    <div className="user-email">{user?.email}</div>
                  </div>
                  <hr />
                  <Link to="/profile" className="dropdown-item" onClick={() => setAccountMenuOpen(false)}>
                    👤 My Profile
                  </Link>
                  <Link to="/trips" className="dropdown-item" onClick={() => setAccountMenuOpen(false)}>
                    🗺️ My Trips
                  </Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
